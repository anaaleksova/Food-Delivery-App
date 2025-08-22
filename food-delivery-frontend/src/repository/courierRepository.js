const courierBase = "/couriers";
export const courierRepository = {
    assignToOrder: (orderId) => axiosInstance.post(`${courierBase}/assign/${orderId}`),
    completeDelivery: (orderId) => axiosInstance.post(`${courierBase}/complete/${orderId}`),
    getMyOrders: () => axiosInstance.get(`${courierBase}/my-orders`),
};