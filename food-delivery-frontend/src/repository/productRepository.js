import axiosInstance from "../axios/axios.js";
const base = "/Products"; // NOTE: capital P required by backend
export default {
  findAll: () => axiosInstance.get(base),
  findById: (id) => axiosInstance.get(`${base}/${id}`),
  findDetails: (id) => axiosInstance.get(`${base}/${id}/details`),
  add: (data) => axiosInstance.post(`${base}/add`, data),
  edit: (id, data) => axiosInstance.put(`${base}/${id}/edit`, data),
  remove: (id) => axiosInstance.delete(`${base}/${id}/delete`),
  addToOrder: (id) => axiosInstance.post(`${base}/${id}/add-to-order`),
  removeFromOrder: (id) => axiosInstance.post(`${base}/${id}/remove-from-order`),
};
