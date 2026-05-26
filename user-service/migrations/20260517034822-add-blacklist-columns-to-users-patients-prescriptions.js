"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = ["users", "patients", "prescriptions"];

    for (const table of tables) {
      const tableInfo = await queryInterface.describeTable(table);

      if (!tableInfo.isActive) {
        await queryInterface.addColumn(table, "isActive", {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        });
      }

      if (!tableInfo.isDelete) {
        await queryInterface.addColumn(table, "isDelete", {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        });
      }

      if (!tableInfo.deleteDate) {
        await queryInterface.addColumn(table, "deleteDate", {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = ["users", "patients", "prescriptions"];

    for (const table of tables) {
      const tableInfo = await queryInterface.describeTable(table);

      if (tableInfo.isActive) {
        await queryInterface.removeColumn(table, "isActive");
      }

      if (tableInfo.isDelete) {
        await queryInterface.removeColumn(table, "isDelete");
      }

      if (tableInfo.deleteDate) {
        await queryInterface.removeColumn(table, "deleteDate");
      }
    }
  },
};
