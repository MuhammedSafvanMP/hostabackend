"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("bookings");

    if (!table.patient_gender) {
      await queryInterface.addColumn("bookings", "patient_gender", {
        type: Sequelize.ENUM("Male", "Female", "Other"),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("bookings");

    if (table.patient_gender) {
      await queryInterface.removeColumn("bookings", "patient_gender");
    }
  },
};
