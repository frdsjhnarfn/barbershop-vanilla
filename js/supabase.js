const SUPABASE_URL = "https://dgmthycvgjlpthgrolzd.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnbXRoeWN2Z2pscHRoZ3JvbHpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU3Mjc3NzYsImV4cCI6MjExMTMwMzc3Nn0.o6m5uc0iIsoEYQSpcy5gpFy9iamDW5-S_Y8859rHWBk";

// Inisialisasi Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);