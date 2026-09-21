import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './src/server/api.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Routes
app.use('/api', apiRouter);

// Serve static frontend files in production
const distPath = path.resolve(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Vynora Backend] Server running on http://0.0.0.0:${PORT}`);
});
