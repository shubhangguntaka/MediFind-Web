
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import UserView from './components/UserView';
import AuthorDashboard from './components/AuthorDashboard';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import ProfilePage from './components/ProfilePage';
import Toast from './components/Toast';

const App: React.FC = () => {
  const { user, resetPassword } = useAuth();
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [view, setView] = useState<'main' | 'profile'>('main');
  const [isResetMode, setIsResetMode] = useState(false);

  const [hasStarted, setHasStarted] = useState(() => {
    return !!localStorage.getItem('medifind_has_started');
  });

  // Handle password reset redirect from Supabase email link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    // Supabase puts access_token in the URL hash after clicking the reset link
    if (hashParams.get('type') === 'recovery' || params.get('reset_password') === 'true') {
      setIsResetMode(true);
      setIsLoginVisible(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('medifind_has_started', 'true');
    setHasStarted(true);
  };

  const handleLogout = () => {
    setView('main');
  };

  const renderContent = () => {
    if (!hasStarted) {
      return <WelcomePage onGetStarted={handleGetStarted} />;
    }

    if ((isLoginVisible || isResetMode) && !user) {
      return (
        <LoginPage
          onClose={() => { setIsLoginVisible(false); setIsResetMode(false); }}
          initialMode={isResetMode ? 'reset' : undefined}
        />
      );
    }

    const renderMainView = () => {
      if (view === 'profile' && user) {
        return <ProfilePage onBack={() => setView('main')} />;
      }

      if (user?.role === 'author') {
        return <AuthorDashboard />;
      }

      return <UserView onLoginClick={() => setIsLoginVisible(true)} />;
    };

    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-slate-900 dark:text-gray-200 overflow-x-hidden">
        <Header
          onLoginClick={() => setIsLoginVisible(true)}
          onProfileClick={() => setView('profile')}
          onLogout={handleLogout}
        />
        <main className="pt-24 pb-8">
          {renderMainView()}
        </main>
      </div>
    );
  }

  return (
    <>
      <Toast />
      {renderContent()}
    </>
  );
};

export default App;
