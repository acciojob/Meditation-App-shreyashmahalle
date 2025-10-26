//your JS code here. If required.
const video = document.querySelector(".vid-container video");
const audio = document.querySelector(".player-container audio");
const playBtn = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const timeButtons = document.querySelectorAll(".time-select button");
const soundButtons = document.querySelectorAll(".sound-picker button");

let fakeDuration = 600; // 10 minutes default

// Play/Pause functionality
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    video.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    video.pause();
    playBtn.textContent = "▶";
  }
});

// Change duration
timeButtons.forEach(button => {
  button.addEventListener("click", function () {
    if (this.id === "smaller-mins") fakeDuration = 120;
    if (this.id === "medium-mins") fakeDuration = 300;
    if (this.id === "long-mins") fakeDuration = 600;
    timeDisplay.textContent = ${Math.floor(fakeDuration / 60)}:00;
  });
});

// Switch sounds/videos
soundButtons.forEach(button => {
  button.addEventListener("click", function () {
    const sound = this.id;
    audio.src = Sounds/${sound}.mp3;
    video.src = Sounds/${sound}.mp4;
    if (!audio.paused) {
      audio.play();
      video.play();
    }
  });
});