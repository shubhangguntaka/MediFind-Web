
import { supabase } from './supabaseClient';

const SEED_PHARMACIES = [
  { 
    email: 'apollo_jubilee@example.com', 
    store_name: 'Apollo Pharmacy - Jubilee Hills', 
    address: 'Rd Number 36, Jubilee Hills, Hyderabad', 
    location: { lat: 17.4300, lng: 78.4012 }, 
    role: 'author', 
    inventory: [
      { name: "Paracetamol 650mg", stock: 100, brands: ["Dolo 650", "Calpol 650"] },
      { name: "Azithromycin 500mg", stock: 50, brands: ["Azee 500"] }
    ] 
  },
  { 
    email: 'medplus_gachibowli@example.com', 
    store_name: 'MedPlus - Gachibowli', 
    address: 'DLF Cyber City, Gachibowli, Hyderabad', 
    location: { lat: 17.4483, lng: 78.3614 }, 
    role: 'author', 
    inventory: [
      { name: "Paracetamol 650mg", stock: 50, brands: ["Calpol"] },
      { name: "Metformin 500mg", stock: 120, brands: ["Glycomet"] }
    ] 
  },
  { 
    email: 'wellness_hitech@example.com', 
    store_name: 'Wellness Forever - Hitech City', 
    address: 'Hitech City, Hyderabad', 
    location: { lat: 17.4262, lng: 78.3842 }, 
    role: 'author', 
    inventory: [
      { name: "Ibuprofen 400mg", stock: 30, brands: ["Brufen"] },
      { name: "Cetirizine 10mg", stock: 100, brands: ["Okacet"] }
    ] 
  },
  {
    email: 'noble_kondapur@example.com',
    store_name: 'Noble Medicals - Kondapur',
    address: 'Botanical Garden Rd, Kondapur, Hyderabad',
    location: { lat: 17.4665, lng: 78.3614 },
    role: 'author',
    inventory: [
      { name: "Levocetirizine 5mg", stock: 180, brands: ["Lecope"] },
      { name: "Amoxicillin 500mg", stock: 60, brands: ["Moxikind"] }
    ]
  }
];

export const seedInitialData = async () => {
  try {
    // Check if we already have pharmacies
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'author');

    if (countError) {
      console.warn('[Seed] Could not check existing pharmacies:', countError.message);
      return;
    }

    if (count === 0) {
      console.log('[Seed] No pharmacies found. Seeding initial data...');
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert(SEED_PHARMACIES.map(p => ({
          email: p.email,
          store_name: p.store_name,
          address: p.address,
          location: p.location,
          role: p.role,
          inventory: p.inventory,
          display_name: p.store_name,
          auth_user_id: null // System-seeded stores have no auth owner initially
        })));

      if (insertError) {
        console.error('[Seed] Error inserting seed data:', insertError.message);
      } else {
        console.log('[Seed] Initial data seeded successfully.');
      }
    } else {
      console.log(`[Seed] Database already has ${count} pharmacies. Skipping.`);
    }
  } catch (err) {
    console.error('[Seed] Critical error during seeding:', err);
  }
};
