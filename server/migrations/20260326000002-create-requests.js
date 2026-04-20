"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("requests", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      request_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "provider",
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      img_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      front_img_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      back_img_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("requests");
  },
};
