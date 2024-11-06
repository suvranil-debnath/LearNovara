// CourseCard.js
import React from 'react';
import './Course.css'; // Import any relevant styles here
import { server } from "../../main";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { CourseData } from "../../context/CourseContext";

const CcourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();

  const { fetchCourses } = CourseData();

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course")) {
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


  return (
    <div className="course_card">
      <div className='image-content'>
        <div className='overlay'>
          <div className='card-image'>
            <img src={`${server}/${course.image}`} alt="" className='card-img' />
          </div>
        </div>
      </div>

      <div className='card-content'>
        <span className="name">{course.title}</span>
        <span className='subname'>{course.createdBy}</span>
        <span className='description'>Duration - {course.duration} weeks</span>
        <hr />
        <span className='subname'>Price- ₹{course.price}</span>
        <div className='buttonside'>
          <button
            onClick={() => navigate(`/course/${course._id}`)}
            className='buttonSide'>
            Get Started
          </button>
          {user && user.role === "admin" && (
          <button
              onClick={() => deleteHandler(course._id)}
              className="buttonSide"
              style={{ background: "red" }}
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
