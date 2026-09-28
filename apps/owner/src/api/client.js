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
    const contentType =
      response.headers.get("content-type") || "";

    let errorMessage = `API request failed with status ${response.status}`;

    if (contentType.includes("application/json")) {
      const errorData = await response.json();

      errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorMessage;
    } else {
      const errorText = await response.text();

      console.error(
        "Non-JSON API error:",
        response.status,
        errorText
      );

      errorMessage =
        errorText?.trim() ||
        errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}