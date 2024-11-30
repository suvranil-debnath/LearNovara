import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/admin.js";
import { handleFileUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, handleFileUpload, createCourse);
router.post("/course/:id", isAuth, isAdmin, handleFileUpload, addLectures);
router.put("/user/:id", isAuth, handleFileUpload, updateRole);

router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.get("/users", isAuth, isAdmin, getAllUser);

export default router;
