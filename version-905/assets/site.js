(function () {
  var button = document.querySelector('[data-menu-button]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (button && panel) {
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 1) {
    var current = 0;
    var showSlide = function (index) {
      current = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    var searchInput = filterRoot.querySelector('[data-filter-input]');
    var selectInputs = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter-select]'));
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('.filter-card'));
    var empty = filterRoot.querySelector('[data-filter-empty]');
    var params = new URLSearchParams(window.location.search);
    var preset = params.get('q');
    if (preset && searchInput) {
      searchInput.value = preset;
    }
    var runFilter = function () {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var activeSelects = selectInputs.map(function (select) {
        return {
          key: select.getAttribute('data-filter-select'),
          value: select.value
        };
      });
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        var matched = !keyword || haystack.indexOf(keyword) !== -1;
        activeSelects.forEach(function (item) {
          if (item.value && card.getAttribute('data-' + item.key) !== item.value) {
            matched = false;
          }
        });
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    };
    if (searchInput) {
      searchInput.addEventListener('input', runFilter);
    }
    selectInputs.forEach(function (select) {
      select.addEventListener('change', runFilter);
    });
    runFilter();
  }
})();

function initMoviePlayer(videoId, coverId, source) {
  var video = document.getElementById(videoId);
  var cover = document.getElementById(coverId);
  if (!video || !cover || !source) {
    return;
  }
  var started = false;
  var start = function () {
    if (!started) {
      started = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }
    cover.classList.add('is-hidden');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  };
  cover.addEventListener('click', start);
  video.addEventListener('click', function () {
    if (!started) {
      start();
    }
  });
}
