// Elements
const app = document.getElementById("app");
const video = document.querySelector(".bg-video");
const audio = document.getElementById("meditation-audio");
const playBtn = document.querySelector(".play");
const timeDisplay = document.querySelector(".time-display");
const timeSelect = document.getElementById("time-select");
const soundPicker = document.querySelector(".sound-picker");

// State
let duration = 600; // default 10 mins
let remaining = duration;
let ticking = null;

// ---------- Helpers ----------
function format(mmss) {
  const m = Math.floor(mmss / 60);
  const s = Math.floor(mmss % 60);
  return `${m}:${s}`;
}

function setTimeDisplay(sec) {
  timeDisplay.textContent = format(sec).replace(/:0$/, ":0"); // keep 10:0 initial style
}

function startTick() {
  stopTick();
  ticking = setInterval(() => {
    if (audio.paused) return;
    remaining = Math.max(0, remaining - 1);
    setTimeDisplay(remaining);
    if (remaining === 0) {
      pauseAll(true);
    }
  }, 1000);
}

function stopTick() {
  if (ticking) clearInterval(ticking);
  ticking = null;
}

function playAll() {
  audio.play().catch(() => {}); // ignore autoplay block
  // video is muted so it can autoplay
  playBtn.textContent = "⏸";
  startTick();
}

function pauseAll(reset = false) {
  audio.pause();
  playBtn.textContent = "▶";
  stopTick();
  if (reset) {
    remaining = duration;
    setTimeDisplay(remaining);
    audio.currentTime = 0;
  }
}

// ---------- Init display ----------
setTimeDisplay(duration);

// ---------- Events ----------
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    // if starting fresh after reaching 0, reset remaining
    if (remaining <= 0) remaining = duration;
    playAll();
  } else {
    pauseAll(false);
  }
});

// Time selection buttons
timeSelect.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const t = Number(e.target.dataset.time || 0);
  if (!t) return;
  duration = t;
  remaining = t;
  setTimeDisplay(remaining);
  // if currently playing, restart the countdown from the new duration
  if (!audio.paused) {
    audio.currentTime = 0;
    startTick();
  }
});

// Sound / video mode picker
soundPicker.addEventListener("click", (e) => {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const mode = e.target.dataset.mode; // 'beach' or 'rain'
  if (!mode) return;

  // swap media sources
  const audioSrc = `./Sounds/${mode}.mp3`;
  const videoSrc = `./Sounds/${mode}.mp4`;

  // Update audio
  audio.pause();
  audio.src = audioSrc;
  audio.load();

  // Update video (kept muted; just for ambience)
  const source = video.querySelector("source");
  source.src = videoSrc;
  video.load(); // will autoplay due to muted+loop

  // keep playing if we were playing
  if (playBtn.textContent === "⏸") {
    audio.play().catch(() => {});
  }
});

// Make sure there is at least one <audio> and <video> element for tests
// (already in DOM above). Also keep video muted for reliable autoplay.
video.muted = true;
video.loop = true;
