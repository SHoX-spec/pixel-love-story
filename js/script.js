// Pixel Love Story — customize the content in this file.
const CONFIG = {
  // Replace these placeholder messages and photos with your own.
  birthdayMessage: "ขอให้ปีนี้เป็นปีที่ใจดีกับเธอมาก ๆ",
  loveLetter: "ขอให้วันนี้เต็มไปด้วยรอยยิ้มและเรื่องราวดี ๆ ขอบคุณที่เข้ามาเป็นส่วนหนึ่งในโลกของเรา ขอให้เราได้สร้างความทรงจำดี ๆ ด้วยกันไปอีกเยอะ ๆ เลยนะ",
  photos: [
    { src: "", caption: "A little moment, a big memory." },
    { src: "", caption: "The days are brighter with you." },
    { src: "", caption: "One of my favorite days." }
  ]
};

const $ = (selector) => document.querySelector(selector);
const startBtn = $("#startBtn");
const giftBtn = $("#giftBtn");
const letterBtn = $("#letterBtn");
const replayBtn = $("#replayBtn");
const photoModal = $("#photoModal");
let musicOn = false;
let audioContext = null;
let musicTimer = null;

// Tiny synthesized chiptune: no external audio file or heavy library required.
function playTone(frequency = 660, duration = 0.09, type = "square", volume = 0.025) {
  if (!musicOn && type === "triangle") return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (_) { /* Audio is optional; the site works without it. */ }
}

function playJingle() {
  [523, 659, 784, 1046].forEach((note, index) => {
    setTimeout(() => playTone(note, 0.16, "square", 0.035), index * 110);
  });
}

$("#musicToggle").addEventListener("click", () => {
  musicOn = !musicOn;
  $("#musicToggle").innerHTML = musicOn ? "♫ <span>เปิดอยู่</span>" : "♫ <span>เพลง</span>";
  if (musicOn) {
    playTone(523, 0.12, "triangle", 0.025);
    $("#musicHint").classList.remove("show");
  } else {
    clearInterval(musicTimer);
  }
});

startBtn.addEventListener("click", () => {
  playTone(784, 0.1);
  $("#journey").scrollIntoView({ behavior: "smooth" });
  burstHearts(8);
});

function burstHearts(count = 12) {
  for (let i = 0; i < count; i++) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.25 ? "♥" : "✦";
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.top = `${55 + Math.random() * 35}%`;
    heart.style.fontSize = `${14 + Math.random() * 22}px`;
    heart.style.animationDelay = `${Math.random() * 0.35}s`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
  }
}

giftBtn.addEventListener("click", () => {
  if ($("#giftMessage").classList.contains("show")) return;
  giftBtn.classList.add("opened");
  $("#giftMessage").classList.add("show");
  $("#giftMessage p:not(.eyebrow)").textContent = CONFIG.birthdayMessage;
  playJingle();
  burstHearts(26);
  const confetti = $("#confetti");
  for (let i = 0; i < 34; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 520}px`);
    piece.style.setProperty("--y", `${100 + Math.random() * 230}px`);
    piece.style.left = `${20 + Math.random() * 60}%`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    confetti.appendChild(piece);
    setTimeout(() => piece.remove(), 2500);
  }
});

letterBtn.addEventListener("click", () => {
  const isOpen = letterBtn.classList.toggle("open");
  $("#letterContent").classList.toggle("show", isOpen);
  $("#loveLetterText").textContent = CONFIG.loveLetter;
  playTone(isOpen ? 880 : 440, 0.12);
});

$("#memoryGrid").addEventListener("click", (event) => {
  const card = event.target.closest(".memory-card");
  if (!card) return;
  const index = [...$("#memoryGrid").children].indexOf(card);
  const photo = CONFIG.photos[index] || {};
  $("#modalCaption").textContent = photo.caption || card.dataset.caption;
  const art = $(".modal-art");
  art.innerHTML = photo.src
    ? `<img src="${photo.src}" alt="ความทรงจำ" style="width:100%;height:100%;object-fit:cover;image-rendering:auto">`
    : "♥";
  photoModal.classList.add("show");
  photoModal.setAttribute("aria-hidden", "false");
  playTone(660, 0.08);
});
function closeModal() {
  photoModal.classList.remove("show");
  photoModal.setAttribute("aria-hidden", "true");
}
$("#modalClose").addEventListener("click", closeModal);
photoModal.addEventListener("click", (event) => {
  if (event.target === photoModal) closeModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

replayBtn.addEventListener("click", () => {
  $("#giftMessage").classList.remove("show");
  giftBtn.classList.remove("opened");
  letterBtn.classList.remove("open");
  $("#letterContent").classList.remove("show");
  $("#confetti").innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  playTone(523, 0.1);
});

// Reveal a few floating hearts as the user explores, using one lightweight observer.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.id !== "home") {
      burstHearts(4);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.35 });
document.querySelectorAll(".section").forEach((section) => revealObserver.observe(section));

// Friendly keyboard support for the main interactive controls.
[giftBtn, letterBtn].forEach((button) => {
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      button.click();
    }
  });
});
