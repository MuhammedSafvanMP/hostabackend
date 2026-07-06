"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("users");

    if (!table.fcmToken) {
      await queryInterface.addColumn("users", "fcmToken", {
            type: Sequelize.JSONB,
        allowNull: true,
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("users");

    if (table.fcmToken) {
      await queryInterface.removeColumn("users", "fcmToken");
    }
  },
};
