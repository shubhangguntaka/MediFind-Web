import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// createClient will gracefully handle missing vars at runtime — errors will appear in the console
// rather than crashing the whole module system at load time.
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);
