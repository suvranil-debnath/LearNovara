import React, { useEffect, useState } from "react";
import "./TutorsPage.css";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";

const TutorsPage = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTutors, setFilteredTutors] = useState([]);

  const fetchTutors = async () => {
    try {
      const { data } = await axios.get(`${server}/api/tutors`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      const fetchedTutors = data.tutors.map((tutor) => ({
        name: tutor.userid?.name || "No Name Available",
        image: tutor.profilepic || "https://via.placeholder.com/150",
        courses: tutor.createdcourses || [],
      }));

      setTutors(fetchedTutors);
      setFilteredTutors(fetchedTutors);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to load tutors.");
    }
  };

  useEffect(() => {
    fetchTutors();
    AOS.init(); // Initialize AOS
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const results = tutors.filter((tutor) => {
      const tutorName = tutor.name.toLowerCase();
      const courses = tutor.courses.map((course) =>
        (course.title || "Untitled Course").toLowerCase()
      );
      return (
        tutorName.includes(value) || courses.some((course) => course.includes(value))
      );
    });

    setFilteredTutors(results);
  };

  if (loading) {
    return <div className="tutors-loading">Loading Tutors...</div>;
  }

  return (
    <div className="tutors-page-container">
      {/* Header with Title and Search Bar */}
      <div className="tutors-header" data-aos="fade-down">
        <h1 className="tutors-page-title">Our Talented Tutors</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tutors by name or course..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            aria-label="Search Tutors"
          />
        </div>
      </div>

      {/* Tutors Card Container */}
      <div className="tutors-card-container"  data-aos="fade-up">
        {filteredTutors.length > 0 ? (
          filteredTutors.map((tutor, index) => (
            <div
              className="tutor-horizontal-card"
              key={index}
             
            >
              <div className="tutor-card-image-container">
                <img
                  src={tutor.image}
                  alt={`Profile of ${tutor.name}`}
                  className="tutor-card-image"
                />
              </div>
              <div className="tutor-card-content">
                <h2 className="tutor-card-name">{tutor.name}</h2>
              </div>
              <div className="tutor-card-courses">
                <h3 className="tutor-card-course-title">Created Courses:</h3>
                <ul className="tutor-card-course-list">
                  {tutor.courses.length > 0 ? (
                    tutor.courses.map((course, idx) => (
                      <li key={idx} className="tutor-card-course-item">
                        {course.title || "Untitled Course"}
                      </li>
                    ))
                  ) : (
                    <p className="tutor-card-no-course">No courses available.</p>
                  )}
                </ul>
              </div>
            </div>
          ))
        ) : (
          <p className="tutors-no-data">No tutors available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default TutorsPage;
