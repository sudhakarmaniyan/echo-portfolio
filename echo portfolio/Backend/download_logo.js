import fs from 'fs';
import https from 'https';
import pg from 'pg';

const url = "https://scontent.cdninstagram.com/v/t51.2885-19/300454076_1512978502464065_6587462021707331871_n.jpg?stp=dst-jpg_s100x100_tt6&_nc_cat=101&ccb=7-5&_nc_sid=bf7eb4&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLnd3dy4xMDgwLkMzIn0%3D&_nc_ohc=rsrwUfAGCfoQ7kNvwGLQ4my&_nc_oc=AdrFYG0yfPR8Bb_Bvx5qOHi8Zn2jGl9l2ApW2i9BMaeWQm0F_jsiXlIlW-VuuY7PZMkfeKd7KipDKbkcsRXNDqEt&_nc_zt=24&_nc_ht=scontent.cdninstagram.com&_nc_ss=7f60f&oh=00_AQATZozf6xlnOEekosQ66aWStbJNV2hHiu31EY9vLmrymQ&oe=6A639767";

const downloadImage = (url, path) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const fileStream = fs.createWriteStream(path);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

const main = async () => {
  try {
    console.log("Downloading image...");
    await downloadImage(url, '../Frontend/public/redangle_logo.jpg');
    console.log("Saved to Frontend public folder");
    
    await downloadImage(url, '../../Admin/public/redangle_logo.jpg');
    console.log("Saved to Admin public folder");

    const { Pool } = pg;
    const pool = new Pool({
      connectionString: 'postgres://postgres:password@localhost:6000/echo%20portfolio',
    });

    console.log("Updating database...");
    await pool.query("UPDATE projects SET image_url = '/redangle_logo.jpg' WHERE title ILIKE '%red angle studio%' OR title ILIKE '%redanglestudio%'");
    console.log("Database updated!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
main();
