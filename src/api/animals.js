const RAW_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
const API_BASE = RAW_BASE.replace(/\/$/, "");


async function request(path, options = {}) {
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = {};
  if (!(options?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed: ${res.status} ${res.statusText} - ${text}`);
  }
  // Some endpoints may return empty body
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) return res.json();
  return null;
}

export async function getAnimals() {
  return request(`/api/animals`);
}

export async function getAnimal(id) {
  return request(`/api/animals/${id}`);
}

export async function createAnimal(payload) {
  const body = payload instanceof FormData ? payload : JSON.stringify(payload);
  return request(`/api/animals`, {
    method: "POST",
    body,
  });
}

export async function updateAnimal(id, payload) {
  if (payload instanceof FormData) {
    if (!payload.has("_method")) payload.append("_method", "PUT");
    return request(`/api/animals/${id}`, {
      method: "POST",
      body: payload,
    });
  }
  return request(`/api/animals/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAnimal(id) {
  return request(`/api/animals/${id}`, {
    method: "DELETE",
  });
}

export async function getAdoptionRequests() {
  return request(`/api/adoption-requests`);
}

export async function createAdoptionRequest(payload) {
  return request(`/api/adoption-requests`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAdoptionRequestStatus(id, status) {
  return request(`/api/adoption-requests/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAdoptionRequest(id) {
  return request(`/api/adoption-requests/${id}`, {
    method: "DELETE",
  });
}

export default {
  getAnimals,
  getAnimal,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getAdoptionRequests,
  createAdoptionRequest,
  updateAdoptionRequestStatus,
  deleteAdoptionRequest,
};
