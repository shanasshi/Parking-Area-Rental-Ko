import axios from "../../../api/axios";

export const getParkingReservations = (userId) =>
  axios.get("/parking-reservations", {
    params: {
      user_id: userId,
    },
  });

export const createParkingReservation = (data) =>
  axios.post("/parking-reservations", data);
