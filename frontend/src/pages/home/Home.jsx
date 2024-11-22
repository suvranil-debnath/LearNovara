import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import { FiSearch } from "react-icons/fi";
import introImage from './intro-image.png';
import Typed from 'typed.js';
import Faq from '../../components/FAQ/Faq';
import Footer from '../../components/footer/Footer';
import Course from '../../components/ccourses/Course';
import Review from '../../components/review/Review';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles
import TutorsPage from "../../components/tutor/TutorPage";


const Home = () => {
    const el = useRef(null);

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

    const navigate = useNavigate();
    return (
        <>
            <div className='row bar' data-aos="fade">
                <div className="col-lg-5 col-md-9 col-sm-12 search-bar">
                    <input type="text" placeholder="Search Courses" />
                    <button type="submit"><FiSearch className='search-icon'/></button>
                </div>
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
                <TutorsPage/>
                <Review />
                <Faq />
                <Footer />
        </>
    );
};

export default Home;
