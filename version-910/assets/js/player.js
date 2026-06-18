(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    const stage = document.querySelector("[data-player]");
    if (!stage) {
      return;
    }

    const video = stage.querySelector("video");
    const button = stage.querySelector("[data-play]");
    const layer = stage.querySelector("[data-play-layer]");
    if (!video) {
      return;
    }

    const stream = video.getAttribute("data-stream");
    let isReady = false;
    let hlsInstance = null;

    function attachStream() {
      if (isReady || !stream) {
        return Promise.resolve();
      }
      isReady = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return new Promise(function (resolve) {
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, resolve);
          window.setTimeout(resolve, 1400);
        });
      }

      video.src = stream;
      return Promise.resolve();
    }

    function playMovie() {
      attachStream().then(function () {
        const request = video.play();
        if (request && typeof request.catch === "function") {
          request.catch(function () {});
        }
        stage.classList.add("is-playing");
      });
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        playMovie();
      });
    }

    if (layer) {
      layer.addEventListener("click", function () {
        playMovie();
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        playMovie();
      }
    });

    video.addEventListener("play", function () {
      stage.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      if (!video.currentTime) {
        stage.classList.remove("is-playing");
      }
    });
  });
})();
