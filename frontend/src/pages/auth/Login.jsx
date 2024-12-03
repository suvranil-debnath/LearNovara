import React, { useState, useEffect, useRef } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import DetectFace from "../../components/face/DetectFace";

const Login = () => {
  const navigate = useNavigate();
  const { btnLoading, loginUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [useFaceLogin, setUseFaceLogin] = useState(false);
  const videoStreamRef = useRef(null); // Ref for the webcam stream

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(email, password, navigate);
  };

  const toggleLoginMode = () => {
    if (useFaceLogin && videoStreamRef.current) {
      // Stop webcam if switching away from face login
      const tracks = videoStreamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
    setUseFaceLogin(!useFaceLogin);
  };

  useEffect(() => {
    return () => {
      // Cleanup webcam on component unmount
      if (videoStreamRef.current) {
        const tracks = videoStreamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login</h2>

        {!useFaceLogin ? (
          <form onSubmit={submitHandler}>
            <input
              type="email"
              placeholder="Email"
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
            <button disabled={btnLoading} type="submit" className="common-btn">
              {btnLoading ? "Please Wait..." : "Login"}
            </button>
          </form>
        ) : (
          <div className="webcam-container">
            <h3>Login with Face</h3>
            <DetectFace setStreamRef={(stream) => (videoStreamRef.current = stream)} />
          </div>
        )}

        <div className="switch-login-mode">
          <button type="button" onClick={toggleLoginMode} className="common-btn">
            {useFaceLogin ? "Use Email/Password" : "Use Face Login"}
          </button>
        </div>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <p>
          <Link to="/forgot">Forgot password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
