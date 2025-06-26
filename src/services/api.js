import { supabase } from "./supabaseClient";

// Elimina el array templates, ya no se usará
// const templates = [ ... ];

export async function addTramite(data) {
  const { data: inserted, error } = await supabase
    .from("tramites")
    .insert([data])
    .select();
  if (error) throw error;
  return inserted[0];
}

export async function getTramites() {
  const { data, error } = await supabase
    .from("tramites")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateTramite(id, status) {
  const { data, error } = await supabase
    .from("tramites")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
  return data;
}

// ✅ Esta función ahora consulta la tabla "tipos_tramite"
export async function getTemplates() {
  const { data, error } = await supabase
    .from("tipos_tramite")
    .select("*");
  if (error) throw error;
  return data;
}

// Puedes eliminar esta función si ya no necesitas manipular un array local
// export function addTemplate(template) {
//   templates.push(template);
// }