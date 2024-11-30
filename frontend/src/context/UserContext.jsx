import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../main";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
        password,
      });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
    } catch (error) {
      setBtnLoading(false);
      setIsAuth(false);
      toast.error(error.response.data.message);
    }
  }

  async function registerUser(name, email, password, faceDescriptor, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
        faceDescriptor,
      });

      toast.success(data.message);
      localStorage.setItem("activationToken", data.activationToken);
      localStorage.setItem("faceDescriptor", JSON.stringify(faceDescriptor));
      setBtnLoading(false);
      navigate("/verify");
    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    const faceDescriptor = localStorage.getItem("faceDescriptor");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
        faceDescriptor,
      });

      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setIsAuth(true);
      setUser(data.user);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const stopWebcam = () => {
    const video = document.querySelector("video");
    if (video && video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };
  async function loginWithFace(descriptor) {
    setBtnLoading(true);
    try {
      const response = await axios.post(`${server}/api/user/login/face`, {
        descriptor,
      });
  
      if (response.data) {
        const { token, message } = response.data;
        toast.success(message || "Login successful!");
        localStorage.setItem("token", token);
        await fetchUser(); // Fetch and update the user data
        setIsAuth(true);
        stopWebcam(); // Stop the webcam after successful login
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Face login error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          "An error occurred during face login. Please try again."
      );
    } finally {
      setBtnLoading(false);
    }
  }
  

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        btnLoading,
        loading,
        registerUser,
        verifyOtp,
        fetchUser,
        loginWithFace,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
