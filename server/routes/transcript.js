import express from "express";
import { Innertube } from "youtubei.js/web"; // Ensure youtubei.js is installed and imported properly

const router = express.Router();

router.get('/youtube-proxy', async (req, res) => {
  try {
    const { url } = req.query; // Get video URL from query parameters

    if (!url) {
      return res.status(400).json({ message: "YouTube video URL is required." });
    }

    // Create YouTube instance
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    // Fetch the video info
    const info = await youtube.getInfo(url);

    // Check if transcript data is available
    const transcriptData = await info.getTranscript();
    if (!transcriptData || !transcriptData.transcript.content.body.initial_segments) {
      return res.status(404).json({ message: "Transcript not available for this video." });
    }

    // Extract transcript
    const transcript = transcriptData.transcript.content.body.initial_segments
      .map((segment) => segment.snippet.text)
      .join(" ");

    // Send the transcript back as a response
    res.json({ transcript });
  } catch (error) {
    console.error("Error fetching transcript:", error);

    if (error.response && error.response.status === 403) {
      res.status(403).json({ message: "Access to the video is restricted." });
    } else {
      res.status(500).json({ message: "An error occurred while fetching YouTube data." });
    }
  }
});

export default router;
