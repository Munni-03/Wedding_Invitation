import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edbhgwevjmqyynoivbpa.supabase.co';
const supabaseAnonKey = 'sb_publishable_n8MhNo1pmFM5nt3uoagxTw_HE-d4M83edbhgwevjmqyynoivbpa';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);