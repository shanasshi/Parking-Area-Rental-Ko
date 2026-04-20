import axios from "../../../api/axios";

const API_URL = "/requests";

export const getRequests = () => axios.get(API_URL);

export const updateRequestStatus = (id, status) =>
  axios.put(`${API_URL}/${id}`, { status });
