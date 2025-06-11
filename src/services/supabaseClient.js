// src/services/supabaseclient.js
import { createClient } from "@supabase/supabase-js";

// ► Cliente PÚBLICO (lo que ya tienes)
const supabaseUrl = "https://xubycjusbnocyicmjckt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1YnljanVzYm5vY3lpY21qY2t0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTk3OTcsImV4cCI6MjA2MTI3NTc5N30.PWpk6MNA5ByohV5-pRPcMMVexj-RXeggJNixWi4EtJQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ► Cliente ADMIN (solo se crea si existe la service role en las variables de entorno)
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      // Desactiva features de sesión que no necesitamos en backend
      auth: { autoRefreshToken: false, detectSessionInUrl: false },
      global: {
        headers: { Authorization: `Bearer ${supabaseServiceRoleKey}` },
      },
    })
  : null; // En producción del frontend debería ser null
