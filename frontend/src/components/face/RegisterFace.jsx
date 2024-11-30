import React, { useState, useEffect } from "react";
import * as faceapi from "face-api.js";

const RegisterFace = ({ setFaceDescriptor }) => {
  const [status, setStatus] = useState("Place your face in front of the webcam.");
  const [isWebcamReady, setIsWebcamReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setIsWebcamReady(true);
      } catch (error) {
        setStatus("Failed to load face-api models.");
      }
    };

    loadModels();
  }, []);

  const handleFaceDetection = (videoElement) => {
    if (!videoElement) {
      setStatus("Please ensure the webcam is active.");
      return;
    }

    // Run detection in intervals to ensure consistent checks
    const interval = setInterval(async () => {
      const detection = await faceapi
        .detectSingleFace(videoElement)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        clearInterval(interval); // Stop interval on success
        setFaceDescriptor(detection.descriptor); // Pass descriptor
        setStatus("Face registered successfully!");
      } else {
        setStatus("No face detected. Ensure proper lighting and position.");
      }
    }, 1000); // Check every second
  };

  useEffect(() => {
    if (isWebcamReady) {
      const videoElement = document.querySelector("video");
      if (videoElement) {
        handleFaceDetection(videoElement);
      }

    }
  }, [isWebcamReady]);

  return (
    <div>
      <p>{status}</p>
    </div>
  );
};

export default RegisterFace;
