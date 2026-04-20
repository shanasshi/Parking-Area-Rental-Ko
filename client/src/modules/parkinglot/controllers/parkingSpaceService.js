import axios from "../../../api/axios";

const API_URL = "/parking-spaces";

export const getParkingSpaces = () => axios.get(API_URL);

export const createParkingSpace = (data) =>
  axios.post(API_URL, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateParkingSpace = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteParkingSpace = (id, data) =>
  axios.delete(`${API_URL}/${id}`, { data });
