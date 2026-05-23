"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable("staff");

    if (!table.staffId) {
      await queryInterface.addColumn("staff", "staffId", {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable("staff");

    if (table.staffId) {
      await queryInterface.removeColumn("staff", "staffId");
    }
  },
};