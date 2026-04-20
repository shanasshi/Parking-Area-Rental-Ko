const express = require("express");
const {
  getParkingSpaces,
  createParkingSpace,
  updateParkingSpace,
  deleteParkingSpace,
} = require("../controllers/parkingSpaceController");
const uploadParkingSpaceImages = require("../middleware/uploadParkingSpaceImages");

const router = express.Router();

router.get("/", getParkingSpaces);
router.post(
  "/",
  uploadParkingSpaceImages.array("images", 6),
  createParkingSpace,
);
router.put(
  "/:id",
  uploadParkingSpaceImages.array("images", 6),
  updateParkingSpace,
);
router.delete("/:id", deleteParkingSpace);

module.exports = router;
