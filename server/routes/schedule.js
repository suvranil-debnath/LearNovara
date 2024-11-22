import express from "express";
import Schedule from "../models/Schedule.js";

const router = express.Router();


router.get("/schedules", async (req, res) => {
    const { userid, startDate, endDate } = req.query;
  
    try {
      const schedules = await Schedule.find({
        userid,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      res.status(200).json(schedules);
    } catch (err) {
      res.status(500).json({ message: "Error fetching schedules", error: err.message });
    }
  });
  
  // Add a new schedule
  router.post("/schedules/new", async (req, res) => {
    const { userid, name, date } = req.body;
  
    try {
      const newSchedule = new Schedule({
        userid,
        name,
        date,
        completed: false,
      });
  
      await newSchedule.save();
      res.status(201).json(newSchedule);
    } catch (err) {
      res.status(500).json({ message: "Error creating schedule", error: err.message });
    }
  });
  
  // Update a schedule's completed status
  router.put("/schedules/:id", async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
  
    try {
      const updatedSchedule = await Schedule.findByIdAndUpdate(
        id,
        { completed },
        { new: true }
      );
      res.status(200).json(updatedSchedule);
    } catch (err) {
      res.status(500).json({ message: "Error updating schedule", error: err.message });
    }
  });
  
  // Delete a schedule
  router.delete("/schedules/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await Schedule.findByIdAndDelete(id);
      res.status(200).json({ message: "Schedule deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting schedule", error: err.message });
    }
  });



export default router;
