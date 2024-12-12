import React, { useState } from "react";
import { IoMdCreate } from "react-icons/io";
import { MdDashboard, MdOutlineCreateNewFolder } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import "./account.css";
import EditProfileForm from "./EditProfileForm";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";




 const Account = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user); // Keep a local state for the user

  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  // Update user state after profile edit
  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  return (
    <div className="account-container">
      {currentUser && (
        <div className="profile-card-large">
          <div className="profile-header">
            <div className="avatar">
              <img
                src="https://avatar.iran.liara.run/public/46"
                alt="Profile Avatar"
                className="profile-image"
              />
            </div>
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              title="Edit Profile"
            >
              <IoMdCreate />
            </button>
          </div>
          <div className="profile-details">
            <h3>{currentUser.name}</h3>
            <p className="email">{currentUser.email}</p>
          </div>
          <div className="profile-actions">
            <button
              onClick={() => navigate(`/dashboard/${currentUser._id}`)}
              className="com-btn"
            >
              <MdDashboard />
              Dashboard
            </button>
            {currentUser.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="com-btn admin-btn"
              >
                <MdDashboard />
                Admin Dashboard
              </button>
            )}
            {currentUser.role === "tutor" && (
              <button
                onClick={() => navigate(`/tutor/course`)}
                className="com-btn admin-btn"
              >
                <MdOutlineCreateNewFolder />
                Create Course
              </button>
            )}
            <button onClick={logoutHandler} className="com-btn logout-btn">
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <EditProfileForm
          user={currentUser}
          closeHandler={() => setIsEditing(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Account;
