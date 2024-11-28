import React, { useState } from "react";
import "./editProfileForm.css";

const EditProfileForm = ({ user, closeHandler }) => {
  // Developer-controlled field visibility
  const fieldVisibility = {
    name: true,
  };

  // Form data state
  const [formData, setFormData] = useState(user);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form data
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User Data:", formData);
    closeHandler();
  };

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(user).map(
            (key) =>
              fieldVisibility[key] && ( // Only render visible fields
                <div className="form-group" key={key}>
                  <label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                  />
                </div>
              )
          )}
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
        <button onClick={closeHandler} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default EditProfileForm;
