'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = ['users', 'patients', 'prescriptions'];
    
    for (const table of tables) {
      await queryInterface.addColumn(table, 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      });
      await queryInterface.addColumn(table, 'isDelete', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
      await queryInterface.addColumn(table, 'deleteDate', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = ['users', 'patients', 'prescriptions'];
    
    for (const table of tables) {
      await queryInterface.removeColumn(table, 'isActive');
      await queryInterface.removeColumn(table, 'isDelete');
      await queryInterface.removeColumn(table, 'deleteDate');
    }
  }
};
