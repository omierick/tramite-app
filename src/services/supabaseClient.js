import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xubycjusbnocyicmjckt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnljanVzYm5vY3lpY21qY2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTk3OTcsImV4cCI6MjA2MTI3NTc5N30.PWpk6MNA5ByohV5-pRPcMMVexj-RXeggJNixWi4EtJQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);