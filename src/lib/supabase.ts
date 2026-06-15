import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect if we are using placeholders, meaning we should run in Mock Mode for testing
export const isMockMode = true; // FORCE MOCK MODE for immediate testing


export const supabase = !isMockMode 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : (null as any); // Will use local storage based DB mock when true
