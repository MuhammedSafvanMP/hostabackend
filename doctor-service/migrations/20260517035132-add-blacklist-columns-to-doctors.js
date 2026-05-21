'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = 'doctor';
    const tableDesc = await queryInterface.describeTable(table);

    if (!tableDesc.isActive) {
      await queryInterface.addColumn(table, 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
    }
    
    if (!tableDesc.isDelete) {
      await queryInterface.addColumn(table, 'isDelete', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }

    if (!tableDesc.deleteDate) {
      await queryInterface.addColumn(table, 'deleteDate', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = 'doctor';
    await queryInterface.removeColumn(table, 'deleteDate');
  }
};
