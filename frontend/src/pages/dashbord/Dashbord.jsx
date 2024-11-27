import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./dashbord.css";
import { CourseData } from "../../context/CourseContext";
import RunningCourseCard from './RunningCourseCard';
import CalendarWithSchedule from "./CalendarWithSchedule";
import ToDoList from "./ToDoList";
import { useParams } from "react-router-dom";
import { FaArrowRight , FaArrowLeft } from "react-icons/fa";

const Dashbord = () => {
  const { mycourse } = CourseData();
  const params = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="student-dashboard">
      {/* Sidebar */}
      <div className={`side-tools ${sidebarOpen ? "open" : ""}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarOpen ?<FaArrowLeft/> : <FaArrowRight /> }
        </button>
        <div className="tools-content">
          <ToDoList userId={params.id} />
          <CalendarWithSchedule userId={params.id} />
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="dashboard-runningcourse-card" data-aos="fade-up">
          <h2 className="dashboard-title">My Enrolled Courses</h2>
          {mycourse && mycourse.length > 0 ? (
            mycourse.map((course) => (
              <div key={course._id}>
                <RunningCourseCard course={course} />
              </div>
            ))
          ) : (
            <p className="no-courses">You haven’t enrolled in any courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashbord;
