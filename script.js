let player;
let isPlaying = false;
let isSeeking = false;
let isLoadYoutubeApiReady = false;

function onYouTubeIframeAPIReady() {
    isLoadYoutubeApiReady = true;

    document.getElementById("loadBtn").addEventListener("click", () => {
        const input = document.getElementById("videoInput").value.trim();
        const id = extractVideoId(input);
        if (id) {
            if (player) player.loadVideoById(id);
            else onLoadYoutube(id);
        } else {
            alert("Invalid YouTube URL or ID.");
        }
    });
}

function extractVideoId(input) {
    const urlMatch = input.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (urlMatch) return urlMatch[1];
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    return null;
}

function onLoadYoutube(id) {
    document.getElementById("container").style.display = "block";
    player = new YT.Player('player', {
        // width: '1280',
        // height: '720',
        videoId: id,
        playerVars: {
            'autoplay': 1,
            // 'controls': 0,            
            // 'enablejsapi': 1,
            'hl': 'vi',
            // 'fs': 0,
            // 'iv_load_policy': 3,
            'playsinline': 1,
            // 'rel': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {    
    event.target.playVideo();

    const playPauseBtn = document.getElementById("playPauseBtn");
    const volumeSlider = document.getElementById("volumeSlider");
    const playbackRate = document.getElementById("playbackRate");
    const progressSlider = document.getElementById("progress");
    const timeDisplay = document.getElementById("timeDisplay");

    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");

    playPauseBtn.addEventListener("click", () => {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            isPlaying = false;
        } else {
            player.playVideo();
            isPlaying = true;
        }
        playIcon.style.display = isPlaying ? "none" : "inline";
        pauseIcon.style.display = isPlaying ? "inline" : "none";
    });

    volumeSlider.addEventListener("input", (e) => {
        player.setVolume(e.target.value);
    });

    playbackRate.addEventListener("change", (e) => {
        player.setPlaybackRate(parseFloat(e.target.value));
    });

    progressSlider.addEventListener("input", () => {
        isSeeking = true;
    });

    progressSlider.addEventListener("change", () => {
        const duration = player.getDuration();
        const seekTo = (progressSlider.value / 100) * duration;
        player.seekTo(seekTo, true);
        isSeeking = false;
    });

    setInterval(() => {
        if (!player || !player.getDuration || isSeeking) return;

        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();
        const percent = (currentTime / duration) * 100;

        progressSlider.value = percent;
        timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }, 500);
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;

}
