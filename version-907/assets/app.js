(function () {
  var heroIndex = 0;

  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', root);
    var dots = selectAll('[data-hero-dot]', root);
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    if (!slides.length) {
      return;
    }

    function show(index) {
      heroIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('active', position === heroIndex);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('active', position === heroIndex);
      });
    }

    dots.forEach(function (dot, position) {
      dot.addEventListener('click', function () {
        show(position);
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(heroIndex - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(heroIndex + 1);
      });
    }

    window.setInterval(function () {
      show(heroIndex + 1);
    }, 6200);
  }

  function setupFilters() {
    var search = document.querySelector('[data-movie-search]');
    var sort = document.querySelector('[data-movie-sort]');
    var grid = document.querySelector('[data-card-grid]');
    var empty = document.querySelector('[data-empty-state]');
    if (!grid) {
      return;
    }

    function cards() {
      return selectAll('[data-title]', grid);
    }

    function apply() {
      var query = search ? search.value.trim().toLowerCase() : '';
      var visible = 0;
      cards().forEach(function (card) {
        var text = (card.getAttribute('data-title') || '').toLowerCase();
        var matched = !query || text.indexOf(query) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('active', visible === 0);
      }
    }

    function applySort() {
      if (!sort) {
        return;
      }
      var items = cards();
      var mode = sort.value;
      items.sort(function (a, b) {
        if (mode === 'year-desc') {
          return (b.getAttribute('data-year') || '').localeCompare(a.getAttribute('data-year') || '');
        }
        if (mode === 'title-asc') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-CN');
        }
        return 0;
      });
      items.forEach(function (item) {
        grid.appendChild(item);
      });
      apply();
    }

    if (search) {
      search.addEventListener('input', apply);
    }
    if (sort) {
      sort.addEventListener('change', applySort);
    }
  }

  var cachedHls = null;

  function getHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (cachedHls) {
      return Promise.resolve(cachedHls);
    }
    return import('./hls-vendor.js').then(function (module) {
      cachedHls = module.H;
      return cachedHls;
    }).catch(function () {
      return null;
    });
  }

  function setupPlayers() {
    selectAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var overlay = player.querySelector('.play-overlay');
      var playButton = player.querySelector('[data-player-play]');
      var muteButton = player.querySelector('[data-player-mute]');
      var fullButton = player.querySelector('[data-player-fullscreen]');
      var stream = video ? video.getAttribute('data-stream') : '';
      var initialized = false;
      var hlsInstance = null;

      if (!video || !stream) {
        return;
      }

      function markError() {
        player.classList.add('has-error');
        if (overlay) {
          overlay.innerHTML = '<span>!</span>';
        }
      }

      function attach() {
        if (initialized) {
          return Promise.resolve();
        }
        initialized = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          return Promise.resolve();
        }
        return getHls().then(function (Hls) {
          if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 90 });
            hlsInstance.loadSource(stream);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.ERROR, function (event, data) {
              if (data && data.fatal) {
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                  hlsInstance.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                  hlsInstance.recoverMediaError();
                } else {
                  markError();
                }
              }
            });
          } else {
            markError();
          }
        });
      }

      function play() {
        attach().then(function () {
          video.controls = true;
          var promise = video.play();
          if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {});
          }
        });
      }

      function togglePlay() {
        if (video.paused) {
          play();
        } else {
          video.pause();
        }
      }

      if (overlay) {
        overlay.addEventListener('click', function (event) {
          event.preventDefault();
          play();
        });
      }
      if (playButton) {
        playButton.addEventListener('click', function (event) {
          event.preventDefault();
          togglePlay();
        });
      }
      if (muteButton) {
        muteButton.addEventListener('click', function (event) {
          event.preventDefault();
          video.muted = !video.muted;
          muteButton.textContent = video.muted ? '取消静音' : '静音';
        });
      }
      if (fullButton) {
        fullButton.addEventListener('click', function (event) {
          event.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (player.requestFullscreen) {
            player.requestFullscreen();
          }
        });
      }

      video.addEventListener('play', function () {
        player.classList.add('is-playing');
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        if (playButton) {
          playButton.textContent = '暂停';
        }
      });

      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
        if (playButton) {
          playButton.textContent = '播放';
        }
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance && hlsInstance.destroy) {
          hlsInstance.destroy();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
