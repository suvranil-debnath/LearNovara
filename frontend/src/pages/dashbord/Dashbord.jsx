import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./dashbord.css";
import { CourseData } from "../../context/CourseContext";
import RunningCourseCard from './RunningCourseCard';
import CalendarWithSchedule from "./CalendarWithSchedule";
import ToDoList from "./ToDoList"; // Import ToDoList
import { useParams } from "react-router-dom";

const Dashbord = () => {
  const { mycourse } = CourseData();
  const params = useParams();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="student-dashboard">
      <h2 className="dashboard-title">My Enrolled Courses</h2>
      <CalendarWithSchedule userId={params.id} />
      <ToDoList userId={params.id}/> 
      <div className="dashboard-content">        
        <div className="dashboard-runningcourse-card" data-aos="fade-up">
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
