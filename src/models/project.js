const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.belongsToMany(models.User, {
        through: "UserProjects",
        as: "users",
        foreignKey: "projectId",
      });
      Project.hasMany(models.Task, {
        foreignKey: "projectId",
        as: "tasks",
      });
      Project.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "owner",
      });
    }
  }

  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM("active", "completed", "on-hold"),
        defaultValue: "active",
      },
    },
    {
      sequelize,
      modelName: "Project",
    }
  );

  return Project;
};
