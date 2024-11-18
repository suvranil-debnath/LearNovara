import React from "react";
import { MdDashboard , MdOutlineCreateNewFolder } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
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
        <div className="profile">
          <h2>My Profile</h2>
          <div className="profile-info">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            </div>
            <div>
            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
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
                onClick={() => navigate(`/admin/course`)}
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
    </div>
  );
};

export default Account;
