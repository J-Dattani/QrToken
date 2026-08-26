import { apiRequest } from "./client";

export async function getMerchantOrders(merchantId, status) {
  let endpoint = `/orders/merchant/${merchantId}`;

  if (status) {
    endpoint += `?status=${status}`;
  }

  return apiRequest(endpoint, {
    method: "GET",
  });
}

export async function updateOrderStatus(orderId, status) {
  const endpoint = `/orders/${orderId}/status`;

  return apiRequest(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });
}