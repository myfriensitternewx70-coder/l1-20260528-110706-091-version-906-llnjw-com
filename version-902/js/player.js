function initPlayer(videoId, overlayId, mediaUrl) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    let attached = false;

    function attach() {
        if (!video || attached) {
            return;
        }
        attached = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = mediaUrl;
        } else if (window.Hls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(mediaUrl);
            hls.attachMedia(video);
        } else {
            video.src = mediaUrl;
        }
    }

    function play() {
        attach();
        if (overlay) {
            overlay.classList.add('hidden');
        }
        const promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                video.controls = true;
            });
        }
    }

    if (overlay) {
        overlay.addEventListener('click', play);
    }

    if (video) {
        video.addEventListener('click', function () {
            if (!attached || video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('hidden');
            }
        });
    }
}
