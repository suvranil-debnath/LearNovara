import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Tutor } from "../models/Turtor.js";
import { User } from "../models/User.js";
export const tutorCreateCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;

  // Create a new course
  const course = await Courses.create({
    title,
    description,
    category,
    createdBy,
    image: image?.path,
    duration,
    price,
  });

  // Find the tutor by userid and update the createdcourses array
  const tutor = await Tutor.findOne({ userid: req.params.id });
  const user = await User.findById( req.params.id);
  if (!tutor) {
    return res.status(404).json({ message: "Tutor not found" });
  }

  tutor.createdcourses.push(course._id);
  user.subscription.push(course._id);
  await tutor.save();
  await user.save();
  
  res.status(201).json({
    message: "Course Created Successfully",
    course,
  });
});
