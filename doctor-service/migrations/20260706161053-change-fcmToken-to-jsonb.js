"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("doctor");

    if (!table.fcmToken) {
      await queryInterface.addColumn("doctor", "fcmToken", {
         type: Sequelize.JSONB,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("doctor");

    if (table.fcmToken) {
      await queryInterface.removeColumn("doctor", "fcmToken");
    }
  },
};

