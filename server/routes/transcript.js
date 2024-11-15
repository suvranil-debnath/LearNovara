import express from "express";
import axios from "axios";  // Ensure axios is imported
import { Innertube } from "youtubei.js/web";  // Ensure youtubei.js is imported

const router = express.Router();

router.get('/youtube-proxy', async (req, res) => {
  try {
    const { url } = req.query;  // Get videoId from query parameters

    // Create YouTube instance
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    // Fetch the video info
    const info = await youtube.getInfo(url);

    // Get the transcript
    const transcriptData = await info.getTranscript();
    const transcript = transcriptData.transcript.content.body.initial_segments
      .map((segment) => segment.snippet.text)
      .join(" ");

    // Send the transcript back as a response
    res.json({ transcript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).json({ message: "Error fetching YouTube data" });
  }
});

export default router;
