"use strict";

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const [users] = await queryInterface.sequelize.query(`
      SELECT id, email FROM Users
      WHERE email IN ('provider@park.local')
    `);

    const provider = users.find((user) => user.email === "provider@park.local");

    if (provider) {
      await queryInterface.bulkInsert("parking_spaces", [
        {
          user_id: provider.id,
          space_name: "Covered Slot A1",
          location: "Session Road, Baguio City",
          latitude: 16.4122466,
          longitude: 120.5960273,
          price_per_hour: 75.0,
          slots_available: 2,
          description: "Covered parking near the city center.",
          createdAt: now,
          updatedAt: now,
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("parking_spaces", {
      space_name: ["Covered Slot A1"],
    });
  },
};
