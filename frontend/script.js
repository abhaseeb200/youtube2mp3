const convertIntoMp3 = async (event) => {
  event.preventDefault();
  const youtubeUrl = document.getElementById("youtubeUrl").value.trim();
  const statusElement = document.getElementById("status");
  const loadingElement = document.getElementById("loading");
  const submitBtn = document.getElementById("submit-btn");

  if (!youtubeUrl) {
    statusElement.textContent = "Please enter a YouTube URL";
    return;
  }

  if (
    !youtubeUrl.includes("youtube.com/watch?v=") &&
    !youtubeUrl.includes("youtu.be/")
  ) {
    statusElement.textContent = "Please enter a valid YouTube URL";
    return;
  }

  loadingElement.style.display = "block";
  statusElement.textContent = "Processing...";
  submitBtn.disabled = "true";
  submitBtn.style.opacity = "0.7";

  try {
    const response = await fetch(
      `http://localhost:3000/formats?url=${encodeURIComponent(youtubeUrl)}`
    );
    const info = await response.json();

    const title = info.data.videoDetails.title;
    const thumbnail = info.data.videoDetails.thumbnails.pop().url;
    const formats = info.data.formats;

    const container = document.getElementById("resultContainer");
    container.innerHTML = "";

    const titleEl = document.createElement("h2");
    titleEl.textContent = title;

    const thumbImg = document.createElement("img");
    thumbImg.src = thumbnail;
    thumbImg.alt = title;
    thumbImg.style.width = "320px";

    container.appendChild(titleEl);
    container.appendChild(thumbImg);

    const filteredFormats = formats.filter(
      (f) => (f.hasAudio && f.hasVideo) || (f.hasAudio && !f.hasVideo)
    );

    filteredFormats.forEach((format) => {
      const formatEl = document.createElement("div");
      formatEl.style.margin = "10px 0";

      const label = document.createElement("span");
      label.textContent = format.hasVideo
        ? `🎬 Video+Audio (${format.qualityLabel}, ${format.container})`
        : `🎵 Audio Only (${format.audioBitrate}kbps, ${format.container})`;

      const btn = document.createElement("a");
      btn.textContent = "Download";
      btn.href = format.url;
      btn.target = "_blank";
      btn.className = "button";

      formatEl.appendChild(label);
      formatEl.appendChild(btn);
      container.appendChild(formatEl);

      statusElement.textContent = "Ready to download.";
    });
  } catch (error) {
    console.error("Error:", error);
    statusElement.textContent = "Failed to convert video, Please try again.";
  } finally {
    loadingElement.style.display = "none";
    submitBtn.disabled = "false";
    submitBtn.style.opacity = "1";
  }
};
