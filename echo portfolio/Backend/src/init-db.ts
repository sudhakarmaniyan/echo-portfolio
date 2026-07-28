import { query } from './db.js';
import bcrypt from 'bcryptjs';

const initDB = async () => {
  try {
    console.log('Initializing PostgreSQL Database...');

    // Create Projects table
    await query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        live_url VARCHAR(255),
        gallery_image_1 VARCHAR(255),
        gallery_image_2 VARCHAR(255),
        testimonial_thumbnail VARCHAR(255),
        testimonial_quote TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Projects table is ready.');

    // Create Messages table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Messages table is ready.');

    // Create Services table
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(255),
        subtitle VARCHAR(255),
        color VARCHAR(50),
        bg_image VARCHAR(255)
      );
    `);
    console.log('✅ Services table is ready.');

    // Create Counts table
    await query(`
      CREATE TABLE IF NOT EXISTS counts (
        id SERIAL PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        value INTEGER NOT NULL,
        icon VARCHAR(255)
      );
    `);
    console.log('✅ Counts table is ready.');

    // Create Testimonials table
    await query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        author_name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        content TEXT NOT NULL,
        avatar_url VARCHAR(255)
      );
    `);
    console.log('✅ Testimonials table is ready.');

    // Drop old Packages table to update schema
    await query(`DROP TABLE IF EXISTS packages;`);

    // Create Packages table
    await query(`
      CREATE TABLE IF NOT EXISTS packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price_monthly VARCHAR(255) NOT NULL,
        price_yearly VARCHAR(255) NOT NULL,
        features TEXT,
        is_popular BOOLEAN DEFAULT FALSE
      );
    `);
    console.log('✅ Packages table is ready.');

    // Create Activity Logs table
    await query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        action_type VARCHAR(50) NOT NULL,
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        description TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Activity Logs table is ready.');

    // Create Orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        package_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Orders table is ready.');

    // Create Admins table and seed initial admin
    await query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Check if the initial admin already exists
    const adminCheck = await query(`SELECT * FROM admins WHERE email = $1`, ['echoadmin@gmail.com']);
    if (adminCheck.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('EchoAdmin123', salt);
      await query(`
        INSERT INTO admins (email, password_hash)
        VALUES ($1, $2)
      `, ['echoadmin@gmail.com', hashedPassword]);
      console.log('✅ Initial Admin seeded successfully.');
    } else {
      console.log('✅ Initial Admin already exists.');
    }

    console.log('🎉 PostgreSQL Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDB();
