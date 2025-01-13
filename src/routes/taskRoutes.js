const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const auth = require("../middlewares/auth");

// All task routes require authentication
router.use(auth);

// Task routes
router.post("/", taskController.create);
router.get("/project/:projectId", taskController.getProjectTasks);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
