const { Task, Project, User } = require("../models");

const taskController = {
  // Create a new task
  async create(req, res) {
    try {
      const project = await Project.findByPk(req.body.projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user has access to the project
      const userProject = await project.hasUser(req.user.id);
      if (!userProject) {
        return res.status(403).json({ error: "Access denied" });
      }

      const task = await Task.create({
        ...req.body,
        createdBy: req.user.id,
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all tasks for a project
  async getProjectTasks(req, res) {
    try {
      const project = await Project.findByPk(req.params.projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user has access to the project
      const userProject = await project.hasUser(req.user.id);
      if (!userProject) {
        return res.status(403).json({ error: "Access denied" });
      }

      const tasks = await Task.findAll({
        where: { projectId: req.params.projectId },
        include: [
          {
            model: User,
            as: "assignee",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update task
  async updateTask(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const project = await Project.findByPk(task.projectId);
      const userProject = await project.hasUser(req.user.id);
      if (!userProject) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updates = Object.keys(req.body);
      const allowedUpdates = [
        "title",
        "description",
        "status",
        "priority",
        "dueDate",
        "assignedTo",
      ];
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid updates" });
      }

      updates.forEach((update) => (task[update] = req.body[update]));
      await task.save();

      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete task
  async deleteTask(req, res) {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const project = await Project.findByPk(task.projectId);
      const userProject = await project.hasUser(req.user.id);
      if (!userProject) {
        return res.status(403).json({ error: "Access denied" });
      }

      await task.destroy();
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = taskController;
