'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Running test migration...');
    // Create a test table
    await queryInterface.createTable('test_table', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    console.log('Test migration completed successfully');
  },

  down: async (queryInterface, Sequelize) => {
    console.log('Rolling back test migration...');
    await queryInterface.dropTable('test_table');
  }
};
