// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const typewriterElement = document.getElementById('typewriter');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const muteBtn = document.getElementById('mute-btn');
const volumeIcon = document.getElementById('volume-icon');
const muteIcon = document.getElementById('mute-icon');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.querySelector('.progress-container');
const songTitle = document.getElementById('song-title');

// Audio Setup
const songs = [
    {
        title: "Playboicarti - Molly Edit by Destxmido [Instrumental]",
        path: "assets/music/Playboicarti - Molly Edit by Destxmido [Instrumental].mp3"
    },
    {
        title: "90s Boom Bap Chill Jazz x LoFi Type Beat - Games",
        path: "assets/music/(FREE FOR PROFIT) 90s Boom Bap Chill Jazz x LoFi Type Beat - Games.mp3"
    }
];

let currentSongIndex = 0;
let audio = new Audio();
let isPlaying = false;
let isMuted = false;

// Typewriter Setup
const texts = ["I am just a human", "Awesome and Cool Developer"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

// Initialize
function init() {
    // Set up splash screen click event
    splashScreen.addEventListener('click', enterSite);
    
    // Set up music player
    loadSong(currentSongIndex);
    setupAudioListeners();
    setupPlayerControls();
    
    // Start typewriter effect
    typeWriter();
}

// Enter Site
function enterSite() {
    splashScreen.style.opacity = 0;
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Fade in main content
        setTimeout(() => {
            mainContent.style.opacity = 1;
        }, 50);
        
        // Start playing music
        playAudio();
    }, 500);
}

// Load Song
function loadSong(index) {
    if (isPlaying) {
        audio.pause();
    }
    
    audio = new Audio(songs[index].path);
    audio.volume = volumeSlider.value;
    songTitle.textContent = songs[index].title;
    
    if (isPlaying) {
        audio.play();
    }
}

// Play/Pause Audio
function playAudio() {
    if (!isPlaying) {
        audio.play();
        isPlaying = true;
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        audio.pause();
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

// Change Song
function changeSong(direction) {
    currentSongIndex = (currentSongIndex + direction + songs.length) % songs.length;
    loadSong(currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Update Progress Bar
function updateProgress() {
    const { currentTime, duration } = audio;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
}

// Set Progress Bar
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Toggle Mute
function toggleMute() {
    isMuted = !isMuted;
    audio.muted = isMuted;
    
    if (isMuted) {
        volumeIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
    } else {
        volumeIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    }
}

// Setup Audio Event Listeners
function setupAudioListeners() {
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        changeSong(1); // Move to next song when current one ends
    });
}

// Setup Player Controls
function setupPlayerControls() {
    playPauseBtn.addEventListener('click', playAudio);
    prevBtn.addEventListener('click', () => changeSong(-1));
    nextBtn.addEventListener('click', () => changeSong(1));
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
        if (audio.volume > 0 && isMuted) {
            toggleMute();
        }
    });
    progressContainer.addEventListener('click', setProgress);
}

// Typewriter Effect
function typeWriter() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        // Deleting text
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Faster when deleting
    } else {
        // Typing text
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal speed when typing
    }
    
    // Switch direction if reached end or beginning
    if (!isDeleting && charIndex === currentText.length) {
        // Pause at the end of typing
        typingSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        // Change text after deleting
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        // Pause before starting new text
        typingSpeed = 500;
    }
    
    setTimeout(typeWriter, typingSpeed);
}

// Apply styles to main content for fade-in effect
mainContent.style.opacity = 0;
mainContent.style.transition = 'opacity 0.5s ease';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

