const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(__dirname, "..", "uploads", "parking-spaces");

fs.mkdirSync(uploadDirectory, { recursive: true });

const sanitizeFilename = (filename) =>
  filename.replace(/[^a-zA-Z0-9.-]/g, "_");

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const uniqueSuffix = `${timestamp}-${Math.round(Math.random() * 1e9)}`;
    callback(null, `${uniqueSuffix}-${sanitizeFilename(file.originalname)}`);
  },
});

const uploadParkingSpaceImages = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = uploadParkingSpaceImages;
