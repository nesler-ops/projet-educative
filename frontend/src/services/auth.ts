// frontend/src/services/auth.ts
export function setUserSession(data: {
  token: string;
  username: string;
  user_type: string;
  user_id: number | string;
}) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", data.username);
  localStorage.setItem("user_type", data.user_type);
  localStorage.setItem("user_id", String(data.user_id));
}

export function getUserSession() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const user_type = localStorage.getItem("user_type");
  const user_id = localStorage.getItem("user_id");
  if (!token) return null;
  return { token, username, user_type, user_id };
}

export function removeUserSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("user_type");
  localStorage.removeItem("user_id");
}
