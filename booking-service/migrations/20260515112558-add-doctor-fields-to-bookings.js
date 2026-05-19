'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('booking');

    // doctor_name
    if (!table.doctor_name) {
      await queryInterface.addColumn('booking', 'doctor_name', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      });
    }

    // doctor_department
    if (!table.doctor_department) {
      await queryInterface.addColumn('booking', 'doctor_department', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('booking');

    if (table.doctor_name) {
      await queryInterface.removeColumn('booking', 'doctor_name');
    }

    if (table.doctor_department) {
      await queryInterface.removeColumn('booking', 'doctor_department');
    }
  },
};