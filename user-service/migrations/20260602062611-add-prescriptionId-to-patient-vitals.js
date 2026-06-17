"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("patient_vitals");

    if (!table.prescriptionId) {
      await queryInterface.addColumn("patient_vitals", "prescriptionId", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    // optional
  },
};