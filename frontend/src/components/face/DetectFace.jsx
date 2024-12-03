import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { UserData } from "../../context/UserContext";

const DetectFace = ({ setStreamRef }) => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Initializing...");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const intervalRef = useRef(null); // Ref for the interval

  const { loginWithFace, btnLoading } = UserData(); // Access context for face login

  useEffect(() => {
    const loadModels = async () => {
      try {
        setStatus("Loading models...");
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setIsModelLoaded(true);
        setStatus("Models loaded. Initializing video...");
      } catch (error) {
        setStatus("Error loading models. Please refresh and try again.");
        console.error("Error loading face-api models:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    const startVideo = async () => {
      try {
        if (!videoRef.current) return;
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStreamRef(stream); // Pass stream to parent component
        setStatus("Video feed started.");
      } catch (error) {
        setStatus("Unable to access camera. Please check permissions.");
        console.error("Error accessing camera:", error);
      }
    };

    startVideo();

    return () => {
      // Cleanup webcam on component unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setStreamRef(null); // Notify parent of cleanup
    };
  }, [videoRef, setStreamRef]);

  useEffect(() => {
    const authenticateUser = async () => {
      if (!videoRef.current || !isModelLoaded || btnLoading) return;
  
      setStatus("Detecting face...");
      intervalRef.current = setInterval(async () => {
        try {
          const detection = await faceapi
            .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options())
            .withFaceLandmarks()
            .withFaceDescriptor();
  
          if (detection) {
            clearInterval(intervalRef.current); // Stop interval on detection
            setStatus("Validating face...");
  
            try {
              await loginWithFace(Array.from(detection.descriptor)); // Pass descriptor
            } catch (error) {
              setStatus("Face login failed. Please try again.");
            }
          }
        } catch (error) {
          console.error("Face detection error:", error);
          setStatus("Error detecting face. Ensure proper lighting and camera angle.");
        }
      }, 1000);
    };
  
    authenticateUser();
  
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current); // Clear interval on component unmount
    };
  }, [isModelLoaded, btnLoading, loginWithFace]);
  

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
