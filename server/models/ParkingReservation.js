const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ParkingReservation = sequelize.define(
  "ParkingReservation",
  {
    parking_space_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    payment_mode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plate_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parking_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "booked",
    },
  },
  {
    tableName: "parking_reservations",
    timestamps: true,
  },
);

module.exports = ParkingReservation;
