'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Images', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      imageId: {
        type: Sequelize.STRING
      },
      earth_date: {
        type: Sequelize.STRING
      },
      sol: {
        type: Sequelize.INTEGER
      },
      url: {
        type: Sequelize.STRING
      },
      camera_name: {
        type: Sequelize.STRING
      },
      rover_name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Images');
  }
};