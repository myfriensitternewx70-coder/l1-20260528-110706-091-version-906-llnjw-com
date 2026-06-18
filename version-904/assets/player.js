(function () {
  function showMessage(box, message) {
    if (!box) {
      return;
    }

    box.textContent = message;
    box.classList.add("is-visible");
  }

  function playVideo(video, overlay, messageBox) {
    var source = video.getAttribute("data-src");

    if (!source) {
      showMessage(messageBox, "未找到播放源，请检查 m3u8 地址。 ");
      return;
    }

    overlay.classList.add("is-hidden");

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      video.play().catch(function () {
        overlay.classList.remove("is-hidden");
        showMessage(messageBox, "浏览器阻止了自动播放，请再次点击播放按钮。 ");
      });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {
          overlay.classList.remove("is-hidden");
          showMessage(messageBox, "浏览器阻止了自动播放，请再次点击播放按钮。 ");
        });
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          overlay.classList.remove("is-hidden");
          showMessage(messageBox, "播放源加载失败，请稍后重试或更换浏览器。 ");
          hls.destroy();
        }
      });
      video._hlsInstance = hls;
      return;
    }

    overlay.classList.remove("is-hidden");
    showMessage(messageBox, "当前浏览器不支持 HLS 播放，请使用 Chrome、Edge 或 Safari。 ");
  }

  function setupPlayer(player) {
    var video = player.querySelector("video[data-src]");
    var overlay = player.querySelector("[data-play-button]");
    var messageBox = player.querySelector("[data-player-message]");

    if (!video || !overlay) {
      return;
    }

    overlay.addEventListener("click", function () {
      playVideo(video, overlay, messageBox);
    });

    video.addEventListener("play", function () {
      overlay.classList.add("is-hidden");
    });

    video.addEventListener("pause", function () {
      if (!video.ended && video.currentTime === 0) {
        overlay.classList.remove("is-hidden");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      document.querySelectorAll("[data-player]").forEach(setupPlayer);
    });
  } else {
    document.querySelectorAll("[data-player]").forEach(setupPlayer);
  }
})();
