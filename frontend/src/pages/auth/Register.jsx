import React, { useState, useEffect } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import WebcamStream from "../../components/face/WebcamStream";
import RegisterFace from "../../components/face/RegisterFace";

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [faceDescriptor, setFaceDescriptor] = useState(null);
  const [isFaceRegisterEnabled, setIsFaceRegisterEnabled] = useState(false);
  const [stream, setStream] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    await registerUser(name, email, password, faceDescriptor, navigate);
  };

  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleFaceRegisterChange = (e) => {
    setIsFaceRegisterEnabled(e.target.checked);

    if (!e.target.checked && stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Register</h2>
        <form onSubmit={submitHandler}>
          <input
            placeholder="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="face-register-toggle">
            <label className="switch">
              <input
                type="checkbox"
                checked={isFaceRegisterEnabled}
                onChange={handleFaceRegisterChange}
              />
              <span className="slider round"></span>
            </label>
            <span>Register with Face</span>
          </div>

          {isFaceRegisterEnabled && (
            <div className="webcam-container">
              <WebcamStream setStream={setStream} />
              <RegisterFace setFaceDescriptor={setFaceDescriptor} />
            </div>
          )}

          <button type="submit" disabled={btnLoading} className="common-btn">
            {btnLoading ? "Please Wait..." : "Register"}
          </button>
        </form>
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
