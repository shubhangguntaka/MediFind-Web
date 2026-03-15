
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { PillIcon, UserCircleIcon, ClipboardListIcon, CloseIcon, ArrowLeftIcon } from './icons';
import MapSelector from './MapSelector';

interface LoginPageProps {
  onClose: () => void;
  initialMode?: 'reset';
}

type View = 'signin' | 'register' | 'forgot_email' | 'forgot_sent' | 'forgot_password';

const LoginPage: React.FC<LoginPageProps> = ({ onClose, initialMode }) => {
  const [view, setView] = useState<View>(initialMode === 'reset' ? 'forgot_password' : 'signin');
  const { login, register, isProcessing, requestPasswordReset, resetPassword } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'author'>('user');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetFormState = () => {
    setEmail('');
    setPassword('');
    setStoreName('');
    setAddress('');
    setLocation(null);
    setRole('user');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSetView = (newView: View) => {
    resetFormState();
    setView(newView);
  };

  const handleLocationSelect = (selected: { lat: number, lng: number, address: string }) => {
    setAddress(selected.address);
    setLocation({ lat: selected.lat, lng: selected.lng });
    setIsMapOpen(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    await login(email, password); // Role is now auto-detected
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", 'error');
      return;
    }
    await register({ email, password_plaintext: password, role, storeName, address, location: location ?? undefined });
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const result = await requestPasswordReset(email);
    if (result.success) {
      setResetEmail(email);
      setView('forgot_sent');
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    if (newPassword.length < 6) { showToast("Password must be at least 6 characters long.", 'error'); return; }
    if (newPassword !== confirmPassword) { showToast("Passwords do not match.", 'error'); return; }
    const result = await resetPassword(resetEmail, newPassword);
    if (result.success) handleSetView('signin');
  };

  const renderRoleToggle = () => (
    <div className="flex p-1 bg-gray-100 dark:bg-slate-700 rounded-xl mb-6">
      <button
        type="button"
        onClick={() => setRole('user')}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
          role === 'user'
            ? 'bg-white dark:bg-slate-600 text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
      >
        I'm a Customer
      </button>
      <button
        type="button"
        onClick={() => setRole('author')}
        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
          role === 'author'
            ? 'bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-100 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
      >
        I'm a Pharmacy Owner
      </button>
    </div>
  );

  const renderHeader = () => {
    let title = '';
    switch (view) {
      case 'signin': title = 'Welcome Back'; break;
      case 'register': title = 'Create Account'; break;
      case 'forgot_email': title = 'Reset Password'; break;
      case 'forgot_sent': title = 'Check Your Email'; break;
      case 'forgot_password': title = 'Set New Password'; break;
    }
    return (
      <div className="text-center mb-4">
        <PillIcon className="w-10 h-10 mx-auto text-primary-600 mb-2" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">{title}</h2>
        {view === 'register' && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Creating account as <span className="font-bold text-gray-700 dark:text-gray-200">{role === 'user' ? 'Customer' : 'Pharmacy Owner'}</span>
          </p>
        )}
      </div>
    );
  };

  const renderSignIn = () => (
    <>
      <form onSubmit={handleLoginSubmit} className="space-y-4">
        <fieldset disabled={isProcessing} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email Address</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="you@example.com" />
          </div>
          <div>
            <div className="flex justify-between items-baseline">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
              <button type="button" onClick={() => handleSetView('forgot_email')} className="text-sm font-medium text-primary-600 hover:text-primary-500">Forgot?</button>
            </div>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400">
            {isProcessing ? 'Signing In...' : 'Sign In'}
          </button>
        </fieldset>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?
        <button onClick={() => handleSetView('register')} disabled={isProcessing} className="ml-1 font-medium text-primary-600 hover:text-primary-500">Register</button>
      </p>
    </>
  );

  const renderRegister = () => (
    <>
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <fieldset disabled={isProcessing} className="space-y-4">
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Email Address" />
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Password (min 6 characters)" />
          {role === 'author' && (
            <div className="space-y-4 border-t dark:border-slate-700 pt-4">
              <input id="storeName" type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Store Name" />
              <div>
                <button type="button" onClick={() => setIsMapOpen(true)} className="w-full text-sm font-semibold text-primary-600 hover:underline text-right mb-1">Select on Map</button>
                <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required rows={2} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Store Address" />
              </div>
            </div>
          )}
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400">
            {isProcessing ? 'Registering...' : 'Register'}
          </button>
        </fieldset>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?
        <button onClick={() => handleSetView('signin')} disabled={isProcessing} className="ml-1 font-medium text-primary-600 hover:text-primary-500">Sign In</button>
      </p>
    </>
  );

  const renderForgotEmail = () => (
    <form onSubmit={handleForgotEmailSubmit} className="space-y-4">
      <p className="text-sm text-center text-gray-600 dark:text-gray-400">Enter your email for reset link.</p>
      <fieldset disabled={isProcessing} className="space-y-4">
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Email Address" />
        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400">
          {isProcessing ? 'Sending...' : 'Send Reset Link'}
        </button>
      </fieldset>
    </form>
  );

  const renderForgotSent = () => (
    <div className="space-y-4 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">Link sent to <span className="font-semibold">{resetEmail}</span>.</p>
      <button onClick={() => handleSetView('signin')} className="w-full py-2 px-4 bg-primary-600 text-white rounded-md">Back to Sign In</button>
    </div>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
      <fieldset disabled={isProcessing} className="space-y-4">
        <input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="New Password" />
        <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white" placeholder="Confirm" />
        <button type="submit" className="w-full py-2 px-4 bg-primary-600 text-white rounded-md">{isProcessing ? 'Saving...' : 'Reset'}</button>
      </fieldset>
    </form>
  );

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 fixed inset-0 z-50">
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500" aria-label="Close" title="Close"><CloseIcon className="w-6 h-6" /></button>
          {view !== 'signin' && view !== 'register' && view !== 'forgot_sent' && (
            <button onClick={() => handleSetView('signin')} className="absolute top-4 left-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"><ArrowLeftIcon className="w-4 h-4" /> Back</button>
          )}
          {renderHeader()}
          {view === 'register' && renderRoleToggle()}
          {view === 'signin' && renderSignIn()}
          {view === 'register' && renderRegister()}
          {view === 'forgot_email' && renderForgotEmail()}
          {view === 'forgot_sent' && renderForgotSent()}
          {view === 'forgot_password' && renderResetPassword()}
        </div>
      </div>
      {isMapOpen && <MapSelector onClose={() => setIsMapOpen(false)} onLocationSelect={handleLocationSelect} />}
    </>
  );
};

export default LoginPage;
