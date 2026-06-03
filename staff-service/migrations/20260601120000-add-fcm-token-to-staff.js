"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = "staff";
    const tableDesc = await queryInterface.describeTable(table);

    if (!tableDesc.fcmToken) {
      await queryInterface.addColumn(table, "fcmToken", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = "staff";
    const tableDesc = await queryInterface.describeTable(table);

    if (tableDesc.fcmToken) {
      await queryInterface.removeColumn(table, "fcmToken");
    }
  },
};
