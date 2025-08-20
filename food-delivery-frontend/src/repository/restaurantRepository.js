import axiosInstance from "../axios/axios.js";
const base = "/restaurants";
export default {
  findById: (id) => axiosInstance.get(`${base}/${id}`),
  add: (data) => axiosInstance.post(`${base}/add`, data),
  edit: (id, data) => axiosInstance.put(`${base}/${id}/edit`, data),
  remove: (id) => axiosInstance.delete(`${base}/${id}/delete`),
};
