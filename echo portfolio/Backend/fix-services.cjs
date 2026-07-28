const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'portfolio_db',
  password: 'admin',
  port: 5432,
});

async function fix() {
  try {
    await pool.query(`
      UPDATE services 
      SET 
        subtitle = COALESCE(subtitle, 'Service'),
        icon = COALESCE(icon, 'LayoutDashboard'),
        color = COALESCE(color, '#3b60e4')
      WHERE subtitle IS NULL OR icon IS NULL OR color IS NULL
    `);
    console.log("Services fixed!");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

fix();
