export const saveActiveOrder = (order) => {
  sessionStorage.setItem(
    "activeOrder",
    JSON.stringify(order)
  );
};


export const getActiveOrder = () => {
  const order = sessionStorage.getItem("activeOrder");

  if (!order) {
    return null;
  }

  const parsedOrder = JSON.parse(order);

  // Orders with these statuses are no longer active
  const completedStatuses = [
    "completed",
    "cancelled",
    "canceled",
  ];

  if (completedStatuses.includes(parsedOrder.status?.toLowerCase())) {
    sessionStorage.removeItem("activeOrder");
    return null;
  }

  return parsedOrder;
};


export const removeActiveOrder = () => {
  sessionStorage.removeItem("activeOrder");
};


export const getOrderHistory = () => {
  const orders = sessionStorage.getItem("orders");

  return orders ? JSON.parse(orders) : [];
};


export const saveOrderHistory = (order) => {
  const orders = getOrderHistory();

  orders.unshift(order);

  sessionStorage.setItem(
    "orders",
    JSON.stringify(orders)
  );
};