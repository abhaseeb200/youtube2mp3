const convertIntoMp3 = async (event) => {
  event.preventDefault();
  const youtubeUrl = document.getElementById("youtubeUrl").value.trim();
  const statusElement = document.getElementById("status");
  const loadingElement = document.getElementById("loading");
  const submitBtn = document.getElementById("submit-btn");

  statusElement.style.display = "block";

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

  statusElement.appendChild(loadingElement);

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

    // Title and Thumbnail wrapper
    const titleThumbWrapper = document.createElement("div");
    titleThumbWrapper.className = "title-with-thumbnail";

    // Inner wrapper for text content
    const textContentWrapper = document.createElement("div");
    textContentWrapper.className = "video-meta";

    const titleEl = document.createElement("h2");
    titleEl.textContent = title;

    const descriptionEl = document.createElement("p");
    descriptionEl.textContent = info.data.videoDetails.description;
    descriptionEl.className = "description";

    const channelEl = document.createElement("p");
    channelEl.innerHTML = `<b>Channel: </b> ${info.data.videoDetails.author.name}`;
    
    const thumbImg = document.createElement("img");
    thumbImg.src = thumbnail;
    thumbImg.alt = title;

    // Append text content to inner wrapper
    textContentWrapper.appendChild(channelEl);
    textContentWrapper.appendChild(titleEl);
    textContentWrapper.appendChild(descriptionEl);

    // Append image and text wrapper to outer wrapper
    titleThumbWrapper.appendChild(thumbImg);
    titleThumbWrapper.appendChild(textContentWrapper);

    container.appendChild(titleThumbWrapper);

    // Downloader wrapper
    const downloaderWrapper = document.createElement("div");
    downloaderWrapper.className = "downloader-wrapper";

    const filteredFormats = formats.filter(
      (f) => (f.hasAudio && f.hasVideo) || (f.hasAudio && !f.hasVideo)
    );

    filteredFormats.forEach((format) => {
      const downloader = document.createElement("div");
      downloader.className = "downloader";

      const label = document.createElement("span");
      label.textContent = format.hasVideo
        ? `🎬 Video+Audio (${format.qualityLabel}, ${format.container})`
        : `🎵 Audio Only (${format.audioBitrate}kbps, ${format.container})`;

      const btn = document.createElement("a");
      btn.textContent = "Download";
      btn.href = format.url;
      btn.target = "_blank";
      btn.className = "button";

      downloader.appendChild(label);
      downloader.appendChild(btn);
      downloaderWrapper.appendChild(downloader);
    });

    // Append all downloaders at once
    container.appendChild(downloaderWrapper);
    statusElement.textContent = "Ready to download.";
  } catch (error) {
    console.error("Error:", error);
    statusElement.textContent = "Failed to convert video, Please try again.";
  } finally {
    loadingElement.style.display = "none";
    submitBtn.disabled = "false";
    submitBtn.style.opacity = "1";
  }
};
