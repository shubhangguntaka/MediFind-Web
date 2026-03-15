/**
 * backend/services/geminiService.ts
 *
 * Server-side Gemini AI service. The API key NEVER leaves the server.
 * Exposes:
 *  1. getMedicineInfo   — medicine description, primary use, common forms
 *  2. analyzeMedicineImage — OCR: prescription scan / pill identification
 *  3. geocodeAddress    — address → lat/lng
 *  4. reverseGeocodeCoordinates — lat/lng → address string
 */

import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.0-flash';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ─── Schemas ──────────────────────────────────────────────────────────────────

const geocodeSchema = {
  type: Type.OBJECT,
  properties: {
    lat: { type: Type.NUMBER },
    lng: { type: Type.NUMBER },
    error: { type: Type.STRING },
  },
};

const reverseGeocodeSchema = {
  type: Type.OBJECT,
  properties: {
    address: { type: Type.STRING },
  },
  required: ['address'],
};

const medicineInfoSchema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING },
    primaryUse: { type: Type.STRING },
    commonForms: { type: Type.STRING },
  },
  required: ['description', 'primaryUse', 'commonForms'],
};

const imageAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    medicines: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    confidence: { type: Type.NUMBER },
    note: { type: Type.STRING },
    error: { type: Type.STRING },
  },
  required: ['medicines'],
};

const cleanJsonString = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
};

// ─── 1. Medicine Info ─────────────────────────────────────────────────────────

export interface MedicineInfo {
  description: string;
  primaryUse: string;
  commonForms: string;
}

export const getMedicineInfo = async (medicineName: string): Promise<MedicineInfo | null> => {
  try {
    const prompt = `Provide details for the medicine "${medicineName}". Focus on its primary use, what it treats, and common forms. Keep the description simple and easy for a layperson to understand.`;
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { temperature: 0.2, responseMimeType: 'application/json', responseSchema: medicineInfoSchema },
    });
    const raw = response.text?.trim();
    if (!raw) return null;
    const info = JSON.parse(cleanJsonString(raw));
    if (info.description.toLowerCase().includes('cannot find')) return null;
    return info as MedicineInfo;
  } catch (e: any) {
    if (e.status === 429 || e.message?.includes('429') || e.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn('[Gemini] Quota exceeded. Skipping medicine info enrichment.');
    } else {
      console.error('[Gemini] getMedicineInfo error:', e);
    }
    return null;
  }
};

// ─── 2. OCR — Image Analysis ──────────────────────────────────────────────────

export const analyzeMedicineImage = async (
  base64Image: string,
  mimeType: string,
  mode: 'prescription' | 'identification'
): Promise<{ medicines: string[]; note?: string; error?: string } | null> => {
  try {
    const systemInstruction =
      mode === 'prescription'
        ? 'You are a specialized medical OCR assistant. Extract all pharmaceutical drug names from medical prescriptions. Ignore patient names, doctor names, hospital headers, and dosages. Only return chemical or commercial drug names. If not a prescription or illegible, use the error field.'
        : 'You are a pharmaceutical identification expert. Identify the medicine shown in the image. Look for brand names on packaging or imprints on the pill. Use the error field if unclear or not medicine-related.';

    const prompt =
      mode === 'prescription'
        ? "Analyze this prescription and extract all medicine names."
        : 'Identify this medicine. Look for brand names or imprints.';

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts: [{ inlineData: { data: base64Image, mimeType } }, { text: prompt }] },
      config: { systemInstruction, responseMimeType: 'application/json', responseSchema: imageAnalysisSchema },
    });

    const raw = response.text?.trim();
    if (!raw) throw new Error('Empty AI response');
    return JSON.parse(cleanJsonString(raw));
  } catch (e: any) {
    console.error('[Gemini] analyzeMedicineImage error:', e);
    return { medicines: [], error: 'AI service error. Please try again with better lighting.' };
  }
};

// ─── 3. Geocode ───────────────────────────────────────────────────────────────

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  const prompt = `You are a geocoding API. Convert this address to precise lat/lng coordinates: "${address}". Return ONLY JSON with 'lat' and 'lng' keys. If ambiguous, return {"error":"Address not found"}.`;
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: { responseMimeType: 'application/json', responseSchema: geocodeSchema },
  });
  const raw = response.text?.trim();
  if (!raw) throw new Error('Empty geocode response');
  const coords = JSON.parse(cleanJsonString(raw));
  if (coords.error || !coords.lat || !coords.lng) throw new Error(coords.error || 'Invalid coordinates');
  return { lat: coords.lat, lng: coords.lng };
};

// ─── 4. Reverse Geocode ───────────────────────────────────────────────────────

export const reverseGeocodeCoordinates = async (coords: { lat: number; lng: number }): Promise<string> => {
  try {
    const prompt = `Convert coordinates lat:${coords.lat}, lng:${coords.lng} to a precise human-readable street address. Return JSON with "address" key.`;
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json', responseSchema: reverseGeocodeSchema },
    });
    const raw = response.text?.trim();
    if (!raw) return 'Unknown location';
    const { address } = JSON.parse(cleanJsonString(raw));
    return address || 'Unknown location';
  } catch {
    return 'Could not determine address';
  }
};
