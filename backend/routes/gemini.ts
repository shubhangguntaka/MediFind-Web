import { Router, Request, Response } from 'express';
import { getMedicineInfo, analyzeMedicineImage, geocodeAddress, reverseGeocodeCoordinates } from '../services/geminiService';

const router = Router();

// GET /api/gemini/medicine-info?name=Paracetamol
router.get('/medicine-info', async (req: Request, res: Response) => {
  const name = req.query.name as string;
  if (!name?.trim()) return res.status(400).json({ error: 'Medicine name is required' });
  try {
    const info = await getMedicineInfo(name.trim());
    res.json({ data: info });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/gemini/ocr  { base64Image, mimeType, mode }
router.post('/ocr', async (req: Request, res: Response) => {
  const { base64Image, mimeType, mode } = req.body;
  if (!base64Image || !mimeType || !mode) return res.status(400).json({ error: 'base64Image, mimeType, and mode are required' });
  try {
    const result = await analyzeMedicineImage(base64Image, mimeType, mode);
    res.json({ data: result });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/gemini/geocode  { address }
router.post('/geocode', async (req: Request, res: Response) => {
  const { address } = req.body;
  if (!address?.trim()) return res.status(400).json({ error: 'Address is required' });
  try {
    const coords = await geocodeAddress(address.trim());
    res.json({ data: coords });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/gemini/reverse-geocode  { lat, lng }
router.post('/reverse-geocode', async (req: Request, res: Response) => {
  const { lat, lng } = req.body;
  if (lat === undefined || lng === undefined) return res.status(400).json({ error: 'lat and lng are required' });
  try {
    const address = await reverseGeocodeCoordinates({ lat, lng });
    res.json({ data: { address } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
