import { Router, Request, Response } from 'express';
import { getAllPharmacies, searchPharmacies, invalidatePharmacyCache } from '../services/pharmacyService';

const router = Router();

// GET /api/pharmacy/all?lat=17.43&lng=78.40
router.get('/all', async (req: Request, res: Response) => {
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
  const lng = req.query.lng ? parseFloat(req.query.lng as string) : null;
  const userLocation = lat !== null && lng !== null ? { lat, lng } : null;
  try {
    const stores = await getAllPharmacies(userLocation);
    res.json({ data: stores });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/pharmacy/search?q=Paracetamol&lat=17.43&lng=78.40
router.get('/search', async (req: Request, res: Response) => {
  const q = (req.query.q as string)?.trim();
  if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
  const lng = req.query.lng ? parseFloat(req.query.lng as string) : null;
  const userLocation = lat !== null && lng !== null ? { lat, lng } : null;
  try {
    const result = await searchPharmacies(q, userLocation);
    res.json({ data: result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/pharmacy/invalidate
router.post('/invalidate', (_req: Request, res: Response) => {
  try {
    invalidatePharmacyCache();
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
