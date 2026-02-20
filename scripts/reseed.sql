-- ============================================================
--  MediFind  –  Full Reseed Script
--  Paste into: Supabase Dashboard → SQL Editor → New Query
--  Run order: DELETE first, then INSERT
-- ============================================================

-- Step 1: Remove old seed data
DELETE FROM profiles WHERE role = 'author';
DELETE FROM profiles WHERE email IN ('user@test.com', 'jane.doe@email.com');

-- Step 2: Insert all pharmacy stores + test users
INSERT INTO profiles
  (email, role, full_name, display_name, store_name, address, location, inventory, search_history, auth_user_id)
VALUES

-- ── Store 1: Apollo Pharmacy - Jubilee Hills ──────────────────
(
  'owner1@apollothy.com', 'author', 'Sanjay Reddy', 'Sanjay R.',
  'Apollo Pharmacy - Jubilee Hills',
  'Rd Number 36, Jubilee Hills, Hyderabad, Telangana 500033',
  '{"lat":17.4300,"lng":78.4012}',
  '[
    {"name":"Paracetamol 650mg","brands":["Dolo 650","Crocin Advance","Calpol"],"stock":200},
    {"name":"Azithromycin 500mg","brands":["Azee 500","Azithral 500"],"stock":75},
    {"name":"Montelukast + Levocetirizine","brands":["Montair-LC","Montek LC"],"stock":110},
    {"name":"Amoxicillin 500mg","brands":["Moxikind-CV","Wymox"],"stock":60},
    {"name":"Vitamin C 500mg","brands":["Limcee","Celin 500"],"stock":150},
    {"name":"Telmisartan 40mg","brands":["Telma 40","Cresar 40"],"stock":85},
    {"name":"Amlodipine 5mg","brands":["Amlokind 5","Amlopres 5"],"stock":120},
    {"name":"Pantoprazole 40mg","brands":["Pan 40","Pantocid"],"stock":180},
    {"name":"Dolo 650","brands":["Dolo 650"],"stock":250},
    {"name":"Cetirizine 10mg","brands":["Okacet","Cetzine","Alerid"],"stock":200},
    {"name":"Metformin 500mg","brands":["Glycomet 500","Gluconorm"],"stock":140},
    {"name":"Aspirin 75mg","brands":["Ecosprin 75","Aspicot 75"],"stock":160},
    {"name":"Ranitidine 150mg","brands":["Rantac 150","Zantac"],"stock":90},
    {"name":"Clonazepam 0.5mg","brands":["Zapiz 0.5","Clonotril"],"stock":45}
  ]',
  NULL, NULL
),

-- ── Store 2: MedPlus - Gachibowli ────────────────────────────
(
  'owner2@medplus.com', 'author', 'Anjali Rao', 'Anjali',
  'MedPlus - Gachibowli',
  'DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032',
  '{"lat":17.4483,"lng":78.3614}',
  '[
    {"name":"Paracetamol 650mg","brands":["Dolo 650","P-650"],"stock":180},
    {"name":"Atorvastatin 10mg","brands":["Atorva 10","Lipikind"],"stock":90},
    {"name":"Metformin 500mg","brands":["Glycomet 500 SR","Gluconorm"],"stock":120},
    {"name":"Aspirin 75mg","brands":["Ecosprin 75","Disprin"],"stock":250},
    {"name":"Domperidone + Pantoprazole","brands":["Pan-D","Pantocid DSR"],"stock":60},
    {"name":"Glimepiride 1mg","brands":["Amaryl 1","Glimestar 1"],"stock":50},
    {"name":"Amoxicillin + Clavulanic Acid 625mg","brands":["Augmentin 625 Duo","Clavam 625"],"stock":80},
    {"name":"Ibuprofen 400mg","brands":["Ibugesic 400","Brufen 400"],"stock":130},
    {"name":"Omeprazole 20mg","brands":["Omez 20","Ocid 20"],"stock":200},
    {"name":"Vitamin D3 60000 IU","brands":["Uprise-D3 60K","Calcirol Sachet"],"stock":110},
    {"name":"Losartan 50mg","brands":["Losar 50","Losakind 50"],"stock":70},
    {"name":"Rosuvastatin 10mg","brands":["Rosuvas 10","Roseday 10"],"stock":85},
    {"name":"Ondansetron 4mg","brands":["Emeset 4","Ondem 4"],"stock":100},
    {"name":"Diclofenac 50mg","brands":["Voveran 50","Reactin 50"],"stock":95}
  ]',
  NULL, NULL
),

-- ── Store 3: Netmeds Pharmacy - Karkhana ─────────────────────
(
  'owner22@netmeds.com', 'author', 'Kiran Kumar', 'Kiran',
  'Netmeds Pharmacy - Karkhana',
  'Karkhana Main Road, Secunderabad, Telangana 500009',
  '{"lat":17.4583,"lng":78.5014}',
  '[
    {"name":"Insulin Glargine 100IU","brands":["Lantus Solostar","Basalog"],"stock":15},
    {"name":"Dapagliflozin 10mg","brands":["Forxiga","Daxin"],"stock":25},
    {"name":"Sitagliptin 50mg","brands":["Januvia","Istavel"],"stock":40},
    {"name":"Empagliflozin 25mg","brands":["Jardiance"],"stock":20},
    {"name":"Multivitamin","brands":["Zincovit","Revital H","Supradyn"],"stock":300},
    {"name":"Thyroxine 50mcg","brands":["Thyronorm 50","Eltroxin 50"],"stock":100},
    {"name":"Calcium + Vitamin D3","brands":["Shelcal 500","Gemcal","Calcimax"],"stock":180},
    {"name":"Iron + Folic Acid","brands":["Feronia-XT","Fefol-Z","Orofer XT"],"stock":120},
    {"name":"Methylcobalamin 1500mcg","brands":["Nurokind-OD","Me-12","Mecobal"],"stock":150},
    {"name":"Biotin 10mg","brands":["Biotax","Hairfree"],"stock":80}
  ]',
  NULL, NULL
),

-- ── Store 4: 1mg Pharmacy - Ameerpet ─────────────────────────
(
  'owner23@1mg.com', 'author', 'Saritha Reddy', 'Saritha',
  '1mg Pharmacy - Ameerpet',
  'Mythrivanam Building, Ameerpet, Hyderabad 500038',
  '{"lat":17.4373,"lng":78.4447}',
  '[
    {"name":"Levocetirizine 5mg","brands":["Cetzine","Okacet","Levocet"],"stock":500},
    {"name":"Fexofenadine 120mg","brands":["Allegra 120","Fexova"],"stock":200},
    {"name":"Desloratadine 5mg","brands":["Deslor","Alerfix"],"stock":80},
    {"name":"Montelukast 10mg","brands":["Montair","Romilast"],"stock":150},
    {"name":"Bilastine 20mg","brands":["Bilas-20","Bilaxten"],"stock":60},
    {"name":"Paracetamol 500mg","brands":["Calpol 500","Crocin"],"stock":400},
    {"name":"Azithromycin 250mg","brands":["Azee 250","Zithromax"],"stock":70},
    {"name":"Doxycycline 100mg","brands":["Doxy-1","Biodoxi"],"stock":55},
    {"name":"Cetirizine 10mg","brands":["Okacet","Cetzine"],"stock":280},
    {"name":"Antacid Gel","brands":["Digene","Gelusil MPS","Mucaine Gel"],"stock":200},
    {"name":"ORS Powder","brands":["Electral","ORSL","Enerzal"],"stock":300},
    {"name":"Cough Syrup (Dry)","brands":["Honitus","Alex","Ascoril D"],"stock":120}
  ]',
  NULL, NULL
),

-- ── Store 5: PharmEasy - Banjara Hills ───────────────────────
(
  'owner24@pharmeasy.com', 'author', 'Rahul Varma', 'Rahul',
  'PharmEasy Store - Banjara Hills',
  'Care Hospital Lane, Road No. 1, Banjara Hills, Hyderabad 500034',
  '{"lat":17.4111,"lng":78.4485}',
  '[
    {"name":"Pantoprazole 40mg","brands":["Pan 40","Pantocid","Pantop 40"],"stock":400},
    {"name":"Rabeprazole 20mg","brands":["Razo 20","Happi"],"stock":350},
    {"name":"Omeprazole 20mg","brands":["Omez","Ocid 20"],"stock":500},
    {"name":"Esomeprazole 40mg","brands":["Nexpro 40","Sompraz"],"stock":250},
    {"name":"Domperidone 10mg","brands":["Domstal","Vomistop"],"stock":600},
    {"name":"Ondansetron 8mg","brands":["Emeset 8","Ondem Syrup"],"stock":150},
    {"name":"Metoclopramide 10mg","brands":["Perinorm","Reglan"],"stock":100},
    {"name":"Lactulose Syrup","brands":["Duphalac","Looz"],"stock":80},
    {"name":"Isabgol Husk","brands":["Sat Isabgol","Metamucil"],"stock":200},
    {"name":"Activated Charcoal 250mg","brands":["Carbactif","Ultracarbon"],"stock":60}
  ]',
  NULL, NULL
),

-- ── Store 6: Wellness Forever - Alwal ────────────────────────
(
  'owner25@wellness_sec.com', 'author', 'Manish G.', 'Manish',
  'Wellness Forever - Alwal',
  'Alwal Main Road, Secunderabad, Telangana 500010',
  '{"lat":17.5015,"lng":78.5012}',
  '[
    {"name":"Sertraline 50mg","brands":["Zoloft","Sertima"],"stock":120},
    {"name":"Escitalopram 10mg","brands":["Nexito 10","Cipralex"],"stock":150},
    {"name":"Fluoxetine 20mg","brands":["Prozac","Flunil"],"stock":90},
    {"name":"Paroxetine 25mg","brands":["Paxidep CR","Pexep CR"],"stock":40},
    {"name":"Clonazepam 0.5mg","brands":["Zapiz 0.5","Clonotril 0.5"],"stock":200},
    {"name":"Alprazolam 0.25mg","brands":["Alprax 0.25","Restyl 0.25"],"stock":80},
    {"name":"Pregabalin 75mg","brands":["Lyrica 75","Pregabalin-NT 75"],"stock":60},
    {"name":"Gabapentin 300mg","brands":["Gabapin 300","Neurontin"],"stock":50},
    {"name":"Amitriptyline 10mg","brands":["Tryptomer 10","Sarotena"],"stock":70},
    {"name":"Melatonin 3mg","brands":["Melatonin-3","Melovit"],"stock":100}
  ]',
  NULL, NULL
),

-- ── Store 7: Global Health Pharmacy - Somajiguda ─────────────
(
  'owner26@globalhealth.com', 'author', 'Deepika S.', 'Deepika',
  'Global Health Pharmacy - Somajiguda',
  'Raj Bhavan Road, Somajiguda, Hyderabad 500082',
  '{"lat":17.4225,"lng":78.4578}',
  '[
    {"name":"Rosuvastatin 10mg","brands":["Rosuvas 10","Roseday 10"],"stock":180},
    {"name":"Atorvastatin 40mg","brands":["Atorva 40","Lipitor"],"stock":100},
    {"name":"Fenofibrate 160mg","brands":["Lipicard","Tricor"],"stock":50},
    {"name":"Clopidogrel 75mg","brands":["Clopitab 75","Deplatt 75"],"stock":130},
    {"name":"Metoprolol 25mg","brands":["Metolar XR 25","Starpress XL 25"],"stock":90},
    {"name":"Amlodipine 10mg","brands":["Amlopres 10","Amlopin 10"],"stock":75},
    {"name":"Telmisartan 80mg","brands":["Telma 80","Cresar 80"],"stock":65},
    {"name":"Ramipril 5mg","brands":["Cardace 5","Tritace 5"],"stock":85},
    {"name":"Nitroglycerin 0.5mg","brands":["Sorbitrate","Nitrostat"],"stock":40},
    {"name":"Digoxin 0.25mg","brands":["Lanoxin","Digicin"],"stock":30}
  ]',
  NULL, NULL
),

-- ── Store 8: Wellness Forever - Hitech City ───────────────────
(
  'owner3@wellness.com', 'author', 'Vikram Singh', 'Vik S.',
  'Wellness Forever - Hitech City',
  'Inorbit Mall Road, Hitech City, Hyderabad, Telangana 500081',
  '{"lat":17.4262,"lng":78.3842}',
  '[
    {"name":"Ibuprofen 400mg","brands":["Ibugesic 400","Brufen 400","Combiflam"],"stock":130},
    {"name":"Vitamin D3 60000 IU","brands":["Uprise-D3 60K","Calcirol Sachet"],"stock":300},
    {"name":"Cetirizine 10mg","brands":["Okacet","Cetzine"],"stock":280},
    {"name":"Omeprazole 20mg","brands":["Omez","Ocid 20"],"stock":95},
    {"name":"Paracetamol + Ibuprofen","brands":["Combiflam","Ibugesic Plus"],"stock":200},
    {"name":"Nimesulide 100mg","brands":["Nise 100","Nimulid"],"stock":120},
    {"name":"Aceclofenac 100mg","brands":["Zerodol","Acenac"],"stock":90},
    {"name":"Diclofenac Gel","brands":["Voveran Gel","Relaxyl"],"stock":150},
    {"name":"Volini Spray","brands":["Volini","Moov Spray"],"stock":100},
    {"name":"Thiocolchicoside 4mg","brands":["Myoril","Muscol"],"stock":60}
  ]',
  NULL, NULL
),

-- ── Store 9: Balaji Medical - Secunderabad ────────────────────
(
  'owner4@balajimed.com', 'author', 'Priya Sharma', 'Priya',
  'Balaji Medical & General Store - Secunderabad',
  'M.G. Road, Secunderabad, Telangana 500003',
  '{"lat":17.4399,"lng":78.4983}',
  '[
    {"name":"Paracetamol 500mg","brands":["Calpol 500","Crocin Pain Relief"],"stock":400},
    {"name":"Cough Syrup","brands":["Benadryl","Grilinctus","Corex D"],"stock":100},
    {"name":"Antacid Gel","brands":["Digene","Gelusil MPS","Mucaine"],"stock":150},
    {"name":"Pain Relief Gel","brands":["Volini","Moov"],"stock":200},
    {"name":"Ranitidine 150mg","brands":["Zantac","Rantac 150"],"stock":125},
    {"name":"ORS Powder","brands":["Electral","ORSL"],"stock":350},
    {"name":"Antiseptic Liquid","brands":["Dettol","Savlon"],"stock":250},
    {"name":"Band-Aids","brands":["Hansaplast","Band-Aid"],"stock":500},
    {"name":"Betadine Ointment","brands":["Betadine","Wokadine Oint."],"stock":100},
    {"name":"Iodine Tincture","brands":["Betadine Solution","Povidone Iodine"],"stock":80}
  ]',
  NULL, NULL
),

-- ── Store 10: LifeCare Pharmacy - Banjara Hills ───────────────
(
  'owner5@lifecare.com', 'author', 'Rohan Mehta', 'Rohan M.',
  'LifeCare Pharmacy - Banjara Hills',
  'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
  '{"lat":17.4150,"lng":78.4485}',
  '[
    {"name":"Calcium + Vitamin D3","brands":["Shelcal 500","Gemcal","Calcimax 500"],"stock":180},
    {"name":"B-Complex with Vitamin C","brands":["Becosules Z","Supradyn"],"stock":220},
    {"name":"Iron + Folic Acid","brands":["Feronia-XT","Fefol-Z"],"stock":0},
    {"name":"Zinc 50mg","brands":["Zincovit","Zinconia"],"stock":100},
    {"name":"Omega-3 Fatty Acids","brands":["Mega-3","Maxirich Omega 3"],"stock":140},
    {"name":"Vitamin E 400 IU","brands":["Evion 400","Golra 400"],"stock":90},
    {"name":"Vitamin B12 1500mcg","brands":["Nurokind Plus","Cobadex CZS"],"stock":120},
    {"name":"Folic Acid 5mg","brands":["Folvite 5mg","Mefolate"],"stock":80},
    {"name":"Multivitamin + Minerals","brands":["Revital H","Zincovit","Supradyn"],"stock":250}
  ]',
  NULL, NULL
),

-- ── Store 11: Hetero Pharmacy - Kukatpally ───────────────────
(
  'owner6@hetero.com', 'author', 'Kavita Iyer', 'Kavita',
  'Hetero Pharmacy - Kukatpally',
  'KPHB Colony, Kukatpally, Hyderabad, Telangana 500072',
  '{"lat":17.4848,"lng":78.4017}',
  '[
    {"name":"Ofloxacin 200mg","brands":["Oflox 200","Zanocin 200"],"stock":65},
    {"name":"Ciprofloxacin 500mg","brands":["Cifran 500","Ciplox 500"],"stock":80},
    {"name":"Metronidazole 400mg","brands":["Flagyl 400","Metrogyl 400"],"stock":115},
    {"name":"Cefixime 200mg","brands":["Cefix 200","Taxim-O 200"],"stock":70},
    {"name":"Nitrofurantoin 100mg","brands":["Macpac 100","Furadantin"],"stock":45},
    {"name":"Amoxicillin 500mg","brands":["Amoxil","Wymox 500"],"stock":100},
    {"name":"Doxycycline 100mg","brands":["Doxy-1 L-DR","Biodoxi"],"stock":60},
    {"name":"Cotrimoxazole 480mg","brands":["Bactrim","Septran"],"stock":80},
    {"name":"Paracetamol 650mg","brands":["Dolo 650"],"stock":300}
  ]',
  NULL, NULL
),

-- ── Store 12: MedPlus - Madhapur ─────────────────────────────
(
  'owner7@medplus2.com', 'author', 'Arjun Desai', 'Arjun D.',
  'MedPlus - Madhapur',
  'Image Gardens Road, Madhapur, Hyderabad, Telangana 500081',
  '{"lat":17.4475,"lng":78.3918}',
  '[
    {"name":"Atorvastatin 20mg","brands":["Atorva 20","Storvas 20"],"stock":100},
    {"name":"Clopidogrel 75mg","brands":["Clopitab 75","Deplatt 75"],"stock":130},
    {"name":"Metoprolol 25mg","brands":["Metolar XR 25","Starpress-XL 25"],"stock":90},
    {"name":"Fexofenadine 120mg","brands":["Allegra 120","Fexova 120"],"stock":0},
    {"name":"Domperidone + Pantoprazole","brands":["Pan-D","Pantop D"],"stock":150},
    {"name":"Lisinopril 5mg","brands":["Listril 5","Cipril 5"],"stock":75},
    {"name":"Amlodipine + Losartan","brands":["Amlovas AT","Teoday AM"],"stock":55},
    {"name":"Spironolactone 25mg","brands":["Aldactone 25","Spiromide"],"stock":40},
    {"name":"Furosemide 40mg","brands":["Lasix 40","Salinex"],"stock":60}
  ]',
  NULL, NULL
),

-- ── Store 13: Apollo Pharmacy - Begumpet ─────────────────────
(
  'owner8@apollothy2.com', 'author', 'Sunita Patil', 'Sunita',
  'Apollo Pharmacy - Begumpet',
  'Opposite Shoppers Stop, Begumpet, Hyderabad, Telangana 500016',
  '{"lat":17.4431,"lng":78.4671}',
  '[
    {"name":"Amoxicillin + Clavulanic Acid 625mg","brands":["Augmentin 625 Duo"],"stock":140},
    {"name":"Sertraline 50mg","brands":["Zoloft","Sertima 50"],"stock":45},
    {"name":"Escitalopram 10mg","brands":["Nexito 10","Cipralex"],"stock":55},
    {"name":"Olanzapine 5mg","brands":["Oleanz 5","Zyprexa"],"stock":30},
    {"name":"Hydroxychloroquine 200mg","brands":["Hcqs 200","Plaquenil"],"stock":60},
    {"name":"Prednisolone 10mg","brands":["Omnacortil 10","Wysolone 10"],"stock":80},
    {"name":"Dexamethasone 0.5mg","brands":["Dexona 0.5","Decdan"],"stock":65},
    {"name":"Methylprednisolone 4mg","brands":["Medrol 4","Solumedrol"],"stock":35}
  ]',
  NULL, NULL
),

-- ── Store 14: Sanjeevani Medical Hall - Ameerpet ──────────────
(
  'owner9@sanjeevani.com', 'author', 'Rajesh Kumar', 'Rajesh',
  'Sanjeevani Medical Hall - Ameerpet',
  'Ameerpet X Road, Hyderabad, Telangana 500016',
  '{"lat":17.4375,"lng":78.4481}',
  '[
    {"name":"Pain Relief Spray","brands":["Volini Spray","Moov Spray"],"stock":180},
    {"name":"Antiseptic Liquid","brands":["Dettol","Savlon"],"stock":250},
    {"name":"Band-Aids","brands":["Hansaplast","Band-Aid"],"stock":500},
    {"name":"ORS Powder","brands":["Electral","ORSL"],"stock":350},
    {"name":"Ibuprofen 200mg","brands":["Combiflam","Ibugesic 200"],"stock":200},
    {"name":"Lubricant Eye Drops","brands":["Refresh Tears","Systane"],"stock":120},
    {"name":"Nasal Saline Spray","brands":["Nasoclear","Otrivin Baby"],"stock":80},
    {"name":"Ear Drops","brands":["Earex","Waxsolv"],"stock":60},
    {"name":"Betadine Ointment","brands":["Betadine","Wokadine Oint."],"stock":100}
  ]',
  NULL, NULL
),

-- ── Store 15: Noble Medicals - Kondapur ──────────────────────
(
  'owner10@noble.com', 'author', 'Meera Gupta', 'Meera G.',
  'Noble Medicals - Kondapur',
  'Botanical Garden Rd, Kondapur, Hyderabad, Telangana 500084',
  '{"lat":17.4665,"lng":78.3614}',
  '[
    {"name":"Levocetirizine 5mg","brands":["Lecope","Vozet 5"],"stock":180},
    {"name":"Salbutamol Inhaler","brands":["Asthalin","Ventolin"],"stock":40},
    {"name":"Budesonide Inhaler","brands":["Budecort","Pulmicort"],"stock":30},
    {"name":"Montelukast + Levocetirizine","brands":["Montair-LC","Montek-LC"],"stock":110},
    {"name":"Methylcobalamin","brands":["Nurokind-OD","Me-12"],"stock":150},
    {"name":"Nimesulide 100mg","brands":["Nise","Nimulid"],"stock":0},
    {"name":"Serratiopeptidase","brands":["Emanzen-D","Seradic-AP"],"stock":110},
    {"name":"Ambroxol Syrup","brands":["Mucosolvan","Ambrodil"],"stock":90},
    {"name":"Theophylline 100mg","brands":["Deriphyllin","Phyllocontin"],"stock":55}
  ]',
  NULL, NULL
),

-- ── Store 16: City Central Pharmacy - Nampally ───────────────
(
  'owner11@citycentral.com', 'author', 'Aditya Varma', 'Aditya',
  'City Central Pharmacy - Nampally',
  'Nampally Station Road, Hyderabad, Telangana 500001',
  '{"lat":17.3916,"lng":78.4608}',
  '[
    {"name":"Insulin Glargine","brands":["Lantus","Basalog"],"stock":20},
    {"name":"Insulin Aspart","brands":["Novorapid","Fiasp"],"stock":25},
    {"name":"Thyroxine 50mcg","brands":["Thyronorm 50","Eltroxin 50"],"stock":100},
    {"name":"Warfarin 2mg","brands":["Warf 2","Coumadin"],"stock":35},
    {"name":"Atenolol 50mg","brands":["Aten 50","Tenormin 50"],"stock":90},
    {"name":"Carvedilol 6.25mg","brands":["Cardivas 6.25","Dilatrend"],"stock":50},
    {"name":"Bisoprolol 5mg","brands":["Concor 5","Ciblock 5"],"stock":70},
    {"name":"Valsartan 80mg","brands":["Valent 80","Diovan 80"],"stock":45}
  ]',
  NULL, NULL
),

-- ── Store 17: Dhanvantari Pharmacy - Dilsukhnagar ────────────
(
  'owner12@dhanvantari.com', 'author', 'Suresh Babu', 'Suresh',
  'Dhanvantari Pharmacy - Dilsukhnagar',
  'Dilsukhnagar Bus Stand Road, Hyderabad, Telangana 500060',
  '{"lat":17.3688,"lng":78.5262}',
  '[
    {"name":"Paracetamol 650mg","brands":["Dolo 650","Crocin 650"],"stock":350},
    {"name":"Ibuprofen 400mg","brands":["Ibugesic 400","Brufen 400"],"stock":200},
    {"name":"Aceclofenac + Paracetamol","brands":["Zerodol-P","Hifenac-P"],"stock":160},
    {"name":"Trypsin + Bromelain + Rutoside","brands":["Chymoral Forte","Flogenzym"],"stock":80},
    {"name":"Colchicine 0.5mg","brands":["Cicolda 0.5","Colhicin"],"stock":40},
    {"name":"Allopurinol 100mg","brands":["Zyloric 100","Alloril"],"stock":75},
    {"name":"Hydroxychloroquine 400mg","brands":["Hcqs 400","Plaquenil 400"],"stock":30},
    {"name":"Sulfasalazine 500mg","brands":["Saaz 500","Sulfazine"],"stock":25}
  ]',
  NULL, NULL
),

-- ── Store 18: Pramukh Medical - LB Nagar ─────────────────────
(
  'owner13@pramukh.com', 'author', 'Naveen Reddy', 'Naveen',
  'Pramukh Medical Store - LB Nagar',
  'LB Nagar X Roads, Hyderabad, Telangana 500074',
  '{"lat":17.3440,"lng":78.5515}',
  '[
    {"name":"Azithromycin 500mg","brands":["Azee 500","Zithromax 500"],"stock":90},
    {"name":"Amoxicillin + Clavulanic Acid 625mg","brands":["Augmentin 625","Clavam 625"],"stock":70},
    {"name":"Cefuroxime 500mg","brands":["Cefoxil 500","Acef 500"],"stock":45},
    {"name":"Cefpodoxime 200mg","brands":["Cepodem 200","Taxim-O 200"],"stock":55},
    {"name":"Levofloxacin 500mg","brands":["Lox 500","Levomac 500"],"stock":80},
    {"name":"Clarithromycin 500mg","brands":["Claribid 500","Klacid"],"stock":35},
    {"name":"Doxycycline 100mg","brands":["Doxy-1 DR","Biodoxi 100"],"stock":60},
    {"name":"Paracetamol 650mg","brands":["Dolo 650"],"stock":400},
    {"name":"ORS Powder","brands":["Electral","ORSL"],"stock":200}
  ]',
  NULL, NULL
),

-- ── Store 19: Ravi Medical & Surgical - Uppal ────────────────
(
  'owner14@ravimed.com', 'author', 'Ravi Teja', 'Ravi T.',
  'Ravi Medical & Surgical - Uppal',
  'Uppal Ring Road, Hyderabad, Telangana 500039',
  '{"lat":17.4051,"lng":78.5591}',
  '[
    {"name":"Timolol Eye Drops 0.5%","brands":["Glucomol","Timolol"],"stock":30},
    {"name":"Latanoprost Eye Drops","brands":["Xalatan","Travatan"],"stock":20},
    {"name":"Tobramycin Eye Drops","brands":["Tobrex","Tobaflam"],"stock":50},
    {"name":"Moxifloxacin Eye Drops","brands":["Moxicip","Vigamox"],"stock":45},
    {"name":"Dexamethasone Eye Drops","brands":["Dexona Eye","Decadron"],"stock":40},
    {"name":"Lubricant Eye Drops","brands":["Refresh","Systane Ultra"],"stock":120},
    {"name":"Brimonidine Eye Drops","brands":["Alphagan P","Bromigan"],"stock":25},
    {"name":"Ciprofloxacin Eye Drops","brands":["Ciplox Eye","Ciprocin"],"stock":60},
    {"name":"Betaxolol Eye Drops","brands":["Betoptic","Optipranolol"],"stock":15}
  ]',
  NULL, NULL
),

-- ── Store 20: Surya Medical - Tarnaka ────────────────────────
(
  'owner15@suryamed.com', 'author', 'Anand Krishnan', 'Anand K.',
  'Surya Medical & General - Tarnaka',
  'Tarnaka Main Road, Secunderabad, Telangana 500017',
  '{"lat":17.4306,"lng":78.5239}',
  '[
    {"name":"Metformin 1000mg","brands":["Glycomet 1000 SR","Gluconorm G2"],"stock":100},
    {"name":"Glimepiride + Metformin","brands":["Amaryl M2","Glimestar M"],"stock":80},
    {"name":"Sitagliptin + Metformin","brands":["Janumet 50/500","Istamet"],"stock":40},
    {"name":"Empagliflozin 10mg","brands":["Jardiance 10","Empa-10"],"stock":35},
    {"name":"Pioglitazone 15mg","brands":["Pioglar 15","Actos"],"stock":55},
    {"name":"Dapagliflozin 10mg","brands":["Forxiga 10","Daxin 10"],"stock":30},
    {"name":"Insulin Human 30/70","brands":["Mixtard 30","Huminsulin 30/70"],"stock":20},
    {"name":"Glucagon Kit","brands":["GlucaGen HypoKit"],"stock":5}
  ]',
  NULL, NULL
),

-- ── Store 21: Medico Pharmacy - Malkajgiri ───────────────────
(
  'owner16@medico.com', 'author', 'Lakshmi Prasad', 'Lakshmi P.',
  'Medico Pharmacy - Malkajgiri',
  'Malkajgiri Circle, Hyderabad, Telangana 500047',
  '{"lat":17.4625,"lng":78.5292}',
  '[
    {"name":"Pantoprazole 40mg","brands":["Pan 40","Pantocid 40"],"stock":300},
    {"name":"Paracetamol 650mg","brands":["Dolo 650"],"stock":500},
    {"name":"Cetirizine 10mg","brands":["Okacet","Cetzine"],"stock":250},
    {"name":"Multivitamin","brands":["Zincovit","Revital H"],"stock":200},
    {"name":"Vitamin C 500mg","brands":["Limcee","Celin 500"],"stock":300},
    {"name":"Calcium + Vitamin D3","brands":["Shelcal","Gemcal"],"stock":180},
    {"name":"Cough Syrup","brands":["Benadryl","Corex","Grilinctus"],"stock":90},
    {"name":"Antacid Tablet","brands":["Gelusil","Eno","Digene"],"stock":400},
    {"name":"Antifungal Cream","brands":["Candid B","Clotrimazole"],"stock":100},
    {"name":"Clotrimazole Dusting Powder","brands":["Candid Powder","Fungitop"],"stock":80}
  ]',
  NULL, NULL
),

-- ── Store 22: Sri Balaji Pharmacy - Nacharam ─────────────────
(
  'owner17@sribalaji.com', 'author', 'Srinivas Rao', 'Srinivas',
  'Sri Balaji Pharmacy - Nacharam',
  'Nacharam Main Road, Hyderabad, Telangana 500076',
  '{"lat":17.4135,"lng":78.5442}',
  '[
    {"name":"Amlodipine 5mg","brands":["Amlopres 5","Amlokind 5"],"stock":160},
    {"name":"Atenolol 50mg","brands":["Aten 50","Tenormin 50"],"stock":120},
    {"name":"Ramipril 5mg","brands":["Cardace 5","Tritace 5"],"stock":80},
    {"name":"Hydrochlorothiazide 12.5mg","brands":["Esidrex","Hydrilla"],"stock":70},
    {"name":"Isosorbide Mononitrate","brands":["Imdur","Monosorb"],"stock":45},
    {"name":"Atorvastatin 10mg","brands":["Atorva 10","Lipitor"],"stock":140},
    {"name":"Aspirin 75mg","brands":["Ecosprin 75","Aspicot"],"stock":200},
    {"name":"Clopidogrel 75mg","brands":["Clopitab 75","Deplatt A 75"],"stock":100},
    {"name":"Losartan + Amlodipine","brands":["Amlovas AT","Theoday-AM"],"stock":60}
  ]',
  NULL, NULL
),

-- ── Store 23: Pushpa Medical Hall - Himayatnagar ──────────────
(
  'owner18@pushpamed.com', 'author', 'Pushpa Devi', 'Pushpa',
  'Pushpa Medical Hall - Himayatnagar',
  'Himayatnagar X Road, Hyderabad, Telangana 500029',
  '{"lat":17.4018,"lng":78.4778}',
  '[
    {"name":"Adapalene Gel 0.1%","brands":["Adaferin","Deriva"],"stock":70},
    {"name":"Clindamycin Gel 1%","brands":["Clindac A","Evoclin"],"stock":85},
    {"name":"Tretinoin Cream 0.025%","brands":["Retino-A 0.025","Tretin"],"stock":50},
    {"name":"Hydroquinone + Tretinoin Cream","brands":["Melacare Forte","Tri-Luma"],"stock":40},
    {"name":"Benzoyl Peroxide 2.5%","brands":["Benzac","Persol AC"],"stock":60},
    {"name":"Salicylic Acid Face Wash","brands":["Acnemoist","Aziderm Face Wash"],"stock":100},
    {"name":"Ketoconazole Shampoo 2%","brands":["Nizoral","Fungicide Shampoo"],"stock":90},
    {"name":"Clobetasol Cream 0.05%","brands":["Tenovate","Lobate"],"stock":55},
    {"name":"Mupirocin Ointment 2%","brands":["T-Bact","Bactroban"],"stock":80}
  ]',
  NULL, NULL
),

-- ── Test / Customer Users ─────────────────────────────────────
(
  'user@test.com', 'user', 'Test User', 'Test',
  NULL, NULL, NULL, NULL,
  '["Dolo 650","Apollo Pharmacy - Jubilee Hills"]',
  NULL
),
(
  'jane.doe@email.com', 'user', 'Jane Doe', 'Jane D.',
  NULL, NULL, NULL, NULL,
  '["Ibuprofen","Montair-LC","MedPlus - Gachibowli"]',
  NULL
);

-- ── Verify ─────────────────────────────────────────────────────
SELECT role, COUNT(*) AS count FROM profiles GROUP BY role;
