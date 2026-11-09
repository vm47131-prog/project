const API_BASE_URL = "http://localhost:8080";

// Fetch pending owner requests
export async function getPendingOwners() {
  const response = await fetch(`${API_BASE_URL}/api/admin/owners/pending`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch pending owners.");
  }

  return data.owners;
}

// Approve owner request
export async function approveOwner(ownerId) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/owners/${ownerId}/approve`,
    {
      method: "PATCH",
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to approve owner.");
  }

  return data;
}

// Reject owner request
export async function rejectOwner(ownerId, reason) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/owners/${ownerId}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ reason }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to reject owner.");
  }

  return data;
}
// Fetch all admins
export async function getAdmins() {
  const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch admins.");
  }

  return data.admins;
}

// Create new admin
export async function createAdmin(adminData) {
  const response = await fetch(`${API_BASE_URL}/api/admin/admins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(adminData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create admin.");
  }

  return data;
}

// Update admin permissions
export async function updateAdminPermissions(adminId, permissions) {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/admins/${adminId}/permissions`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ permissions }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update permissions.");
  }

  return data;
}

// Delete admin
export async function deleteAdmin(adminId) {
  const response = await fetch(`${API_BASE_URL}/api/admin/admins/${adminId}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete admin.");
  }

  return data;
}
