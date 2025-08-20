import axiosInstance from "../axios/axios.js";
export default {
  register: (data) => axiosInstance.post("/user/register", data),
  login: (data) => axiosInstance.post("/user/login", data),
  me: () => axiosInstance.get("/user/me"),
};
