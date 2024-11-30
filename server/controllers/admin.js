import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { Tutor } from '../models/Turtor.js'; 

export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;

  const image = req.file;

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course)
    return res.status(404).json({
      message: "No Course with this id",
    });

  const { title, description } = req.body;

  const file = req.file;

  const lecture = await Lecture.create({
    title,
    description,
    video: file?.path,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  rm(lecture.video, () => {
    console.log("Video deleted");
  });

  await lecture.deleteOne();

  res.json({ message: "Lecture Deleted" });
});


import { unlink } from "fs/promises"; // For local file deletion
import { google } from "googleapis";
import { URL } from "url";

// Google Drive setup (use your existing configuration)
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: "total-velocity-443113-c4",
    private_key_id: "6f01196d0d03280ba8405bf5821276c6e206225b",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDby/B2R1/7/ls/\nHMaS0+lKQJAq9TplT7JkdIQP84nmlej7dzlIY2Y9B0LuiAfx7iKEw1xsiUpj/Wgt\nZ91JnIzpZ168r9S46c9NpO+KumZackzmq5FjDzCSkbZbML5F3JSNvjlUoONNk/Dh\nWDMfXLLIz7UDdh7t5KuHHGY6WP7fZiF6l60KTfjv9PHmgONkeospYLSiDbYCzdaw\njl510hOfk2gmi+JaHlFy2Z5Fs/UfW2WuDoWCm20hwMaRkI4bjesSgAk1s6MVAaqh\nm6COIlXbxpvXEDXMrimWnPR/W5T5FHKBIyZ9ljhPXFs0FQIKIQR0CT+LicpZbu7y\nBou5Ui+bAgMBAAECggEADl2H5n3HvN/k9X0F+swK2qWERqp8bz6u5CM8C7wubnms\nc92uSsLkXby/F86gO6RaxolA3dR4njcOZgP8fIvU0d8bBq4J8y6k3pLsbQlobc+R\nTco3gwftHsc96eaHqRKU9aanIewvWan/plrDYfCxvATcnyX144p8g3ohsafmEJJX\nO5B2HiS0jC9FB4rFUxG4biGFwOsOk+yJt/4kUyBO6nmeDyUSj7JBTXo83tdFEAwX\n8761os3rktFMfI7utrTe4RzR64ATp39oJZIPWdOJHHXlPOgBhei93CSRCFCuzDBp\nlU5fQyMwSkTy6hcNrE94ykDRqI78q/35lg8bhrQugQKBgQD1QLkDuXDPvxHtCXvm\nkIiXDh9wROPsKsyLqqz6EYqx9rnsNiT73MOEX0sdnhfblQSB4d6VRW0ARBzNRypy\nZDC2spt0WtwW8zyIDoAMP4RXivpf94Bqba0NM3Yilfs2Xs/GfoROfs8hU6fc5Ea+\nwONtU9XJTrwablRGbY0dni54ewKBgQDlbaVYKBgCcut5HtqzZ4GK7R41/l1qwaAi\nT2bP2xjC1T5/XCc07+X1Is3+YP9HM/epb24Njbu7CUH/jgJ2EKPpyXVk0sD3YOZY\nvpDJRF0wuA3V8X87vL4G27wqgzuG1Uj9HD46HxCEbaAuhWX25xNKH4HXS7Tey+g9\nkrysHXfLYQKBgF+I48lAnmI+osP8MsiAusRk2vhHzaU8kstBI/qRhL6IRqpt+QAn\nYf4ZhNA3ukFuDgBuNN9e2PQGlFWeiDlhL9yrPIUZs6w4+fZh951NzMaxO5DQf7R1\nnriKuFUGqYHncvZ2aCGPoi3wQW55edlql+0JgDjXs8xz994rZJIKAT4rAoGAJFSq\nnD0tICYml7WFGGfJocBOymoPTPqAay57r2qYjzHJhc2H/+AFYD40tJWTlyjpjREy\nMj9BfSrIIrnQNfYIntriFicxm3rivybeMqD6yN48gqaNaV5IETn2oBzL7lwUBNDW\nIcoNiYr6lKNXNDP/X/uBSiCY8bcEfcugyPiZocECgYEAzbm4xR1Zavj3BN5PSBRM\nggTNOYav1G/7bTdqP/3YPTGkg3wNnVTifFIu69MhEeLRiD12dS3yBRLIqIYkfmpr\nu4cFgovUa3HDJrWiZwRfbpWvscKZIAqTHA0wpS/wlEMDUTulCW8JqZYwIZPmFZaq\nPkulKXwRnM14JGS1VdVkyo8=\n-----END PRIVATE KEY-----\n",
    client_email: "learnovara@total-velocity-443113-c4.iam.gserviceaccount.com",
    client_id: "107608827948461132380",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/learnovara%40total-velocity-443113-c4.iam.gserviceaccount.com",
  },
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// Helper function to delete files from Google Drive
async function deleteFromDrive(fileUrl) {
  try {
    const fileId = new URL(fileUrl).searchParams.get("id"); // Extract file ID from URL
    if (fileId) {
      await drive.files.delete({ fileId });
      console.log(`File with ID ${fileId} deleted successfully.`);
    } else {
      console.warn(`Invalid file URL: ${fileUrl}`);
    }
  } catch (error) {
    console.error(`Failed to delete file from Google Drive: ${error.message}`);
    throw new Error("Failed to delete file from Google Drive");
  }
}

// Updated deleteCourse function
export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Fetch associated lectures
  const lectures = await Lecture.find({ course: course._id });

  // Delete lecture videos from Google Drive
  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.video.startsWith("https://drive.google.com")) {
        try {
          await deleteFromDrive(lecture.video);
        } catch (error) {
          console.error(`Failed to delete video: ${lecture.video}`, error.message);
        }
      } else {
        // Delete local video files if applicable
        try {
          await unlink(lecture.video);
          console.log("Local video deleted");
        } catch (error) {
          console.error(`Failed to delete local video: ${lecture.video}`, error.message);
        }
      }
    })
  );

  // Delete course image from Google Drive
  if (course.image.startsWith("https://drive.google.com")) {
    try {
      await deleteFromDrive(course.image);
    } catch (error) {
      console.error(`Failed to delete course image: ${course.image}`, error.message);
    }
  } else {
    // Delete local image files if applicable
    try {
      rm(course.image, () => {
        console.log("Local image deleted");
      });
    } catch (error) {
      console.error(`Failed to delete local image: ${course.image}`, error.message);
    }
  }

  // Remove lectures and course data
  await Lecture.deleteMany({ course: req.params.id });
  await course.deleteOne();

  // Update user subscriptions
  await User.updateMany({}, { $pull: { subscription: req.params.id } });

  res.json({ message: "Course Deleted" });
});






export const getAllStats = TryCatch(async (req, res) => {
  const totalCoures = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  // Check if the requester is a superadmin
  if (req.user.mainrole !== "superadmin") {
      return res.status(403).json({
          message: "This endpoint is assigned to superadmin",
      });
  }

  // Find the user by ID
  const user = await User.findById(req.params.id);
  if (!user) {
      return res.status(404).json({
          message: "User not found",
      });
  }

  if (user.role === "user") {
      // Update role to tutor
      user.role = "tutor";
      await user.save();

      // Create a corresponding Tutor document
      const tutorExists = await Tutor.findOne({ userid: user._id });
      if (!tutorExists) {
          const image = req.file;
          await Tutor.create({
              userid: user._id,
              profilepic: image?.path, // Set a default profile picture or use a placeholder
              createdcourses: [],
          });
      }

      return res.status(200).json({
          message: "Role updated to tutor",
      });
  }

  if (user.role === "tutor") {
    // Update role back to user
    user.role = "user";
    await user.save();
    const tutor = await Tutor.findOne({ userid: user._id });
  
    // Delete the profile picture from Google Drive
    if (tutor?.profilepic)  {
        try {
          await deleteFromDrive(tutor.profilepic);
        } catch (error) {
          console.error("Failed to delete Google Drive file:", error.message);
        }
      }
  
  
    // Remove the corresponding Tutor document
    await Tutor.deleteOne({ userid: user._id });
  
    return res.status(200).json({
      message: "Role updated to user",
    });
  }
  
});