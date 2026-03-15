/**
 * backend/services/pharmacyService.ts
 * Server-side pharmacy search service.
 * Called by the Express API routes — never directly by the frontend.
 */

import Fuse from 'fuse.js';
import { getMedicineInfo } from './geminiService';
import { supabase } from './supabaseClient';

// ─── Types (inline, no dependency on frontend types.ts) ──────────────────────

export interface Medicine {
  name: string;
  brands: string[];
  stock: number;
}

export interface AuthorEntry {
  role: 'author';
  email: string;
  fullName: string;
  displayName: string;
  storeName: string;
  address: string;
  location: { lat: number; lng: number };
  inventory: Medicine[];
}

export interface Pharmacy {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  distance: number;
  medicine: Medicine;
}

export interface BasicStoreInfo {
  name: string;
  address: string;
  location: { lat: number; lng: number };
  distance: number;
}

export interface SearchResult {
  type: 'medicines' | 'store';
  data: any;
  medicineName?: string;
  medicineInfo?: any;
}

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_AUTHORS: AuthorEntry[] = [
  { role: 'author', email: 'owner1@apollothy.com', fullName: 'Sanjay Reddy', displayName: 'Sanjay R.', storeName: 'Apollo Pharmacy - Jubilee Hills', address: 'Rd Number 36, Jubilee Hills, Hyderabad, Telangana 500033', location: { lat: 17.4300, lng: 78.4012 }, inventory: [{ name: 'Paracetamol 650mg', brands: ['Dolo 650', 'Crocin Advance', 'Calpol'], stock: 200 }, { name: 'Azithromycin 500mg', brands: ['Azee 500', 'Azithral 500'], stock: 75 }, { name: 'Montelukast + Levocetirizine', brands: ['Montair-LC', 'Montek LC'], stock: 110 }, { name: 'Amoxicillin 500mg', brands: ['Moxikind-CV 625'], stock: 0 }, { name: 'Vitamin C + Zinc', brands: ['Limcee', 'Celin 500'], stock: 150 }, { name: 'Telmisartan 40mg', brands: ['Telma 40', 'Cresar 40'], stock: 85 }, { name: 'Amlodipine 5mg', brands: ['Amlokind 5', 'Amlopres 5'], stock: 120 }] },
  { role: 'author', email: 'owner2@medplus.com', fullName: 'Anjali Rao', displayName: 'Anjali', storeName: 'MedPlus - Gachibowli', address: 'DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032', location: { lat: 17.4483, lng: 78.3614 }, inventory: [{ name: 'Paracetamol 650mg', brands: ['Dolo 650', 'P-650'], stock: 180 }, { name: 'Atorvastatin 10mg', brands: ['Atorva 10', 'Lipikind'], stock: 90 }, { name: 'Metformin 500mg', brands: ['Glycomet 500 SR', 'Gluconorm'], stock: 120 }, { name: 'Aspirin 75mg', brands: ['Ecosprin 75', 'Disprin'], stock: 250 }, { name: 'Domperidone + Pantoprazole', brands: ['Pan-D', 'Pantocid DSR'], stock: 60 }, { name: 'Glimepiride 1mg', brands: ['Amaryl 1', 'Glimestar 1'], stock: 50 }] },
  { role: 'author', email: 'owner3@wellness.com', fullName: 'Vikram Singh', displayName: 'Vik S.', storeName: 'Wellness Forever - Hitech City', address: 'Inorbit Mall Road, Hitech City, Hyderabad, Telangana 500081', location: { lat: 17.4262, lng: 78.3842 }, inventory: [{ name: 'Ibuprofen 400mg', brands: ['Ibugesic 400', 'Brufen 400'], stock: 130 }, { name: 'Rosuvastatin 10mg', brands: ['Rosuvas 10', 'Roseday 10'], stock: 0 }, { name: 'Cholecalciferol 60000 IU', brands: ['Uprise-D3 60K', 'Calcirol Sachet'], stock: 300 }, { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine'], stock: 280 }] },
  { role: 'author', email: 'owner4@balajimed.com', fullName: 'Priya Sharma', displayName: 'Priya', storeName: 'Balaji Medical & General Store - Secunderabad', address: 'M.G. Road, Secunderabad, Telangana 500003', location: { lat: 17.4399, lng: 78.4983 }, inventory: [{ name: 'Paracetamol 500mg', brands: ['Calpol 500', 'Crocin Pain Relief'], stock: 400 }, { name: 'Cough Syrup', brands: ['Benadryl', 'Grilinctus'], stock: 100 }, { name: 'Antacid Gel', brands: ['Digene', 'Gelusil MPS'], stock: 150 }, { name: 'Pain Relief Gel', brands: ['Volini', 'Moov'], stock: 200 }] },
  { role: 'author', email: 'owner5@lifecare.com', fullName: 'Rohan Mehta', displayName: 'Rohan M.', storeName: 'LifeCare Pharmacy - Banjara Hills', address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', location: { lat: 17.4150, lng: 78.4485 }, inventory: [{ name: 'Calcium + Vitamin D3', brands: ['Shelcal 500', 'Gemcal'], stock: 180 }, { name: 'B-Complex with Vitamin C', brands: ['Becosules Z', 'Supradyn'], stock: 220 }, { name: 'Iron + Folic Acid', brands: ['Feronia-XT', 'Fefol-Z'], stock: 0 }, { name: 'Losartan 50mg', brands: ['Losar 50', 'Losakind 50'], stock: 70 }] },
  { role: 'author', email: 'owner6@hetero.com', fullName: 'Kavita Iyer', displayName: 'Kavita', storeName: 'Hetero Pharmacy - Kukatpally', address: 'KPHB Colony, Kukatpally, Hyderabad, Telangana 500072', location: { lat: 17.4848, lng: 78.4017 }, inventory: [{ name: 'Ofloxacin 200mg', brands: ['Oflox 200', 'Zanocin 200'], stock: 65 }, { name: 'Ciprofloxacin 500mg', brands: ['Cifran 500', 'Ciplox 500'], stock: 80 }, { name: 'Metronidazole 400mg', brands: ['Flagyl 400', 'Metrogyl 400'], stock: 115 }, { name: 'Paracetamol 650mg', brands: ['Dolo 650'], stock: 300 }] },
  { role: 'author', email: 'owner7@medplus2.com', fullName: 'Arjun Desai', displayName: 'Arjun D.', storeName: 'MedPlus - Madhapur', address: 'Image Gardens Road, Madhapur, Hyderabad, Telangana 500081', location: { lat: 17.4475, lng: 78.3918 }, inventory: [{ name: 'Atorvastatin 20mg', brands: ['Atorva 20', 'Storvas 20'], stock: 100 }, { name: 'Clopidogrel 75mg', brands: ['Clopitab 75', 'Deplatt 75'], stock: 130 }, { name: 'Metoprolol 25mg', brands: ['Metolar XR 25', 'Starpress-XL 25'], stock: 90 }, { name: 'Domperidone + Pantoprazole', brands: ['Pan-D', 'Pantop D'], stock: 150 }] },
  { role: 'author', email: 'owner8@apollothy2.com', fullName: 'Sunita Patil', displayName: 'Sunita', storeName: 'Apollo Pharmacy - Begumpet', address: 'Opposite Shoppers Stop, Begumpet, Hyderabad, Telangana 500016', location: { lat: 17.4431, lng: 78.4671 }, inventory: [{ name: 'Amoxicillin + Clavulanic Acid 625mg', brands: ['Augmentin 625 Duo'], stock: 140 }, { name: 'Doxycycline 100mg', brands: ['Doxy-1 L-DR Forte'], stock: 70 }, { name: 'Sertraline 50mg', brands: ['Zoloft', 'Sertima 50'], stock: 45 }, { name: 'Escitalopram 10mg', brands: ['Nexito 10', 'Cipralex'], stock: 55 }] },
  { role: 'author', email: 'owner9@sanjeevani.com', fullName: 'Rajesh Kumar', displayName: 'Rajesh', storeName: 'Sanjeevani Medical Hall - Ameerpet', address: 'Ameerpet X Road, Hyderabad, Telangana 500016', location: { lat: 17.4375, lng: 78.4481 }, inventory: [{ name: 'Pain Relief Spray', brands: ['Volini Spray', 'Moov Spray'], stock: 180 }, { name: 'Antiseptic Liquid', brands: ['Dettol', 'Savlon'], stock: 250 }, { name: 'ORS Powder', brands: ['Electral', 'ORSL'], stock: 350 }, { name: 'Ibuprofen 200mg', brands: ['Combiflam', 'Ibugesic 200'], stock: 200 }] },
  { role: 'author', email: 'owner10@noble.com', fullName: 'Meera Gupta', displayName: 'Meera G.', storeName: 'Noble Medicals - Kondapur', address: 'Botanical Garden Rd, Kondapur, Hyderabad, Telangana 500084', location: { lat: 17.4665, lng: 78.3614 }, inventory: [{ name: 'Levocetirizine 5mg', brands: ['Lecope', 'Vozet 5'], stock: 180 }, { name: 'Nimesulide 100mg', brands: ['Nise', 'Nimulid'], stock: 0 }, { name: 'Serratiopeptidase', brands: ['Emanzen-D', 'Seradic-AP'], stock: 110 }, { name: 'Methylcobalamin', brands: ['Nurokind-OD', 'Me-12'], stock: 150 }] },
];

let cachedAuthors: AuthorEntry[] | null = null;

const timeout = (ms: number) => new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));

const getValidAuthors = async (): Promise<AuthorEntry[]> => {
  if (cachedAuthors !== null) return cachedAuthors;
  try {
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (anonKey && anonKey.startsWith('sb_publishable_')) {
      console.error('[PharmacyService] CRITICAL: SUPABASE_ANON_KEY appears to be a STRIPE key!');
    }

    const result = await Promise.race([
      supabase.from('profiles').select('*').eq('role', 'author').is('deletion_scheduled_on', null),
      timeout(8000), // Increased to 8s for reliability
    ]);
    
    if (result && 'data' in result) {
      if (result.error) {
        console.error('[PharmacyService] Supabase error:', result.error.message, result.error.details);
      } else if (result.data && result.data.length > 0) {
        const fromDB = (result.data as any[])
          .filter((p: any) => p.location && typeof p.location.lat === 'number' && typeof p.location.lng === 'number')
          .map((p: any): AuthorEntry => ({
            role: 'author',
            email: p.email,
            fullName: p.full_name ?? '',
            displayName: p.display_name ?? '',
            storeName: p.store_name ?? '',
            address: p.address ?? '',
            location: p.location,
            inventory: p.inventory ?? [],
          }));
        
        if (fromDB.length > 0) {
          cachedAuthors = fromDB;
          console.log(`[PharmacyService] Successfully loaded ${fromDB.length} pharmacies from Supabase.`);
          return fromDB;
        }
      } else {
        console.warn('[PharmacyService] Supabase returned 0 pharmacies.');
      }
    } else {
      console.error('[PharmacyService] Supabase fetch TIMED OUT (8s).');
    }
  } catch (err: any) {
    console.error('[PharmacyService] Unexpected fetch error:', err?.message || err);
  }

  // If DB fails, return fallback but DON'T cache it permanently
  console.warn('[PharmacyService] Using fallback data (DB offline or slow).');
  return FALLBACK_AUTHORS;
};

export const invalidatePharmacyCache = () => { cachedAuthors = null; };

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getAllPharmacies = async (userLocation: { lat: number; lng: number } | null): Promise<BasicStoreInfo[]> => {
  const authors = await getValidAuthors();
  const stores: BasicStoreInfo[] = authors.map(a => ({
    name: a.storeName,
    address: a.address,
    location: a.location,
    distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, a.location.lat, a.location.lng) : -1,
  }));
  if (userLocation) stores.sort((a, b) => a.distance - b.distance);
  return stores;
};

export const searchPharmacies = async (query: string, userLocation: { lat: number; lng: number } | null): Promise<SearchResult | null> => {
  const authors = await getValidAuthors();
  const searchTerm = query.trim();
  if (!searchTerm) return null;

  // 1. Store name match
  const storeFuse = new Fuse(authors, { keys: ['storeName'], includeScore: true, threshold: 0.2, minMatchCharLength: 3 });
  const storeResults = storeFuse.search(searchTerm);
  if (storeResults.length > 0 && (storeResults[0].score ?? 1) < 0.2) {
    const match = storeResults[0].item;
    return {
      type: 'store',
      data: {
        store: { email: match.email, storeName: match.storeName, address: match.address, location: match.location },
        inventory: match.inventory,
        distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, match.location.lat, match.location.lng) : -1,
      },
    };
  }

  // 2. Medicine search
  const foundPharmacies: Pharmacy[] = [];
  authors.forEach(author => {
    if (!author.inventory?.length) return;
    const medicineFuse = new Fuse(author.inventory, {
      keys: [{ name: 'name', weight: 0.7 }, { name: 'brands', weight: 0.3 }],
      includeScore: true, threshold: 0.3, minMatchCharLength: 2,
    });
    const results = medicineFuse.search(searchTerm);
    if (results.length > 0) {
      foundPharmacies.push({
        name: author.storeName,
        address: author.address,
        location: author.location,
        medicine: results[0].item,
        distance: userLocation ? calculateDistance(userLocation.lat, userLocation.lng, author.location.lat, author.location.lng) : -1,
      });
    }
  });

  if (foundPharmacies.length === 0) return null;

  let medicineInfo = null;
  try {
    medicineInfo = await getMedicineInfo(searchTerm);
  } catch (err) {
    console.warn('[PharmacyService] Could not fetch medicine info (quota or network):', searchTerm);
  }
  if (userLocation) foundPharmacies.sort((a, b) => a.distance - b.distance);

  return { type: 'medicines', data: foundPharmacies, medicineName: searchTerm, medicineInfo };
};
