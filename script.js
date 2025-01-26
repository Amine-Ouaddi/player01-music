document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const fileInput = document.getElementById('file-input');
    const playPauseButton = document.getElementById('play-pause');
    const shuffleButton = document.getElementById('shuffle');
    const repeatButton = document.getElementById('repeat');
    const volumeSlider = document.getElementById('volume');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const coverImage = document.getElementById('cover-image');
    const playlistList = document.getElementById('playlist-list');

    let isShuffle = false;
    let isRepeat = false;
    let currentTrackIndex = 0;
    let tracks = [];

    function loadTrack(index) {
        if (tracks.length === 0) return;
        const track = tracks[index];
        if (track) {
            audio.src = URL.createObjectURL(track);
            audio.load();
            songTitle.textContent = track.name;
            songArtist.textContent = 'User Uploaded';
            coverImage.src = 'default-cover.jpg'; // Default cover for uploaded songs
            updatePlaylist();
        }
    }

    function updatePlaylist() {
        playlistList.innerHTML = '';
        tracks.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = file.name;
            listItem.dataset.index = index;
            playlistList.appendChild(listItem);

            listItem.addEventListener('click', () => {
                currentTrackIndex = index;
                loadTrack(currentTrackIndex);
                audio.play();
                playPauseButton.textContent = '❚❚'; // Update button to pause
            });
        });
    }

    fileInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        tracks = files.filter(file => file.type.startsWith('audio/'));
        if (tracks.length > 0) {
            loadTrack(currentTrackIndex);
        }
    });

    playPauseButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseButton.textContent = '❚❚';
        } else {
            audio.pause();
            playPauseButton.textContent = '▶';
        }
    });

    shuffleButton.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleButton.style.color = isShuffle ? '#3498db' : '#ecf0f1';
    });

    repeatButton.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatButton.style.color = isRepeat ? '#3498db' : '#ecf0f1';
    });

    nextButton.addEventListener('click', () => {
        if (isShuffle) {
            currentTrackIndex = Math.floor(Math.random() * tracks.length);
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        }
        loadTrack(currentTrackIndex);
        audio.play();
        playPauseButton.textContent = '❚❚';
    });

    prevButton.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playPauseButton.textContent = '❚❚';
    });

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            loadTrack(currentTrackIndex);
            audio.play();
        } else {
            nextButton.click();
        }
    });

    audio.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audio;
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
        seekBar.value = (currentTime / duration) * 100 || 0;
    });

    seekBar.addEventListener('input', () => {
        const seekTime = (seekBar.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value;
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
