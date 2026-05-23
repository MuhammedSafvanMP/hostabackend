"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("bookings");

    if (!table.patient_age) {
      await queryInterface.addColumn("bookings", "patient_age", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // Provide default so existing rows don't break
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("bookings");

    if (table.patient_age) {
      await queryInterface.removeColumn("bookings", "patient_age");
    }
  },
};
