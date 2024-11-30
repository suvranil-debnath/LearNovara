import React, { useEffect, useState } from "react";
import "./Course.css"; // Updated styles here
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

import AOS from "aos";
import "aos/dist/aos.css";
import { FaClock, FaHeart, FaRegHeart, FaShareAlt } from "react-icons/fa"; // Icons for duration, favorite, and share

const CcourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user } = UserData();
  const { fetchCourses } = CourseData();
  const [isFavorite, setIsFavorite] = useState(false); // State to toggle the favorite button

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites!" : "Added to favorites!");
  };

  const shareCourse = () => {
    const courseUrl = `${window.location.origin}/course/${course._id}`;
    navigator.clipboard.writeText(courseUrl);
    toast.success("Course link copied to clipboard!");
  };

  const isGoogleDriveLink = course.image && course.image.includes("drive.google.com");

  return (
    <div className="course_card" data-aos="fade-up"   >
      {/* Overlay with the image and title */}
      <div className="overlay">
        <div className="card-image">
          <img
            src={isGoogleDriveLink ? course.image : `${server}/${course.image}`} 
            alt={course.title}
            className="card-img"
          />
        </div>
        <div className="overlay-dark">{course.title}</div>
      </div>

      {/* Rest of the card content */}
      <div className="card-content">
        <div className="subname">
          <img
            className="subava"
            src="https://avatar.iran.liara.run/public/job/teacher/male"
            alt="avatar"
          />
          {course.createdBy}<div className="card-icons-container">
          <div className="card-icon favorite-icon" onClick={toggleFavorite}>
            {isFavorite ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}
          </div>
          <div className="card-icon share-icon" onClick={shareCourse}>
            <FaShareAlt />
          </div>
        </div>
        </div>
        <span className="description">
          <FaClock style={{ marginRight: "5px", color: "teal" }} />{" "}
          {course.duration} weeks
        </span>
        <hr />
        <span className="price">₹{course.price}</span>

        <div className="buttonside">
          <button
            onClick={() => navigate(`/course/${course._id}`)}
            className="buttonSide"
          >
            Get Started
          </button>
          {user && user.role === "admin" && (
            <button
              onClick={() => deleteHandler(course._id)}
              className="buttonSide buttonDelete"
            >
              Delete
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default CcourseCard;
