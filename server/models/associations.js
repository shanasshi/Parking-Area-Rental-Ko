const User = require("./User");
const Request = require("./Request");
const ParkingSpace = require("./ParkingSpace");
const ParkingSpaceImage = require("./ParkingSpaceImage");
const ParkingReservation = require("./ParkingReservation");

const applyAssociations = () => {
  Request.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(Request, { foreignKey: "user_id" });
  ParkingSpace.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(ParkingSpace, { foreignKey: "user_id" });
  ParkingSpace.hasMany(ParkingSpaceImage, { foreignKey: "parking_space_id" });
  ParkingSpaceImage.belongsTo(ParkingSpace, { foreignKey: "parking_space_id" });
  ParkingSpace.hasMany(ParkingReservation, { foreignKey: "parking_space_id" });
  ParkingReservation.belongsTo(ParkingSpace, { foreignKey: "parking_space_id" });
  User.hasMany(ParkingReservation, { foreignKey: "user_id" });
  ParkingReservation.belongsTo(User, { foreignKey: "user_id" });
};

module.exports = applyAssociations;
