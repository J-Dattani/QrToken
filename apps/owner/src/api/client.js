import { getStoredToken } from "../utils/authStorage";
const BASE_URL = "https://qrcode-ac0d.onrender.com/api";

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

const token = getStoredToken();

  const headers = {
    ...options.headers,
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.message ||
        `API request failed with status ${response.status}`
    );
  }

  return response.json();
}