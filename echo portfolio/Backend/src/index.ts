import express from 'express';
import cors from 'cors';
import routes from './routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Echo Portfolio API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
