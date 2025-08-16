import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cyocvlzqxvqkczynrfmy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b2N2bHpxeHZxa2N6eW5yZm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNjAyNTIsImV4cCI6MjA3MDkzNjI1Mn0.G5GMBMk_Du0yfUTBfeqRRZUGYPne3zt4nyD6h9teRFQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
