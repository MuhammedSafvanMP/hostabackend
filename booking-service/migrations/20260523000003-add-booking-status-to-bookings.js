"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("bookings");

    if (!table.booking_status) {
      await queryInterface.addColumn("bookings", "booking_status", {
        type: Sequelize.ENUM("user booking", "hospital booking"),
        allowNull: false,
        defaultValue: "user booking", // Provide default for existing records
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("bookings");

    if (table.booking_status) {
      await queryInterface.removeColumn("bookings", "booking_status");
      // Note: PostgreSQL requires manual type drop for ENUMs created this way if needed,
      // but queryInterface.removeColumn is sufficient for rollback.
    }
  },
};
