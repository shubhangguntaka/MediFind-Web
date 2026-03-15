/**
 * BACKEND — Services Layer
 * 
 * This folder contains all data-fetching, authentication, and AI services.
 * Components should NEVER import directly from firebase, supabase, or gemini APIs.
 * Instead, they must use these service modules.
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  backend/services/                                       │
 * │  ├── firebase.ts        → Firebase Auth (authentication) │
 * │  ├── supabaseClient.ts  → Supabase DB (data only)        │
 * │  ├── geminiService.ts   → AI: OCR, Location, MedInfo     │
 * │  ├── pharmacyService.ts → Search pharmacies & medicines   │
 * │  └── seedData.ts        → Database seeding utility        │
 * └─────────────────────────────────────────────────────────┘
 */
export * from '../../services/firebase';
export * from '../../services/geminiService';
export * from '../../services/pharmacyService';
export { supabase } from '../../services/supabaseClient';
