import { query } from './db.js';

const updateDB = async () => {
  try {
    console.log('Updating PostgreSQL Database Schema...');

    await query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS gallery_image_1 VARCHAR(255),
      ADD COLUMN IF NOT EXISTS gallery_image_2 VARCHAR(255),
      ADD COLUMN IF NOT EXISTS testimonial_thumbnail VARCHAR(255),
      ADD COLUMN IF NOT EXISTS testimonial_quote TEXT;
    `);

    console.log('✅ Projects table schema updated successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating database schema:', error);
    process.exit(1);
  }
};

updateDB();
