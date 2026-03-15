
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';

// ── Pages (role-based) ────────────────────────────────────────────────────────
import CustomerPage from './pages/CustomerPage';
import OwnerPage from './pages/OwnerPage';

// ── Shared UI ─────────────────────────────────────────────────────────────────
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import ProfilePage from './components/ProfilePage';
import Toast from './components/Toast';

// ─── Role-Based Router ────────────────────────────────────────────────────────
// • user.role === 'author' (pharmacy owner) → OwnerPage  (inventory dashboard)
// • user.role === 'user'  (customer) or guest → CustomerPage (search, OCR, map)

const AppRouter: React.FC<{
  onLoginClick: () => void;
  view: 'main' | 'profile';
  onBackFromProfile: () => void;
}> = ({ onLoginClick, view, onBackFromProfile }) => {
  const { user } = useAuth();

  if (view === 'profile' && user) {
    return <ProfilePage onBack={onBackFromProfile} />;
  }
  if (user?.role === 'author') {
    return <OwnerPage />;
  }
  return <CustomerPage onLoginClick={onLoginClick} />;
};

// ─── App ──────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const { user } = useAuth();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [view, setView] = useState<'main' | 'profile'>('main');
  const [isResetMode, setIsResetMode] = useState(false);
  const [prevUser, setPrevUser] = useState(user);

  const [hasStarted, setHasStarted] = useState(() =>
    !!localStorage.getItem('medifind_has_started')
  );

  // Handle Supabase password-reset redirect from email link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    if (hashParams.get('type') === 'recovery' || params.get('reset_password') === 'true') {
      setIsResetMode(true);
      setIsLoginVisible(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Auto-redirect when user signs in: close modal and route to correct page
  useEffect(() => {
    if (!prevUser && user) {
      setIsLoginVisible(false);
      setIsResetMode(false);
      setView('main');
      // AppRouter immediately picks up the correct view from user.role
    }
    setPrevUser(user);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGetStarted = useCallback(() => {
    localStorage.setItem('medifind_has_started', 'true');
    setHasStarted(true);
  }, []);

  const handleLogout = useCallback(() => setView('main'), []);
  const handleLoginClick = useCallback(() => setIsLoginVisible(true), []);
  const handleCloseLogin = useCallback(() => {
    setIsLoginVisible(false);
    setIsResetMode(false);
  }, []);

  if (!hasStarted) {
    return (
      <>
        <Toast />
        <WelcomePage onGetStarted={handleGetStarted} />
      </>
    );
  }

  if ((isLoginVisible || isResetMode) && !user) {
    return (
      <>
        <Toast />
        <LoginPage
          onClose={handleCloseLogin}
          initialMode={isResetMode ? 'reset' : undefined}
        />
      </>
    );
  }

  return (
    <>
      <Toast />
      <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-slate-950 dark:text-gray-200 overflow-x-hidden">
        <Header
          onLoginClick={handleLoginClick}
          onProfileClick={() => setView('profile')}
          onLogout={handleLogout}
          onLogoClick={() => setView('main')}
        />
        <main className="pt-24 pb-8">
          <AppRouter
            onLoginClick={handleLoginClick}
            view={view}
            onBackFromProfile={() => setView('main')}
          />
        </main>
      </div>
    </>
  );
};

export default App;
