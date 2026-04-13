# MediFind: System Architecture & Technical Documentation

This document provides a comprehensive overview of the MediFind (Medicine Locator) system architecture. It is designed to be used as a reference for project presentations, official documentation, and research papers.

---

## 1. High-Level System Overview

MediFind is a full-stack web application designed to bridge the gap between customers seeking specific medications and local pharmacies managing their inventory. The system employs a modern, decoupled **Client-Server Architecture** utilizing a RESTful API to communicate between a React-based frontend and a Node.js/Express backend. 

### Core Components:
1. **Frontend (Client-Side):** A responsive, Single Page Application (SPA) built with React and Vite.
2. **Backend (Server-Side):** A robust Express.js REST API that handles business logic, AI integrations, and location-based queries.
3. **Database & Authentication (BaaS):** Supabase (PostgreSQL) is utilized for secure data persistence, real-time inventory synchronization, and user authentication.
4. **AI & Geospatial Services:** Integration with Google Gemini AI for Optical Character Recognition (OCR) and natural language processing, alongside Leaflet for interactive map rendering.

---

## 2. Architectural Diagram (Logical Flow)

```text
[ Users (Customers/Owners) ] 
         |
         v
+-----------------------+     REST API     +------------------------+
|   Frontend (React)    | <--------------> |  Backend (Node/Express)|
| - Role-based UI       | (JSON / HTTP)    | - AI & OCR Logic       |
| - State Management    |                  | - Geospatial Routing   |
| - Interactive Maps    |                  | - API Integrations     |
+-----------------------+                  +------------------------+
         |                                          |
         | (Auth & Real-time Sync)                  | (Data Queries)
         v                                          v
+-------------------------------------------------------------------+
|                   Supabase (PostgreSQL Database)                  |
| - Profiles (Users & Pharmacies)                                   |
| - Inventory JSONB                                                 |
| - Row Level Security (RLS)                                        |
+-------------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------------+
|                        External Services                          |
| - Google Gemini AI (Image OCR, Medicine Info, Geocoding)          |
| - OpenStreetMap / Leaflet (Mapping & Visualization)               |
+-------------------------------------------------------------------+
```

---

## 3. Frontend Architecture

The frontend is built for high performance and modularity using **React 19** and **Vite**. It implements a **Role-Based Routing System** to serve distinct user experiences.

### Key Modules & Structure:
- **`App.tsx` (Entry Point & Router):** Intercepts authentication states and dynamically routes users.
  - **Customer View (`CustomerPage.tsx` / `UserView.tsx`):** Provides a search-driven interface featuring smart scanning (OCR), an interactive map (`MapSelector.tsx`), and a list of nearby pharmacies (`ResultsList.tsx`).
  - **Pharmacy Owner View (`OwnerPage.tsx` / `AuthorDashboard.tsx`):** A management dashboard allowing store owners to update location, operating hours, and live medicine inventory.
- **State Management:** Utilizes React Context API (`AuthContext.tsx`) for global user state and authentication persistence.
- **Geospatial Mapping:** Utilizes `leaflet` and `react-leaflet` to plot pharmacy coordinates and calculate proximity to the user.
- **Service Layer (`/services/`):** Contains `apiClient.ts` for encapsulating REST API calls to the local/deployed backend, and `supabaseClient.ts` for direct database and authentication interactions.

---

## 4. Backend Architecture

The backend operates as an intermediary microservice designed in **Node.js** with **Express.js**, written strictly in **TypeScript** for type safety.

### Key Modules & Structure:
- **`server.ts` (Entry Point):** Configures CORS, JSON body parsers (with extended limits for Base64 image uploads), and mounts API routers.
- **RESTful Routes:**
  - `GET /api/pharmacy/all` & `GET /api/pharmacy/search`: Handles geospatial queries, taking latitude/longitude inputs to return sorted lists of nearby pharmacies carrying the queried medicine.
  - `POST /api/pharmacy/invalidate`: Webhook mechanism to invalidate backend cache when inventory is updated.
- **AI Integration (`routes/gemini.ts` & `services/geminiService.ts`):** 
  - Exposes `/api/gemini/ocr` allowing the frontend to send prescription images. The backend uses `@google/genai` to extract medicine names via OCR.
  - Exposes endpoints to provide detailed medicine information and intelligent geocoding/reverse-geocoding translating physical addresses to GPS coordinates.
- **Fuzzy Searching:** Implements `fuse.js` to provide typo-tolerant searching across pharmacy inventories.

---

## 5. Database Schema & Data Models

The system leverages **Supabase**, utilizing its underlying **PostgreSQL** database. 

### Core Table: `profiles`
The schema revolves around a unified `profiles` table that handles both regular customers and pharmacy owners ("authors").

| Column Name | Data Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key, auto-generated. |
| `auth_user_id` | UUID | Maps to Supabase's native Auth table. |
| `email` | TEXT | Unique identifier for communication and login. |
| `role` | TEXT | Enforced via CHECK constraint (`'user'` or `'author'`). |
| `store_name` | TEXT | Name of the pharmacy (Author only). |
| `address` | TEXT | Physical address of the pharmacy. |
| `location` | JSONB | Contains precise coordinates `{"lat": Float, "lng": Float}`. |
| `inventory` | JSONB | Array of medicine objects: `[{"name": "...", "stock": 100}]`. |

### Security Model:
- **Row Level Security (RLS):** Strict PostgreSQL policies are implemented to ensure isolation.
  - *Public read access* is granted for pharmacy inventories to enable global search.
  - *Restricted write access* ensures that only authenticated owners can update their respective `inventory` arrays, preventing unauthorized modifications.

---

## 6. Technological Stack Summary

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite, TypeScript |
| **Mapping & UI** | Leaflet, Vanilla CSS/Tailwind (styled components) |
| **Backend Framework** | Node.js, Express.js, TypeScript |
| **Database & Auth** | PostgreSQL, Supabase, JWT Authentication |
| **AI & External APIs** | Google Gemini API (OCR, NLP), OpenStreetMap |
| **Search Engine** | Fuse.js (Fuzzy String Matching) |

---

## 7. Application Flow Highlights (For Research Paper / Presentation)

1. **Smart Prescription Scanning (OCR Flow):** 
   User captures/uploads a prescription -> Frontend converts to Base64 -> Sent to `/api/gemini/ocr` -> Backend processes via Google Gemini -> Extracted medicine names returned to UI -> Automated search triggered.
2. **Proximity-Based Search Flow:**
   User grants location access -> `lat`/`lng` mapped -> Query sent to `/api/pharmacy/search` -> Backend retrieves public inventories from Supabase -> Applies spatial distance calculation -> Results sorted by proximity and stock availability -> Rendered on UI Map (`Leaflet`).
3. **Synchronized Inventory Management:**
   Pharmacy owner logs in -> `AuthContext` detects `'author'` role -> Loads `AuthorDashboard.tsx` -> Owner updates stock -> Direct mutation to Supabase `inventory` JSONB column -> Local pharmacy cache invalidated -> Next customer search reflects live data instantly.
