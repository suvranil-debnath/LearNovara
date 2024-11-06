import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./dashboard.css";
import { FaChalkboardTeacher, FaVideo, FaUsers } from "react-icons/fa"; // icons for dashboard stats

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0,
  });

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="main-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="stats-grid">
          <div className="box">
            <FaChalkboardTeacher className="icon" />
            <p>Total Courses</p>
            <p className="stat-value">{stats.totalCourses}</p>
          </div>
          <div className="box">
            <FaVideo className="icon" />
            <p>Total Lectures</p>
            <p className="stat-value">{stats.totalLectures}</p>
          </div>
          <div className="box">
            <FaUsers className="icon" />
            <p>Total Users</p>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
