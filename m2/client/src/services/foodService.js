const API_BASE_URL = "http://localhost:8080/api/admin/foods";

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong.");
  }

  return data;
}

// Fetch all accessible foods
export async function getFoods() {
  const data = await apiRequest(API_BASE_URL);
  return data.foods || [];
}

// Create food
export async function createFood(foodData) {
  return apiRequest(API_BASE_URL, {
    method: "POST",
    body: JSON.stringify(foodData),
  });
}

// Update food
export async function updateFood(foodId, foodData) {
  return apiRequest(`${API_BASE_URL}/${foodId}`, {
    method: "PUT",
    body: JSON.stringify(foodData),
  });
}

// Delete food
export async function deleteFood(foodId) {
  return apiRequest(`${API_BASE_URL}/${foodId}`, {
    method: "DELETE",
  });
}
