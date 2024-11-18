import express from "express";
import { Tutor } from "../models/Turtor.js";
import { isAuth } from "../middlewares/isAuth.js";
import { uploadFiles } from "../middlewares/multer.js";
import { tutorCreateCourse } from "../controllers/tutor.js";


const router = express.Router();
router.get("/tutors",async (req, res) => {
    try {
        const tutors = await Tutor.find().populate("userid"); // Populate 'name' and 'email' from the User schema
        res.status(200).json({ tutors });
        } catch (error) {
        res.status(500).json({ message: "Failed to fetch tutors." });
        }
    });

// Fetch tutor details
router.get("/tutor/:id", async (req, res) => {
    try {
      const tutor = await Tutor.findOne({ userid: req.params.id });
      if (!tutor) return res.status(404).json({ message: "Tutor not found" });
      res.status(200).json(tutor);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

 router.post("/tutor/createcourses/:id", isAuth , uploadFiles, tutorCreateCourse );


export default router;
