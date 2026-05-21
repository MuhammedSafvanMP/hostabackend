'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = 'staff';
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
    const table = 'staff';
    await queryInterface.removeColumn(table, 'deleteDate');
    // Not removing isActive and isDelete in down just in case they were there before
  }
};
