(function () {
    var shell = document.querySelector('[data-player]');

    if (!shell) {
        return;
    }

    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-play]');

    if (!video) {
        return;
    }

    var source = video.getAttribute('data-src');
    var hlsInstance = null;

    var loadVideo = function () {
        if (!source || video.getAttribute('data-ready') === 'true') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }

        video.setAttribute('data-ready', 'true');
    };

    var playVideo = function () {
        loadVideo();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.controls = true;

        var promise = video.play();

        if (promise && promise.catch) {
            promise.catch(function () {});
        }
    };

    if (overlay) {
        overlay.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
        if (video.getAttribute('data-ready') !== 'true') {
            playVideo();
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
