import axiosInstance from "../axios/axios.js";
const base = "/payments";
export default {
  createIntent: (orderId) => axiosInstance.post(`${base}/${orderId}/intent`),
  get: (paymentId) => axiosInstance.get(`${base}/${paymentId}`),
  simulateSuccess: (paymentId) => axiosInstance.post(`${base}/${paymentId}/simulate-success`),
  simulateFailure: (paymentId) => axiosInstance.post(`${base}/${paymentId}/simulate-failure`),
};
