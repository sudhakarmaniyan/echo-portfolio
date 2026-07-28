const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const defaultImages = {
  3: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1470&auto=format&fit=crop', // Mobile App
  4: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop', // Web Dev
  5: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop', // Business Consultation
  6: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1374&auto=format&fit=crop', // Social Media
  7: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1470&auto=format&fit=crop', // Video Creations
  8: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1400&auto=format&fit=crop'  // UI/UX
};

async function fix() {
  try {
    for (const [id, url] of Object.entries(defaultImages)) {
      await pool.query('UPDATE services SET bg_image = $1 WHERE id = $2 AND (bg_image IS NULL OR bg_image = \'\')', [url, id]);
    }
    console.log("Images fixed!");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

fix();
