/**
 * FRONTEND — UI Layer
 *
 * This folder is the React frontend. It contains all pages, components,
 * contexts, and hooks. Frontend code should ONLY communicate with the
 * backend through the service modules in backend/services/.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │  frontend/                                           │
 * │  ├── pages/                                          │
 * │  │   ├── CustomerPage.tsx  → Customer view           │
 * │  │   ├── OwnerPage.tsx     → Owner/Pharmacy view     │
 * │  │   └── WelcomePage.tsx   → Landing page            │
 * │  ├── components/           → Shared UI components    │
 * │  ├── contexts/             → React context providers │
 * │  └── hooks/                → Custom React hooks      │
 * └─────────────────────────────────────────────────────┘
 */

// Re-export pages for convenient imports
export { default as CustomerPage } from './pages/CustomerPage';
export { default as OwnerPage } from './pages/OwnerPage';
