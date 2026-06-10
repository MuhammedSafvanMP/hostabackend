"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("prescriptions", "type", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "text",
    });

    await queryInterface.addColumn("prescriptions", "content", {
      type: Sequelize.TEXT,
      defaultValue: "",
    });

    await queryInterface.addColumn("prescriptions", "x", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });

    await queryInterface.addColumn("prescriptions", "y", {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    });

    await queryInterface.addColumn("prescriptions", "width", {
      type: Sequelize.FLOAT,
      defaultValue: 100,
    });

    await queryInterface.addColumn("prescriptions", "height", {
      type: Sequelize.FLOAT,
      defaultValue: 40,
    });

    await queryInterface.addColumn("prescriptions", "fontSize", {
      type: Sequelize.STRING,
      defaultValue: "text-base",
    });

    await queryInterface.addColumn("prescriptions", "fontWeight", {
      type: Sequelize.STRING,
      defaultValue: "",
    });

    await queryInterface.addColumn("prescriptions", "textAlign", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("prescriptions", "textColor", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("prescriptions", "bgColor", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("prescriptions", "type");
    await queryInterface.removeColumn("prescriptions", "content");
    await queryInterface.removeColumn("prescriptions", "x");
    await queryInterface.removeColumn("prescriptions", "y");
    await queryInterface.removeColumn("prescriptions", "width");
    await queryInterface.removeColumn("prescriptions", "height");
    await queryInterface.removeColumn("prescriptions", "fontSize");
    await queryInterface.removeColumn("prescriptions", "fontWeight");
    await queryInterface.removeColumn("prescriptions", "textAlign");
    await queryInterface.removeColumn("prescriptions", "textColor");
    await queryInterface.removeColumn("prescriptions", "bgColor");
  },
};