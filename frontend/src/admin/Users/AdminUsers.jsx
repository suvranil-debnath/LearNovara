import React, { useEffect, useState } from "react";
import "./users.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.mainrole !== "superadmin") return navigate("/");

  const [users, setUsers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const updateRole = async (id) => {
    if (confirm("Are you sure you want to update this user's role?")) {
      try {
        const formData = new FormData();
        if (selectedImage) {
          formData.append("file", selectedImage);
        }

        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchUsers();
        setSelectedImage(null); // Reset selected image after update
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update role");
      }
    }
  };

  return (
    <Layout>
      <div className="users">
        <h1 className="title">User Management</h1>
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-upload-input"
                    />
                    <button
                      onClick={() => updateRole(user._id)}
                      className="update-btn"
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AdminUsers;
