import express from "express";
import { Tutor } from "../models/Turtor.js";

const router = express.Router();
router.get("/tutors",async (req, res) => {
    try {
        const tutors = await Tutor.find().populate("userid"); // Populate 'name' and 'email' from the User schema
        res.status(200).json({ tutors });
        } catch (error) {
        res.status(500).json({ message: "Failed to fetch tutors." });
        }
    });


export default router;