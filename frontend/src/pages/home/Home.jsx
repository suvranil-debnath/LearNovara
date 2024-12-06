import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { FiSearch } from "react-icons/fi";
import introImage from './intro-image.png';
import Typed from 'typed.js';
import Course from "../../components/ccourses/Course"
import Faq from '../../components/FAQ/Faq';
import Footer from '../../components/footer/Footer';
import Review from '../../components/review/Review';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import TutorsPage from "../../components/tutor/TutorPage";
import Chat from "../../components/Chat/Chat";
import { CourseData } from "../../context/CourseContext";

const Home = () => {
    const el = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const { courses } = CourseData(); // Access courses from context

    useEffect(() => {
        // Initialize Typed.js animation
        const typed = new Typed(el.current, {
            strings: ['<h2>Hi! Welcome to <span>L</span>ear<span>N</span>ovara</h2>'],
            typeSpeed: 50,
        });

        // Initialize AOS
        AOS.init({
            duration: 800,  // Animation duration in milliseconds
            once: true,      // Whether animation should happen only once
        });

        return () => {
            typed.destroy(); // Cleanup Typed instance
        };
    }, []);

    useEffect(() => {
        // Filter courses based on search query
        if (searchQuery) {
            const results = courses.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCourses(results);
        } else {
            setFilteredCourses([]);
        }
    }, [searchQuery, courses]);

    const navigate = useNavigate();

    const handleCourseClick = (id) => {
        navigate(`/course/${id}`); // Navigate to the selected course page
    };

    return (
        <>
                <div className="col-lg-5 col-md-9 col-sm-9 search-bar "  data-aos="fade">
                    <input
                        type="text"
                        placeholder="Search Courses"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit"><FiSearch className='search-icon' /></button>
                
                    {/* Search Results */}
                    {filteredCourses.length > 0 && (
                        <div className="search-results">
                            <ul>
                                {filteredCourses.map(course => (
                                    <li
                                        key={course._id}
                                        onClick={() => handleCourseClick(course._id)}
                                        className="search-result-item"
                                    >
                                        {course.title}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
    

            <div className="row intro-section">
                <div className="col-lg-5 col-md-7 col-sm-12 intro-text">
                    <h3 ref={el}></h3>
                </div>

                <div className="col-lg-7 col-md-12 col-sm-12 intro-image" data-aos="fade-left">
                    <img src={introImage} alt="Intro" />
                </div>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
                <Course />
            </div>
            <TutorsPage />
            <Review />
            <Faq />
            <Footer />
            <Chat />
        </>
    );
};

export default Home;
