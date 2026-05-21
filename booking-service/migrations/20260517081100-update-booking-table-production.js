"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // =========================
    // CHECK TABLE EXISTS
    // =========================

    const table = await queryInterface.describeTable("booking");

    // =========================
    // RENAME TABLE
    // booking -> bookings
    // =========================

    await queryInterface.renameTable(
      "booking",
      "bookings"
    );

    // =========================
    // CHANGE patient_name
    // =========================

    await queryInterface.changeColumn(
      "bookings",
      "patient_name",
      {
        type: Sequelize.STRING(120),
        allowNull: false,
      }
    );

    // =========================
    // CHANGE patient_phone
    // =========================

    await queryInterface.changeColumn(
      "bookings",
      "patient_phone",
      {
        type: Sequelize.STRING(20),
        allowNull: false,
      }
    );

    // =========================
    // CHANGE patient_place
    // =========================

    await queryInterface.changeColumn(
      "bookings",
      "patient_place",
      {
        type: Sequelize.STRING(120),
        allowNull: true,
      }
    );

    // =========================
    // CHANGE consulting_time
    // =========================

    await queryInterface.changeColumn(
      "bookings",
      "consulting_time",
      {
        type: Sequelize.STRING(50),
        allowNull: true,
      }
    );

    // =========================
    // CHANGE doctor_name
    // =========================

    await queryInterface.changeColumn(
      "bookings",
      "doctor_name",
      {
        type: Sequelize.STRING(120),
        allowNull: false,
      }
    );

    // =========================
    // CHANGE doctor_department
    // =========================

    await queryInterface.changeColumn(
      "bookings",
      "doctor_department",
      {
        type: Sequelize.STRING(120),
        allowNull: false,
      }
    );

    // =========================
    // ADD completed ENUM VALUE
    // PostgreSQL ONLY
    // =========================

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_booking_status"
      ADD VALUE IF NOT EXISTS 'completed';
    `);

    // =========================
    // ADD token COLUMN
    // =========================

    if (!table.token) {
      await queryInterface.addColumn(
        "bookings",
        "token",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
        }
      );
    }

    // =========================
    // ADD INDEXES
    // =========================

    await queryInterface.addIndex(
      "bookings",
      ["doctorId"],
      {
        name: "bookings_doctorId_index",
      }
    );

    await queryInterface.addIndex(
      "bookings",
      ["hospitalId"],
      {
        name: "bookings_hospitalId_index",
      }
    );

    await queryInterface.addIndex(
      "bookings",
      ["userId"],
      {
        name: "bookings_userId_index",
      }
    );

    await queryInterface.addIndex(
      "bookings",
      ["booking_date"],
      {
        name: "bookings_booking_date_index",
      }
    );

    await queryInterface.addIndex(
      "bookings",
      ["status"],
      {
        name: "bookings_status_index",
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // =========================
    // REMOVE INDEXES
    // =========================

    await queryInterface.removeIndex(
      "bookings",
      "bookings_doctorId_index"
    );

    await queryInterface.removeIndex(
      "bookings",
      "bookings_hospitalId_index"
    );

    await queryInterface.removeIndex(
      "bookings",
      "bookings_userId_index"
    );

    await queryInterface.removeIndex(
      "bookings",
      "bookings_booking_date_index"
    );

    await queryInterface.removeIndex(
      "bookings",
      "bookings_status_index"
    );

    // =========================
    // REMOVE token COLUMN
    // =========================

    const table = await queryInterface.describeTable(
      "bookings"
    );

    if (table.token) {
      await queryInterface.removeColumn(
        "bookings",
        "token"
      );
    }

    // =========================
    // RENAME TABLE BACK
    // =========================

    await queryInterface.renameTable(
      "bookings",
      "booking"
    );
  },
};