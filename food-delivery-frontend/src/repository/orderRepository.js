import axiosInstance from "../axios/axios.js";
const base = "/orders";
export default {
  getPending: () => axiosInstance.get(`${base}/pending`),
  confirmPending: () => axiosInstance.put(`${base}/pending/confirm`),
  cancelPending: () => axiosInstance.put(`${base}/pending/cancel`),
  getConfirmed: () => axiosInstance.get(`${base}/confirmed`),
  trackOrder: (orderId) => axiosInstance.get(`${base}/track/${orderId}`),
};
