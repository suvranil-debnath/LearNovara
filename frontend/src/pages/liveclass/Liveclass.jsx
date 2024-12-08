import React, { useState, useEffect } from "react";
import { server } from "../../main";
import Popup from "./Popup";
import "./Liveclasscard.css";
import axios from "axios";
import AOS from "aos"; // Import AOS library
import "aos/dist/aos.css"; // Import AOS styles

const Liveclass = ({ user }) => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  // Initialize AOS and fetch subjects
  useEffect(() => {
    AOS.init(); // Initialize AOS
    const fetchLiveClasses = async () => {
      try {
        const response = await axios.get(`${server}/api/liveclasses`);
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching live classes:", error);
      }
    };

    fetchLiveClasses();
  }, []);

  const handleJoin = (link) => {
    // Open the Google Meet link
    window.open(link, "_blank");
  };

  const handleShare = (link) => {
    // Copy the link to clipboard and notify the user
    navigator.clipboard.writeText(link);
    alert("Meeting link copied to clipboard!");
  };

  return (
    <>
      <div className="live-link_card">
        {subjects.map((subject) => (
          <div
            key={subject._id}
            className="live-teacher_card"
            data-aos="fade-up" // AOS Animation
            data-aos-duration="1000" // Animation duration
          >
            <div className="live-card-image" data-aos="zoom-in">
              <img
                src={subject.tutorProfilePic || "default-profile.png"}
                alt={`${subject.tutorId?.name || "Tutor"}'s profile`}
              />
            </div>
            <div className="live-card-content" data-aos="fade-right">
              <div className="live-text-content">
                <h3 className="live-name">{subject.tutorId?.name}</h3>
                <span className="live-subject"> Subject : {subject.subjectName}</span>
                <p className="live-description"> Description : {subject.description}</p>
              </div>
              <div className="live-join_share" data-aos="fade-left">
                <button
                  className="live-join_button"
                  onClick={() => handleJoin(subject.gmeetLink)}
                >
                  Join
                </button>
                <button
                  className="live-share_button"
                  onClick={() => handleShare(subject.gmeetLink)}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {user.role === "tutor" && (
        <div
          className="live-create-class"
          data-aos="fade-up" // AOS Animation
          data-aos-delay="200" // Add delay to the animation
        >
          <button
            type="button"
            className="live-class-create-btn"
            onClick={() => setShowModal(true)}
          >
            Create Live
          </button>
          {showModal && <Popup closeModal={closeModal} user={user} />}
        </div>
      )}
    </>
  );
};

export default Liveclass;
