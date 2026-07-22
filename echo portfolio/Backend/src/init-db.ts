import { query } from './db.js';

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
        icon VARCHAR(255)
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

    console.log('🎉 PostgreSQL Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initDB();
