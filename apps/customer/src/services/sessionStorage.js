export const saveActiveOrder = (order) => {
    sessionStorage.setItem(
        "activeOrder", JSON.stringify(order)
    );
}

export const getActiveOrder = () => {
    const order = sessionStorage.getItem("activeOrder");
    return order ? JSON.parse(order) : null;
}

export const removeActiveOrder = () => {
    sessionStorage.removeItem("activeOrder");
}
export const getOrderHistory = () => {
  const orders = sessionStorage.getItem("orders");
  return orders ? JSON.parse(orders) : [];
};

export const saveOrderHistory = (order) => {
  const orders = getOrderHistory();
  orders.unshift(order);
  sessionStorage.setItem("orders", JSON.stringify(orders));
};