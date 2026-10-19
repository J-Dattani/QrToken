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

export async function registerOwner(formData) {
  const endpoint = "/auth/register";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      merchantName: formData.outletName,
      name: formData.ownerName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      city: formData.city,
      gstin: formData.gstin,
      fssai: formData.fssai,
      role: "owner",
    }),
  };

  return apiRequest(endpoint, options);
}