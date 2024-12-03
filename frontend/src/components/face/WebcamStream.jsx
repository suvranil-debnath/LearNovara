import React, { useEffect } from "react";

const WebcamStream = ({ setStream }) => {
  useEffect(() => {
    const videoElement = document.querySelector("video");
    let stream;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        setStream(stream); // Pass the stream to parent component
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    startWebcam();

    // Cleanup function to stop the webcam when component unmounts
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [setStream]);

  return <video width="100%" style={{
    maxWidth: "200px",
    maxHeight: "150px",
    borderRadius: "10px",
    border: "2px solid #ccc",
  }}
  autoPlay muted />;
};

export default WebcamStream;
