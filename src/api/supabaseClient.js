// supabaseClient.js
// Initializes and exports the Supabase client using environment variables.

import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and Anon Key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a single Supabase client for the app
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
