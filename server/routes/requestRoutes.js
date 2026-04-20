const express = require("express");
const {
  getRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const router = express.Router();

router.get("/", getRequests);
router.put("/:id", updateRequestStatus);

module.exports = router;
