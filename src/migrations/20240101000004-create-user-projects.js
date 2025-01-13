"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("UserProjects", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      projectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.ENUM("member", "admin"),
        defaultValue: "member",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint to prevent duplicate user-project associations
    await queryInterface.addConstraint("UserProjects", {
      fields: ["userId", "projectId"],
      type: "unique",
      name: "unique_user_project",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserProjects");
  },
};
