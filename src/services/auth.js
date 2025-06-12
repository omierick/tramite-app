// Este ejemplo asume que tu usuario tiene el campo 'rol' (admin, revisor, usuario, etc.)
export function saveUserSession(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUserSession() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}
