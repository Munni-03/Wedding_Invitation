import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edbhgwevjmqyynoivbpa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkYmhnd2V2am1xeXlub2l2YnBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzMjk2ODksImV4cCI6MjEwMTkwNTY4OX0.egzLhiRJgkN2ZLLzrD_mv41TE7O6K_g7awvtRV1gLas';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);