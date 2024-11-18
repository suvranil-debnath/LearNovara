import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../context/CourseContext";
import CourseCard from "../components/coursecard/CourseCard";
import "./tutorcourses.css";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../main";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const TutorCourses = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "tutor") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const [tutorCourses, setTutorCourses] = useState([]);
  const { courses, fetchCourses } = CourseData();

  // Fetch tutor-specific data
  const fetchTutorCourses = async () => {
    try {
      const { data } = await axios.get(`${server}/api/tutor/${user._id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setTutorCourses(data.createdcourses);
    } catch (error) {
      toast.error("Failed to fetch your courses.");
    }
  };

  useEffect(() => {
    if (user && user.role === "tutor") {
      fetchTutorCourses();
    }
  }, [user]);

  // Filter courses based on tutor's `createdcourses` array
  const filteredCourses = courses.filter((course) =>
    tutorCourses.includes(course._id)
  );

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);

    try {
      const { data } = await axios.post(`${server}/api/tutor/createcourses/${user._id}`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      fetchTutorCourses(); // Refresh tutor's courses
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  return (
    <div className="tutor-courses">
      <div className="left">
        <h1>Your Courses</h1>
        <div className="dashboard-content">
          {filteredCourses && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))
          ) : (
            <p>No Courses Yet</p>
          )}
        </div>
      </div>

      <div className="right">
        <div className="add-course">
          <div className="course-form">
            <h2>Create a Course</h2>
            <form onSubmit={submitHandler}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                required
              ></textarea>

              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <label htmlFor="createdBy">Your Name</label>
              <input
                type="text"
                id="createdBy"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />

              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option value={cat} key={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <label htmlFor="duration">Duration (hrs)</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />

              <label htmlFor="image">Course Image</label>
              <input type="file" id="image" onChange={changeImageHandler} />
              {imagePrev && <img src={imagePrev} alt="Preview" width="300" />}

              <button type="submit" disabled={btnLoading} className="common-btn">
                {btnLoading ? "Please Wait..." : "Create Course"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorCourses;
