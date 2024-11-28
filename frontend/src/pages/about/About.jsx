import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
import "./about.css";
import std from './std.png';
import teach from './teach.png';
import why from './why.png';

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true,     // Whether animation should happen only once
    });
  }, []);

  return (
    <div className="about">
      <div className="about-content" data-aos="fade-up">
        <p>
          Welcome to <strong className="title-logo">LearNovara</strong>, the ultimate destination for online learning and teaching. Our platform is designed to bring students and educators together in a dynamic, flexible, and innovative digital environment. Whether you're here to learn a new skill, share your expertise, or explore endless opportunities, LearNovara has something for everyone.
        </p>
      </div>
      
      <div className="about-students" data-aos="fade-right">
        <div className="about-text">
          <h3>For Students</h3>
          <ul>
            <li>Unlock your potential with courses that inspire and empower.</li>
            <li>Access a wide range of topics taught by top-tier tutors.</li>
            <li>Learn at your own pace, anytime and anywhere.</li>
            <li>Connect with a global community of like-minded learners.</li>
          </ul>
        </div>
        <div className="about-icon about-icon-student">
          <img src={std} alt="Student" className="about-image" />
        </div>
      </div>
      
      <div className="about-tutors" data-aos="fade-left">
        <div className="about-text">
          <h3>For Tutors</h3>
          <ul>
            <li>Share your knowledge with learners worldwide.</li>
            <li>Create and manage courses with intuitive tools.</li>
            <li>Host interactive live classes in real-time.</li>
            <li>Build your brand and grow professionally as an educator.</li>
          </ul>
        </div>
        <div className="about-icon about-icon-tutor">
          <img src={teach} alt="Tutor" className="about-image" />
        </div>
      </div>

      <div className="about-vision" data-aos="fade-up">
        <div className="about-icon about-icon-vision">
          <img src={why} alt="Vision" className="about-image" />
        </div>
        <div className="about-text">
          <h3>Why Choose LearNovara?</h3>
          <p>
            At <strong>LearNovara</strong>, we believe education is about more than just knowledge transfer—it's about building connections, fostering creativity, and empowering everyone to thrive. Our mission is to redefine education by offering a platform that is as flexible as it is comprehensive.
          </p>
          <p>
            Whether you’re here to teach, learn, or explore, the opportunities are limitless. Join us and be a part of the future of education.
          </p>
          <p><strong>Discover. Learn. Grow. With LearNovara.</strong></p>
        </div>
      </div>
    </div>
  );
};

export default About;
