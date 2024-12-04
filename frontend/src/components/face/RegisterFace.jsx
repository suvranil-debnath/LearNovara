import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { loadFaceApiModels } from "./faceApiLoader"; // Preloader utility

const RegisterFace = ({ setFaceDescriptor }) => {
  const [status, setStatus] = useState("Initializing...");
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      setStatus("Loading face detection models...");
      try {
        await loadFaceApiModels(); // Load models only on this page
        setStatus("Models loaded. Initializing webcam...");
        setIsWebcamReady(true);
      } catch (error) {
        setStatus("Error loading models. Please refresh and try again.");
        console.error(error);
      }
    };

    initialize();
  }, []);

  const handleFaceDetection = async (videoElement) => {
    if (!videoElement) {
      setStatus("Webcam not available.");
      return;
    }

    const interval = setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        clearInterval(interval); // Stop interval on success
        setFaceDescriptor(detection.descriptor);
        setStatus("Face registered successfully!");
      } else {
        setStatus("No face detected. Ensure proper lighting and position.");
      }
    }, 1000);
  };

  useEffect(() => {
    if (isWebcamReady) {
      const videoElement = document.querySelector("video");
      if (videoElement) handleFaceDetection(videoElement);
    }
  }, [isWebcamReady]);

  return (
    <div>
      <p>{status}</p>
    </div>
  );
};

export default RegisterFace;
