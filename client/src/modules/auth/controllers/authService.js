import axios from "../../../api/axios";

export const loginUser = (data) => axios.post("/auth/login", data);
export const registerUser = (data) => axios.post("/auth/register", data);
