import axios from "../../../api/axios";

export const getUsers = () => axios.get("/users");
export const getUserById = (id) => axios.get(`/users/${id}`);
export const addUser = (data) => axios.post("/users", data);
export const requestProviderAccess = (userId, data) =>
  axios.post(`/users/${userId}/provider-request`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const requestUserVerification = (userId, data) =>
  axios.post(`/users/${userId}/verification-request`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
