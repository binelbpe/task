const { Project, User, Task } = require("../models");

const projectController = {
  // Create a new project
  async create(req, res) {
    try {
      const project = await Project.create({
        ...req.body,
        ownerId: req.user.id,
      });

      // Add owner as project admin
      await project.addUser(req.user.id, {
        through: { role: "admin" },
      });

      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all projects for current user
  async getAllProjects(req, res) {
    try {
      const projects = await req.user.getProjects({
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "email"],
            through: { attributes: ["role"] },
          },
        ],
      });

      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get project by ID
  async getProjectById(req, res) {
    try {
      const project = await Project.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "users",
            attributes: ["id", "name", "email"],
            through: { attributes: ["role"] },
          },
          {
            model: Task,
            as: "tasks",
            include: [
              {
                model: User,
                as: "assignee",
                attributes: ["id", "name", "email"],
              },
            ],
          },
        ],
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user has access to the project
      const userProject = await project.hasUser(req.user.id);
      if (!userProject) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update project
  async updateProject(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user is project owner
      if (project.ownerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Only project owner can update project" });
      }

      const updates = Object.keys(req.body);
      const allowedUpdates = ["name", "description", "status"];
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid updates" });
      }

      updates.forEach((update) => (project[update] = req.body[update]));
      await project.save();

      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete project
  async deleteProject(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user is project owner
      if (project.ownerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Only project owner can delete project" });
      }

      await project.destroy();
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add member to project
  async addMember(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user is project admin
      const userProject = await project.getUserProjects({
        where: { userId: req.user.id },
      });
      if (!userProject || userProject[0].role !== "admin") {
        return res
          .status(403)
          .json({ error: "Only project admins can add members" });
      }

      const { userId, role = "member" } = req.body;
      const userToAdd = await User.findByPk(userId);
      if (!userToAdd) {
        return res.status(404).json({ error: "User not found" });
      }

      await project.addUser(userToAdd, { through: { role } });
      res.status(201).json({ message: "Member added successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Remove member from project
  async removeMember(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user is project admin
      const userProject = await project.getUserProjects({
        where: { userId: req.user.id },
      });
      if (!userProject || userProject[0].role !== "admin") {
        return res
          .status(403)
          .json({ error: "Only project admins can remove members" });
      }

      // Cannot remove project owner
      if (project.ownerId === req.params.userId) {
        return res.status(400).json({ error: "Cannot remove project owner" });
      }

      await project.removeUser(req.params.userId);
      res.json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update member role
  async updateMemberRole(req, res) {
    try {
      const project = await Project.findByPk(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      // Check if user is project owner
      if (project.ownerId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "Only project owner can update member roles" });
      }

      const { role } = req.body;
      if (!["admin", "member"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      await project.setUserRole(req.params.userId, role);
      res.json({ message: "Member role updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = projectController;
