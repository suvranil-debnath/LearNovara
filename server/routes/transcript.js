// routes/transcript.js
import express from "express";
import { YoutubeTranscript } from 'youtube-transcript'
const router = express.Router();

router.get('/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const formattedTranscript = transcript.map((item) => item.text).join(' ');
    res.json({ transcript: formattedTranscript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).json({ message: 'Error fetching transcript' });
  }
});

export default router;
