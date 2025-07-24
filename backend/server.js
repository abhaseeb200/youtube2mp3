const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

// To used this you need to install the ffmpeg in your system
// and configure the environment variable
ffmpeg.setFfmpegPath(ffmpegPath);

const corsOptions = {
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// USE CASE:
// This endpoint will receive a YouTube video URL and return the available formats
app.get("/formats", async (req, res) => {
  const videoURL = req.query.url;

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    res.status(200).json({ data: info });
  } catch (error) {
    res.status(500).send(error);
  }
});

// USE CASE:
// This endpoint will receive the video URL and format from the frontend
// and will return the video file as a response
// ISSUE: files are not being downloading properly, they needs to be fixed in future.
app.post("/downloader", async (req, res) => {
  const url = req.body.url;
  const format = req.body.formats[0];

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title
      .replace(/[^\w\s]/gi, "")
      .substring(0, 50);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${title}.${format.container}"`
    );

    ytdl.downloadFromInfo(info, { format: format }).pipe(res);
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).send("Failed to download video");
  }
});

// USE CASE:
// Directly download a video or audio file from YouTube
// and Options are mp4, mp3 passed as query parameters
// and ffmpeg is used to convert the video to mp3 if requested
app.get("/download", async (req, res) => {
  const videoURL = req.query.url;
  const format = req.query.format || "mp3";

  if (!ytdl.validateURL(videoURL)) {
    return res.status(400).send("Invalid YouTube URL");
  }

  try {
    const info = await ytdl.getInfo(videoURL);
    const title = info.videoDetails.title
      .replace(/[^\w\s]/gi, "")
      .substring(0, 50);

    if (format === "mp4") {
      const fileName = `${title}.mp4`;

      const format = ytdl.chooseFormat(info.formats, {
        filter: "videoandaudio",
      });
      console.log(format);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", "video/mp4");

      ytdl.downloadFromInfo(info, { format: format }).pipe(res);
    } else if (format === "mp3") {
      const outputFileName = `${title}.mp3`;

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${outputFileName}"`
      );
      res.setHeader("Content-Type", "audio/mpeg");

      const stream = ytdl(videoURL, { quality: "highestaudio" });

      ffmpeg(stream)
        .audioBitrate(128)
        .format("mp3")
        .on("error", (err) => {
          console.error("FFmpeg error:", err.message);
          res.status(500).send("Error converting video to MP3");
        })
        .on("end", () => {
          res.status(200).json({
            message: "Conversion finished successfully",
          });
        })
        .pipe(res, { end: true });
    } else {
      return res.status(400).send("Unsupported format Use 'mp3' or 'mp4'");
    }
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).send("Failed to download video");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
