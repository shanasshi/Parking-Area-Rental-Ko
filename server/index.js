const express = require("express");
const cors = require("cors");
const path = require("path");
const sequelize = require("./database");
const applyAssociations = require("./models/associations");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");
const parkingSpaceRoutes = require("./routes/parkingSpaceRoutes");
const authRoutes = require("./routes/authRoutes");
const parkingReservationRoutes = require("./routes/parkingReservationRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
applyAssociations();

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((error) => console.error("Database connection failed:", error));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/parking-spaces", parkingSpaceRoutes);
app.use("/api/parking-reservations", parkingReservationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
