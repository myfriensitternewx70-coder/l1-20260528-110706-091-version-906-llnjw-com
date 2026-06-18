(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var redirectForms = document.querySelectorAll('.js-redirect-search');
  redirectForms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var url = './search.html';
      if (value) {
        url += '?q=' + encodeURIComponent(value);
      }
      window.location.href = url;
    });
  });

  var carousel = document.querySelector('.js-hero-carousel');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.js-hero-dot'));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var filterScopes = document.querySelectorAll('.js-filter-scope');
  filterScopes.forEach(function (scope) {
    var root = scope.closest('section') || document;
    var searchInput = root.querySelector('.js-search-input');
    var selects = Array.prototype.slice.call(root.querySelectorAll('.js-filter-select'));
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.js-movie-card'));
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q');

    if (searchInput && initialQuery) {
      searchInput.value = initialQuery;
    }

    function matches(card, field, value) {
      if (!value) {
        return true;
      }
      var dataValue = (card.getAttribute('data-' + field) || '').toLowerCase();
      return dataValue.indexOf(value.toLowerCase()) !== -1;
    }

    function applyFilters() {
      var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var visible = !query || text.indexOf(query) !== -1;
        selects.forEach(function (select) {
          var field = select.getAttribute('data-filter-field');
          visible = visible && matches(card, field, select.value);
        });
        card.style.display = visible ? '' : 'none';
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });
    applyFilters();
  });
})();
