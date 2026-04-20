"use strict";

const crypto = require("crypto");

const hashPassword = (password) =>
  crypto.createHash("sha256").update(password).digest("hex");

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const users = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        first_name: "System",
        last_name: "Admin",
        phone_number: "09170000001",
        user_type_id: 1,
        email: "admin@park.local",
        password: hashPassword("admin123"),
        is_verified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        first_name: "Paula",
        last_name: "Provider",
        phone_number: "09170000002",
        user_type_id: 2,
        email: "provider@park.local",
        password: hashPassword("provider123"),
        is_verified: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        first_name: "Nina",
        last_name: "User",
        phone_number: "09170000003",
        user_type_id: 3,
        email: "user@park.local",
        password: hashPassword("user123"),
        is_verified: false,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", {
      email: ["admin@park.local", "provider@park.local", "user@park.local"],
    });
  },
};
