const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const ParkingSpaceImage = sequelize.define(
  "ParkingSpaceImage",
  {
    parking_space_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    img_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "parking_space_images",
    timestamps: true,
  },
);

module.exports = ParkingSpaceImage;
