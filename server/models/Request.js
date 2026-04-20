const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Request = sequelize.define(
  "Request",
  {
    // Keep this singular
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Pending
    },
    request_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "provider",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img_path: {
      type: DataTypes.STRING,
    },
    front_img_path: {
      type: DataTypes.STRING,
    },
    back_img_path: {
      type: DataTypes.STRING,
    },
  },
  {
    // THIS IS THE CRITICAL PART:
    tableName: "requests", // Forces Sequelize to use the lowercase name from your screenshot
    timestamps: true, // Set to true because your screenshot shows createdAt/updatedAt
  },
);

module.exports = Request;
