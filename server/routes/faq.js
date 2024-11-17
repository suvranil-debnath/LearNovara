import express from "express";
import Faq from "../models/Faq.js"; // Ensure you have the correct path to your Faq model

const router = express.Router();

// POST route to add a new FAQ
router.post('/', async (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const newFaq = new Faq({ question, answer });
        await newFaq.save();
        res.status(201).json({ message: "FAQ saved successfully", data: newFaq });
    } catch (error) {
        console.error("Error saving FAQ:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET route to fetch all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await Faq.find({});
        res.status(200).json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
