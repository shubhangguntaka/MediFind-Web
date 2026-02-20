-- ============================================================
--  MediFind – Add More Common Medicines (Add-On Script)
--  Run this AFTER reseed.sql (no DELETE needed).
--  Paste into: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

INSERT INTO profiles
  (email, role, full_name, display_name, store_name, address, location, inventory, search_history, auth_user_id)
VALUES

-- ── Store 24: QuickMeds Pharmacy - Kukatpally Housing Board ──
-- Specialises in common cold, fever, OTC, everyday medicines
(
  'owner19@quickmeds.com', 'author', 'Ramesh Yadav', 'Ramesh Y.',
  'QuickMeds Pharmacy - KPHB',
  'Phase 3, KPHB Colony, Kukatpally Housing Board, Hyderabad, Telangana 500085',
  '{"lat":17.4921,"lng":78.3951}',
  '[
    {"name":"Cheston Cold","brands":["Cheston Cold","Cheston Cold Total"],"stock":300},
    {"name":"Coldact","brands":["Coldact","Coldact Plus"],"stock":250},
    {"name":"Sinarest","brands":["Sinarest","Sinarest LP","Sinarest AF"],"stock":280},
    {"name":"D-Cold Total","brands":["D-Cold Total","D-Cold NF"],"stock":220},
    {"name":"Vicks Action 500 Extra","brands":["Vicks Action 500 Extra"],"stock":200},
    {"name":"Crocin Cold & Flu","brands":["Crocin Cold & Flu Max"],"stock":180},
    {"name":"Zerodol SP","brands":["Zerodol-SP","Hifenac SP"],"stock":160},
    {"name":"Zerodol P","brands":["Zerodol-P","Acenac-P"],"stock":200},
    {"name":"Zerodol (Aceclofenac 100mg)","brands":["Zerodol","Hifenac","Acenac"],"stock":180},
    {"name":"Cefixime 200mg","brands":["Taxim-O 200","Zifi 200","Cefix 200","Topcef 200"],"stock":150},
    {"name":"Cetirizine 10mg","brands":["Okacet 10","Cetzine 10","Alerid 10","Zyrtec"],"stock":400},
    {"name":"Ranitidine 150mg (Zintac)","brands":["Zintac 150","Rantac 150","Aciloc 150"],"stock":320},
    {"name":"Vicks VapoRub","brands":["Vicks VapoRub"],"stock":200},
    {"name":"Nasivion Nasal Drops","brands":["Nasivion","Otrivin"],"stock":120},
    {"name":"Strepsils Lozenges","brands":["Strepsils","Cofsils"],"stock":250},
    {"name":"ENO Fruit Salt","brands":["ENO Regular","ENO Lemon"],"stock":300},
    {"name":"Disprin (Aspirin 350mg)","brands":["Disprin","Aspirin 325mg"],"stock":180},
    {"name":"Dextromethorphan + Guaifenesin Syrup","brands":["Benadryl","Mepril","Torex"],"stock":140},
    {"name":"Levocetirizine + Montelukast","brands":["Montair-LC","Montek-LC","Levomer"],"stock":200},
    {"name":"Paracetamol 650mg","brands":["Dolo 650","Crocin 650"],"stock":500}
  ]',
  NULL, NULL
),

-- ── Store 25: Sai Medicals - Mehdipatnam ─────────────────────
-- General store with wide mix of daily-use medicines
(
  'owner20@saimedicals.com', 'author', 'Sailaja Rani', 'Sailaja R.',
  'Sai Medicals - Mehdipatnam',
  'Mehdipatnam Main Road, Near Bus Stand, Hyderabad, Telangana 500028',
  '{"lat":17.3953,"lng":78.4335}',
  '[
    {"name":"Cheston Cold","brands":["Cheston Cold","Cheston Cold Total"],"stock":220},
    {"name":"Coldact Flu Plus","brands":["Coldact Flu Plus","Cold Best"],"stock":180},
    {"name":"Sinarest Syrup","brands":["Sinarest Syrup","D-Cold Syrup"],"stock":100},
    {"name":"Cefixime 200mg","brands":["Taxim-O 200","Zifi 200","Mahacef 200"],"stock":130},
    {"name":"Cefixime + Azithromycin Combo","brands":["Zifi AZ","Azicef","Cfaz"],"stock":80},
    {"name":"Cetirizine 10mg","brands":["Okacet","Cetzine","Lecope"],"stock":350},
    {"name":"Chlorpheniramine 4mg","brands":["Avil 25","Phenergan"],"stock":200},
    {"name":"Diphenhydramine","brands":["Benadryl Cough Syrup","Dreemon"],"stock":120},
    {"name":"Zerodol SP","brands":["Zerodol-SP","Acenac-SP"],"stock":140},
    {"name":"Zerodol MR","brands":["Zerodol-MR","Dolowin MR"],"stock":90},
    {"name":"Ranitidine 150mg (Zintac)","brands":["Zintac","Rantac 150","Histac 150"],"stock":280},
    {"name":"Famotidine 40mg","brands":["Famocid 40","Topcid 40"],"stock":100},
    {"name":"Pantoprazole 40mg","brands":["Pan 40","Pantocid"],"stock":300},
    {"name":"Vicks VapoRub","brands":["Vicks VapoRub"],"stock":150},
    {"name":"Ibuprofen + Paracetamol","brands":["Combiflam","Ibugesic Plus"],"stock":300},
    {"name":"Dolo 650","brands":["Dolo 650"],"stock":500},
    {"name":"Paracetamol 500mg","brands":["Calpol 500","Crocin"],"stock":400},
    {"name":"Hajmola Tablets","brands":["Dabur Hajmola","Hajmola Regular"],"stock":200},
    {"name":"Pudin Hara Pearls","brands":["Pudin Hara","Dabur Pudin Hara"],"stock":150},
    {"name":"Gelusil MPS","brands":["Gelusil MPS Syrup","Gelusil Tablet"],"stock":250},
    {"name":"Azithromycin 500mg","brands":["Azee 500","Azithral 500","Zithromax"],"stock":110},
    {"name":"Amoxicillin + Clavulanic Acid 625mg","brands":["Augmentin 625","Clavam 625"],"stock":90},
    {"name":"Ofloxacin + Ornidazole","brands":["Oflomac OZ","Zanocin OZ","Norflox OZ"],"stock":100},
    {"name":"Betnesol (Betamethasone)","brands":["Betnesol","Betamethasone"],"stock":60},
    {"name":"Soframycin Skin Cream","brands":["Soframycin","Sofra-Tulle"],"stock":100},
    {"name":"Burnol Cream","brands":["Burnol","Silverex"],"stock":80},
    {"name":"Lacto Calamine Lotion","brands":["Lacto Calamine","Calamine BP"],"stock":90},
    {"name":"ORS Powder","brands":["Electral","ORSL","Glucon-D"],"stock":300},
    {"name":"Glycodin Syrup","brands":["Glycodin","Terpin Hydrate Cough"],"stock":90},
    {"name":"Strepsils","brands":["Strepsils Original","Strepsils Honey & Lemon"],"stock":200}
  ]',
  NULL, NULL
);

-- ── Verify total counts ────────────────────────────────────────
SELECT role, COUNT(*) AS total FROM profiles GROUP BY role;
