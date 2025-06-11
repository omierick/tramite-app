import { supabase } from "./supabaseClient";

const templates = [
  "Licencia de Construcción",
  "Permiso de Comercio",
  "Certificado de Habitabilidad",
];

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

export function getTemplates() {
  return templates;
}

export function addTemplate(template) {
  templates.push(template);
}
