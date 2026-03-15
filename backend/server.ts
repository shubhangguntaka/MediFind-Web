import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import geminiRoutes from './routes/gemini';
import pharmacyRoutes from './routes/pharmacy';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: [FRONTEND_URL, 'http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' })); // Allow large base64 images for OCR

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MediFind Backend API', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/gemini', geminiRoutes);    // Gemini AI: OCR, location, medicine info
app.use('/api/pharmacy', pharmacyRoutes); // Pharmacy search & listing

// ─── 404 fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 MediFind Backend running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   CORS allowed for: ${FRONTEND_URL}\n`);
});

export default app;
