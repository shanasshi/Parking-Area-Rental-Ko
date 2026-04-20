const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  createProviderRequest,
} = require("../controllers/userController");
const {
  createUserVerificationRequest,
} = require("../controllers/requestController");
const uploadRequestImages = require("../middleware/uploadRequestImages");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post(
  "/:userId/provider-request",
  uploadRequestImages.single("image"),
  createProviderRequest,
);
router.post(
  "/:userId/verification-request",
  uploadRequestImages.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
  ]),
  createUserVerificationRequest,
);

module.exports = router;
