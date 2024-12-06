import React, { useState } from "react";
import "./Liveclass.css";
import { server } from "../../main";

const Popup = ({ closeModal, user }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description } = formData;

    // Validate form inputs
    if (!title || !description) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Send data to the backend
      const response = await fetch(`${server}/api/liveclass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subjectName: title,
          description,
          tutorId: user._id, // Replace with actual tutor ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create live class");
      }

      const newClass = await response.json();

      // Show success message or perform any additional actions as needed
      alert(`Live class created successfully!`);

      // Close the modal
      closeModal();
    } catch (error) {
      console.error("Error creating live class:", error);
      alert("An error occurred while creating the live class. Please try again.");
    }
  };

  return (
    <>
      <div className="live-popup-wrapper" onClick={closeModal}></div>
      <div className="live-popup">
        <div className="live-popup-content">
          <h2>Create Live Class</h2>
          <form className="live-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Subject Title</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
            />

            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={formData.description}
              onChange={handleChange}
            />

            <div className="live-button">
              <button type="button" className="live-cancel-btn" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="live-create-btn">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Popup;
