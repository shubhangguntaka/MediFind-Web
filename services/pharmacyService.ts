
import Fuse from 'fuse.js';
import type { Pharmacy, AuthorUser, SearchResult, BasicStoreInfo, MedicineInfo } from '../types';
import { getMedicineInfo } from './geminiService';
import { supabase } from './supabaseClient';

// ─── Static fallback data ─────────────────────────────────────────────────────
// Used immediately while Supabase loads, and as permanent fallback if DB is empty.
const FALLBACK_AUTHORS: AuthorUser[] = [
    { role: 'author', email: 'owner1@apollothy.com', fullName: 'Sanjay Reddy', displayName: 'Sanjay R.', storeName: 'Apollo Pharmacy - Jubilee Hills', address: 'Rd Number 36, Jubilee Hills, Hyderabad, Telangana 500033', location: { lat: 17.4300, lng: 78.4012 }, inventory: [{ name: 'Paracetamol 650mg', brands: ['Dolo 650', 'Crocin Advance', 'Calpol'], stock: 200 }, { name: 'Azithromycin 500mg', brands: ['Azee 500', 'Azithral 500'], stock: 75 }, { name: 'Montelukast + Levocetirizine', brands: ['Montair-LC', 'Montek LC'], stock: 110 }, { name: 'Amoxicillin 500mg', brands: ['Moxikind-CV 625'], stock: 0 }, { name: 'Vitamin C + Zinc', brands: ['Limcee', 'Celin 500'], stock: 150 }, { name: 'Telmisartan 40mg', brands: ['Telma 40', 'Cresar 40'], stock: 85 }, { name: 'Amlodipine 5mg', brands: ['Amlokind 5', 'Amlopres 5'], stock: 120 }] },
    { role: 'author', email: 'owner2@medplus.com', fullName: 'Anjali Rao', displayName: 'Anjali', storeName: 'MedPlus - Gachibowli', address: 'DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032', location: { lat: 17.4483, lng: 78.3614 }, inventory: [{ name: 'Paracetamol 650mg', brands: ['Dolo 650', 'P-650'], stock: 180 }, { name: 'Atorvastatin 10mg', brands: ['Atorva 10', 'Lipikind'], stock: 90 }, { name: 'Metformin 500mg', brands: ['Glycomet 500 SR', 'Gluconorm'], stock: 120 }, { name: 'Aspirin 75mg', brands: ['Ecosprin 75', 'Disprin'], stock: 250 }, { name: 'Domperidone + Pantoprazole', brands: ['Pan-D', 'Pantocid DSR'], stock: 60 }, { name: 'Glimepiride 1mg', brands: ['Amaryl 1', 'Glimestar 1'], stock: 50 }] },
    { role: 'author', email: 'owner22@netmeds.com', fullName: 'Kiran Kumar', displayName: 'Kiran', storeName: 'Netmeds Pharmacy - Karkhana', address: 'Karkhana Main Road, Secunderabad, Telangana 500009', location: { lat: 17.4583, lng: 78.5014 }, inventory: [{ name: 'Insulin Glargine 100IU', brands: ['Lantus Solostar', 'Basalog'], stock: 15 }, { name: 'Dapagliflozin 10mg', brands: ['Forxiga', 'Daxin'], stock: 25 }, { name: 'Sitagliptin 50mg', brands: ['Januvia', 'Istavel'], stock: 40 }, { name: 'Multivitamin', brands: ['Zincovit', 'Revital H'], stock: 300 }] },
    { role: 'author', email: 'owner23@1mg.com', fullName: 'Saritha Reddy', displayName: 'Saritha', storeName: '1mg Pharmacy - Ameerpet', address: 'Mythrivanam Building, Ameerpet, Hyderabad 500038', location: { lat: 17.4373, lng: 78.4447 }, inventory: [{ name: 'Levocetirizine 5mg', brands: ['Cetzine', 'Okacet'], stock: 500 }, { name: 'Fexofenadine 120mg', brands: ['Allegra', 'Fexova'], stock: 200 }, { name: 'Desloratadine 5mg', brands: ['Deslor', 'Alerfix'], stock: 80 }, { name: 'Montelukast 10mg', brands: ['Montair', 'Romilast'], stock: 150 }] },
    { role: 'author', email: 'owner24@pharmeasy.com', fullName: 'Rahul Varma', displayName: 'Rahul', storeName: 'PharmEasy Store - Banjara Hills', address: 'Care Hospital Lane, Road No. 1, Banjara Hills, Hyderabad 500034', location: { lat: 17.4111, lng: 78.4485 }, inventory: [{ name: 'Pantoprazole 40mg', brands: ['Pan 40', 'Pantocid'], stock: 400 }, { name: 'Rabeprazole 20mg', brands: ['Razo 20', 'Happi'], stock: 350 }, { name: 'Omeprazole 20mg', brands: ['Omez'], stock: 500 }, { name: 'Domperidone 10mg', brands: ['Domstal'], stock: 600 }] },
    { role: 'author', email: 'owner25@wellness_sec.com', fullName: 'Manish G.', displayName: 'Manish', storeName: 'Wellness Forever - Alwal', address: 'Alwal Main Road, Secunderabad, Telangana 500010', location: { lat: 17.5015, lng: 78.5012 }, inventory: [{ name: 'Sertraline 50mg', brands: ['Zoloft', 'Sertima'], stock: 120 }, { name: 'Escitalopram 10mg', brands: ['Nexito', 'Cipralex'], stock: 150 }, { name: 'Fluoxetine 20mg', brands: ['Prozac', 'Flunil'], stock: 90 }, { name: 'Clonazepam 0.5mg', brands: ['Zapiz 0.5', 'Klonopin'], stock: 200 }] },
    { role: 'author', email: 'owner26@globalhealth.com', fullName: 'Deepika S.', displayName: 'Deepika', storeName: 'Global Health Pharmacy - Somajiguda', address: 'Raj Bhavan Road, Somajiguda, Hyderabad 500082', location: { lat: 17.4225, lng: 78.4578 }, inventory: [{ name: 'Rosuvastatin 10mg', brands: ['Rosuvas', 'Roseday'], stock: 180 }, { name: 'Atorvastatin 40mg', brands: ['Atorva 40'], stock: 100 }, { name: 'Fenofibrate 160mg', brands: ['Lipicard'], stock: 50 }] },
    { role: 'author', email: 'owner3@wellness.com', fullName: 'Vikram Singh', displayName: 'Vik S.', storeName: 'Wellness Forever - Hitech City', address: 'Inorbit Mall Road, Hitech City, Hyderabad, Telangana 500081', location: { lat: 17.4262, lng: 78.3842 }, inventory: [{ name: 'Ibuprofen 400mg', brands: ['Ibugesic 400', 'Brufen 400'], stock: 130 }, { name: 'Rosuvastatin 10mg', brands: ['Rosuvas 10', 'Roseday 10'], stock: 0 }, { name: 'Cholecalciferol 60000 IU', brands: ['Uprise-D3 60K', 'Calcirol Sachet'], stock: 300 }, { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine'], stock: 280 }] },
    { role: 'author', email: 'owner4@balajimed.com', fullName: 'Priya Sharma', displayName: 'Priya', storeName: 'Balaji Medical & General Store - Secunderabad', address: 'M.G. Road, Secunderabad, Telangana 500003', location: { lat: 17.4399, lng: 78.4983 }, inventory: [{ name: 'Paracetamol 500mg', brands: ['Calpol 500', 'Crocin Pain Relief'], stock: 400 }, { name: 'Cough Syrup', brands: ['Benadryl', 'Grilinctus'], stock: 100 }, { name: 'Antacid Gel', brands: ['Digene', 'Gelusil MPS'], stock: 150 }, { name: 'Pain Relief Gel', brands: ['Volini', 'Moov'], stock: 200 }] },
    { role: 'author', email: 'owner5@lifecare.com', fullName: 'Rohan Mehta', displayName: 'Rohan M.', storeName: 'LifeCare Pharmacy - Banjara Hills', address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', location: { lat: 17.4150, lng: 78.4485 }, inventory: [{ name: 'Calcium + Vitamin D3', brands: ['Shelcal 500', 'Gemcal'], stock: 180 }, { name: 'B-Complex with Vitamin C', brands: ['Becosules Z', 'Supradyn'], stock: 220 }, { name: 'Iron + Folic Acid', brands: ['Feronia-XT', 'Fefol-Z'], stock: 0 }, { name: 'Losartan 50mg', brands: ['Losar 50', 'Losakind 50'], stock: 70 }] },
    { role: 'author', email: 'owner6@hetero.com', fullName: 'Kavita Iyer', displayName: 'Kavita', storeName: 'Hetero Pharmacy - Kukatpally', address: 'KPHB Colony, Kukatpally, Hyderabad, Telangana 500072', location: { lat: 17.4848, lng: 78.4017 }, inventory: [{ name: 'Ofloxacin 200mg', brands: ['Oflox 200', 'Zanocin 200'], stock: 65 }, { name: 'Ciprofloxacin 500mg', brands: ['Cifran 500', 'Ciplox 500'], stock: 80 }, { name: 'Metronidazole 400mg', brands: ['Flagyl 400', 'Metrogyl 400'], stock: 115 }, { name: 'Paracetamol 650mg', brands: ['Dolo 650'], stock: 300 }] },
    { role: 'author', email: 'owner7@medplus2.com', fullName: 'Arjun Desai', displayName: 'Arjun D.', storeName: 'MedPlus - Madhapur', address: 'Image Gardens Road, Madhapur, Hyderabad, Telangana 500081', location: { lat: 17.4475, lng: 78.3918 }, inventory: [{ name: 'Atorvastatin 20mg', brands: ['Atorva 20', 'Storvas 20'], stock: 100 }, { name: 'Clopidogrel 75mg', brands: ['Clopitab 75', 'Deplatt 75'], stock: 130 }, { name: 'Metoprolol 25mg', brands: ['Metolar XR 25', 'Starpress-XL 25'], stock: 90 }, { name: 'Domperidone + Pantoprazole', brands: ['Pan-D', 'Pantop D'], stock: 150 }] },
    { role: 'author', email: 'owner8@apollothy2.com', fullName: 'Sunita Patil', displayName: 'Sunita', storeName: 'Apollo Pharmacy - Begumpet', address: 'Opposite Shoppers Stop, Begumpet, Hyderabad, Telangana 500016', location: { lat: 17.4431, lng: 78.4671 }, inventory: [{ name: 'Amoxicillin + Clavulanic Acid 625mg', brands: ['Augmentin 625 Duo'], stock: 140 }, { name: 'Doxycycline 100mg', brands: ['Doxy-1 L-DR Forte'], stock: 70 }, { name: 'Sertraline 50mg', brands: ['Zoloft', 'Sertima 50'], stock: 45 }, { name: 'Escitalopram 10mg', brands: ['Nexito 10', 'Cipralex'], stock: 55 }] },
    { role: 'author', email: 'owner9@sanjeevani.com', fullName: 'Rajesh Kumar', displayName: 'Rajesh', storeName: 'Sanjeevani Medical Hall - Ameerpet', address: 'Ameerpet X Road, Hyderabad, Telangana 500016', location: { lat: 17.4375, lng: 78.4481 }, inventory: [{ name: 'Pain Relief Spray', brands: ['Volini Spray', 'Moov Spray'], stock: 180 }, { name: 'Antiseptic Liquid', brands: ['Dettol', 'Savlon'], stock: 250 }, { name: 'ORS Powder', brands: ['Electral', 'ORSL'], stock: 350 }, { name: 'Ibuprofen 200mg', brands: ['Combiflam', 'Ibugesic 200'], stock: 200 }] },
    { role: 'author', email: 'owner10@noble.com', fullName: 'Meera Gupta', displayName: 'Meera G.', storeName: 'Noble Medicals - Kondapur', address: 'Botanical Garden Rd, Kondapur, Hyderabad, Telangana 500084', location: { lat: 17.4665, lng: 78.3614 }, inventory: [{ name: 'Levocetirizine 5mg', brands: ['Lecope', 'Vozet 5'], stock: 180 }, { name: 'Nimesulide 100mg', brands: ['Nise', 'Nimulid'], stock: 0 }, { name: 'Serratiopeptidase', brands: ['Emanzen-D', 'Seradic-AP'], stock: 110 }, { name: 'Methylcobalamin', brands: ['Nurokind-OD', 'Me-12'], stock: 150 }] },
    { role: 'author', email: 'owner11@citycentral.com', fullName: 'Aditya Varma', displayName: 'Aditya', storeName: 'City Central Pharmacy - Nampally', address: 'Nampally Station Road, Hyderabad, Telangana 500001', location: { lat: 17.3916, lng: 78.4608 }, inventory: [{ name: 'Thyroxine 50mcg', brands: ['Thyronorm 50', 'Eltroxin 50'], stock: 100 }, { name: 'Warfarin 2mg', brands: ['Warf 2', 'Coumadin'], stock: 35 }, { name: 'Insulin Glargine', brands: ['Lantus', 'Basalog'], stock: 20 }] },
];

// ─── In-memory cache to avoid repeated fetches ───────────────────────────────
let cachedAuthors: AuthorUser[] | null = null;

// Resolves after `ms` milliseconds with a sentinel value
const timeout = (ms: number) =>
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms));

const getValidAuthors = async (): Promise<AuthorUser[]> => {
    // Return cached data immediately if available
    if (cachedAuthors !== null) return cachedAuthors;

    try {
        // Race the Supabase query against a 3-second hard timeout.
        // If Supabase is paused/unreachable, this returns null after 3 s
        // instead of hanging indefinitely.
        const result = await Promise.race([
            supabase
                .from('profiles')
                .select('*')
                .eq('role', 'author')
                .is('deletion_scheduled_on', null),
            timeout(3000),
        ]);

        if (result && 'data' in result && !result.error && result.data && result.data.length > 0) {
            const fromDB = (result.data as any[])
                .filter((p: any) =>
                    p.location &&
                    typeof p.location.lat === 'number' &&
                    typeof p.location.lng === 'number'
                )
                .map((p: any): AuthorUser => ({
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
                return fromDB;
            }
        }
    } catch (e) {
        // Network error — swallow and use fallback
    }

    console.info('[MediFind] Using built-in pharmacy data (Supabase unavailable or empty).');
    cachedAuthors = FALLBACK_AUTHORS;
    return FALLBACK_AUTHORS;
};


// Invalidate cache after profile updates (called from AuthContext)
export const invalidatePharmacyCache = () => { cachedAuthors = null; };

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getAllPharmacies = async (
    userLocation: { lat: number, lng: number } | null
): Promise<BasicStoreInfo[]> => {
    const authors = await getValidAuthors();

    const stores: BasicStoreInfo[] = authors.map(author => {
        const distance = userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, author.location.lat, author.location.lng)
            : -1;
        return {
            name: author.storeName,
            address: author.address,
            location: author.location,
            distance,
        };
    });

    if (userLocation) {
        stores.sort((a, b) => a.distance - b.distance);
    }

    return stores;
};


export const searchPharmacies = async (
    query: string,
    userLocation: { lat: number, lng: number } | null
): Promise<SearchResult | null> => {
    const authors = await getValidAuthors();
    const searchTerm = query.trim();
    if (!searchTerm) return null;

    // 1. Try store name match first
    const storeFuse = new Fuse(authors, {
        keys: ['storeName'],
        includeScore: true,
        threshold: 0.2,
        minMatchCharLength: 3,
    });
    const storeResults = storeFuse.search(searchTerm);

    if (storeResults.length > 0 && (storeResults[0].score ?? 1) < 0.2) {
        const matchingStore = storeResults[0].item;
        const distance = userLocation
            ? calculateDistance(userLocation.lat, userLocation.lng, matchingStore.location.lat, matchingStore.location.lng)
            : -1;

        return {
            type: 'store',
            data: {
                store: {
                    email: matchingStore.email,
                    storeName: matchingStore.storeName,
                    address: matchingStore.address,
                    location: matchingStore.location,
                },
                inventory: matchingStore.inventory,
                distance,
            }
        };
    }

    // 2. Search medicines across all stores
    const foundPharmacies: Pharmacy[] = [];
    authors.forEach(author => {
        if (!author.inventory || author.inventory.length === 0) return;

        const medicineFuse = new Fuse(author.inventory, {
            keys: [
                { name: 'name', weight: 0.7 },
                { name: 'brands', weight: 0.3 }
            ],
            includeScore: true,
            threshold: 0.3,
            minMatchCharLength: 2,
        });
        const medicineResults = medicineFuse.search(searchTerm);

        if (medicineResults.length > 0) {
            const bestMatch = medicineResults[0].item;
            const distance = userLocation
                ? calculateDistance(userLocation.lat, userLocation.lng, author.location.lat, author.location.lng)
                : -1;

            foundPharmacies.push({
                name: author.storeName,
                address: author.address,
                location: author.location,
                medicine: bestMatch,
                distance,
            });
        }
    });

    if (foundPharmacies.length === 0) return null;

    const medicineInfo: MedicineInfo | null = await getMedicineInfo(searchTerm);

    if (userLocation) {
        foundPharmacies.sort((a, b) => a.distance - b.distance);
    }

    return {
        type: 'medicines',
        data: foundPharmacies,
        medicineName: searchTerm,
        medicineInfo,
    };
};
