import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Lecture } from "../models/Lecture.js";
import { Progress } from "../models/Progress.js";
import { Courses } from "../models/Courses.js";
import { Face } from "../models/Face.js";
import * as faceapi from "face-api.js";

// Register a new user with optional face registration
export const register = TryCatch(async (req, res) => {
  const { email, name, password, faceDescriptor } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User already exists",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = {
    name,
    email,
    password: hashPassword,
  };

  const otp = Math.floor(Math.random() * 1000000);

  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  const data = {
    name,
    otp,
  };

  await sendMail(email, "E-learning Activation", data);

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
    faceDescriptor,
  });
});

// Verify OTP and save the user with face registration if applicable
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken, faceDescriptor } = req.body; 

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if (!verify)
    return res.status(400).json({
      message: "OTP expired",
    });

  if (verify.otp !== otp)
    return res.status(400).json({
      message: "Wrong OTP",
    });

  // Create and save the user
  const user = await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  // Save the face descriptor if provided
  if (faceDescriptor) {
    let parsedFaceDescriptor;
    try {
      // Parse the string into a JSON object
      const rawData = JSON.parse(faceDescriptor);
  
      // Convert it into a flat array of numbers
      parsedFaceDescriptor = Array.isArray(rawData)
        ? rawData.map(item => Number(item)) // If it's already an array, map to ensure numbers
        : Object.values(rawData).map(item => Number(item)); // If it's an object, use its values
  
      // Validate the result to ensure all elements are numbers
      if (!parsedFaceDescriptor.every(item => typeof item === 'number')) {
        return res.status(400).json({
          message: "Invalid face descriptor format. Must be an array of numbers.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "Face descriptor must be a valid JSON string",
      });
    }
  
    // Save the parsed face descriptor to the database
    const face = await Face.create({
      userId: user._id,
      facedec: parsedFaceDescriptor,
    });
  
    await face.save(); // Save the face descriptor
    await user.save(); // Save the user
  }
  
  res.json({
    message: "User registered successfully",
  });
});



export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No User with this email",
    });

  const mathPassword = await bcrypt.compare(password, user.password);

  if (!mathPassword)
    return res.status(400).json({
      message: "wrong Password",
    });

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({ user });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "No User with this email",
    });

  const token = jwt.sign({ email }, process.env.Forgot_Secret);

  const data = { email, token };

  await sendForgotMail("E learning", data);

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  res.json({
    message: "Reset Password Link is send to you mail",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);

  const user = await User.findOne({ email: decodedData.email });

  if (!user)
    return res.status(404).json({
      message: "No user with this email",
    });

  if (user.resetPasswordExpire === null)
    return res.status(400).json({
      message: "Token Expired",
    });

  if (user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({
      message: "Token Expired",
    });
  }

  const password = await bcrypt.hash(req.body.password, 10);

  user.password = password;

  user.resetPasswordExpire = null;

  await user.save();

  res.json({ message: "Password Reset" });
});

export const userProgress = TryCatch(async (req, res) => {
    const { courseId } = req.params;
    const progress = await Progress.find({
      course: courseId,
    });

    if (!progress) return res.status(404).json({ message: "null" });

    const allLecturesCount = (await Lecture.find({ course: courseId })).length;
    const alllectures = (await Lecture.find({ course: courseId }));
  
    const completedLectures = progress[0].completedLectures.length;
  
    const courseProgressPercentage = (completedLectures * 100) / allLecturesCount;


   const lecTitles = []
    alllectures.map((e) => {
      lecTitles.push(e.title)
    })

    res.json({
      courseProgressPercentage,
      completedLectures,
      allLecturesCount,
      lecTitles
    });
});



export const loginWithFace = TryCatch(async (req, res) => {
  const { descriptor } = req.body;

  if (!descriptor) {
    return res.status(400).json({
      message: "Face descriptor is required",
    });
  }

  // Retrieve all face descriptors from the database
  const faces = await Face.find();

  // Compare incoming descriptor with saved descriptors
  const threshold = 0.6; // Adjust the threshold as needed
  let matchedUser = null;

  for (const face of faces) {
    const distance = faceapi.euclideanDistance(descriptor, face.facedec);
    if (distance < threshold) {
      matchedUser = await User.findById(face.userId);
      break;
    }
  }

  if (!matchedUser) {
    return res.status(400).json({
      message: "Face not recognized",
    });
  }

  const token = jwt.sign({ _id: matchedUser._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${matchedUser.name}`,
    token,
    user: matchedUser, // Include user for frontend state updates
  });
});
