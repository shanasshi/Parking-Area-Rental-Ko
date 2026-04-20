const express = require("express");
const {
  getParkingReservations,
  createParkingReservation,
} = require("../controllers/parkingReservationController");

const router = express.Router();

router.get("/", getParkingReservations);
router.post("/", createParkingReservation);

module.exports = router;
