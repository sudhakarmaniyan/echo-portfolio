import { Router } from 'express';
import { query } from './db.js';
import multer from 'multer';
import path from 'path';

const router = Router();

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
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Return the URL to access the uploaded file
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.status(201).json({ url: imageUrl });
});

// Get all projects
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
router.post('/projects', async (req, res) => {
  const { title, description, image_url, live_url } = req.body;
  try {
    const result = await query(
      'INSERT INTO projects (title, description, image_url, live_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, image_url, live_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a contact message (Frontend)
router.post('/messages', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const result = await query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id',
      [name, email, message]
    );
    res.status(201).json({ success: true, messageId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project (Admin)
router.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all messages (Admin)
router.get('/messages', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a message (Admin)
router.delete('/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM messages WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project (Admin)
router.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, live_url } = req.body;
  try {
    const result = await query(
      'UPDATE projects SET title = $1, description = $2, image_url = $3, live_url = $4 WHERE id = $5 RETURNING *',
      [title, description, image_url, live_url, id]
    );
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

router.post('/services', async (req, res) => {
  const { title, description, icon } = req.body;
  try {
    const result = await query(
      'INSERT INTO services (title, description, icon) VALUES ($1, $2, $3) RETURNING *',
      [title, description, icon]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/services/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, icon } = req.body;
  try {
    const result = await query(
      'UPDATE services SET title = $1, description = $2, icon = $3 WHERE id = $4 RETURNING *',
      [title, description, icon, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/services/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM services WHERE id = $1', [id]);
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

router.post('/counts', async (req, res) => {
  const { label, value, icon } = req.body;
  try {
    const result = await query(
      'INSERT INTO counts (label, value, icon) VALUES ($1, $2, $3) RETURNING *',
      [label, value, icon]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/counts/:id', async (req, res) => {
  const { id } = req.params;
  const { label, value, icon } = req.body;
  try {
    const result = await query(
      'UPDATE counts SET label = $1, value = $2, icon = $3 WHERE id = $4 RETURNING *',
      [label, value, icon, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/counts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM counts WHERE id = $1', [id]);
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

router.post('/packages', async (req, res) => {
  const { name, price_monthly, price_yearly, features, is_popular } = req.body;
  try {
    const result = await query(
      'INSERT INTO packages (name, price_monthly, price_yearly, features, is_popular) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price_monthly, price_yearly, features, is_popular]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/packages/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price_monthly, price_yearly, features, is_popular } = req.body;
  try {
    const result = await query(
      'UPDATE packages SET name = $1, price_monthly = $2, price_yearly = $3, features = $4, is_popular = $5 WHERE id = $6 RETURNING *',
      [name, price_monthly, price_yearly, features, is_popular, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/packages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM packages WHERE id = $1', [id]);
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

router.post('/testimonials', async (req, res) => {
  const { author_name, role, content, avatar_url } = req.body;
  try {
    const result = await query(
      'INSERT INTO testimonials (author_name, role, content, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [author_name, role, content, avatar_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  const { author_name, role, content, avatar_url } = req.body;
  try {
    const result = await query(
      'UPDATE testimonials SET author_name = $1, role = $2, content = $3, avatar_url = $4 WHERE id = $5 RETURNING *',
      [author_name, role, content, avatar_url, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM testimonials WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
