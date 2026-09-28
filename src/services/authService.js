import api from "../api/axios";

export async function login(loginRequest) {
  const response = await api.post("/auth/login", loginRequest);

  return response.data;
}

export async function register(data) {
  const response = await api.post("/auth/register", data);

  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get("/users/me");

  return response.data;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}
