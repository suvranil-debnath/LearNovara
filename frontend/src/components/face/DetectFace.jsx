import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { UserData } from "../../context/UserContext";
import { loadFaceApiModels } from "./faceApiLoader"; // Lazy-loading utility

const DetectFace = ({ setStreamRef }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const intervalRef = useRef(null); // Ref for the interval

  const { loginWithFace, btnLoading } = UserData(); // Access context for face login

  useEffect(() => {
    const initialize = async () => {
      setStatus("Loading models...");
      try {
        await loadFaceApiModels(); // Lazy-load models
        setStatus("Models loaded. Initializing webcam...");
        await startVideo(); // Initialize webcam after models are loaded
      } catch (error) {
        setStatus("Error loading models. Please refresh and try again.");
        console.error("Error loading face-api models:", error);
      }
    };

    initialize();

    return () => {
      cleanupVideoStream(); // Cleanup webcam on unmount
    };
  }, []);

  const startVideo = async () => {
    try {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStreamRef(stream); // Pass stream to parent component
      setStatus("Video feed started. Detecting face...");
      detectFace(); // Start face detection once video starts
    } catch (error) {
      setStatus("Unable to access camera. Please check permissions.");
      console.error("Error accessing camera:", error);
    }
  };

  const cleanupVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamRef(null); // Notify parent of cleanup
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear detection interval
  };

  const detectFace = () => {
    intervalRef.current = setInterval(async () => {
      try {
        if (!videoRef.current || btnLoading) return;

        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (detection) {
          clearInterval(intervalRef.current); // Stop detection interval on success
          setStatus("Validating face...");

          try {
            await loginWithFace(Array.from(detection.descriptor)); // Pass descriptor to context
            setStatus("Face login successful!");
          } catch (error) {
            setStatus("Face login failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Face detection error:", error);
        setStatus("Error detecting face. Ensure proper lighting and camera angle.");
      }
    }, 1000); // Detect every second
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{
          maxWidth: "200px",
          maxHeight: "150px",
          borderRadius: "10px",
          border: "2px solid #ccc",
        }}
      />
      <p>{status}</p>
    </div>
  );
};

export default DetectFace;
