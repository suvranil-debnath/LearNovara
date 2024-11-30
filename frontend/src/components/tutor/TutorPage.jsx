import React, { useEffect, useState } from "react";
import "./TutorsPage.css"; // Import the CSS file for styling
import { server } from "../../main"; // Adjust the path as per your project structure
import axios from "axios";
import toast from "react-hot-toast";
import img from "./tutor.jpg";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const TutorsPage = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTutors = async () => {
        try {
        const { data } = await axios.get(`${server}/api/tutors`, {
            headers: {
            token: localStorage.getItem("token"),
            },
        });

        const fetchedTutors = data.tutors.map((tutor) => ({
            name: tutor.userid?.name || "No Name Available",
            image: tutor.profilepic ? `${tutor.profilepic}` : img,
        }));

        setTutors(fetchedTutors);
        setLoading(false);
        } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message || "Failed to load tutors.");
        }
    };

    useEffect(() => {
        fetchTutors();
        AOS.init({
        duration: 800, // Animation duration
        offset: 200, // Offset to trigger animation
        delay: 100, // Delay before animation starts
        once: true, // Only animate once
        });
    }, []);

    if (loading) {
        return <div className="loading">Loading Tutors...</div>;
    }

    return (
        <div className="tutors-page" data-aos="fade">
        {/* Header Section */}
        <div className="header-section">
            <h1>Meet Our Popular Tutors</h1>
            <p>
            Want someone to instruct you? No worries. Here we introduce our
            CourseMania’s online tutors to assist & guide you in your professional
            path.
            </p>
            <button className="explore-btn">Explore</button>
        </div>

        {/* Grid of Tutor Cards */}
        <div className="tutors-grid">
            {tutors.length > 0 ? (
            tutors.map((tutor, index) => (
                <div
                className="tutorcard"
                key={index}
                data-aos="fade-up"
                data-aos-delay={`${index * 100}`} // Different delay for each card
                >
                <div className="tutor-image-container">
                    <img
                    src={tutor.image}
                    alt={tutor.name || "Tutor"}
                    className="tutor-image"
                    />
                    <div className="tutor-name">
                    <span>{tutor.name || "No Name Available"}</span>
                    </div>
                </div>
                </div>
            ))
            ) : (
            <p>No tutors available at the moment.</p>
            )}
        </div>

        {/* Find a Tutor Button */}
        <button className="find-tutor-btn">Find A Tutor</button>
        </div>
    );
};

export default TutorsPage;
