import React from "react";
import "./dashbord.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";

const Dashbord = () => {
  const { mycourse } = CourseData();
  return (
    <div className="student-dashboard">
      <h2 className="dashboard-title">My Enrolled Courses</h2>
      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((course) => <CourseCard key={course._id} course={course} />)
        ) : (
          <p className="no-courses">You haven’t enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};
export default Dashbord;
