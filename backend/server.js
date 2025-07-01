const express = require("express");
const app = express();
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");

const corsOptions = {
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/download", async (req, res, next) => {
  const videoURL = req.query.url;

  console.log(videoURL, "STARTING DOWNLOAD...");

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid YouTube URL");
  }

  try {
    const timestamp = Date.now(); // Unique filename using timestamp
    const info = await ytdl.getInfo(videoURL);

    // // Set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${timestamp}.mp3"`
    );

    // Stream audio directly
    const audioStream = ytdl(videoURL, { filter: "audioonly" }).pipe(res);
    console.log("✅ Download finished");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to download audio");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
