// Variables
const playlist = [
  { title: "Song 1 - Artist A", url: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3" },
  { title: "Song 2 - Artist B", url: "https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3" },
  { title: "Song 3 - Artist C", url: "https://www.bensound.com/bensound-music/bensound-dubstep.mp3" }
];

let currentTrackIndex = 0;
const music = document.getElementById("bg-music");
const currentTrackLabel = document.getElementById("current-track");
const playlistUI = document.getElementById("playlist-ui");

// Populate playlist UI dynamically
function renderPlaylist() {
  playlistUI.innerHTML = '';
  playlist.forEach((track, i) => {
    const trackDiv = document.createElement('div');
    trackDiv.classList.add('track');
    if(i === currentTrackIndex) trackDiv.classList.add('playing');
    trackDiv.textContent = track.title;
    trackDiv.onclick = () => setTrack(i);
    playlistUI.appendChild(trackDiv);
  });
}

// Set current track and play
function setTrack(index) {
  currentTrackIndex = index;
  music.src = playlist[index].url;
  currentTrackLabel.textContent = `🎵 ${playlist[index].title}`;
  music.volume = document.getElementById("volume-slider").value;
  music.play();
  localStorage.setItem("lastTrack", index);
  renderPlaylist();
}

// Next track
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  setTrack(currentTrackIndex);
}

// Previous track
function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  setTrack(currentTrackIndex);
}

// Play/pause toggle
function togglePlay() {
  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}

// Volume control
function setVolume(slider) {
  music.volume = slider.value;
}

// Nav toggle
function toggleNav() {
  const navLinks = document.getElementById("nav-links");
  const navToggle = document.getElementById("nav-toggle");
  navLinks.classList.toggle("show");
  navToggle.classList.toggle("open");
}

// Auto close nav on link click (mobile)
function navLinkClicked() {
  if (window.innerWidth <= 600) {
    document.getElementById("nav-links").classList.remove("show");
    document.getElementById("nav-toggle").classList.remove("open");
  }
}

// Dark/light mode toggle and persistence
function toggleMode() {
  document.body.classList.toggle("light-mode");
  const mode = document.body.classList.contains("light-mode") ? "light" : "dark";
  localStorage.setItem("mode", mode);
}

// Start music on CTA click or music picker change
function startMusic() {
  if(!music.src) setTrack(currentTrackIndex);
  music.volume = 0.3;
  music.play().catch(() => alert("Click to enable music playback."));
}

// Music picker
function pickMusic(select) {
  const url = select.value;
  if (url) {
    const foundIndex = playlist.findIndex(t => t.url === url);
    if(foundIndex !== -1) {
      setTrack(foundIndex);
    } else {
      // Add new track to playlist
      playlist.push({ title: "Custom Track", url: url });
      setTrack(playlist.length - 1);
    }
  }
}

// Typewriter effect
const typewriterTexts = ["Your music, your way.", "Unlimited listening.", "Join millions of users."];
let typeIndex = 0, charIndex = 0;
function type() {
  const el = document.getElementById("typewriter");
  if (typeIndex < typewriterTexts.length) {
    const current = typewriterTexts[typeIndex];
    if (charIndex <= current.length) {
      el.textContent = current.substring(0, charIndex);
      charIndex++;
      setTimeout(type, 100);
    } else {
      charIndex = 0;
      typeIndex = (typeIndex + 1) % typewriterTexts.length;
      setTimeout(type, 1500);
    }
  }
}

// Scroll progress bar, sticky nav, parallax hero
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("sticky", window.scrollY > 50);

  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  document.getElementById("progress-bar").style.width = (winScroll / height) * 100 + "%";

  const hero = document.querySelector(".hero");
  window.requestAnimationFrame(() => {
    hero.style.backgroundPositionY = `${window.scrollY * 0.5}px`;
  });
});

// Intersection Observer for fade/slide + counters
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.classList.contains("counter")) {
        animateCounter(entry.target);
      }
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in, .slide-in, .counter').forEach(el => observer.observe(el));

function animateCounter(el) {
  const target = +el.getAttribute('data-target');
  let count = 0;
  const increment = target / 100;
  const update = () => {
    count += increment;
    if (count < target) {
      el.textContent = Math.floor(count).toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  };
  update();
}

// Load saved mode & last track + start typewriter
window.onload = function() {
  const savedMode = localStorage.getItem("mode");
  if (savedMode === "light") document.body.classList.add("light-mode");

  const savedTrack = localStorage.getItem("lastTrack");
  if (savedTrack !== null) {
    currentTrackIndex = parseInt(savedTrack);
    setTrack(currentTrackIndex);
  }

  renderPlaylist();
  type();

  // Set volume slider to current volume
  document.getElementById("volume-slider").value = music.volume;
};
