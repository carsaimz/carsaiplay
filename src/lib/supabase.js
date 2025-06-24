import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beubrfdsmxzqtididhnl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJldWJyZmRzbXh6cXRpZGlkaG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NDQ4MjQsImV4cCI6MjA2NjMyMDgyNH0.1MTPm7gG4_y88Mh-KJoNKDOSFwTLhYPPhUDXWJxu-Z0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);