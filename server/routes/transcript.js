import express from "express";
import { Innertube } from "youtubei.js"; // Adjusted to avoid web-specific import

const router = express.Router();

router.get('/youtube-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: "YouTube video URL is required." });
    }

    console.log("Fetching transcript for URL:", url);

    // Create YouTube instance
    const youtube = await Innertube.create({
      lang: "en",
      location: "US",
      retrieve_player: false,
    });

    console.log("YouTube instance created successfully.");

    // Fetch video info
    const videoInfo = await youtube.getInfo(url);
    console.log("Fetched video information:", videoInfo);

    // Check for transcript availability
    const transcriptData = await videoInfo.getTranscript();
    if (!transcriptData || !transcriptData.transcript || !transcriptData.transcript.content) {
      return res.status(404).json({ message: "Transcript not available for this video." });
    }

    // Parse transcript content
    const segments = transcriptData.transcript.content.body.initial_segments || [];
    const transcript = segments.map(segment => segment.snippet.text).join(" ");

    res.json({ transcript });
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    res.status(500).json({ message: "Failed to fetch YouTube transcript." });
  }
});

export default router;
