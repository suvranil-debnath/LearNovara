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
  const imgplaceholder = "https://avatar.iran.liara.run/public/46";

  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };
  return (
    <div className="account-container">
      {user && (
        <div className="profile-card-large">
          <div className="profile-header">
            <div className="avatar">
              <img
                src={imgplaceholder}
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
            <h3>{user.name}</h3>
            <p className="email">{user.email}</p>
          </div>
          <div className="profile-actions">
          <button
              onClick={() => navigate(`/dashboard/${user._id}`)}
              className="com-btn"
            >
              <MdDashboard />
              Dashboard
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="com-btn admin-btn"
              >
                <MdDashboard />
                Admin Dashboard
              </button>
            )}
            {user.role === "tutor" && (
              <button
                onClick={() => navigate(`/tutor/course`)}
                className="com-btn admin-btn"
              >
                <MdOutlineCreateNewFolder />
                Create Course
              </button>
            )}
            <button
              onClick={logoutHandler}
              className="com-btn logout-btn"
            >
              <IoMdLogOut />
              Logout
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <EditProfileForm
          user={user}
          closeHandler={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default Account;
