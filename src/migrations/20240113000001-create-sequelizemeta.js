'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.createTable('SequelizeMeta', {
        name: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        }
      });
      console.log('SequelizeMeta table created successfully');
    } catch (error) {
      console.error('Error creating SequelizeMeta table:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SequelizeMeta');
  }
}; 