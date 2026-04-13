# Location-Based System for Finding Medicine Availability Using AI and Geolocation

**1N. Suresh, 2D. Shiva Sai Kalyan, 3D. Satish Reddy, 4G. Shubhang**

1 Assistant Professor, Department of Computer Science and Engineering (AI&ML), CMRIT, Hyderabad, Telangana, India — sureshnomula558@gmail.com

2 Student, Department of Artificial Intelligence & Machine Learning, CMRIT, Hyderabad, Telangana, India — 22r01a7312@cmrithyderabad.edu.in

3 Student, Department of Artificial Intelligence & Machine Learning, CMRIT, Hyderabad, Telangana, India — 22r01a7316@cmrithyderabad.edu.in

4 Student, Department of Artificial Intelligence & Machine Learning, CMRIT, Hyderabad, Telangana, India — 22r01a7331@cmrithyderabad.edu.in

---

## Abstract

Getting hold of the right medicine at the right time should not be as difficult as it often is. Patients and caregivers frequently visit multiple pharmacies only to discover the required drug is out of stock — a process that wastes time and, in emergencies, risks health outcomes. Most existing pharmacy-finder tools show store locations without confirming actual medicine availability.

This project introduces MediFind, a web-based medicine availability tracker that combines real-time geolocation with a shared pharmacy inventory database. Users type a medicine name or scan a prescription using an AI-powered OCR module — built on Google Gemini — which extracts drug names automatically. In testing, OCR achieved 83.3% extraction accuracy across printed, handwritten, and low-quality images. Results are displayed on an interactive map, sorted by proximity. By tying together location intelligence, inventory data, and smart search, MediFind cuts down the effort involved in locating medicines and helps patients get treated sooner.

**Keywords:** Medicine Availability, Pharmacy Locator, Geolocation, Inventory Tracking, Healthcare Application, Optical Character Recognition (OCR), Global Positioning System (GPS).

---

## I. INTRODUCTION

Digital tools have reshaped healthcare — from online appointments to e-prescriptions. Yet one common problem persists: finding out which nearby pharmacy actually stocks the medicine you need. For a caregiver rushing to get medication for a sick child, or an elderly person managing chronic illness, visiting three or four stores before finding the right drug is both exhausting and risky.

Some digital solutions exist. Pharmacy directory apps show where stores are on a map, and a few list operating hours. But almost none confirm whether a *specific* medicine is on the shelf [1][7]. A patient might travel kilometres to a pharmacy only to discover the drug ran out yesterday. Earlier systems in this space were essentially GPS navigation tools wearing a healthcare label — they could get you *to* a pharmacy but could not tell you *what was inside*.

What has changed is the technology available. Cloud databases like Supabase now offer real-time synchronization. Mapping libraries such as Leaflet are free and capable. Multimodal AI services like Google Gemini can read text from photographs with reasonable accuracy [5][6]. These building blocks make a unified solution practical.

MediFind is a web platform that merges geolocation tracking, a centralized pharmacy inventory database, AI-powered prescription scanning, and interactive map visualization into one workflow. The core contributions are:

- A working prototype tracking medicine availability in nearby pharmacies using real-time geolocation.
- Centralized inventory synchronization so pharmacy stock updates are visible to users almost instantly.
- A prescription-assisted search pipeline using AI-based OCR to extract medicine names from images automatically.
- A modular architecture designed for future extensions including delivery integration and tele-pharmacy support.

By sharing inventory data through a common platform, patients make faster decisions and the overall healthcare ecosystem becomes more connected [3][7].

---

## II. RELATED WORK

The earliest pharmacy-access tools were GPS-based finders that plotted stores on a map and gave directions. Useful in unfamiliar areas, but they stopped at location — whether the pharmacy had your medicine or was even open remained unknown until you arrived.

Etse and Osei [2] built Dawa Papa, combining Google Maps API with the Haversine formula to find the nearest pharmacy carrying a desired drug. However, inventory data was manually maintained, and pharmacies often did not update, leaving availability data stale. Van Rooyen and Swart [1] factored in cost and travel time alongside distance when recommending pharmacies, but testing was limited to simulated datasets without live inventory integration.

Rahman et al. [4] proposed a cloud-based mobile system for medication tracking, but reliability suffered in low-bandwidth areas. On the AI side, Sharma et al. [5] applied deep learning with OCR to extract medicine names from handwritten prescriptions — effective for legible text, but accuracy dropped with poor handwriting. Chen et al. [6] pushed further using LLMs for medical text extraction, though hallucinations and high API costs were practical concerns.

Jaiswal and Gupta [8] surveyed internal pharmacy inventory systems — useful for billing and stock alerts, but the data stays locked inside pharmacy software, invisible to patients. Patel and Mehra [7] highlighted that in developing regions, the pharmaceutical supply chain is not digitized enough for remote querying.

On the technical side, Al-Majeed and Al-Husseini [9] demonstrated fuzzy string matching for medical retrieval — critical since patients frequently misspell drug names. Nguyen et al. [10] showed how GIS integration enables proximity-based healthcare searching. Singh and Verma [11] addressed security in cloud e-pharmacy systems through Row Level Security and role-based access controls.

The pattern across existing work is clear: systems do one thing well — location finding, inventory management, or prescription reading — but none integrate all three into a single patient-facing platform. MediFind bridges this gap by combining real-time inventory tracking, geolocation search, AI OCR, fuzzy matching, and role-based access in one application.

### Table 2.1: Literature Survey

| S.No | Title | Problem Statement | Method Used | Limitations |
|:---|:---|:---|:---|:---|
| 1 | A Framework for Locating Prescribed Medication at Pharmacies (2023) [1] | Patients face difficulty finding pharmacies that stock prescribed medicines quickly. | GPS-based framework integrating pharmacy data and location services. | Tested on limited datasets and lacked large-scale real-time deployment. |
| 2 | Locating the Nearest Pharmacy with the Desired Medicine (Dawa Papa) (2023) [2] | Difficulty in identifying nearby pharmacies that have specific medicines available. | Google Maps API and Haversine distance formula to find nearest pharmacy. | Does not consider factors like travel cost, working hours, or stock updates in real time. |
| 3 | Design and Implementation of a Real-Time Pharmacy and Medicine Locator Application (2022) [3] | Delay in locating available drugs across disparate pharmacy systems via manual queries. | Web/Mobile application architecture integrating real-time inventory queries. | Relies heavily on continuous local pharmacy updates; lacks automated prescription processing. |
| 4 | A Cloud-Based Mobile Health System for Real-Time Medication Tracking (2021) [4] | Lack of scalable architecture for tracking drug availability on mobile devices. | Cloud-infrastructure connecting mobile clients with centralized pharmacy databases. | Subject to network latency and cloud service downtimes in low-bandwidth regions. |
| 5 | Automated Extraction of Medication Names from Handwritten Prescriptions (2023) [5] | High error rate and time consumption when manually inputting handwritten prescription data. | Deep learning and Optical Character Recognition (OCR) models. | Struggles with highly illegible handwriting; requires significant computational resources. |
| 6 | Leveraging Large Language Models for Medical Text Information Extraction (2024) [6] | Relying on manual extraction from unstructured medical documents is inefficient. | Utilized LLMs to parse medical context and map data to geographic coordinates. | Occasional hallucinations in medical entity recognition and high operational AI API costs. |
| 7 | Improving Medicine Accessibility Using Digital Platforms (2021) [7] | Difficulty in accessing medicines due to limited digital healthcare solutions. | Web-based healthcare platforms for improving medicine accessibility. | Lacks integration with real-time pharmacy inventory systems. |
| 8 | Pharmacy Inventory Management Systems: A Review (2019) [8] | Inefficiencies and frequent stockouts in traditional manual pharmacy management. | Comprehensive literature review of existing manual and semi-automated systems. | Being a review, it proposes no new system architecture and focuses on older systems. |
| 9 | Implementing Fuzzy String Matching Algorithms for Accurate Medical Retrieval (2021) [9] | Users often mistype complex pharmaceutical drug names, leading to failed searches. | Implementation of typo-tolerant fuzzy string matching algorithms. | Algorithmic overhead can increase query response time with very large drug databases. |
| 10 | Integrating Geographic Information Systems (GIS) in Healthcare (2021) [10] | Inability to accurately map proximity between patients and available medical resources. | Spatial data analysis and GIS integration to optimize proximity-based searching. | Requires accurate mapping APIs which might lack granular data for remote or rural clinics. |
| 11 | Security and Data Privacy in Cloud-Based E-Pharmacy Management Systems (2022) [11] | High potential risk of data breaches in centralized cloud healthcare applications. | Implementation of Role-Based Access Control and Row Level Security (RLS) policies. | Strict security rules can complicate user onboarding and limit rapid data sharing. |

---

## III. METHODOLOGY

### System Architecture

MediFind uses a three-layer architecture. The frontend is a React-based single-page application built with Vite. The backend is an Express.js server handling API routing, search logic, and AI service calls. The data layer is Supabase (PostgreSQL), storing pharmacy profiles, inventory, and authentication data. These layers communicate through RESTful APIs with real-time synchronization keeping inventory fresh [3][11].

> *Figure 3.0.1: Architecture diagram*

A typical request flows like this: user opens the app → browser captures GPS coordinates via the HTML5 Geolocation API → user enters a medicine name → backend queries the pharmacy database → filters by stock availability → sorts by distance using the Haversine formula → returns a ranked list → frontend plots results on a Leaflet map. The round trip takes roughly 1–2 seconds.

For prescription scanning, an extra step is added. The user uploads a prescription image, the frontend Base64-encodes it and POSTs to the backend's OCR endpoint, which forwards it to Google Gemini's vision model [5][6]. Extracted medicine names feed directly into the same search pipeline — no typing required.

The system also has a pharmacy owner dashboard (accessible only to "author" role users). Owners log in, update inventory — add medicines, adjust stock, remove items — and changes write directly to Supabase, triggering cache invalidation so the next customer search reflects current data [8]. Row Level Security policies ensure owners can only modify their own records [11].

### Workflow

> *Figure 3.0.2: Workflow diagram*

**Step 1 — Location Detection:** The app requests the user's geographic position. If permission is denied, a manual map-based pin-drop fallback is provided [10].

**Step 2 — Medicine Input:** The user either types a medicine name or taps "Scan" to upload a prescription image for OCR processing.

**Step 3 — Search and Filtering:** The backend queries inventory records, applies fuzzy matching via Fuse.js [9] for typo tolerance, calculates Haversine distances, and sorts pharmacies nearest-first.

**Step 4 — Results Display:** Matching pharmacies appear as cards showing store name, address, distance, and inventory access. Markers appear on the interactive Leaflet map.

**Step 5 — Navigation:** Selecting a pharmacy zooms the map and provides route information.

### Key Modules

**Medicine Search & Fuzzy Matching:** The search uses Fuse.js for approximate string matching [9]. Typing "Paracitamol" instead of "Paracetamol" still returns correct results. The search is case-insensitive, supports partial names, and uses indexed lookups for performance. In healthcare, drug names are long and derived from chemical nomenclature — a rigid exact-match engine would fail users regularly.

**Pharmacy Inventory Management:** Pharmacy owners manage stock through a dedicated dashboard. Every change persists to Supabase in real-time. Because Supabase supports real-time subscriptions, when a pharmacy marks a drug as out-of-stock, users searching for it will not see that pharmacy within seconds [8]. The platform's reliability fundamentally depends on pharmacies keeping their data current.

**Database & Real-Time Sync:** The Supabase PostgreSQL database uses a unified `profiles` table differentiating customers and pharmacy owners by a `role` field. Inventory is stored as JSONB arrays. A cache invalidation endpoint (`/api/pharmacy/invalidate`) refreshes the server-side cache on every stock update [3][11].

**Mapping & Distance:** Leaflet with OpenStreetMap tiles handles visualization — free, lightweight, and requiring no API key billing [10]. The Haversine formula computes straight-line distance for ranking, which is computationally cheap and sufficiently accurate for city-level pharmacy searching.

### Algorithms

**1) Inventory Data Management** — Validates and applies stock changes from the pharmacy dashboard to the JSONB inventory column, triggering cache invalidation [8].

**2) Medicine Search** — Runs user input against inventory data using Fuse.js weighted indexing. Case-insensitive, returns results exceeding a configurable similarity threshold [9].

**3) Location-Based Filtering** — Computes Haversine distance between user and pharmacy coordinates, sorts ascending. Optional radius filter excludes distant pharmacies [10].

**4) Navigation Route Generation** — Centres the map on the selected pharmacy and provides directional guidance through the Leaflet interface.

**5) Inventory Sync** — Invalidates backend cache on stock changes and pushes updates to connected clients via Supabase's real-time channel, preventing stale availability data [3].

---

## IV. RESULT ANALYSIS

We evaluated MediFind across five dimensions: search accuracy, OCR performance, location detection, processing speed, and real-time sync. The customer dashboard (Figure 4.0.1) — featuring the search bar, OCR scan button, auto-detected location, and a grid of 21 nearby pharmacies sorted by distance — served as the testing ground.

> *Figure 4.0.1: MediFind Home Page*

### 4.1 Medicine Search Performance and Typo Tolerance

The Fuse.js-based fuzzy search [9] was tested with 40 queries: 20 exact and 20 with common misspellings (like "Azithromicin" or "Paracitamol").

**Table 4.1: Medicine Search and Typo Tolerance Performance**

| Parameter | Exact Queries | Typo-laden Queries | Overall |
|:---|:---|:---|:---|
| Total Search Queries | 20 | 20 | 40 |
| Successful Pharmacy Results | 19 | 17 | 36 |
| Search Success Rate | 95% | 85% | 90% |

The one exact-query failure came from a brand-name variant. The three typo failures involved names so heavily misspelled that even fuzzy matching could not recover candidates. An 85% success rate on misspelled queries — which better mirrors real-world usage — is encouraging.

### 4.2 Prescription Scanning (AI-OCR) Performance

The OCR module sends uploaded prescription images to Google Gemini's multimodal vision model for text extraction [5][6]. We tested 30 images across three quality tiers.

**Table 4.2: AI-OCR Extraction Performance by Image Quality**

| Image Quality/Type | Total Tested | Correct Extractions | Accuracy |
|:---|:---|:---|:---|
| Clearly Printed | 10 | 10 | 100% |
| Normal Handwritten | 10 | 8 | 80% |
| Low Lighting / Blurry | 10 | 7 | 70% |
| **Overall** | **30** | **25** | **83.3%** |

Printed prescriptions were handled flawlessly. Handwritten ones failed only with genuinely illegible writing. The 70% on low-quality images is expected — vision models cannot reliably read text that humans would also struggle with. For the ~17% of failures, users can manually correct extracted text before searching.

### 4.3 OCR Processing Time

**Table 4.3: Image Processing and Search Timings**

| Operation | Average Time |
|:---|:---|
| Image Upload & AI Inference | 15.0 – 25.0 seconds |
| Medicine Search After Extraction | ~1.0 – 1.5 seconds |
| **Total Time to Results** | **~16.0 – 26.5 seconds** |

The 15–25 second range is dominated by Gemini API inference time. While longer than a manual text search, it eliminates the need for users to decipher and type complex pharmaceutical names — which for many users takes even longer.

### 4.4 Location Detection Performance

**Table 4.4: Location Detection Performance**

| Parameter | Result |
|:---|:---|
| Total Location Tests | 15 |
| Correct Location Detection | 14 |
| Location Detection Accuracy | 93% |

The single failure occurred because browser location permission was previously blocked. MediFind handled this gracefully by displaying the manual pin-drop selector.

### 4.5 Real-Time Inventory Sync and System Responsiveness

**Table 4.5: System Response & Sync Latencies**

| Operation | Average Latency |
|:---|:---|
| Text Search Query (Database Fetch) | ~1.4 seconds |
| Client-side Fuzzy Filtering | ~50 – 200 ms |
| Map Tile Visualization | ~1.0 second |
| Active Inventory Sync (Real-time Push) | ~0.5 – 1.2 seconds |

The sync latency of 0.5–1.2 seconds means stock updates by pharmacy owners are visible to customers in roughly one second — preventing the scenario where a user travels to a pharmacy for an already sold-out medicine [3].

### 4.6 Overall System Evaluation

**Table 4.6: Overall System Performance Summary**

| Metric | Result |
|:---|:---|
| Search Success Rate (Overall) | 90% |
| AI-OCR Extraction Accuracy | 83.3% |
| Location Detection Accuracy | 93% |
| Real-Time Sync Latency | ~0.5 – 1.2 seconds |
| Average Text Search Time | ~1.4 seconds |
| Average OCR Processing Time | ~16 – 26.5 seconds |

The system performs reliably across all tested dimensions. There is room for improvement in OCR speed and accuracy on poor-quality images, but as a working prototype, MediFind delivers on its core promise.

---

## V. DISCUSSION

The results confirm that combining geolocation with a shared pharmacy database makes medicine-finding faster and less stressful in practice. The modular architecture — where search, OCR, database, and mapping operate as separate components via defined APIs — proved to be one of the system's greatest strengths, allowing independent development and debugging of each piece.

The fuzzy search layer [9] was more valuable than initially expected. Early testing revealed users misspell drug names far more often than assumed. Without Fuse.js, a significant portion of searches would return empty results — a trust-killer for any platform.

The biggest limitation is data freshness. MediFind can only show accurate availability if pharmacies keep their inventory updated. In controlled testing, we managed this ourselves. In a real deployment, there is no guarantee every pharmacy owner will update diligently. This is a human behaviour problem, not a technical one, and solving it may require incentive structures — like customer traffic analytics for active pharmacies — rather than more code [1][8].

The OCR module's 83.3% accuracy means roughly five of every six prescriptions are processed without manual intervention. The 16.7% failure rate, concentrated in low-quality images, is mitigated by allowing users to edit extracted text before searching.

Compared to existing tools — simple directories, standalone inventory systems, or prototypes tested on simulated data [1][2][4] — MediFind offers a more complete solution by integrating pieces that others left separate. It is not the first to use GPS for pharmacy finding, OCR for prescriptions, or fuzzy search for drug names. But it combines all three into a platform a user can open and use immediately, meaningfully contributing to healthcare accessibility in urban and semi-urban areas [7].

---

## VI. CONCLUSION

MediFind demonstrates that combining existing technologies — real-time databases, geolocation APIs, fuzzy search, and multimodal AI — produces a healthcare tool with genuine practical value. A 90% search success rate, 83.3% OCR accuracy, and sub-second inventory synchronization confirm reliable performance under realistic conditions.

OCR processing speed (15–25 seconds) is the most noticeable bottleneck, but this trade-off is acceptable since manually deciphering doctor handwriting is often slower and more error-prone. The modular architecture supports future extensions without rewriting existing logic.

MediFind is a proof-of-concept that a unified, location-aware medicine availability platform can work. Pharmacy onboarding, data quality enforcement, and UI refinement need attention before a public launch, but the technical foundation is solid and the core workflow — search, find, navigate — delivers on its promise.

---

## VII. FUTURE WORK

The most critical next step is scaling the pharmacy database through partnerships with pharmacy chains, independent stores, and hospital pharmacies. An onboarding process with bulk data import would be essential [8].

Integration with existing pharmacy management software would largely solve the data freshness problem — when a POS system records a sale, MediFind updates automatically, eliminating manual entry.

The OCR module could improve through fine-tuning on Indian prescription formats and common handwriting styles. Adding medicine image recognition — photographing a tablet strip or bottle instead of a prescription — would open new use cases [5][6].

Demand analytics could aggregate anonymised search data to show pharmacies which medicines are searched most frequently in their area, helping anticipate demand and reduce stockouts.

A dedicated mobile application with push notifications — alerting users when a previously unavailable medicine comes back in stock — would enhance accessibility. Cloud infrastructure optimization and load testing are necessary before large-scale deployment across multiple cities [4][11].

---

## REFERENCES

[1] E. Van Rooyen and N. Swart, "A Framework for Locating Prescribed Medication at Pharmacies," Integrated Pharmacy Research and Practice, Jun. 2023, p. 127.

[2] S. Etse and K. Osei, "Locating the Nearest Pharmacy with the Desired Medicine (Dawa Papa)," Ashesi University College, 2023.

[3] M. A. Hasan, M. S. Islam, and T. Hossain, "Design and Implementation of a Real-Time Pharmacy and Medicine Locator Application," 2022 IEEE 12th International Conference on Advanced Computer Science and Information Systems (ICACSIS), 2022, pp. 112-117.

[4] S. Rahman, A. Kumar, and J. Smith, "A Cloud-Based Mobile Health System for Real-Time Medication Availability Tracking," Journal of Medical Internet Research (JMIR) mHealth and uHealth, vol. 9, no. 4, e24561, 2021.

[5] A. Sharma, R. Gupta, and P. Sharma, "Automated Extraction of Medication Names from Handwritten Prescriptions Using Deep Learning and OCR," 2023 IEEE International Conference on Artificial Intelligence in Healthcare (ICAIH), 2023, pp. 45-51.

[6] L. Chen, Y. Wang, and K. Zhang, "Leveraging Large Language Models for Medical Text Information Extraction and Geocoding," IEEE Transactions on Artificial Intelligence, vol. 5, no. 2, pp. 210-222, 2024.

[7] G. Patel and P. Mehra, "Improving Medicine Accessibility Using Digital Platforms," ACM Digital Library, 2021.

[8] M. Jaiswal and R. Gupta, "Pharmacy Inventory Management Systems: A Review," Journal of Health Informatics Research, 2019.

[9] H. Al-Majeed and K. Al-Husseini, "Implementing Fuzzy String Matching Algorithms for Accurate Medical Data Retrieval and Typo Tolerance," 2021 IEEE International Conference on Bioinformatics and Biomedicine (BIBM), 2021, pp. 3125-3130.

[10] T. Nguyen, H. Patel, and S. Kumar, "Integrating Geographic Information Systems (GIS) in Healthcare: Proximity-Based Search for Medical Resources," 2021 International Conference on Information Networking (ICOIN), 2021, pp. 884-889.

[11] P. K. Singh and A. K. Verma, "Security and Data Privacy in Cloud-Based E-Pharmacy Management Systems: An Implementation of Role-Based RLS," IEEE Access, vol. 10, pp. 56789-56801, 2022.
