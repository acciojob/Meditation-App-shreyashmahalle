const video = document.querySelector('.bg-video');
const videoSrc = document.querySelector('.bg-video source'); // because <video><source/></video>
const audio = document.querySelector('.song');
const playBtn = document.querySelector('.play');
const timeDisplay = document.querySelector('.time-display');
const presetBtns = document.querySelectorAll('.time-select button');
const rainBtn = document.querySelector('.sound-picker .rain');
const beachBtn = document.querySelector('.sound-picker .beach');

// --------- timer state ----------
let duration = 600000;   // 10 mins default
let remaining = duration;
let timerId = null;

// M:S (no leading zero → "10:0")
function paint(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  timeDisplay.textContent = ${m}:${s};
}
paint(remaining);

// start/stop helpers
function start() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    remaining -= 1000;
    if (remaining <= 0) {
      remaining = 0;
      paint(remaining);
      stop();
      remaining = duration; // reset to chosen duration
      paint(remaining);
      return;
    }
    paint(remaining);
  }, 1000);
}
function stop() {
  clearInterval(timerId);
  audio.pause();
  playBtn.textContent = '▶️';
}

// --------- events ----------
// Play / Pause toggle
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = '⏸';
    start();
  } else {
    stop();
  }
});

// Time presets (2/5/10 minutes)
presetBtns.forEach(b => {
  b.addEventListener('click', () => {
    duration = Number(b.dataset.time) || 600000;
    remaining = duration;
    paint(remaining);
    if (!audio.paused) start(); // keep counting if already playing
  });
});

// Sound picker: swap audio + background video
function setMedia(kind) {
  // Use local file names as per spec
  const a = kind === 'rain' ? './Sounds/rain.mp3' : './Sounds/beach.mp3';
  const v = kind === 'rain' ? './Sounds/rain.mp4' : './Sounds/beach.mp4';
  audio.src = a;
  videoSrc.src = v;
  video.load(); // refresh <video> after changing <source>
  if (!audio.paused) audio.play(); // keep playing if already in play state
}
rainBtn.addEventListener('click', () => setMedia('rain'));
beachBtn.addEventListener('click', () => setMedia('beach'));