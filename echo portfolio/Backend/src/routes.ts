import { Router } from 'express';
import { query } from './db.js';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'echosecret123';

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Activity Logging Helper
const logActivity = async (actionType: string, entityType: string, description: string, entityId?: number) => {
  try {
    await query(
      'INSERT INTO activity_logs (action_type, entity_type, description, entity_id) VALUES ($1, $2, $3, $4)',
      [actionType, entityType, description, entityId || null]
    );
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
};

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await query('SELECT * FROM admins WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const admin = rows[0];
    const validPassword = await bcrypt.compare(password, admin.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, JWT_SECRET, { expiresIn: '24h' });
    
    // Log login activity
    await logActivity('LOGIN', 'Admin', 'Admin logged into the dashboard');
    
    res.json({ token, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// File Upload Endpoint (Admin)
router.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

// Get Activity Logs (Admin)
router.get('/activities', authenticateToken, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all projects (Public)
router.get('/projects', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project (Admin)
router.post('/projects', authenticateToken, async (req, res) => {
  const { title, description, image_url, live_url, gallery_image_1, gallery_image_2, testimonial_thumbnail, testimonial_quote } = req.body;
  try {
    const result = await query(
      'INSERT INTO projects (title, description, image_url, live_url, gallery_image_1, gallery_image_2, testimonial_thumbnail, testimonial_quote) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, image_url, live_url, gallery_image_1, gallery_image_2, testimonial_thumbnail, testimonial_quote]
    );
    await logActivity('CREATE', 'Project', `Added new project: ${title}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a contact message (Public - Frontend)
router.post('/messages', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [name, email, message]
    );
    await logActivity('NEW_INQUIRY', 'Message', `New contact message received from ${name}`, result.rows[0].id);
    res.status(201).json({ success: true, messageId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project (Admin)
router.delete('/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM projects WHERE id = $1', [id]);
    await logActivity('DELETE', 'Project', `Deleted project #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all messages (Admin)
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a message (Admin)
router.delete('/messages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM messages WHERE id = $1', [id]);
    await logActivity('DELETE', 'Message', `Deleted message #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project (Admin)
router.put('/projects/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, live_url, gallery_image_1, gallery_image_2, testimonial_thumbnail, testimonial_quote } = req.body;
  try {
    const result = await query(
      'UPDATE projects SET title = $1, description = $2, image_url = $3, live_url = $4, gallery_image_1 = $5, gallery_image_2 = $6, testimonial_thumbnail = $7, testimonial_quote = $8 WHERE id = $9 RETURNING *',
      [title, description, image_url, live_url, gallery_image_1, gallery_image_2, testimonial_thumbnail, testimonial_quote, id]
    );
    await logActivity('UPDATE', 'Project', `Updated project: ${title}`, parseInt(id));
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Services CRUD
router.get('/services', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM services ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/services', authenticateToken, async (req, res) => {
  const { title, description, icon } = req.body;
  try {
    const result = await query(
      'INSERT INTO services (title, description, icon) VALUES ($1, $2, $3) RETURNING *',
      [title, description, icon]
    );
    await logActivity('CREATE', 'Service', `Added new service: ${title}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/services/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, icon } = req.body;
  try {
    const result = await query(
      'UPDATE services SET title = $1, description = $2, icon = $3 WHERE id = $4 RETURNING *',
      [title, description, icon, id]
    );
    await logActivity('UPDATE', 'Service', `Updated service: ${title}`, parseInt(id));
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/services/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM services WHERE id = $1', [id]);
    await logActivity('DELETE', 'Service', `Deleted service #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Counts CRUD
router.get('/counts', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM counts ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/counts', authenticateToken, async (req, res) => {
  const { label, value, icon } = req.body;
  try {
    const result = await query(
      'INSERT INTO counts (label, value, icon) VALUES ($1, $2, $3) RETURNING *',
      [label, value, icon]
    );
    await logActivity('CREATE', 'Count', `Added new count: ${label}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/counts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { label, value, icon } = req.body;
  try {
    const result = await query(
      'UPDATE counts SET label = $1, value = $2, icon = $3 WHERE id = $4 RETURNING *',
      [label, value, icon, id]
    );
    await logActivity('UPDATE', 'Count', `Updated count: ${label}`, parseInt(id));
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/counts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM counts WHERE id = $1', [id]);
    await logActivity('DELETE', 'Count', `Deleted count #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Packages CRUD
router.get('/packages', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM packages ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/packages', authenticateToken, async (req, res) => {
  const { name, price_monthly, price_yearly, features, is_popular } = req.body;
  try {
    const result = await query(
      'INSERT INTO packages (name, price_monthly, price_yearly, features, is_popular) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price_monthly, price_yearly, features, is_popular]
    );
    await logActivity('CREATE', 'Package', `Added new package: ${name}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/packages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price_monthly, price_yearly, features, is_popular } = req.body;
  try {
    const result = await query(
      'UPDATE packages SET name = $1, price_monthly = $2, price_yearly = $3, features = $4, is_popular = $5 WHERE id = $6 RETURNING *',
      [name, price_monthly, price_yearly, features, is_popular, id]
    );
    await logActivity('UPDATE', 'Package', `Updated package: ${name}`, parseInt(id));
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/packages/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM packages WHERE id = $1', [id]);
    await logActivity('DELETE', 'Package', `Deleted package #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Testimonials CRUD
router.get('/testimonials', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM testimonials ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/testimonials', authenticateToken, async (req, res) => {
  const { author_name, role, content, avatar_url } = req.body;
  try {
    const result = await query(
      'INSERT INTO testimonials (author_name, role, content, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [author_name, role, content, avatar_url]
    );
    await logActivity('CREATE', 'Testimonial', `Added testimonial from: ${author_name}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/testimonials/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { author_name, role, content, avatar_url } = req.body;
  try {
    const result = await query(
      'UPDATE testimonials SET author_name = $1, role = $2, content = $3, avatar_url = $4 WHERE id = $5 RETURNING *',
      [author_name, role, content, avatar_url, id]
    );
    await logActivity('UPDATE', 'Testimonial', `Updated testimonial from: ${author_name}`, parseInt(id));
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/testimonials/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM testimonials WHERE id = $1', [id]);
    await logActivity('DELETE', 'Testimonial', `Deleted testimonial #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Orders CRUD ---
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/orders', async (req, res) => {
  // Public route so frontend can eventually submit orders directly
  const { client_name, client_email, package_name } = req.body;
  try {
    const result = await query(
      'INSERT INTO orders (client_name, client_email, package_name) VALUES ($1, $2, $3) RETURNING *',
      [client_name, client_email, package_name]
    );
    await logActivity('NEW_INQUIRY', 'Order', `New order received from ${client_name} for ${package_name}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    await logActivity('UPDATE', 'Order', `Updated order #${id} status to ${status}`, parseInt(id));
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM orders WHERE id = $1', [id]);
    await logActivity('DELETE', 'Order', `Deleted order #${id}`, parseInt(id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Admins Management ---
router.get('/admins', authenticateToken, async (req, res) => {
  try {
    const { rows } = await query('SELECT id, email, created_at FROM admins ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/admins', authenticateToken, async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if exists
    const check = await query('SELECT id FROM admins WHERE email = $1', [email]);
    if (check.rows.length > 0) return res.status(400).json({ error: 'Admin already exists' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    await logActivity('CREATE', 'Admin', `Added new admin: ${email}`, result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/admins/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // Prevent deleting the very last admin
    const countRes = await query('SELECT COUNT(*) FROM admins');
    if (parseInt(countRes.rows[0].count) <= 1) {
      return res.status(400).json({ error: 'Cannot delete the only remaining admin' });
    }
    
    // Attempt to get the email before deletion for the log
    const adminRes = await query('SELECT email FROM admins WHERE id = $1', [id]);
    if (adminRes.rows.length > 0) {
      await query('DELETE FROM admins WHERE id = $1', [id]);
      await logActivity('DELETE', 'Admin', `Revoked admin access for: ${adminRes.rows[0].email}`, parseInt(id));
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Admin not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
