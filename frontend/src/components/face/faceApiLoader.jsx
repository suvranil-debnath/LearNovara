import * as faceapi from "face-api.js";

let modelsLoaded = false;

export const loadFaceApiModels = async () => {
  if (modelsLoaded) return; // Prevent redundant loading

  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    ]);
    modelsLoaded = true;
    console.log("Face-api.js models loaded successfully.");
  } catch (error) {
    console.error("Error loading face-api models:", error);
    throw new Error("Failed to load face-api models.");
  }
};
