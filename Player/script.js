const player = document.querySelector('.wrapper');
const stop = document.querySelector('.stop');
const toggle = document.querySelector('.toggle');
const sound = document.querySelector('.sound');
const lineSound = document.querySelector('.progress-sound');
const lineSpeed = document.querySelector('.progress-speed');
const screen = document.querySelector('.screen');
const lineBox = document.querySelector('.line-box');
const line = document.querySelector('.line');
const currentTag = document.querySelector('.current');
const durationTag = document.querySelector('.duration');
const windows = document.querySelector('.windows');
const video = document.querySelectorAll('.video');
const backward = document.querySelector('.backward');
const forward = document.querySelector('.forward');

let enabled = true;
let currentNumber = 0;
//---------------------------------------------------------------------//
function togglePlay() {
    if (video[currentNumber].paused) {
        video[currentNumber].play();
        toggle.querySelector('em').className = 'far fa-pause-circle';
    } else {
        video[currentNumber].pause();
        toggle.querySelector('em').className = 'far fa-play-circle';
    }
};
windows.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
//---------------------------------------------------------------------//
function stopPlay() {
    video[currentNumber].pause();
    toggle.querySelector('em').className = 'far fa-play-circle';
    video[currentNumber].currentTime = 0;
    sound.querySelector('em').className = 'fas fa-volume-up';
    video[currentNumber].volume = 1;
    lineSound.value = 1;
    lineSound.style.background = 'rgb(230, 105, 105)';
    video[currentNumber].playbackRate = 1;
    lineSpeed.value = 1;
};
stop.addEventListener('click', stopPlay);
//---------------------------------------------------------------------//
function lineUpdate() {
    line.style.width = (video[currentNumber].currentTime / video[currentNumber].duration * 100) + "%";
    if (video[currentNumber].ended) {
        toggle.querySelector('em').className = 'far fa-play-circle';
    }
};
video[currentNumber].addEventListener('timeupdate', lineUpdate);

function drag(x) {
    video[currentNumber].currentTime = (x.offsetX / lineBox.offsetWidth) * video[currentNumber].duration;
};
lineBox.addEventListener('click', drag);
//---------------------------------------------------------------------//
function toggleScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        screen.querySelector('em').className = 'fas fa-expand';
    } else {
        player.requestFullscreen();
        screen.querySelector('em').className = 'fas fa-compress';
    }
};
screen.addEventListener('click', toggleScreen);
//---------------------------------------------------------------------//
function powerSound() {
    if (video[currentNumber].volume > 0) {
        video[currentNumber].volume = 0;
        sound.querySelector('em').className = 'fas fa-volume-mute';
        lineSound.value = 0;
        lineSound.style.background = 'rgb(169, 169, 169)';

    } else {
        video[currentNumber].volume = 1;
        sound.querySelector('em').className = 'fas fa-volume-up';
        lineSound.value = 1;
        lineSound.style.background = 'rgb(230, 105, 105)';
    }
};
sound.addEventListener('click', powerSound);

function volume() {
    video[currentNumber].volume = this.value;
    if (video[currentNumber].volume == 0) {
        sound.querySelector('em').className = 'fas fa-volume-mute';
    }
    if (video[currentNumber].volume > 0 && video[currentNumber].volume < 1 / 2) {
        sound.querySelector('em').className = 'fas fa-volume-down';
    }
    if (video[currentNumber].volume >= 1 / 2) {
        sound.querySelector('em').className = 'fas fa-volume-up';
    }
};
lineSound.addEventListener('mousemove', volume);

function colorSound() {
    let x = lineSound.value;
    let color = 'linear-gradient(to right, rgb(230, 105, 105)' + 100 * x + '%, rgb(169, 169, 169)' + 100 * x + '%)';
    lineSound.style.background = color;
}
lineSound.addEventListener('mousemove', colorSound);
//---------------------------------------------------------------------//
function updateTime() {
    let currentMinutes = Math.floor(video[currentNumber].currentTime / 60);
    let currentSeconds = Math.floor(video[currentNumber].currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(video[currentNumber].duration / 60);
    let durationSeconds = Math.floor(video[currentNumber].duration - durationMinutes * 60);
    currentTag.innerHTML = `${currentMinutes}:${currentSeconds}`;
    durationTag.innerHTML = `${durationMinutes}:${durationSeconds}`;
}
video[currentNumber].addEventListener('timeupdate', updateTime);
//---------------------------------------------------------------------//
function updateSpeed() {
    video[currentNumber].playbackRate = this.value;
};
lineSpeed.addEventListener('mousemove', updateSpeed);
//---------------------------------------------------------------------//
document.addEventListener('keydown', (event) => {
    if (event.code == 'Space') {
        togglePlay();
    }
    if (event.code == 'KeyF') {
        toggleScreen();
    }
    if (event.code == 'KeyM') {
        powerSound();
    }
    if (event.code == 'Comma') {
        video[currentNumber].playbackRate = Math.max(video[currentNumber].playbackRate - 0.25, lineSpeed.min);
        lineSpeed.value = video[currentNumber].playbackRate;
    }
    if (event.code == 'Period') {
        video[currentNumber].playbackRate = Math.min(video[currentNumber].playbackRate + 0.25, lineSpeed.max);
        lineSpeed.value = video[currentNumber].playbackRate;
    }
});
//---------------------------------------------------------------------//
function changeVideo(x) {
    currentNumber = (x + video.length) % video.length;
};

function hideVideo(direction) {
    enabled = false;
    video[currentNumber].classList.add(direction);
    video[currentNumber].addEventListener('animationend', function () {
        this.classList.remove('active', direction);
    });
    video[currentNumber].addEventListener('timeupdate', updateTime);
    video[currentNumber].addEventListener('timeupdate', lineUpdate);
};

function showVideo(direction) {
    video[currentNumber].classList.add('next', direction);
    video[currentNumber].addEventListener('animationend', function () {
        this.classList.remove('next', direction);
        this.classList.add('active');
        enabled = true
    });
    video[currentNumber].addEventListener('timeupdate', updateTime);
    video[currentNumber].addEventListener('timeupdate', lineUpdate);
};

forward.addEventListener('click', function () {
    stopPlay();
    if (enabled) {
        hideVideo('to-right');
        changeVideo(currentNumber - 1);
        showVideo('from-left');
    }
});

backward.addEventListener('click', function () {
    stopPlay();
    if (enabled) {
        hideVideo('to-left');
        changeVideo(currentNumber + 1);
        showVideo('from-right')
    }
});