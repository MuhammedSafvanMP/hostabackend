"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("prescriptions", "canvasBg", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("prescriptions", "design", {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("prescriptions", "canvasBg");
    await queryInterface.removeColumn("prescriptions", "design");
  },
};