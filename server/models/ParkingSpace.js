const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ParkingSpace = sequelize.define(
  "ParkingSpace",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    space_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: false,
    },
    price_per_hour: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    slots_available: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "parking_spaces",
    timestamps: true,
  },
);

module.exports = ParkingSpace;
