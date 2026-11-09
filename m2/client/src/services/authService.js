const API_BASE_URL = "http://localhost:8080";

export async function signupUser(userData) {
  const response = await fetch(`${API_BASE_URL}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed. Please try again.");
  }

  return data;
}

export async function registerOwner(ownerData) {
  const response = await fetch(`${API_BASE_URL}/api/owner-register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(ownerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Owner registration failed. Please try again.",
    );
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed. Please try again.");
  }

  return data;
}

export async function getCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/api/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Could not check login status.");
  }

  return data.user;
}

export async function logoutUser() {
  const response = await fetch(`${API_BASE_URL}/api/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Logout failed.");
  }

  return data;
}
