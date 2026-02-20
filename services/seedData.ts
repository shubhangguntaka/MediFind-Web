
import type { Medicine } from '../types';
import { supabase } from './supabaseClient';

interface SeedProfile {
    email: string;
    password_plaintext?: string;
    role: 'user' | 'author';
    fullName?: string;
    displayName?: string;
    storeName?: string;
    address?: string;
    location?: { lat: number; lng: number };
    inventory?: Medicine[];
    searchHistory?: string[];
}

const seedProfiles: SeedProfile[] = [
    // ─── Store 1: Apollo Pharmacy - Jubilee Hills ───
    {
        email: 'owner1@apollothy.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Sanjay Reddy',
        displayName: 'Sanjay R.',
        storeName: 'Apollo Pharmacy - Jubilee Hills',
        address: 'Rd Number 36, Jubilee Hills, Hyderabad, Telangana 500033',
        location: { lat: 17.4300, lng: 78.4012 },
        inventory: [
            { name: 'Paracetamol 650mg', brands: ['Dolo 650', 'Crocin Advance', 'Calpol'], stock: 200 },
            { name: 'Azithromycin 500mg', brands: ['Azee 500', 'Azithral 500'], stock: 75 },
            { name: 'Montelukast + Levocetirizine', brands: ['Montair-LC', 'Montek LC'], stock: 110 },
            { name: 'Amoxicillin 500mg', brands: ['Moxikind-CV', 'Wymox'], stock: 60 },
            { name: 'Vitamin C 500mg', brands: ['Limcee', 'Celin 500'], stock: 150 },
            { name: 'Telmisartan 40mg', brands: ['Telma 40', 'Cresar 40'], stock: 85 },
            { name: 'Amlodipine 5mg', brands: ['Amlokind 5', 'Amlopres 5'], stock: 120 },
            { name: 'Pantoprazole 40mg', brands: ['Pan 40', 'Pantocid'], stock: 180 },
            { name: 'Dolo 650', brands: ['Dolo 650'], stock: 250 },
            { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine', 'Alerid'], stock: 200 },
            { name: 'Metformin 500mg', brands: ['Glycomet 500', 'Gluconorm'], stock: 140 },
            { name: 'Aspirin 75mg', brands: ['Ecosprin 75', 'Aspicot 75'], stock: 160 },
            { name: 'Ranitidine 150mg', brands: ['Rantac 150', 'Zantac'], stock: 90 },
            { name: 'Clonazepam 0.5mg', brands: ['Zapiz 0.5', 'Clonotril'], stock: 45 },
        ],
    },
    // ─── Store 2: MedPlus - Gachibowli ───
    {
        email: 'owner2@medplus.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Anjali Rao',
        displayName: 'Anjali',
        storeName: 'MedPlus - Gachibowli',
        address: 'DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032',
        location: { lat: 17.4483, lng: 78.3614 },
        inventory: [
            { name: 'Paracetamol 650mg', brands: ['Dolo 650', 'P-650'], stock: 180 },
            { name: 'Atorvastatin 10mg', brands: ['Atorva 10', 'Lipikind'], stock: 90 },
            { name: 'Metformin 500mg', brands: ['Glycomet 500 SR', 'Gluconorm'], stock: 120 },
            { name: 'Aspirin 75mg', brands: ['Ecosprin 75', 'Disprin'], stock: 250 },
            { name: 'Domperidone + Pantoprazole', brands: ['Pan-D', 'Pantocid DSR'], stock: 60 },
            { name: 'Glimepiride 1mg', brands: ['Amaryl 1', 'Glimestar 1'], stock: 50 },
            { name: 'Amoxicillin + Clavulanic Acid 625mg', brands: ['Augmentin 625 Duo', 'Clavam 625'], stock: 80 },
            { name: 'Ibuprofen 400mg', brands: ['Ibugesic 400', 'Brufen 400'], stock: 130 },
            { name: 'Omeprazole 20mg', brands: ['Omez 20', 'Ocid 20'], stock: 200 },
            { name: 'Vitamin D3 60000 IU', brands: ['Uprise-D3 60K', 'Calcirol Sachet'], stock: 110 },
            { name: 'Losartan 50mg', brands: ['Losar 50', 'Losakind 50'], stock: 70 },
            { name: 'Rosuvastatin 10mg', brands: ['Rosuvas 10', 'Roseday 10'], stock: 85 },
            { name: 'Ondansetron 4mg', brands: ['Emeset 4', 'Ondem 4'], stock: 100 },
            { name: 'Diclofenac 50mg', brands: ['Voveran 50', 'Reactin 50'], stock: 95 },
        ],
    },
    // ─── Store 3: Netmeds Pharmacy - Karkhana ───
    {
        email: 'owner22@netmeds.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Kiran Kumar',
        displayName: 'Kiran',
        storeName: 'Netmeds Pharmacy - Karkhana',
        address: 'Karkhana Main Road, Secunderabad, Telangana 500009',
        location: { lat: 17.4583, lng: 78.5014 },
        inventory: [
            { name: 'Insulin Glargine 100IU', brands: ['Lantus Solostar', 'Basalog'], stock: 15 },
            { name: 'Dapagliflozin 10mg', brands: ['Forxiga', 'Daxin'], stock: 25 },
            { name: 'Sitagliptin 50mg', brands: ['Januvia', 'Istavel'], stock: 40 },
            { name: 'Empagliflozin 25mg', brands: ['Jardiance'], stock: 20 },
            { name: 'Multivitamin', brands: ['Zincovit', 'Revital H', 'Supradyn'], stock: 300 },
            { name: 'Thyroxine 50mcg', brands: ['Thyronorm 50', 'Eltroxin 50'], stock: 100 },
            { name: 'Calcium + Vitamin D3', brands: ['Shelcal 500', 'Gemcal', 'Calcimax'], stock: 180 },
            { name: 'Iron + Folic Acid', brands: ['Feronia-XT', 'Fefol-Z', 'Orofer XT'], stock: 120 },
            { name: 'Methylcobalamin 1500mcg', brands: ['Nurokind-OD', 'Me-12', 'Mecobal'], stock: 150 },
            { name: 'Biotin 10mg', brands: ['Biotax', 'Hairfree'], stock: 80 },
        ],
    },
    // ─── Store 4: 1mg Pharmacy - Ameerpet ───
    {
        email: 'owner23@1mg.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Saritha Reddy',
        displayName: 'Saritha',
        storeName: '1mg Pharmacy - Ameerpet',
        address: 'Mythrivanam Building, Ameerpet, Hyderabad 500038',
        location: { lat: 17.4373, lng: 78.4447 },
        inventory: [
            { name: 'Levocetirizine 5mg', brands: ['Cetzine', 'Okacet', 'Levocet'], stock: 500 },
            { name: 'Fexofenadine 120mg', brands: ['Allegra 120', 'Fexova'], stock: 200 },
            { name: 'Desloratadine 5mg', brands: ['Deslor', 'Alerfix'], stock: 80 },
            { name: 'Montelukast 10mg', brands: ['Montair', 'Romilast'], stock: 150 },
            { name: 'Bilastine 20mg', brands: ['Bilas-20', 'Bilaxten'], stock: 60 },
            { name: 'Paracetamol 500mg', brands: ['Calpol 500', 'Crocin'], stock: 400 },
            { name: 'Azithromycin 250mg', brands: ['Azee 250', 'Zithromax'], stock: 70 },
            { name: 'Doxycycline 100mg', brands: ['Doxy-1', 'Biodoxi'], stock: 55 },
            { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine'], stock: 280 },
            { name: 'Antacid Gel', brands: ['Digene', 'Gelusil MPS', 'Mucaine Gel'], stock: 200 },
            { name: 'ORS Powder', brands: ['Electral', 'ORSL', 'Enerzal'], stock: 300 },
            { name: 'Cough Syrup (Dry)', brands: ['Honitus', 'Alex', 'Ascoril D'], stock: 120 },
        ],
    },
    // ─── Store 5: PharmEasy Store - Banjara Hills ───
    {
        email: 'owner24@pharmeasy.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Rahul Varma',
        displayName: 'Rahul',
        storeName: 'PharmEasy Store - Banjara Hills',
        address: 'Care Hospital Lane, Road No. 1, Banjara Hills, Hyderabad 500034',
        location: { lat: 17.4111, lng: 78.4485 },
        inventory: [
            { name: 'Pantoprazole 40mg', brands: ['Pan 40', 'Pantocid', 'Pantop 40'], stock: 400 },
            { name: 'Rabeprazole 20mg', brands: ['Razo 20', 'Happi'], stock: 350 },
            { name: 'Omeprazole 20mg', brands: ['Omez', 'Ocid 20'], stock: 500 },
            { name: 'Esomeprazole 40mg', brands: ['Nexpro 40', 'Sompraz'], stock: 250 },
            { name: 'Domperidone 10mg', brands: ['Domstal', 'Vomistop'], stock: 600 },
            { name: 'Ondansetron 8mg', brands: ['Emeset 8', 'Ondem Syrup'], stock: 150 },
            { name: 'Metoclopramide 10mg', brands: ['Perinorm', 'Reglan'], stock: 100 },
            { name: 'Lactulose Syrup', brands: ['Duphalac', 'Looz'], stock: 80 },
            { name: 'Isabgol Husk', brands: ['Sat Isabgol', 'Metamucil'], stock: 200 },
            { name: 'Activated Charcoal 250mg', brands: ['Carbactif', 'Ultracarbon'], stock: 60 },
        ],
    },
    // ─── Store 6: Wellness Forever - Alwal ───
    {
        email: 'owner25@wellness_sec.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Manish G.',
        displayName: 'Manish',
        storeName: 'Wellness Forever - Alwal',
        address: 'Alwal Main Road, Secunderabad, Telangana 500010',
        location: { lat: 17.5015, lng: 78.5012 },
        inventory: [
            { name: 'Sertraline 50mg', brands: ['Zoloft', 'Sertima'], stock: 120 },
            { name: 'Escitalopram 10mg', brands: ['Nexito 10', 'Cipralex'], stock: 150 },
            { name: 'Fluoxetine 20mg', brands: ['Prozac', 'Flunil'], stock: 90 },
            { name: 'Paroxetine 25mg', brands: ['Paxidep CR', 'Pexep CR'], stock: 40 },
            { name: 'Clonazepam 0.5mg', brands: ['Zapiz 0.5', 'Clonotril 0.5'], stock: 200 },
            { name: 'Alprazolam 0.25mg', brands: ['Alprax 0.25', 'Restyl 0.25'], stock: 80 },
            { name: 'Pregabalin 75mg', brands: ['Lyrica 75', 'Pregabalin-NT 75'], stock: 60 },
            { name: 'Gabapentin 300mg', brands: ['Gabapin 300', 'Neurontin'], stock: 50 },
            { name: 'Amitriptyline 10mg', brands: ['Tryptomer 10', 'Sarotena'], stock: 70 },
            { name: 'Melatonin 3mg', brands: ['Melatonin-3', 'Melovit'], stock: 100 },
        ],
    },
    // ─── Store 7: Global Health Pharmacy - Somajiguda ───
    {
        email: 'owner26@globalhealth.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Deepika S.',
        displayName: 'Deepika',
        storeName: 'Global Health Pharmacy - Somajiguda',
        address: 'Raj Bhavan Road, Somajiguda, Hyderabad 500082',
        location: { lat: 17.4225, lng: 78.4578 },
        inventory: [
            { name: 'Rosuvastatin 10mg', brands: ['Rosuvas 10', 'Roseday 10'], stock: 180 },
            { name: 'Atorvastatin 40mg', brands: ['Atorva 40', 'Lipitor'], stock: 100 },
            { name: 'Fenofibrate 160mg', brands: ['Lipicard', 'Tricor'], stock: 50 },
            { name: 'Clopidogrel 75mg', brands: ['Clopitab 75', 'Deplatt 75'], stock: 130 },
            { name: 'Metoprolol 25mg', brands: ['Metolar XR 25', 'Starpress XL 25'], stock: 90 },
            { name: 'Amlodipine 10mg', brands: ['Amlopres 10', 'Amlopin 10'], stock: 75 },
            { name: 'Telmisartan 80mg', brands: ['Telma 80', 'Cresar 80'], stock: 65 },
            { name: 'Ramipril 5mg', brands: ['Cardace 5', 'Tritace 5'], stock: 85 },
            { name: 'Nitroglycerin 0.5mg', brands: ['Sorbitrate', 'Nitrostat'], stock: 40 },
            { name: 'Digoxin 0.25mg', brands: ['Lanoxin', 'Digicin'], stock: 30 },
        ],
    },
    // ─── Store 8: Wellness Forever - Hitech City ───
    {
        email: 'owner3@wellness.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Vikram Singh',
        displayName: 'Vik S.',
        storeName: 'Wellness Forever - Hitech City',
        address: 'Inorbit Mall Road, Hitech City, Hyderabad, Telangana 500081',
        location: { lat: 17.4262, lng: 78.3842 },
        inventory: [
            { name: 'Ibuprofen 400mg', brands: ['Ibugesic 400', 'Brufen 400', 'Combiflam'], stock: 130 },
            { name: 'Vitamin D3 60000 IU', brands: ['Uprise-D3 60K', 'Calcirol Sachet'], stock: 300 },
            { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine'], stock: 280 },
            { name: 'Omeprazole 20mg', brands: ['Omez', 'Ocid 20'], stock: 95 },
            { name: 'Paracetamol + Ibuprofen', brands: ['Combiflam', 'Ibugesic Plus'], stock: 200 },
            { name: 'Nimesulide 100mg', brands: ['Nise 100', 'Nimulid'], stock: 120 },
            { name: 'Aceclofenac 100mg', brands: ['Zerodol', 'Acenac'], stock: 90 },
            { name: 'Diclofenac Gel', brands: ['Voveran Gel', 'Relaxyl'], stock: 150 },
            { name: 'Volini Spray', brands: ['Volini', 'Moov Spray'], stock: 100 },
            { name: 'Muscle Relaxant (Thiocolchicoside)', brands: ['Myoril', 'Tizanidine'], stock: 60 },
        ],
    },
    // ─── Store 9: Balaji Medical - Secunderabad ───
    {
        email: 'owner4@balajimed.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Priya Sharma',
        displayName: 'Priya',
        storeName: 'Balaji Medical & General Store - Secunderabad',
        address: 'M.G. Road, Secunderabad, Telangana 500003',
        location: { lat: 17.4399, lng: 78.4983 },
        inventory: [
            { name: 'Paracetamol 500mg', brands: ['Calpol 500', 'Crocin Pain Relief'], stock: 400 },
            { name: 'Cough Syrup', brands: ['Benadryl', 'Grilinctus', 'Corex D'], stock: 100 },
            { name: 'Antacid Gel', brands: ['Digene', 'Gelusil MPS', 'Mucaine'], stock: 150 },
            { name: 'Pain Relief Gel', brands: ['Volini', 'Moov'], stock: 200 },
            { name: 'Ranitidine 150mg', brands: ['Zantac', 'Rantac 150'], stock: 125 },
            { name: 'ORS Powder', brands: ['Electral', 'ORSL'], stock: 350 },
            { name: 'Antiseptic Liquid', brands: ['Dettol', 'Savlon'], stock: 250 },
            { name: 'Band-Aids', brands: ['Hansaplast', 'Band-Aid'], stock: 500 },
            { name: 'Iodine Tincture', brands: ['Betadine', 'Wokadine'], stock: 80 },
            { name: 'Thermometer', brands: ['Dr. Morepen', 'Omron'], stock: 30 },
        ],
    },
    // ─── Store 10: LifeCare Pharmacy - Banjara Hills ───
    {
        email: 'owner5@lifecare.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Rohan Mehta',
        displayName: 'Rohan M.',
        storeName: 'LifeCare Pharmacy - Banjara Hills',
        address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
        location: { lat: 17.4150, lng: 78.4485 },
        inventory: [
            { name: 'Calcium + Vitamin D3', brands: ['Shelcal 500', 'Gemcal', 'Calcimax 500'], stock: 180 },
            { name: 'B-Complex with Vitamin C', brands: ['Becosules Z', 'Supradyn'], stock: 220 },
            { name: 'Iron + Folic Acid', brands: ['Feronia-XT', 'Fefol-Z'], stock: 0 },
            { name: 'Zinc 50mg', brands: ['Zincovit', 'Zinconia'], stock: 100 },
            { name: 'Omega-3 Fatty Acids', brands: ['Mega-3', 'Maxirich Omega 3'], stock: 140 },
            { name: 'Vitamin E 400 IU', brands: ['Evion 400', 'Golra 400'], stock: 90 },
            { name: 'Vitamin B12', brands: ['Nurokind Plus', 'Cobadex CZS'], stock: 120 },
            { name: 'Folic Acid 5mg', brands: ['Folvite 5mg', 'Mefolate'], stock: 80 },
            { name: 'Multivitamin + Minerals', brands: ['Revital H', 'Zincovit', 'Supradyn'], stock: 250 },
        ],
    },
    // ─── Store 11: Hetero Pharmacy - Kukatpally ───
    {
        email: 'owner6@hetero.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Kavita Iyer',
        displayName: 'Kavita',
        storeName: 'Hetero Pharmacy - Kukatpally',
        address: 'KPHB Colony, Kukatpally, Hyderabad, Telangana 500072',
        location: { lat: 17.4848, lng: 78.4017 },
        inventory: [
            { name: 'Ofloxacin 200mg', brands: ['Oflox 200', 'Zanocin 200'], stock: 65 },
            { name: 'Ciprofloxacin 500mg', brands: ['Cifran 500', 'Ciplox 500'], stock: 80 },
            { name: 'Metronidazole 400mg', brands: ['Flagyl 400', 'Metrogyl 400'], stock: 115 },
            { name: 'Cefixime 200mg', brands: ['Cefix 200', 'Taxim-O 200'], stock: 70 },
            { name: 'Nitrofurantoin 100mg', brands: ['Macpac 100', 'Furadantin'], stock: 45 },
            { name: 'Amoxicillin 500mg', brands: ['Amoxil', 'Wymox 500'], stock: 100 },
            { name: 'Doxycycline 100mg', brands: ['Doxy-1 L-DR', 'Biodoxi'], stock: 60 },
            { name: 'Cotrimoxazole 480mg', brands: ['Bactrim', 'Septran'], stock: 80 },
            { name: 'Paracetamol 650mg', brands: ['Dolo 650'], stock: 300 },
        ],
    },
    // ─── Store 12: MedPlus - Madhapur ───
    {
        email: 'owner7@medplus2.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Arjun Desai',
        displayName: 'Arjun D.',
        storeName: 'MedPlus - Madhapur',
        address: 'Image Gardens Road, Madhapur, Hyderabad, Telangana 500081',
        location: { lat: 17.4475, lng: 78.3918 },
        inventory: [
            { name: 'Atorvastatin 20mg', brands: ['Atorva 20', 'Storvas 20'], stock: 100 },
            { name: 'Clopidogrel 75mg', brands: ['Clopitab 75', 'Deplatt 75'], stock: 130 },
            { name: 'Metoprolol 25mg', brands: ['Metolar XR 25', 'Starpress-XL 25'], stock: 90 },
            { name: 'Fexofenadine 120mg', brands: ['Allegra 120', 'Fexova 120'], stock: 0 },
            { name: 'Domperidone + Pantoprazole', brands: ['Pan-D', 'Pantop D'], stock: 150 },
            { name: 'Lisinopril 5mg', brands: ['Listril 5', 'Cipril 5'], stock: 75 },
            { name: 'Amlodipine + Losartan', brands: ['Amlovas AT', 'Teoday AM'], stock: 55 },
            { name: 'Spironolactone 25mg', brands: ['Aldactone 25', 'Spiromide'], stock: 40 },
            { name: 'Furosemide 40mg', brands: ['Lasix 40', 'Salinex'], stock: 60 },
        ],
    },
    // ─── Store 13: Apollo Pharmacy - Begumpet ───
    {
        email: 'owner8@apollothy2.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Sunita Patil',
        displayName: 'Sunita',
        storeName: 'Apollo Pharmacy - Begumpet',
        address: 'Opposite Shoppers Stop, Begumpet, Hyderabad, Telangana 500016',
        location: { lat: 17.4431, lng: 78.4671 },
        inventory: [
            { name: 'Amoxicillin + Clavulanic Acid 625mg', brands: ['Augmentin 625 Duo'], stock: 140 },
            { name: 'Sertraline 50mg', brands: ['Zoloft', 'Sertima 50'], stock: 45 },
            { name: 'Escitalopram 10mg', brands: ['Nexito 10', 'Cipralex'], stock: 55 },
            { name: 'Olanzapine 5mg', brands: ['Oleanz 5', 'Zyprexa'], stock: 30 },
            { name: 'Hydroxychloroquine 200mg', brands: ['Hcqs 200', 'Plaquenil'], stock: 60 },
            { name: 'Prednisolone 10mg', brands: ['Omnacortil 10', 'Wysolone 10'], stock: 80 },
            { name: 'Dexamethasone 0.5mg', brands: ['Dexona 0.5', 'Decdan'], stock: 65 },
            { name: 'Methylprednisolone 4mg', brands: ['Medrol 4', 'Solumedrol'], stock: 35 },
        ],
    },
    // ─── Store 14: Sanjeevani Medical Hall - Ameerpet ───
    {
        email: 'owner9@sanjeevani.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Rajesh Kumar',
        displayName: 'Rajesh',
        storeName: 'Sanjeevani Medical Hall - Ameerpet',
        address: 'Ameerpet X Road, Hyderabad, Telangana 500016',
        location: { lat: 17.4375, lng: 78.4481 },
        inventory: [
            { name: 'Pain Relief Spray', brands: ['Volini Spray', 'Moov Spray'], stock: 180 },
            { name: 'Antiseptic Liquid', brands: ['Dettol', 'Savlon'], stock: 250 },
            { name: 'Band-Aids', brands: ['Hansaplast', 'Band-Aid'], stock: 500 },
            { name: 'ORS Powder', brands: ['Electral', 'ORSL'], stock: 350 },
            { name: 'Ibuprofen 200mg', brands: ['Combiflam', 'Ibugesic 200'], stock: 200 },
            { name: 'Eye Drops (Lubricant)', brands: ['Refresh Tears', 'Systane'], stock: 120 },
            { name: 'Nasal Spray Saline', brands: ['Nasoclear', 'Otrivin Baby'], stock: 80 },
            { name: 'Ear Drops', brands: ['Earex', 'Waxsolv'], stock: 60 },
            { name: 'Betadine Ointment', brands: ['Betadine', 'Wokadine Oint.'], stock: 100 },
        ],
    },
    // ─── Store 15: Noble Medicals - Kondapur ───
    {
        email: 'owner10@noble.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Meera Gupta',
        displayName: 'Meera G.',
        storeName: 'Noble Medicals - Kondapur',
        address: 'Botanical Garden Rd, Kondapur, Hyderabad, Telangana 500084',
        location: { lat: 17.4665, lng: 78.3614 },
        inventory: [
            { name: 'Levocetirizine 5mg', brands: ['Lecope', 'Vozet 5'], stock: 180 },
            { name: 'Salbutamol Inhaler', brands: ['Asthalin', 'Ventolin'], stock: 40 },
            { name: 'Budesonide Inhaler', brands: ['Budecort', 'Pulmicort'], stock: 30 },
            { name: 'Montelukast + Levocetirizine', brands: ['Montair-LC', 'Montek-LC'], stock: 110 },
            { name: 'Methylcobalamin', brands: ['Nurokind-OD', 'Me-12'], stock: 150 },
            { name: 'Nimesulide 100mg', brands: ['Nise', 'Nimulid'], stock: 0 },
            { name: 'Serratiopeptidase', brands: ['Emanzen-D', 'Seradic-AP'], stock: 110 },
            { name: 'Ambroxol Syrup', brands: ['Mucosolvan', 'Ambrodil'], stock: 90 },
            { name: 'Theophylline 100mg', brands: ['Deriphyllin', 'Phyllocontin'], stock: 55 },
        ],
    },
    // ─── Store 16: City Central Pharmacy - Nampally ───
    {
        email: 'owner11@citycentral.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Aditya Varma',
        displayName: 'Aditya',
        storeName: 'City Central Pharmacy - Nampally',
        address: 'Nampally Station Road, Hyderabad, Telangana 500001',
        location: { lat: 17.3916, lng: 78.4608 },
        inventory: [
            { name: 'Insulin Glargine', brands: ['Lantus', 'Basalog'], stock: 20 },
            { name: 'Insulin Aspart', brands: ['Novorapid', 'Fiasp'], stock: 25 },
            { name: 'Thyroxine 50mcg', brands: ['Thyronorm 50', 'Eltroxin 50'], stock: 100 },
            { name: 'Warfarin 2mg', brands: ['Warf 2', 'Coumadin'], stock: 35 },
            { name: 'Atenolol 50mg', brands: ['Aten 50', 'Tenormin 50'], stock: 90 },
            { name: 'Carvedilol 6.25mg', brands: ['Cardivas 6.25', 'Dilatrend'], stock: 50 },
            { name: 'Bisoprolol 5mg', brands: ['Concor 5', 'Ciblock 5'], stock: 70 },
            { name: 'Valsartan 80mg', brands: ['Valent 80', 'Diovan 80'], stock: 45 },
        ],
    },
    // ─── Store 17: Dhanvantari Pharmacy - Dilsukhnagar ───
    {
        email: 'owner12@dhanvantari.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Suresh Babu',
        displayName: 'Suresh',
        storeName: 'Dhanvantari Pharmacy - Dilsukhnagar',
        address: 'Dilsukhnagar Bus Stand Road, Hyderabad, Telangana 500060',
        location: { lat: 17.3688, lng: 78.5262 },
        inventory: [
            { name: 'Paracetamol 650mg', brands: ['Dolo 650', 'Crocin 650'], stock: 350 },
            { name: 'Ibuprofen 400mg', brands: ['Ibugesic 400', 'Brufen 400'], stock: 200 },
            { name: 'Aceclofenac + Paracetamol', brands: ['Zerodol-P', 'Hifenac-P'], stock: 160 },
            { name: 'Trypsin + Bromelain + Rutoside', brands: ['Chymoral Forte', 'Flogenzym'], stock: 80 },
            { name: 'Colchicine 0.5mg', brands: ['Colchicin', 'Cicolda 0.5'], stock: 40 },
            { name: 'Allopurinol 100mg', brands: ['Zyloric 100', 'Alloril'], stock: 75 },
            { name: 'Hydroxychloroquine 400mg', brands: ['Hcqs 400', 'Plaquenil 400'], stock: 30 },
            { name: 'Sulfasalazine 500mg', brands: ['Saaz 500', 'Sulfazine'], stock: 25 },
        ],
    },
    // ─── Store 18: Pramukh Medical - LB Nagar ───
    {
        email: 'owner13@pramukh.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Naveen Reddy',
        displayName: 'Naveen',
        storeName: 'Pramukh Medical Store - LB Nagar',
        address: 'LB Nagar X Roads, Hyderabad, Telangana 500074',
        location: { lat: 17.3440, lng: 78.5515 },
        inventory: [
            { name: 'Azithromycin 500mg', brands: ['Azee 500', 'Zithromax 500'], stock: 90 },
            { name: 'Amoxicillin + Clavulanic Acid 625mg', brands: ['Augmentin 625', 'Clavam 625'], stock: 70 },
            { name: 'Cefuroxime 500mg', brands: ['Cefoxil 500', 'Acef 500'], stock: 45 },
            { name: 'Cefpodoxime 200mg', brands: ['Cepodem 200', 'Taxim-O 200'], stock: 55 },
            { name: 'Levofloxacin 500mg', brands: ['Lox 500', 'Levomac 500'], stock: 80 },
            { name: 'Clarithromycin 500mg', brands: ['Claribid 500', 'Klacid'], stock: 35 },
            { name: 'Doxycycline 100mg', brands: ['Doxy-1 DR', 'Biodoxi 100'], stock: 60 },
            { name: 'Paracetamol 650mg', brands: ['Dolo 650'], stock: 400 },
            { name: 'ORS Powder', brands: ['Electral', 'ORSL'], stock: 200 },
        ],
    },
    // ─── Store 19: Ravi Medical & Surgical - Uppal ───
    {
        email: 'owner14@ravimed.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Ravi Teja',
        displayName: 'Ravi T.',
        storeName: 'Ravi Medical & Surgical - Uppal',
        address: 'Uppal Ring Road, Hyderabad, Telangana 500039',
        location: { lat: 17.4051, lng: 78.5591 },
        inventory: [
            { name: 'Glaucoma Eye Drops (Timolol)', brands: ['Timolol 0.5%', 'Glucomol'], stock: 30 },
            { name: 'Latanoprost Eye Drops', brands: ['Xalatan', 'Travatan'], stock: 20 },
            { name: 'Tobramycin Eye Drops', brands: ['Tobrex', 'Tobaflam'], stock: 50 },
            { name: 'Moxifloxacin Eye Drops', brands: ['Moxicip', 'Vigamox'], stock: 45 },
            { name: 'Dexamethasone Eye Drops', brands: ['Dexona Eye', 'Decadron'], stock: 40 },
            { name: 'Lubricant Eye Drops', brands: ['Refresh', 'Systane Ultra'], stock: 120 },
            { name: 'Brimonidine Eye Drops', brands: ['Alphagan P', 'Bromigan'], stock: 25 },
            { name: 'Ciprofloxacin Eye Drops', brands: ['Ciplox Eye', 'Ciprocin'], stock: 60 },
            { name: 'Betaxolol Eye Drops', brands: ['Betoptic', 'Optipranolol'], stock: 15 },
        ],
    },
    // ─── Store 20: Surya Medical & General - Tarnaka ───
    {
        email: 'owner15@suryamed.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Anand Krishnan',
        displayName: 'Anand K.',
        storeName: 'Surya Medical & General - Tarnaka',
        address: 'Tarnaka Main Road, Secunderabad, Telangana 500017',
        location: { lat: 17.4306, lng: 78.5239 },
        inventory: [
            { name: 'Metformin 1000mg', brands: ['Glycomet 1000 SR', 'Gluconorm G2'], stock: 100 },
            { name: 'Glimepiride + Metformin', brands: ['Amaryl M2', 'Glimestar M'], stock: 80 },
            { name: 'Janumet (Sitagliptin+Metformin)', brands: ['Janumet 50/500', 'Istamet'], stock: 40 },
            { name: 'Empagliflozin 10mg', brands: ['Jardiance 10', 'Empa-10'], stock: 35 },
            { name: 'Pioglitazone 15mg', brands: ['Pioglar 15', 'Actos'], stock: 55 },
            { name: 'Dapagliflozin 10mg', brands: ['Forxiga 10', 'Daxin 10'], stock: 30 },
            { name: 'Insulin Human 30/70', brands: ['Mixtard 30', 'Huminsulin 30/70'], stock: 20 },
            { name: 'Glucagon Kit', brands: ['GlucaGen HypoKit'], stock: 5 },
        ],
    },
    // ─── Store 21: Medico Pharmacy - Malkajgiri ───
    {
        email: 'owner16@medico.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Lakshmi Prasad',
        displayName: 'Lakshmi P.',
        storeName: 'Medico Pharmacy - Malkajgiri',
        address: 'Malkajgiri Circle, Hyderabad, Telangana 500047',
        location: { lat: 17.4625, lng: 78.5292 },
        inventory: [
            { name: 'Pantoprazole 40mg', brands: ['Pan 40', 'Pantocid 40'], stock: 300 },
            { name: 'Paracetamol 650mg', brands: ['Dolo 650'], stock: 500 },
            { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine'], stock: 250 },
            { name: 'Multivitamin', brands: ['Zincovit', 'Revital H'], stock: 200 },
            { name: 'Vitamin C 500mg', brands: ['Limcee', 'Celin 500'], stock: 300 },
            { name: 'Calcium + Vitamin D3', brands: ['Shelcal', 'Gemcal'], stock: 180 },
            { name: 'Cough Syrup', brands: ['Benadryl', 'Corex', 'Grilinctus'], stock: 90 },
            { name: 'Antacid Tablet', brands: ['Gelusil', 'Eno', 'Digene'], stock: 400 },
            { name: 'Skin Cream (Antifungal)', brands: ['Candid B', 'Clotrimazole'], stock: 100 },
            { name: 'Clotrimazole Dusting Powder', brands: ['Candid Powder', 'Fungitop'], stock: 80 },
        ],
    },
    // ─── Store 22: Sri Balaji Pharmacy - Nacharam ───
    {
        email: 'owner17@sribalaji.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Srinivas Rao',
        displayName: 'Srinivas',
        storeName: 'Sri Balaji Pharmacy - Nacharam',
        address: 'Nacharam Main Road, Hyderabad, Telangana 500076',
        location: { lat: 17.4135, lng: 78.5442 },
        inventory: [
            { name: 'Amlodipine 5mg', brands: ['Amlopres 5', 'Amlokind 5'], stock: 160 },
            { name: 'Atenolol 50mg', brands: ['Aten 50', 'Tenormin 50'], stock: 120 },
            { name: 'Ramipril 5mg', brands: ['Cardace 5', 'Tritace 5'], stock: 80 },
            { name: 'Hydrochlorothiazide 12.5mg', brands: ['Esidrex', 'Hydrilla'], stock: 70 },
            { name: 'Isosorbide Mononitrate', brands: ['Imdur', 'Monosorb'], stock: 45 },
            { name: 'Atorvastatin 10mg', brands: ['Atorva 10', 'Lipitor'], stock: 140 },
            { name: 'Aspirin 75mg', brands: ['Ecosprin 75', 'Aspicot'], stock: 200 },
            { name: 'Clopidogrel 75mg', brands: ['Clopitab 75', 'Deplatt A 75'], stock: 100 },
            { name: 'Losartan + Amlodipine', brands: ['Amlovas AT', 'Theoday-AM'], stock: 60 },
        ],
    },
    // ─── Store 23: Pushpa Medical Hall - Himayatnagar ───
    {
        email: 'owner18@pushpamed.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Pushpa Devi',
        displayName: 'Pushpa',
        storeName: 'Pushpa Medical Hall - Himayatnagar',
        address: 'Himayatnagar X Road, Hyderabad, Telangana 500029',
        location: { lat: 17.4018, lng: 78.4778 },
        inventory: [
            { name: 'Adapalene Gel 0.1%', brands: ['Adaferin', 'Deriva'], stock: 70 },
            { name: 'Clindamycin Gel 1%', brands: ['Clindac A', 'Evoclin'], stock: 85 },
            { name: 'Tretinoin Cream 0.025%', brands: ['Retino-A 0.025', 'Tretin'], stock: 50 },
            { name: 'Hydroquinone + Tretinoin Cream', brands: ['Melacare Forte', 'Tri-Luma'], stock: 40 },
            { name: 'Benzoyl Peroxide 2.5%', brands: ['Benzac', 'Persol AC'], stock: 60 },
            { name: 'Salicylic Acid Face Wash', brands: ['Acnemoist', 'Aziderm Face Wash'], stock: 100 },
            { name: 'Ketoconazole Shampoo 2%', brands: ['Nizoral', 'Fungicide Shampoo'], stock: 90 },
            { name: 'Clobetasol Cream 0.05%', brands: ['Tenovate', 'Lobate'], stock: 55 },
            { name: 'Mupirocin Ointment 2%', brands: ['T-Bact', 'Bactroban'], stock: 80 },
        ],
    },
    // ─── Store 24: QuickMeds Pharmacy - KPHB ───
    {
        email: 'owner19@quickmeds.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Ramesh Yadav',
        displayName: 'Ramesh Y.',
        storeName: 'QuickMeds Pharmacy - KPHB',
        address: 'Phase 3, KPHB Colony, Kukatpally Housing Board, Hyderabad, Telangana 500085',
        location: { lat: 17.4921, lng: 78.3951 },
        inventory: [
            { name: 'Cheston Cold', brands: ['Cheston Cold', 'Cheston Cold Total'], stock: 300 },
            { name: 'Coldact', brands: ['Coldact', 'Coldact Plus'], stock: 250 },
            { name: 'Sinarest', brands: ['Sinarest', 'Sinarest LP', 'Sinarest AF'], stock: 280 },
            { name: 'D-Cold Total', brands: ['D-Cold Total', 'D-Cold NF'], stock: 220 },
            { name: 'Vicks Action 500 Extra', brands: ['Vicks Action 500 Extra'], stock: 200 },
            { name: 'Crocin Cold & Flu', brands: ['Crocin Cold & Flu Max'], stock: 180 },
            { name: 'Zerodol SP', brands: ['Zerodol-SP', 'Hifenac SP'], stock: 160 },
            { name: 'Zerodol P', brands: ['Zerodol-P', 'Acenac-P'], stock: 200 },
            { name: 'Zerodol (Aceclofenac 100mg)', brands: ['Zerodol', 'Hifenac', 'Acenac'], stock: 180 },
            { name: 'Cefixime 200mg', brands: ['Taxim-O 200', 'Zifi 200', 'Cefix 200', 'Topcef 200'], stock: 150 },
            { name: 'Cetirizine 10mg', brands: ['Okacet 10', 'Cetzine 10', 'Alerid 10', 'Zyrtec'], stock: 400 },
            { name: 'Ranitidine 150mg (Zintac)', brands: ['Zintac 150', 'Rantac 150', 'Aciloc 150'], stock: 320 },
            { name: 'Vicks VapoRub', brands: ['Vicks VapoRub'], stock: 200 },
            { name: 'Nasivion Nasal Drops', brands: ['Nasivion', 'Otrivin'], stock: 120 },
            { name: 'Strepsils Lozenges', brands: ['Strepsils', 'Cofsils'], stock: 250 },
            { name: 'ENO Fruit Salt', brands: ['ENO Regular', 'ENO Lemon'], stock: 300 },
            { name: 'Disprin (Aspirin 350mg)', brands: ['Disprin', 'Aspirin 325mg'], stock: 180 },
            { name: 'Dextromethorphan + Guaifenesin Syrup', brands: ['Benadryl', 'Mepril', 'Torex'], stock: 140 },
            { name: 'Levocetirizine + Montelukast', brands: ['Montair-LC', 'Montek-LC', 'Levomer'], stock: 200 },
            { name: 'Paracetamol 650mg', brands: ['Dolo 650', 'Crocin 650'], stock: 500 },
        ],
    },
    // ─── Store 25: Sai Medicals - Mehdipatnam ───
    {
        email: 'owner20@saimedicals.com',
        password_plaintext: 'password123',
        role: 'author',
        fullName: 'Sailaja Rani',
        displayName: 'Sailaja R.',
        storeName: 'Sai Medicals - Mehdipatnam',
        address: 'Mehdipatnam Main Road, Near Bus Stand, Hyderabad, Telangana 500028',
        location: { lat: 17.3953, lng: 78.4335 },
        inventory: [
            { name: 'Cheston Cold', brands: ['Cheston Cold', 'Cheston Cold Total'], stock: 220 },
            { name: 'Coldact Flu Plus', brands: ['Coldact Flu Plus', 'Cold Best'], stock: 180 },
            { name: 'Sinarest Syrup', brands: ['Sinarest Syrup', 'D-Cold Syrup'], stock: 100 },
            { name: 'Cefixime 200mg', brands: ['Taxim-O 200', 'Zifi 200', 'Mahacef 200'], stock: 130 },
            { name: 'Cefixime + Azithromycin Combo', brands: ['Zifi AZ', 'Azicef', 'Cfaz'], stock: 80 },
            { name: 'Cetirizine 10mg', brands: ['Okacet', 'Cetzine', 'Lecope'], stock: 350 },
            { name: 'Chlorpheniramine 4mg', brands: ['Avil 25', 'Phenergan'], stock: 200 },
            { name: 'Diphenhydramine Cough Syrup', brands: ['Benadryl Cough Syrup', 'Dreemon'], stock: 120 },
            { name: 'Zerodol SP', brands: ['Zerodol-SP', 'Acenac-SP'], stock: 140 },
            { name: 'Zerodol MR', brands: ['Zerodol-MR', 'Dolowin MR'], stock: 90 },
            { name: 'Ranitidine 150mg (Zintac)', brands: ['Zintac', 'Rantac 150', 'Histac 150'], stock: 280 },
            { name: 'Famotidine 40mg', brands: ['Famocid 40', 'Topcid 40'], stock: 100 },
            { name: 'Pantoprazole 40mg', brands: ['Pan 40', 'Pantocid'], stock: 300 },
            { name: 'Vicks VapoRub', brands: ['Vicks VapoRub'], stock: 150 },
            { name: 'Ibuprofen + Paracetamol', brands: ['Combiflam', 'Ibugesic Plus'], stock: 300 },
            { name: 'Dolo 650', brands: ['Dolo 650'], stock: 500 },
            { name: 'Paracetamol 500mg', brands: ['Calpol 500', 'Crocin'], stock: 400 },
            { name: 'Hajmola Tablets', brands: ['Dabur Hajmola', 'Hajmola Regular'], stock: 200 },
            { name: 'Pudin Hara Pearls', brands: ['Pudin Hara', 'Dabur Pudin Hara'], stock: 150 },
            { name: 'Gelusil MPS', brands: ['Gelusil MPS Syrup', 'Gelusil Tablet'], stock: 250 },
            { name: 'Azithromycin 500mg', brands: ['Azee 500', 'Azithral 500', 'Zithromax'], stock: 110 },
            { name: 'Amoxicillin + Clavulanic Acid 625mg', brands: ['Augmentin 625', 'Clavam 625'], stock: 90 },
            { name: 'Ofloxacin + Ornidazole', brands: ['Oflomac OZ', 'Zanocin OZ', 'Norflox OZ'], stock: 100 },
            { name: 'Soframycin Skin Cream', brands: ['Soframycin', 'Sofra-Tulle'], stock: 100 },
            { name: 'Burnol Cream', brands: ['Burnol', 'Silverex'], stock: 80 },
            { name: 'Lacto Calamine Lotion', brands: ['Lacto Calamine', 'Calamine BP'], stock: 90 },
            { name: 'ORS Powder', brands: ['Electral', 'ORSL', 'Glucon-D'], stock: 300 },
            { name: 'Glycodin Syrup', brands: ['Glycodin', 'Terpin Hydrate Cough'], stock: 90 },
            { name: 'Strepsils', brands: ['Strepsils Original', 'Strepsils Honey & Lemon'], stock: 200 },
        ],
    },
    // ─── Test / Customer Accounts ───
    {
        email: 'user@test.com',
        password_plaintext: 'password123',
        role: 'user',
        fullName: 'Test User',
        displayName: 'Test',
        searchHistory: ['Dolo 650', 'Apollo Pharmacy - Jubilee Hills'],
    },
    {
        email: 'jane.doe@email.com',
        password_plaintext: 'password123',
        role: 'user',
        fullName: 'Jane Doe',
        displayName: 'Jane D.',
        searchHistory: ['Ibuprofen', 'Montair-LC', 'MedPlus - Gachibowli'],
    },
];

let seedingInProgress = false;

/**
 * Seeds all pharmacy and test-user profiles directly into the `profiles` table.
 * Pharmacy rows are inserted WITHOUT creating Supabase Auth accounts — they are
 * public read-only store data. For accounts that need login (role='user' + test
 * pharmacy owners), auth sign-up is attempted as a best-effort.
 */
export const seedInitialData = async (): Promise<void> => {
    if (seedingInProgress) return;
    seedingInProgress = true;

    try {
        // Check how many author rows already exist
        const { count, error: countErr } = await supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true })
            .eq('role', 'author');

        if (countErr) {
            console.warn('Seed check failed (table may not exist yet):', countErr.message);
            seedingInProgress = false;
            return;
        }

        if ((count ?? 0) > 0) {
            console.log('Already seeded — skipping.');
            seedingInProgress = false;
            return;
        }

        console.log('Seeding MediFind data into Supabase…');

        const rows = seedProfiles.map(s => ({
            email: s.email,
            role: s.role,
            full_name: s.fullName ?? '',
            display_name: s.displayName ?? '',
            store_name: s.storeName ?? null,
            address: s.address ?? null,
            location: s.location ?? null,
            inventory: s.inventory ?? null,
            search_history: s.searchHistory ?? null,
            auth_user_id: null,
        }));

        const { error: insertErr } = await supabase.from('profiles').insert(rows);

        if (insertErr) {
            console.error('Seed insert failed:', insertErr.message);
        } else {
            console.log(`Seeded ${rows.length} profiles successfully.`);
        }
    } catch (e) {
        console.warn('Seeding error:', e);
    } finally {
        seedingInProgress = false;
    }
};

/**
 * Force-reseeds the database by deleting ALL existing seed profiles (author +
 * seed user rows) and re-inserting the full updated dataset.
 *
 * Call from browser console:
 *   import('/services/seedData').then(m => m.forceReseedData())
 * OR temporarily wire a dev button to this function.
 */
export const forceReseedData = async (): Promise<void> => {
    if (seedingInProgress) return;
    seedingInProgress = true;

    try {
        console.log('Force-reseeding: deleting existing seed profiles…');

        // Delete all existing author rows (pharmacies)
        const { error: delAuthors } = await supabase
            .from('profiles')
            .delete()
            .eq('role', 'author');

        if (delAuthors) {
            console.error('Failed to delete author profiles:', delAuthors.message);
            return;
        }

        // Delete seed test-user rows by known emails
        const seedUserEmails = seedProfiles
            .filter(s => s.role === 'user')
            .map(s => s.email);

        if (seedUserEmails.length > 0) {
            const { error: delUsers } = await supabase
                .from('profiles')
                .delete()
                .in('email', seedUserEmails);

            if (delUsers) {
                console.warn('Failed to delete seed user profiles:', delUsers.message);
            }
        }

        console.log('Old seed data cleared. Inserting updated profiles…');

        const rows = seedProfiles.map(s => ({
            email: s.email,
            role: s.role,
            full_name: s.fullName ?? '',
            display_name: s.displayName ?? '',
            store_name: s.storeName ?? null,
            address: s.address ?? null,
            location: s.location ?? null,
            inventory: s.inventory ?? null,
            search_history: s.searchHistory ?? null,
            auth_user_id: null,
        }));

        const { error: insertErr } = await supabase.from('profiles').insert(rows);

        if (insertErr) {
            console.error('Force-seed insert failed:', insertErr.message);
        } else {
            console.log(`✅ Force-seeded ${rows.length} profiles successfully.`);
        }
    } catch (e) {
        console.warn('Force-seeding error:', e);
    } finally {
        seedingInProgress = false;
    }
};
