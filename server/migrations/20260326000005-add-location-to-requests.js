"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDefinition = await queryInterface.describeTable("requests");

    if (!tableDefinition.location) {
      await queryInterface.addColumn("requests", "location", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const tableDefinition = await queryInterface.describeTable("requests");

    if (tableDefinition.location) {
      await queryInterface.removeColumn("requests", "location");
    }
  },
};
