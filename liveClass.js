import express from "express";
import { google } from "googleapis";
import { LiveClass } from "../models/LiveClass.js";
import { User } from "../models/User.js";
import { Tutor } from "../models/Turtor.js";
import axios from "axios";

const router = express.Router();

// OAuth2 client credentials
const { installed } = {
  installed: {
    client_id: "800476639249-f1bu3th3susq2n0hk7htumo1k6q0bjp0.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uris: ["http://localhost:5000"],
  },
};

// Refresh token
const REFRESH_TOKEN = "1//0glcFOneqX2KUCgYIARAAGBASNwF-L9IrmpwpxL1m51bVBX6_gtpvOOihLrndGAtytU8b3-wyoAIIUvFcDnBpZQDm94lQR-hWYq0";

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  installed.client_id,
  installed.client_secret,
  installed.redirect_uris[0]
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

router.post("/liveclass", async (req, res) => {
  try {
    const { tutorId, subjectName, description } = req.body;

    if (!tutorId || !subjectName || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch tutor's email
    const tutor = await User.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Ensure the OAuth2 client has a valid access token
    const { token } = await oauth2Client.getAccessToken();

    // Initialize Google Meet API client
    const meetClient = google.meet({
      version: "v2",
      auth: oauth2Client,
    });
    
    // Step 1: Create a meeting space
    const meetingSpace = await meetClient.spaces.create({
      requestBody: {
        config: {
          accessType: "TRUSTED",
        },
      },
    });
    const spaceName = meetingSpace.data.name;
    const meetingLink = meetingSpace.data.meetingUri; // Google Meet link

    if (!meetingLink) {
      throw new Error("Failed to create Google Meet space");
    }
    const cohostEmail = tutor.email; // Replace with the desired co-host email
    const addCohostResponse = await axios.post(
      `https://meet.googleapis.com/v2beta/${spaceName}/members`,
      {
        email: cohostEmail,
        role: "COHOST", // Role can be COHOST or other valid roles
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cohost added successfully:", addCohostResponse.data);
    
    // Step 2: Save LiveClass to Database
    const newLiveClass = new LiveClass({
      tutorId,
      gmeetLink: meetingLink,
      subjectName,
      description,
    });

    await newLiveClass.save();

    res.status(201).json({
      message: "Live class created successfully",
      liveClass: newLiveClass,
    });
  } catch (error) {
    console.error("Error creating live class:", error.message);
    res.status(500).json({ message: error.message || "An unknown error occurred" });
  }
});



router.get("/liveclasses", async (req, res) => {
  try {
    // Fetch all live classes
    const liveClasses = await LiveClass.find()
      .populate("tutorId", "name email") // Populate the basic fields from the User schema
      .exec();

    // Add the profile picture from the Tutor schema
    const liveClassesWithTutorDetails = await Promise.all(
      liveClasses.map(async (liveClass) => {
        const tutor = await Tutor.findOne({ userid: liveClass.tutorId._id }).select("profilepic").exec();
        return {
          ...liveClass._doc, // Spread the liveClass object
          tutorProfilePic: tutor?.profilepic || null, // Add the tutor's profile picture
        };
      })
    );

    res.status(200).json(liveClassesWithTutorDetails);
  } catch (error) {
    console.error("Error fetching live classes:", error.message);
    res.status(500).json({ message: "Failed to fetch live classes" });
  }
});


export default router;
