(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    var setSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    var start = function () {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    };

    if (slides.length > 1) {
      if (prev) {
        prev.addEventListener('click', function () {
          setSlide(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          setSlide(current + 1);
          start();
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
          start();
        });
      });

      start();
    }
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

  panels.forEach(function (panel) {
    var root = panel.closest('main') || panel.parentElement;
    var input = panel.querySelector('[data-search-input]');
    var yearSelect = panel.querySelector('[data-year-select]');
    var regionSelect = panel.querySelector('[data-region-select]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-filter-card]'));
    var years = [];
    var regions = [];

    cards.forEach(function (card) {
      var year = card.getAttribute('data-year') || '';
      var region = card.getAttribute('data-region') || '';

      if (year && years.indexOf(year) === -1) {
        years.push(year);
      }

      if (region && regions.indexOf(region) === -1) {
        regions.push(region);
      }
    });

    years.sort().reverse().forEach(function (year) {
      var option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    });

    regions.sort().forEach(function (region) {
      var option = document.createElement('option');
      option.value = region;
      option.textContent = region;
      regionSelect.appendChild(option);
    });

    var applyFilter = function () {
      var query = input.value.trim().toLowerCase();
      var year = yearSelect.value;
      var region = regionSelect.value;

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardRegion = card.getAttribute('data-region') || '';
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }

        if (year && cardYear !== year) {
          matched = false;
        }

        if (region && cardRegion !== region) {
          matched = false;
        }

        card.classList.toggle('hidden-by-filter', !matched);
      });
    };

    input.addEventListener('input', applyFilter);
    yearSelect.addEventListener('change', applyFilter);
    regionSelect.addEventListener('change', applyFilter);
  });

  var video = document.querySelector('[data-player-video]');
  var trigger = document.querySelector('[data-play-trigger]');

  if (video && trigger && typeof currentPlaySource !== 'undefined') {
    var hlsInstance = null;
    var attached = false;

    var loadHlsScript = function () {
      return new Promise(function (resolve, reject) {
        if (window.Hls) {
          resolve();
          return;
        }

        var script = document.createElement('script');
        script.src = 'https://unpkg.com/hls.js@1.5.20/dist/hls.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    var attach = function () {
      if (attached) {
        return Promise.resolve();
      }

      attached = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentPlaySource;
        return Promise.resolve();
      }

      return loadHlsScript().then(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(currentPlaySource);
          hlsInstance.attachMedia(video);
        } else {
          video.src = currentPlaySource;
        }
      }).catch(function () {
        video.src = currentPlaySource;
      });
    };

    var play = function () {
      trigger.classList.add('is-hidden');
      video.controls = true;

      attach().then(function () {
        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            trigger.classList.remove('is-hidden');
          });
        }
      });
    };

    trigger.addEventListener('click', play);

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    video.addEventListener('play', function () {
      trigger.classList.add('is-hidden');
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        trigger.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
