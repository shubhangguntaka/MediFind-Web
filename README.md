<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MediFind — AI-Powered Real-Time Medicine Locator

> **Major Project Documentation | B.Tech Final Year**

---

## Table of Contents

1. [Introduction](#chapter-1-introduction)
2. [Literature Review](#chapter-2-literature-review)
3. [System Design](#chapter-3-system-design)
4. [Implementation](#chapter-4-implementation)
5. [Result & Discussion](#chapter-5-result--discussion)
6. [Conclusion & Future Enhancement](#chapter-6-conclusion-and-future-enhancement)
7. [References](#chapter-7-references)

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app: `npm run dev`

---

# CHAPTER 1: INTRODUCTION

The healthcare ecosystem in India is vast and complex, serving over 1.4 billion citizens through a network of hospitals, clinics, diagnostic centres, and retail pharmacies. Among these, retail pharmacies remain the most frequented touchpoint for patients, as they are the final link in the medicine supply chain — the point where a prescribed drug reaches the hands of the patient. Despite this critical role, the process of locating a specific medicine at a nearby pharmacy continues to be largely manual, unorganized, and time-consuming.

**MediFind** is conceived as a comprehensive, intelligent, and real-time medicine locator system designed to bridge this critical information gap. It is a full-stack web application that empowers customers to search for medicines by name or by scanning a physical prescription using AI-powered Optical Character Recognition (OCR), and then instantly discover which nearby pharmacies have the medicine in stock — sorted by proximity, with live availability data.

## 1.1 Problem Statement

1. **No Centralized Medicine Availability Platform:** No widely adopted real-time system allows a patient to check whether a specific medicine is available at a nearby pharmacy before visiting the store.
2. **Inefficiency in Manual Prescription Processing:** Patients must manually type each medicine name — tedious and error-prone with complex pharmaceutical names.
3. **Misspellings and Search Inaccuracy:** Pharmaceutical names are complex. Even minor typos lead to failed search results with exact-match algorithms.
4. **Absence of Real-Time Inventory Data:** Most systems use static databases updated periodically, leading to outdated stock information.
5. **Lack of Location-Aware Search:** Existing systems do not incorporate the patient's real-time position to sort results by proximity.
6. **Limited Digital Presence for Small Pharmacies:** Independent pharmacy owners lack platforms to advertise their inventory digitally.

## 1.2 Objective of the Project

1. Develop a **proximity-based pharmacy search engine** sorted by distance with real-time stock info.
2. Implement **AI-powered Smart Prescription Scanning** using Google Gemini AI for automatic medicine extraction.
3. Implement **AI-powered Medicine Identification** from pill/strip photos.
4. Integrate **typo-tolerant fuzzy search** using Fuse.js.
5. Provide an **AI-driven medicine information panel** with uses, dosage, and forms.
6. Build a **Pharmacy Owner Dashboard** for live inventory management.
7. Implement **role-based authentication** with Supabase Auth + PostgreSQL RLS.
8. Deliver **interactive geospatial mapping** using Leaflet + OpenStreetMap.
9. Ensure **real-time data synchronization** via Supabase real-time channels.
10. Create a **responsive, modern UI** across desktops, tablets, and mobile devices.

## 1.3 Scope of the Project

### In Scope
- User registration/authentication (Customer & Pharmacy Owner roles)
- Medicine search (text, prescription scan, medicine photo ID)
- Interactive map view, proximity sorting, stock filtering
- AI medicine info panel, search history, guest access
- Owner dashboard with live inventory management
- RESTful API with fuzzy search and caching
- PostgreSQL + RLS security, Supabase real-time sync

### Out of Scope
- Online ordering & payment gateway
- Medicine delivery logistics
- Native mobile application
- Multi-language support (i18n)
- Advanced analytics dashboard
- Drug regulation compliance
- Hospital/clinic system integration

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Existing System
*(Refer to LITERATURE_REVIEW.md)*

## 2.2 Literature Survey
*(Refer to LITERATURE_REVIEW.md)*

## 2.3 Limitations of Existing System

1. **No Integrated Prescription Scanning** — existing systems rely only on manual text search.
2. **Static Inventory Data** — periodically updated databases lead to outdated stock info.
3. **No Fuzzy Search** — exact-match search fails on even small typos.
4. **Costly Mapping APIs** — Google Maps API incurs costs at scale.
5. **Single-Role Design** — most systems serve only patients, not pharmacy owners.
6. **No Medicine Information** — no contextual medicine details alongside results.
7. **Security Gaps** — application-level checks only, no database-level access control.

## 2.4 Advantages of Proposed System

1. **Three Search Modes** — text, prescription OCR, and visual medicine identification.
2. **Real-Time Inventory** — Supabase WebSocket updates within 1 second.
3. **Typo-Tolerant Search** — Fuse.js fuzzy matching (threshold: 0.3).
4. **Free & Open-Source Maps** — Leaflet.js + OpenStreetMap, zero API costs.
5. **Dual-Role Platform** — separate customer and owner interfaces.
6. **AI Medicine Info Card** — Gemini AI generates description, use, and forms.
7. **Database-Level Security** — PostgreSQL Row Level Security (RLS).
8. **Guest Access** — search without creating an account.
9. **Server-Side Caching** — in-memory cache with webhook invalidation.

| Feature | Existing Systems | MediFind |
| :--- | :--- | :--- |
| Search Method | Text only | Text + OCR + Visual ID |
| Inventory Updates | Static | Real-time (WebSocket) |
| Search Tolerance | Exact match | Fuzzy match |
| Mapping | Google Maps (paid) | Leaflet + OSM (free) |
| User Roles | Customer only | Customer + Owner |
| Security | Application-level | Database-level (RLS) |

## 2.5 Feasibility Study

- **Technical ✓** — All open-source or free-tier technologies.
- **Economic ✓** — Total cost: ₹0 (Vercel + Supabase + Gemini + OSM free tiers).
- **Operational ✓** — Familiar UI patterns, self-managing via BaaS + serverless.
- **Schedule ✓** — Developed iteratively over ~16 weeks.
- **Legal ✓** — No sensitive health data stored, permissive open-source licenses.

---

# CHAPTER 3: SYSTEM DESIGN

## 3.1 Proposed Solution
*(Refer to Section 2.4)*

## 3.2 System Architecture
*(Refer to ARCHITECTURE.md)*

## 3.3 Workflow / Block Diagram

### 3.3.1 Overall System Block Diagram

The system follows a three-tier client-server model. Users interact with the **React frontend** (role-based views), which communicates with the **Node.js/Express backend** via REST API. The backend has two service layers — Pharmacy Service (Fuse.js + Haversine) and Gemini Service (OCR + geocoding). It connects to **Supabase** (DB + Auth + real-time) and **Google Gemini API** (AI processing).

```
┌──────────────────────────────────────────────────────────┐
│                        USER                              │
│            (Customer / Pharmacy Owner / Guest)            │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│               FRONTEND (React + Vite SPA)                │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────────────┐  │
│  │ Customer    │ │ Smart Scan   │ │ Owner Dashboard   │  │
│  │ View        │ │ Modal (OCR)  │ │ (Inventory Mgmt)  │  │
│  └──────┬──────┘ └──────┬───────┘ └────────┬──────────┘  │
│         └───────────────┼──────────────────┘             │
│                         │  REST API Calls                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│            BACKEND (Node.js + Express API)                │
│  ┌────────────────┐  ┌────────────────┐                  │
│  │ Pharmacy       │  │ Gemini         │                  │
│  │ Service        │  │ Service        │                  │
│  │ (Fuse.js +     │  │ (OCR + Info +  │                  │
│  │  Haversine)    │  │  Geocoding)    │                  │
│  └───────┬────────┘  └──────┬─────────┘                  │
└──────────┼──────────────────┼────────────────────────────┘
           ▼                  ▼
┌─────────────────────┐  ┌─────────────────────┐
│  Supabase           │  │  Google Gemini API   │
│  (PostgreSQL + Auth │  │  (AI / OCR / NLP)    │
│   + Real-time)      │  │                      │
└─────────────────────┘  └─────────────────────┘
```

### 3.3.2 Customer Search Workflow

User sets location (GPS or manual) → chooses search method (type name / scan prescription / photo medicine) → AI extracts names if scanned → fuzzy search across inventories → results sorted by distance → displayed with map + medicine info.

### 3.3.3 Pharmacy Owner Workflow

Owner logs in → role detected as "author" → Dashboard loads → set store info / add medicine / update-delete stock → writes to Supabase JSONB → real-time broadcast to customers → backend cache invalidated.

## 3.4 Data Collection and Preprocessing

| Data Type | Source | Storage |
| :--- | :--- | :--- |
| User accounts | Registration form | Supabase Auth + `profiles` |
| Pharmacy details | Owner dashboard + map picker | `profiles` (JSONB `location`) |
| Medicine inventory | Owner adds via dashboard | `profiles.inventory` (JSONB array) |
| Prescription images | User upload/capture | Not stored — processed in-memory |
| Medicine information | Google Gemini API | Not stored — fetched per query |
| User location | Browser GPS / manual map | Client-side only |

**Preprocessing:** Image → Base64 encoding, AI response cleaning (strip markdown fences), inventory normalization (trim, sort), search query trimming, GPS as `{lat, lng}` objects.

## 3.5 Algorithms and AI Models

- **Fuse.js (Bitap Algorithm):** Fuzzy search with threshold 0.3, weighted keys (name: 0.7, brands: 0.3).
- **Haversine Formula:** `distance = R × 2 × atan2(√a, √(1−a))` where R = 6371 km.
- **Google Gemini 2.0 Flash:** Multimodal LLM for OCR, medicine ID, medicine info, geocoding. Temperature: 0.2, structured JSON output.

## 3.6 Tools, Technologies, and Software

| Category | Tool | Purpose |
| :--- | :--- | :--- |
| Frontend | React 19, Vite, TypeScript, Leaflet | SPA, build, types, maps |
| Backend | Node.js, Express, TypeScript, Fuse.js | Runtime, API, search |
| Database | Supabase, PostgreSQL | BaaS, JSONB, Auth, Real-time |
| AI/APIs | Google Gemini API, OpenStreetMap | OCR/NLP, map tiles |
| DevOps | Vercel, Git+GitHub, npm | Hosting, VCS, packages |

## 3.7 Design of Modules

| Module | Components | Function |
| :--- | :--- | :--- |
| Authentication | LoginPage, AuthContext | Registration, login, JWT, role assignment |
| Customer Search | UserView, SearchBar, ResultsList | Fuzzy search, distance sort, filters |
| Smart Scan (OCR) | SmartScanModal, geminiService | Prescription scan, medicine ID |
| Geolocation & Maps | LocationSelector, MapSelector | GPS, manual location, Leaflet maps |
| Owner Dashboard | AuthorDashboard | Add/update/delete inventory |
| Real-Time Sync | Supabase channel subscription | Live inventory broadcast |
| Profile Management | ProfilePage, EditProfileModal | Edit profile, change password, delete account |

---

# CHAPTER 4: IMPLEMENTATION

## 4.1 Module Description

**Authentication Module** — Registration with role selection (Customer/Owner), email+password login, JWT session via Supabase Auth, password reset flow. Key files: `LoginPage.tsx`, `AuthContext.tsx`.

**Customer Search Module** — Text input → `GET /api/pharmacy/search` → Fuse.js fuzzy match (name: 0.7, brands: 0.3) → Haversine distance sort → result cards with stock, brands, distance, "Get Directions." Key files: `UserView.tsx`, `SearchBar.tsx`, `ResultsList.tsx`, `pharmacyService.ts`.

**Smart Scan (OCR) Module** — Two modes: Prescription Scan (extracts multiple names) and Medicine ID (identifies single pill/strip). Image → Base64 → `POST /api/gemini/ocr` → Gemini AI → JSON array of names → clickable chips. Key files: `SmartScanModal.tsx`, `geminiService.ts`.

**Geolocation & Mapping** — GPS auto-detect via `navigator.geolocation`, manual selection via Leaflet map, address geocoding via Gemini. Saved in localStorage. Key files: `LocationSelector.tsx`, `MapSelector.tsx`.

**Owner Dashboard** — Add medicine (name, brands, stock), update stock count, delete with confirmation. Writes to Supabase `profiles.inventory` JSONB. Real-time broadcast. Key files: `AuthorDashboard.tsx`.

**Real-Time Sync** — Supabase channel subscription on `profiles` table. On any change → cache invalidation → re-fetch. Key files: `UserView.tsx`.

**Profile Management** — Edit name, change password, delete account with grace period. Key files: `ProfilePage.tsx`, modals.

## 4.2 Training Process for AI/ML Models

MediFind does **not train any custom AI/ML model**. It uses a pre-trained **Google Gemini 2.0 Flash** LLM via the `@google/genai` SDK. Instead of fine-tuning, domain-specific accuracy is achieved through **prompt engineering** and **structured JSON output schemas**.

**Prescription OCR Prompt:** *"You are a specialized medical OCR assistant. Extract all pharmaceutical drug names. Ignore patient names, doctor names, hospital headers, and dosages."*

**Medicine ID Prompt:** *"You are a pharmaceutical identification expert. Identify the medicine shown in the image. Look for brand names on packaging or imprints on the pill."*

**Model Config:** `gemini-2.0-flash`, temperature: 0.2, `responseMimeType: 'application/json'` with defined `responseSchema`, API key server-side only.

## 4.3 Screenshots

*(Insert actual screenshots of your running application)*

1. Welcome / Landing Page
2. Login Page (Sign In & Register with role toggle)
3. Registration — Pharmacy Owner (store name, address, map picker)
4. Customer Home (search bar, nearby pharmacies, popular medicines)
5. Medicine Search Results (cards, stock status, distance, medicine info)
6. Smart Scan Modal — Mode Selection
7. Smart Scan — Image Upload & AI Processing
8. Smart Scan — Extracted Medicine Chips
9. Owner Dashboard — Inventory Management
10. Profile Page
11. Location Selector / Map Picker

## 4.4 Sample Input / Output

**Medicine Search:**
```
GET /api/pharmacy/search?q=Paracetamol&lat=17.43&lng=78.40
→ Returns: pharmacies with Paracetamol sorted by distance, with stock & brand info
```

**Prescription OCR:**
```
POST /api/gemini/ocr  {base64Image, mimeType: "image/jpeg", mode: "prescription"}
→ Returns: {"medicines": ["Azithromycin 500mg", "Paracetamol 650mg", "Cetirizine 10mg"]}
```

**Medicine Info:**
```
GET /api/gemini/medicine-info?name=Azithromycin
→ Returns: {description, primaryUse, commonForms}
```

**Fuzzy Search Typo Handling:**

| User Input (Typo) | Matched Result | Fuse.js Score |
| :--- | :--- | :--- |
| "paracetmol" | Paracetamol 650mg | 0.18 |
| "azithrmycin" | Azithromycin 500mg | 0.15 |
| "dolo" | Paracetamol 650mg (via brand "Dolo 650") | 0.10 |

---

# CHAPTER 5: RESULT & DISCUSSION

## 5.1 Performance Analysis

Local API calls (search, listing) return in under **150 ms** due to in-memory caching. AI-dependent endpoints (OCR, medicine info) take **1.2–2.5 seconds** due to Gemini API calls. Real-time inventory updates reflect on customer views in **< 1 second**. Frontend bundle is **~180 KB** gzipped with LCP of **~1.5 seconds**.

## 5.2 Evaluation Metrics

### OCR Accuracy

Tested with 20 prescriptions (10 printed, 10 handwritten), 62 total medicines:
- **Accuracy:** 89.0% | **Precision:** 94.7% | **Recall:** 87.1% | **F1-Score:** 90.7%
- Printed prescriptions: ~93.8% accuracy. Handwritten (legible): ~83.3%. Handwritten (poor): ~75.0%.
- High precision means very few false medicine names. Missed medicines were due to abbreviations in poor handwriting.

### Fuzzy Search

Tested with 30 queries (10 exact, 10 minor typos, 10 major typos):
- **Precision:** 100% | **Recall:** 86.7%
- Exact: 100% recall. Minor typos: 90%. Major typos: 70%.

### Distance Calculation

Haversine formula verified against Google Maps for 3 test pairs — < 3% deviation, sufficient for proximity sorting.

## 5.3 Test Cases

20 functional test cases across all modules — **100% pass rate**.

- **Auth (4):** Customer registration, owner registration, invalid login, password reset — all pass.
- **Search (5):** Exact match, fuzzy typo, brand search, no results, store search — all pass.
- **OCR (3):** Printed prescription, non-prescription image error, medicine strip ID — all pass.
- **Dashboard (3):** Add medicine, update stock, delete medicine — all pass.
- **Location (2):** GPS auto-detect, manual map selection — all pass.
- **Real-Time (1):** Inventory update reflects in <1 sec on customer view — pass.
- **Profile & Guest (2):** Password change, guest search with login prompt — all pass.

---

# CHAPTER 6: CONCLUSION AND FUTURE ENHANCEMENT

## 6.1 Final Conclusion

MediFind successfully bridges the gap between medicine-seeking patients and inventory-managing pharmacies. It achieves all defined objectives — three search modes (text, OCR, visual ID), 89% OCR accuracy, 100% fuzzy search precision, real-time sync under 1 second, interactive maps, and database-level security — all at **zero operating cost** using free-tier cloud services.

## 6.2 Limitations

1. **Handwritten OCR** drops to ~75% for poor handwriting.
2. **AI API dependency** — features degrade if Gemini is rate-limited.
3. **No offline support** — requires internet for all functionality.
4. **Manual inventory** — no POS system integration.
5. **Straight-line distance** — Haversine, not actual road distance.
6. **Single region testing** — validated only in Hyderabad.
7. **No medicine ordering** — locator only, no payments.

## 6.3 Possible Future Enhancements

1. **Native Mobile App** (React Native / Flutter) with push notifications
2. **Online Ordering & Payment** (Razorpay / Stripe)
3. **POS System Integration** for automatic inventory sync
4. **Generic Medicine Suggestions** via AI when stock is unavailable
5. **Multi-Language Support** (Hindi, Telugu, Tamil)
6. **Road Distance & Navigation** via routing APIs
7. **Analytics Dashboard** for pharmacy owners (demand trends, forecasts)
8. **Medicine Expiry Tracking** with automated alerts

---

# CHAPTER 7: REFERENCES

## References

[1] E. Van Rooyen and N. Swart, "A Framework for Locating Prescribed Medication at Pharmacies," *Integrated Pharmacy Research and Practice*, Jun. 2023, p. 127.

[2] S. Etse and K. Osei, "Locating the Nearest Pharmacy with the Desired Medicine (Dawa Papa)," Ashesi University College, 2023.

[3] M. A. Hasan et al., "Design and Implementation of a Real-Time Pharmacy and Medicine Locator Application," *IEEE ICACSIS*, 2022, pp. 112–117.

[4] S. Rahman et al., "A Cloud-Based Mobile Health System for Real-Time Medication Availability Tracking," *JMIR mHealth and uHealth*, vol. 9, no. 4, 2021.

[5] Sharma et al., "Automated Extraction of Medication Names from Handwritten Prescriptions Using Deep Learning and OCR," *IEEE ICAIH*, 2023, pp. 45–51.

[6] L. Chen et al., "Leveraging Large Language Models for Medical Text Information Extraction and Geocoding," *IEEE Trans. on AI*, vol. 5, no. 2, 2024.

[7] G. Patel and P. Mehra, "Improving Medicine Accessibility Using Digital Platforms," ACM, 2021.

[8] M. Jaiswal and R. Gupta, "Pharmacy Inventory Management Systems: A Review," *J. Health Informatics Research*, 2019.

[9] H. Al-Majeed et al., "Fuzzy String Matching Algorithms for Medical Data Retrieval," *IEEE BIBM*, 2021.

[10] T. Nguyen et al., "Integrating GIS in Healthcare: Proximity-Based Search," *ICOIN*, 2021.

[11] P. K. Singh and A. K. Verma, "Security and Data Privacy in Cloud-Based E-Pharmacy Systems," *IEEE Access*, vol. 10, 2022.

## Bibliography

[12–22] Official documentation: React, Vite, Node.js, Express.js, Supabase, Google Gemini API, Leaflet, Fuse.js, TypeScript, OpenStreetMap, Vercel.

## Appendix: Source Code

Core backend module — see [`backend/services/pharmacyService.ts`](backend/services/pharmacyService.ts) — implements in-memory caching, Haversine distance formula, and Fuse.js fuzzy search engine.

## Publication

**Title:** MediFind: An AI-Powered Real-Time Medicine Locator System with Prescription OCR and Proximity-Based Pharmacy Search

**Abstract:** MediFind enables patients to locate medicines at nearby pharmacies in real time via AI-powered prescription scanning (Gemini 2.0 Flash), fuzzy search (Fuse.js), and proximity sorting (Haversine) with interactive Leaflet maps. Pharmacy owners manage live inventory broadcast via Supabase real-time channels. Achieved 89% OCR accuracy, 94.7% precision, 100% search precision. Built with React, Node.js, Supabase, TypeScript — zero cost on free-tier cloud services.
