import express from "express";
import ToDoList from "../models/ToDoList.js";

const router = express.Router();

// Get ToDoList by User ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let toDoList = await ToDoList.findOne({ userId });

    // If no ToDoList exists, create a new one
    if (!toDoList) {
      toDoList = new ToDoList({ userId, tasks: [] });
      await toDoList.save();
    }

    res.status(200).json(toDoList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add or Update ToDoList
router.post("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { tasks } = req.body;

    let toDoList = await ToDoList.findOne({ userId });

    if (toDoList) {
      // Update existing ToDoList
      toDoList.tasks = tasks || toDoList.tasks;
      await toDoList.save();
    } else {
      // Create new ToDoList
      toDoList = new ToDoList({ userId, tasks });
      await toDoList.save();
    }

    res.status(200).json({ message: "ToDo list saved successfully", toDoList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Task
router.delete("/:userId/:taskId", async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const toDoList = await ToDoList.findOne({ userId });

    if (!toDoList) {
      return res.status(404).json({ message: "ToDo list not found" });
    }

    toDoList.tasks = toDoList.tasks.filter((task) => task._id.toString() !== taskId);
    await toDoList.save();

    res.status(200).json({ message: "Task deleted successfully", toDoList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle Subtask completion
router.put("/:userId/:taskId/:subtaskId", async (req, res) => {
  try {
    const { userId, taskId, subtaskId } = req.params;
    const toDoList = await ToDoList.findOne({ userId });

    if (!toDoList) {
      return res.status(404).json({ message: "ToDo list not found" });
    }

    const task = toDoList.tasks.find((task) => task._id.toString() === taskId);
    const subtask = task.subtasks.find(
      (subtask) => subtask._id.toString() === subtaskId
    );

    subtask.completionStatus = !subtask.completionStatus;

    await toDoList.save();

    res.status(200).json({ message: "Subtask completion updated", toDoList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a subtask to a task
router.post("/:userId/:taskId/subtask", async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    const { title } = req.body;
    const toDoList = await ToDoList.findOne({ userId });

    if (!toDoList) {
      return res.status(404).json({ message: "ToDo list not found" });
    }

    const task = toDoList.tasks.find((task) => task._id.toString() === taskId);
    task.subtasks.push({ title, completionStatus: false });

    await toDoList.save();

    res.status(200).json({ message: "Subtask added", toDoList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Add a subtask to a task
router.post("/:userId/:taskId/subtask", async (req, res) => {
    try {
      const { userId, taskId } = req.params;
      const { title } = req.body;
      const toDoList = await ToDoList.findOne({ userId });
  
      if (!toDoList) {
        return res.status(404).json({ message: "ToDo list not found" });
      }
  
      const task = toDoList.tasks.find((task) => task._id.toString() === taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      const newSubtask = { title, completionStatus: false };
      task.subtasks.push(newSubtask);
      await toDoList.save();
  
      res.status(200).json({ message: "Subtask added", toDoList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Toggle Subtask completion
router.put("/:userId/:taskId/:subtaskId", async (req, res) => {
    try {
      const { userId, taskId, subtaskId } = req.params;
      const toDoList = await ToDoList.findOne({ userId });
  
      if (!toDoList) {
        return res.status(404).json({ message: "ToDo list not found" });
      }
  
      const task = toDoList.tasks.find((task) => task._id.toString() === taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      const subtask = task.subtasks.find((subtask) => subtask._id.toString() === subtaskId);
      if (!subtask) {
        return res.status(404).json({ message: "Subtask not found" });
      }
  
      subtask.completionStatus = !subtask.completionStatus;
      await toDoList.save();
  
      res.status(200).json({ message: "Subtask completion updated", toDoList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Delete Subtask
router.delete("/:userId/:taskId/:subtaskId", async (req, res) => {
    try {
      const { userId, taskId, subtaskId } = req.params;
      const toDoList = await ToDoList.findOne({ userId });
  
      if (!toDoList) {
        return res.status(404).json({ message: "ToDo list not found" });
      }
  
      const task = toDoList.tasks.find((task) => task._id.toString() === taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      task.subtasks = task.subtasks.filter((subtask) => subtask._id.toString() !== subtaskId);
      await toDoList.save();
  
      res.status(200).json({ message: "Subtask deleted", toDoList });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
export default router;
