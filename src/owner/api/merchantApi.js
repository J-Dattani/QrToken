import { apiRequest } from "./client";

export async function getMerchantProfile() {
    const endpoint = "/merchant/me";
    const options = {
        method: "GET",
    };

    return apiRequest(endpoint, options);
}
export async function updateMerchantProfile(data) {
  const endpoint = "/merchant/me";

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return apiRequest(endpoint, options);
}