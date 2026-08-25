import { apiRequest } from "./client";

export async function loginOwner(email, password) {
  const endpoint = "/auth/login";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  };

  return apiRequest(endpoint, options);
}