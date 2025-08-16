# YouTube Downloader

A simple web app to convert and download YouTube videos as MP3 or MP4 files.

## Demo
![qZxQgC](https://github.com/user-attachments/assets/e0c50342-08d9-4a3f-bc6a-4f2e166876b3)

![ddMNfs](https://github.com/user-attachments/assets/6b62bfb4-203a-4760-bb24-34c2f43ef17f)

## Features
- Paste a YouTube URL and get video info instantly
- Download as MP3 (audio) or MP4 (video+audio)
- Fast, server-side conversion using Node.js, Express, ytdl-core, and ffmpeg
- Clean, modern UI (desktop only)

## Requirements
- Node.js
- ffmpeg (must be installed and available in your system PATH)

## How to Use
1. Start the backend server:
   ```sh
   cd backend
   npm install
   node server.js
   ```
2. Open `frontend/index.html` in your browser
3. Paste a YouTube link and click Download
4. Choose your format and download

## Notes
- **Mobile responsiveness is NOT supported.**
- For best results, use on desktop browsers.
- For any issues with downloads, check your ffmpeg installation.

---
**For educational/demo use only.**
