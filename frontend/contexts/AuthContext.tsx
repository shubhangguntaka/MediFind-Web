
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { User, AuthorUser, Medicine, CustomerUser } from '../types';
import { geocodeAddress, invalidatePharmacyCache as notifyBackendOfChange } from '../services/apiClient';
import { supabase } from '../services/supabaseClient';
import { useToast } from './ToastContext';
import { seedInitialData } from '../services/seedData';

interface RegisterData {
  email: string;
  password_plaintext: string;
  role: 'user' | 'author';
  storeName?: string;
  address?: string;
  location?: { lat: number; lng: number };
}

interface ProfileUpdateData {
  fullName?: string;
  displayName?: string;
  email?: string;
  storeName?: string;
  address?: string;
  location?: { lat: number; lng: number };
}

interface PasswordChangeData {
  currentPassword_plaintext: string;
  newPassword_plaintext: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password_plaintext: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateInventory: (newInventory: Medicine[]) => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<{ success: boolean; error?: string }>;
  changePassword: (data: PasswordChangeData) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  addSearchTerm: (term: string) => Promise<void>;
  isProcessing: boolean;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyPasswordResetOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword_plaintext: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Profile helpers (Supabase DB) ──────────────────────────────────────────

// Map a Supabase profile row → typed User
const profileToUser = (row: any): User => {
  if (row.role === 'author') {
    const u: AuthorUser = {
      role: 'author',
      email: row.email ?? '',
      fullName: row.full_name ?? '',
      displayName: row.display_name ?? '',
      storeName: row.store_name ?? '',
      address: row.address ?? '',
      location: row.location ?? { lat: 0, lng: 0 },
      inventory: row.inventory ?? [],
    };
    return u;
  }
  const u: CustomerUser = {
    role: 'user',
    email: row.email ?? '',
    fullName: row.full_name ?? '',
    displayName: row.display_name ?? '',
    searchHistory: row.search_history ?? [],
  };
  return u;
};

// Fetch a profile row by the Supabase auth user's UUID
const fetchProfileByAuthId = async (authUserId: string): Promise<{ user: User | null; rowId: string | null }> => {
  const timeoutPromise = new Promise<{ user: null; rowId: null }>(
    (resolve) => setTimeout(() => resolve({ user: null, rowId: null }), 5000)
  );

  const queryPromise = (async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error) {
        console.warn('[Supabase] Fetch profile error:', error.message);
        return { user: null, rowId: null };
      }
      if (!data) return { user: null, rowId: null };
      if (data.deletion_scheduled_on) return { user: null, rowId: null };
      return { user: profileToUser(data), rowId: data.id as string };
    } catch (err) {
      console.error('[Supabase] Fetch profile crash:', err);
      return { user: null, rowId: null };
    }
  })();

  return Promise.race([queryPromise, timeoutPromise]);
};

// Build a minimal User from raw Supabase auth session (used when profiles table is unavailable).
const buildFallbackUser = (sessionUser: { id: string; email?: string; user_metadata?: Record<string, any> }): User => {
  const meta = sessionUser.user_metadata ?? {};
  const role = meta.role === 'author' ? 'author' : 'user';
  if (role === 'author') {
    return {
      role: 'author',
      email: sessionUser.email ?? '',
      fullName: meta.full_name ?? '',
      displayName: meta.store_name ?? (sessionUser.email ?? '').split('@')[0],
      storeName: meta.store_name ?? '',
      address: meta.address ?? '',
      location: meta.location ?? { lat: 0, lng: 0 },
      inventory: [],
    } as AuthorUser;
  }
  return {
    role: 'user',
    email: sessionUser.email ?? '',
    fullName: meta.full_name ?? '',
    displayName: (sessionUser.email ?? 'User').split('@')[0],
    searchHistory: [],
  };
};

// ─── AuthProvider ────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileRowId, setProfileRowId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  
  // Track current auth ID to safely filter real-time updates
  const sessionUserIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    // Seed initial pharmacy data in the background
    seedInitialData().catch(err => console.warn('[Seed] Fail:', err));

    let initDone = false;

    // Step 1: getSession() reads from local storage — instant, no network.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!initDone) {
        if (session?.user) {
          sessionUserIdRef.current = session.user.id;
          const { user: profile, rowId } = await fetchProfileByAuthId(session.user.id);
          setUser(profile ?? buildFallbackUser(session.user));
          setProfileRowId(rowId);
        }
        setIsInitialized(true);
        initDone = true;
      }
    }).catch(() => {
      if (!initDone) { setIsInitialized(true); initDone = true; }
    });

    // Step 2: onAuthStateChange handles future login/logout/token-refresh events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      initDone = true;
      try {
        if (session?.user) {
          const { user: profile, rowId } = await fetchProfileByAuthId(session.user.id);
          
          // CRITICAL FIX: If re-fetch fails (timeout/network), DO NOT reset the inventory to empty.
          // Only update if we actually got a profile, OR if we have no user yet.
          if (profile) {
              setUser(profile);
              setProfileRowId(rowId);
          } else {
              // Only use fallback if we don't already have a valid user in state
              setUser(prev => prev || buildFallbackUser(session.user));
          }
          sessionUserIdRef.current = session.user.id;
        } else {
          setUser(null);
          setProfileRowId(null);
          sessionUserIdRef.current = null;
        }
      } catch (err) {
        console.error('[Auth] Error in onAuthStateChange:', err);
        // Only reset if it's a signed-out event
        if (!session?.user) {
            setUser(null);
            setProfileRowId(null);
        }
      } finally {
        setIsInitialized(true);
      }
    });

    // Step 3: Real-time listener for the LOGGED-IN user's own profile changes
    // This ensures if the DB updates (even from another tab), the local state stays fresh.
    const userChannel = supabase
      .channel('my-profile')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles'
      }, (payload) => {
        // Only apply if the change is for THIS user
        setUser(currentUser => {
          if (!currentUser) return null;
          // Note: profileRowId is a UUID string. payload.new.id is the UUID from DB.
          if (payload.new && payload.new.auth_user_id === sessionUserIdRef.current) {
            console.log('[Auth] Real-time profile update received:', payload.new.id);
            return profileToUser(payload.new);
          }
          return currentUser;
        });
      })
      .subscribe();

    // Safety fallback
    const timer = setTimeout(() => { setIsInitialized(true); initDone = true; }, 5000);

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(userChannel);
      clearTimeout(timer);
    };
  }, []);

  // ─── register ────────────────────────────────────────────────────────────
  const register = async (data: RegisterData): Promise<void> => {
    setIsProcessing(true);
    try {
      // Save role and store info in user_metadata so it's available from session
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password_plaintext,
        options: {
          data: {
            role: data.role,
            store_name: data.storeName ?? '',
            address: data.address ?? '',
            location: data.location ?? null,
          },
        },
      });

      if (signUpError) { showToast(signUpError.message, 'error'); return; }

      const authUserId = authData.user?.id;
      if (!authUserId) { showToast('Registration failed. Try again.', 'error'); return; }

      // Build profile record
      let profileData: Record<string, any> = {
        auth_user_id: authUserId,
        email: data.email,
        role: data.role,
        full_name: '',
      };

      if (data.role === 'author') {
        if (!data.storeName || !data.address) {
          showToast('Store Name and Address are required for owners.', 'error');
          return;
        }
        const location = data.location ?? await geocodeAddress(data.address);
        profileData = {
          ...profileData,
          store_name: data.storeName,
          address: data.address,
          location,
          inventory: [],
          display_name: data.storeName,
        };
      } else {
        profileData.display_name = data.email.split('@')[0];
        profileData.search_history = [];
      }

      console.log('[Auth] Creating Supabase profile...', profileData);

      const { data: profileRow, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('[Auth] Profile creation failed:', profileError);
        showToast('Profile setup failed: ' + profileError.message, 'error');
      } else if (profileRow) {
        console.log('[Auth] Profile created successfully:', profileRow.id);
        setProfileRowId(profileRow.id);
        setUser(profileToUser(profileRow));
        try { await notifyBackendOfChange(); } catch { /* ignore */ }
      }

      showToast('Registration successful! You are now logged in.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── login ───────────────────────────────────────────────────────────────
  const login = async (email: string, password_plaintext: string): Promise<void> => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: password_plaintext });
      if (error) showToast('Invalid email or password.', 'error');
      else showToast('Login successful!', 'success');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── logout ──────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileRowId(null);
  };

  // ─── updateInventory ─────────────────────────────────────────────────────
  const updateInventory = async (newInventory: Medicine[]): Promise<void> => {
    if (!user || user.role !== 'author') {
      console.warn('[Auth] updateInventory skipped: User is not an author or not logged in.', { role: user?.role });
      return;
    }

    console.log('[Auth] Attempting inventory update for profile:', profileRowId || 'using auth_id fallback');
    
    // Get fresh auth ID just in case
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      showToast('Session expired. Please log in again.', 'error');
      return;
    }

    // Build query: prefer primary key ID, fallback to auth_user_id
    let query = supabase.from('profiles').update({ inventory: newInventory });
    if (profileRowId) {
      query = query.eq('id', profileRowId);
    } else {
      query = query.eq('auth_user_id', authUser.id);
    }

    const { error, data } = await query.select();

    if (error) {
      console.error('[Auth] Supabase Inventory Update Error:', error.message, error.details);
      showToast('Failed to update inventory: ' + error.message, 'error');
      return;
    }

    console.log('[Auth] Inventory update successful in Supabase:', data);

    setUser(prev => {
      if (!prev || prev.role !== 'author') return prev;
      return { ...prev, inventory: newInventory };
    });

    // Notify backend to refresh search results for customers
    try { 
      await notifyBackendOfChange(); 
    } catch (e) { 
      console.warn('[Auth] Backend cache invalidation failed (non-critical)', e); 
    }

    showToast('Inventory updated successfully!', 'success');
  };

  // ─── updateProfile ───────────────────────────────────────────────────────
  const updateProfile = async (data: ProfileUpdateData): Promise<{ success: boolean; error?: string }> => {
    if (!user || !profileRowId) return { success: false, error: 'Not logged in.' };

    const updates: Record<string, any> = {};
    if (data.fullName !== undefined) updates.full_name = data.fullName;
    if (data.displayName !== undefined) updates.display_name = data.displayName;
    if (data.email) updates.email = data.email;

    if (user.role === 'author') {
      if (data.storeName) updates.store_name = data.storeName;
      if (data.location) {
        updates.address = data.address ?? (user as AuthorUser).address;
        updates.location = data.location;
      } else if (data.address && data.address !== (user as AuthorUser).address) {
        try {
          updates.address = data.address;
          updates.location = await geocodeAddress(data.address);
        } catch (err: any) {
          const msg = err.message || 'Could not validate new address.';
          showToast(msg, 'error');
          return { success: false, error: msg };
        }
      }
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', profileRowId);
    if (error) {
      showToast('Profile update failed: ' + error.message, 'error');
      return { success: false, error: error.message };
    }

    if (data.email && data.email !== user.email) {
      await supabase.auth.updateUser({ email: data.email });
    }

    // Re-fetch to get fresh state
    const { data: sessionData } = await supabase.auth.getSession();
    const authId = sessionData.session?.user?.id;
    if (authId) {
      const { user: refreshed } = await fetchProfileByAuthId(authId);
      if (refreshed) setUser(refreshed);
    }

    if (user.role === 'author') {
      try { await notifyBackendOfChange(); } catch { /* ignore */ }
    }

    showToast('Profile updated successfully!', 'success');
    return { success: true };
  };

  // ─── changePassword ──────────────────────────────────────────────────────
  const changePassword = async ({ currentPassword_plaintext, newPassword_plaintext }: PasswordChangeData): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not logged in.' };

    const { error: reAuthErr } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword_plaintext,
    });
    if (reAuthErr) {
      showToast('Incorrect current password.', 'error');
      return { success: false, error: 'Incorrect current password.' };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword_plaintext });
    if (error) {
      showToast('Password change failed: ' + error.message, 'error');
      return { success: false, error: error.message };
    }

    showToast('Password changed successfully!', 'success');
    return { success: true };
  };

  // ─── deleteAccount ────────────────────────────────────────────────────────
  const deleteAccount = async (password: string): Promise<{ success: boolean; error?: string }> => {
    if (!user || !profileRowId) return { success: false, error: 'Not logged in.' };

    const { error: reAuthErr } = await supabase.auth.signInWithPassword({ email: user.email, password });
    if (reAuthErr) {
      showToast('Incorrect password.', 'error');
      return { success: false, error: 'Incorrect password.' };
    }

    const oneWeekFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const { error } = await supabase
      .from('profiles')
      .update({ deletion_scheduled_on: oneWeekFromNow })
      .eq('id', profileRowId);

    if (error) {
      showToast('Failed to schedule deletion.', 'error');
      return { success: false, error: error.message };
    }

    await logout();
    showToast('Account deletion scheduled. You have been logged out.', 'info');
    return { success: true };
  };

  // ─── addSearchTerm ────────────────────────────────────────────────────────
  const addSearchTerm = async (term: string): Promise<void> => {
    if (!user || user.role !== 'user') return;
    const lower = term.toLowerCase();
    const existing = (user as CustomerUser).searchHistory || [];
    const updated = [term, ...existing.filter(t => t.toLowerCase() !== lower)].slice(0, 10);
    setUser({ ...user, searchHistory: updated });
    if (profileRowId) {
      await supabase.from('profiles').update({ search_history: updated }).eq('id', profileRowId);
    }
  };

  // ─── requestPasswordReset ────────────────────────────────────────────────
  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/?reset_password=true`,
      });
      if (error) {
        showToast(error.message, 'error');
        return { success: false, error: error.message };
      }
      showToast(`Reset link sent to ${email}. Check your inbox!`, 'success');
      return { success: true };
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyPasswordResetOTP = async (_e: string, _o: string): Promise<{ success: boolean; error?: string }> =>
    ({ success: true });

  // ─── resetPassword ────────────────────────────────────────────────────────
  const resetPassword = async (_email: string, newPassword_plaintext: string): Promise<{ success: boolean; error?: string }> => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword_plaintext });
      if (error) {
        showToast(error.message, 'error');
        return { success: false, error: error.message };
      }
      showToast('Password reset! Please sign in.', 'success');
      return { success: true };
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#0f172a', color: '#94a3b8',
        fontFamily: 'system-ui, sans-serif', fontSize: '1rem',
      }}>
        Loading MediFind…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user, login, register, logout,
      updateInventory, addSearchTerm, updateProfile,
      deleteAccount, changePassword, isProcessing,
      requestPasswordReset, verifyPasswordResetOTP, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
