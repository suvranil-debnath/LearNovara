import React, { useState, useEffect } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import AOS from "aos";
import "aos/dist/aos.css";

const Courses = () => {
  const { courses } = CourseData();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    if (courses) {
      const uniqueCategories = ["All", ...new Set(courses.map((e) => e.category))];
      setCategories(uniqueCategories);
      setFilteredCourses(courses);
    }
  }, [courses]);

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with animation duration
  }, []);

  const filterHandler = () => {
    let filtered = courses;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((course) => course.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOption) {
      filtered = [...filtered].sort((a, b) => {
        if (sortOption === "price-low") return a.price - b.price;
        if (sortOption === "price-high") return b.price - a.price;
        if (sortOption === "name-asc") return a.title.localeCompare(b.title);
        if (sortOption === "name-desc") return b.title.localeCompare(a.title);
        return 0;
      });
    }

    setFilteredCourses(filtered);
  };

  useEffect(() => {
    filterHandler();
  }, [selectedCategory, searchTerm, sortOption]);

  return (
    <div className="courses-page">
      <h2 className="courses-heading">Explore Our Courses</h2>

      {/* Filter Section */}
      <div className="filter-section" data-aos="fade-up">
        <input
          type="text"
          placeholder="Search courses..."
          className="course-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="sort-filter"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Courses Section */}
      <div className="course-container">
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course._id} data-aos="zoom-in">
              <CourseCard course={course} />
            </div>
          ))
        ) : (
          <p className="no-courses">No Courses Found!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
