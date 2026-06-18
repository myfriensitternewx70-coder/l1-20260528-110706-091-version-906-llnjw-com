document.addEventListener('DOMContentLoaded', function () {
  var wrappers = document.querySelectorAll('[data-player]');

  wrappers.forEach(function (wrapper) {
    var video = wrapper.querySelector('video');
    var button = wrapper.querySelector('[data-play]');
    var source = video ? video.querySelector('source') : null;
    var stream = source ? source.getAttribute('src') : '';
    var prepared = false;
    var hlsInstance = null;

    function prepare() {
      if (!video || prepared) {
        return Promise.resolve();
      }

      prepared = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        return new Promise(function (resolve) {
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
            resolve();
          });
        });
      }

      video.src = stream;
      return Promise.resolve();
    }

    function start() {
      prepare().then(function () {
        var result = video.play();
        if (result && result.catch) {
          result.catch(function () {});
        }
      });
    }

    if (button) {
      button.addEventListener('click', function () {
        wrapper.classList.add('is-playing');
        start();
      });
    }

    if (video) {
      video.addEventListener('play', function () {
        wrapper.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        wrapper.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
    }
  });
});
