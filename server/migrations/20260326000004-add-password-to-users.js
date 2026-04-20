"use strict";

const crypto = require("crypto");

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable("Users");

    if (!tableDefinition.password) {
      await queryInterface.addColumn("Users", "password", {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: hashPassword("password123"),
      });
    }
  },

  async down(queryInterface) {
    const tableDefinition = await queryInterface.describeTable("Users");

    if (tableDefinition.password) {
      await queryInterface.removeColumn("Users", "password");
    }
  },
};
