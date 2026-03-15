/**
 * frontend/services/apiClient.ts
 *
 * The single interface between the frontend and the MediFind backend API.
 * All Gemini AI calls and pharmacy queries go through here.
 * The backend is reachable at /api/* (proxied to localhost:5000 by Vite in dev).
 */

const API_BASE = '/api';

// ─── Generic fetch helper ─────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `API Error ${res.status}`);
  return json.data as T;
}

// ─── Pharmacy API ─────────────────────────────────────────────────────────────

export interface BasicStoreInfo {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  distance: number;
}

export const getAllPharmacies = async (
  userLocation: { lat: number; lng: number } | null
): Promise<BasicStoreInfo[]> => {
  const params = userLocation
    ? `?lat=${userLocation.lat}&lng=${userLocation.lng}`
    : '';
  return apiFetch<BasicStoreInfo[]>(`/pharmacy/all${params}`);
};

export const searchPharmacies = async (
  query: string,
  userLocation: { lat: number; lng: number } | null
) => {
  const params = new URLSearchParams({ q: query });
  if (userLocation) {
    params.set('lat', String(userLocation.lat));
    params.set('lng', String(userLocation.lng));
  }
  return apiFetch<any>(`/pharmacy/search?${params.toString()}`);
};

export const invalidatePharmacyCache = async () => {
  return apiFetch<void>(`/pharmacy/invalidate`, { method: 'POST' });
};

// ─── Gemini AI API ────────────────────────────────────────────────────────────

export interface MedicineInfo {
  description: string;
  primaryUse: string;
  commonForms: string;
}

export const getMedicineInfo = async (name: string): Promise<MedicineInfo | null> => {
  try {
    return apiFetch<MedicineInfo | null>(`/gemini/medicine-info?name=${encodeURIComponent(name)}`);
  } catch {
    return null;
  }
};

export const analyzeMedicineImage = async (
  base64Image: string,
  mimeType: string,
  mode: 'prescription' | 'identification'
): Promise<{ medicines: string[]; note?: string; error?: string } | null> => {
  return apiFetch(`/gemini/ocr`, {
    method: 'POST',
    body: JSON.stringify({ base64Image, mimeType, mode }),
  });
};

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  return apiFetch(`/gemini/geocode`, {
    method: 'POST',
    body: JSON.stringify({ address }),
  });
};

export const reverseGeocodeCoordinates = async (coords: {
  lat: number;
  lng: number;
}): Promise<string> => {
  const result = await apiFetch<{ address: string }>(`/gemini/reverse-geocode`, {
    method: 'POST',
    body: JSON.stringify(coords),
  });
  return result.address;
};
