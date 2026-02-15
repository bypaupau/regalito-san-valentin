/* =====================================================================
   script.js — Valentine's Day interactive desktop
   ===================================================================== */

// =========== GLOBAL AUDIO STATE ===========
let currentSong = -1;
let audioPlayer = new Audio();

// =========== LIVE CLOCK (widget + taskbar) ===========
function updateClock() {
    const now  = new Date();
    let   h    = now.getHours();
    const m    = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    const taskbarClock = document.getElementById('clock');
    if (taskbarClock) taskbarClock.textContent = `${h}:${m} ${ampm}`;

    const liveClock = document.getElementById('live-clock');
    const liveAmpm  = document.getElementById('live-ampm');
    if (liveClock) liveClock.textContent = `${h}:${m}`;
    if (liveAmpm)  liveAmpm.textContent  = ampm;

    const toastTime = document.getElementById('toast-time');
    if (toastTime) toastTime.textContent = `${h}:${m} ${ampm}`;
}
updateClock();
setInterval(updateClock, 10000);


// =========== NOTIFICATION TOAST ===========
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
    }, 5000);
}

function toastClick() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
    toast.classList.add('hide');
    openWindow('letter-window');
}

setTimeout(showToast, 1800);

// =========== FLOATING HEARTS ===========
const heartBg     = document.getElementById('heart-bg');
const heartEmojis = ['🌸','💕','🩷','💌','✨','🌷','💗','🌼','💛'];

for (let i = 0; i < 18; i++) {
    const span = document.createElement('span');
    span.textContent             = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    span.style.left              = Math.random() * 100 + 'vw';
    span.style.animationDuration = (8 + Math.random() * 14) + 's';
    span.style.animationDelay    = (Math.random() * 12) + 's';
    span.style.fontSize          = (10 + Math.random() * 12) + 'px';
    heartBg.appendChild(span);
}


// =========== WINDOWS ===========

function openWindow(id) {
    document.getElementById('overlay').classList.add('active');
    const win = document.getElementById(id);
    win.style.display = 'block';
    requestAnimationFrame(() => win.classList.add('active'));
    if (id === 'reasons-window')  loadReasons();
    if (id === 'playlist-window') loadPlaylist();
}

function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('active');
    setTimeout(() => win.style.display = 'none', 300);
    document.getElementById('overlay').classList.remove('active');

    // Stop music when closing playlist window
    if (id === 'playlist-window' && currentSong >= 0) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        document.getElementById(`song-${currentSong}`)?.classList.remove('playing');
        currentSong = -1;
    }
}

function closeAllWindows() {
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active');
        setTimeout(() => w.style.display = 'none', 300);
    });
    document.getElementById('overlay').classList.remove('active');

    // Stop music if playing
    if (currentSong >= 0) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        document.getElementById(`song-${currentSong}`)?.classList.remove('playing');
        currentSong = -1;
    }
}




// =========== RSVP ===========
function confirmRSVP() {
    document.getElementById('rsvp-area').style.display = 'none';
    document.getElementById('rsvp-response').classList.add('show');
    launchConfetti();
}


// =========== REASONS ===========
const reasons = [
    "Porque tu generosidad no conoce límites, eres la persona más amable y dulce que he conocido en mi vida.",
    "Porque tuviste la valentía que yo no tuve, y eso me cambió el resto de mis días",
    "Porque me escuchas con una atención con la que nunca he sido escuchada y recuerdas cada detalle y aquello siempre me hace sentir especial.",
    "Porque cuando compartes tus conocimientos, siento un cosquilleo dentro de mí que me hace sentir que no puedo creer que esté con una persona tal inteligente como tú. De verdad, siempre me sonrojo cuando empiezas a hablar de todo lo que sabes.",
    "Porque me haces sentir segura cuando estoy a tu lado.",
    "Porque cuando hablas de Matemáticas y Física se te iluminan los ojos. ",
    "Porque eres paciente conmigo incluso cuando yo no me tengo paciencia.",
    "Porque en tan poco tiempo te has convertido en una parte esencial de mis días.",
    "Porque me haces querer ser mejor versión de mí misma, me ayudas a creer en mí incluso cuando no creo en mí.",
    "Porque me das fuerzas cuando estoy débil (es decir todo el tiempo).",
    "Porque eres tan diferente a todos los demás. En todos los sentidos. Nunca había conocido a alguien tan trabajador, responsable como tú. Me das la seguridad de que siempre puedo contar contigo.",
    "Porque puedo compartir todo contigo.",
    "Porque compartes todo conmigo.",
    "Porque eres mi mejor amigo :)"
];

let reasonsLoaded = false;

function loadReasons() {
    if (reasonsLoaded) return;
    reasonsLoaded = true;

    const list = document.getElementById('reasons-list');
    reasons.forEach((r, i) => {
        const el = document.createElement('div');
        el.className = 'reason-item';
        el.innerHTML = `
            <span class="reason-num">${String(i + 1).padStart(2, '0')}.</span>
            <span class="reason-text">${r}</span>
        `;
        list.appendChild(el);
        setTimeout(() => el.classList.add('visible'), 100 + i * 120);
    });
}


// =========== PLAYLIST ===========
const songs = [
    { title: "Valentine",            artist: "Laufey",       file: "resources/music/valentine.mp3" },
    { title: "Love Song",            artist: "The Cure",     file: "resources/music/lovesong.mp3" },
    { title: "Glue Song",            artist: "beabadoobee",  file: "resources/music/glue song.mp3" },
];

let playlistLoaded = false;

function loadPlaylist() {
    if (playlistLoaded) return;
    playlistLoaded = true;

    const list = document.getElementById('song-list');
    songs.forEach((s, i) => {
        const el = document.createElement('div');
        el.className = 'song-item';
        el.id        = `song-${i}`;
        el.onclick   = () => playSong(i);
        el.innerHTML = `
            <span class="song-num">${i + 1}</span>
            <div class="song-info">
                <div class="song-title">${s.title}</div>
                <div class="song-artist">${s.artist}</div>
            </div>
            <div class="song-bar">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        `;
        list.appendChild(el);
    });
}

function playSong(i) {
    // Clicking the same song → pause/stop
    if (currentSong === i) {
        document.getElementById(`song-${i}`).classList.remove('playing');
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        currentSong = -1;
        return;
    }
    // Stop previous song
    if (currentSong >= 0) {
        document.getElementById(`song-${currentSong}`)?.classList.remove('playing');
    }
    // Play new song
    currentSong = i;
    document.getElementById(`song-${i}`).classList.add('playing');
    audioPlayer.src = songs[i].file;
    audioPlayer.play();

    // When it ends, clear playing state
    audioPlayer.onended = () => {
        document.getElementById(`song-${i}`)?.classList.remove('playing');
        currentSong = -1;
    };
}


// =========== GIFT ===========
let giftOpened = false;

function openGift() {
    if (giftOpened) return;
    giftOpened = true;

    const box = document.getElementById('gift-box-area');

    setTimeout(() => {
        box.style.display = 'none';
        document.getElementById('gift-message').classList.add('show');
        launchConfetti();
    }, 500);
}


// =========== CONFETTI ===========
function launchConfetti() {
    const colors = ['#c9e8f5','#fdf3c0','#f5d0d8','#b8ddf5','#fce8c0','#e0f4fb','#f9e0ea'];
    for (let i = 0; i < 45; i++) {
        const c = document.createElement('div');
        c.className               = 'confetti-piece';
        c.style.left              = (20 + Math.random() * 60) + 'vw';
        c.style.top               = (20 + Math.random() * 40) + 'vh';
        c.style.background        = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDuration = (0.8 + Math.random() * 1.2) + 's';
        c.style.animationDelay    = Math.random() * 0.5 + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2500);
    }
}