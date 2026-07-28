const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fix() {
  try {
    await pool.query(`
      UPDATE services 
      SET bg_image = NULL 
      WHERE bg_image LIKE '%unsplash%'
    `);
    console.log("Unsplash images removed!");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

fix();
