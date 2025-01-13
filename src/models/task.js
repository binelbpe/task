const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
      Task.belongsTo(models.User, {
        foreignKey: "assignedTo",
        as: "assignee",
      });
    }
  }

  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM("todo", "in-progress", "done"),
        defaultValue: "todo",
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },
      dueDate: {
        type: DataTypes.DATE,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      assignedTo: {
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Task",
    }
  );

  return Task;
};
