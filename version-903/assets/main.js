document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  var forms = document.querySelectorAll('[data-search-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      if (value) {
        window.location.href = './search.html?q=' + encodeURIComponent(value);
      }
    });
  });

  var hero = document.querySelector('[data-hero-slider]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      showSlide(0);
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var filters = document.querySelectorAll('[data-card-filter]');
  filters.forEach(function (filter) {
    filter.addEventListener('input', function () {
      var keyword = filter.value.trim().toLowerCase();
      var cards = document.querySelectorAll('[data-filter-card]');
      cards.forEach(function (card) {
        var text = card.getAttribute('data-filter-card') || '';
        card.hidden = keyword && text.toLowerCase().indexOf(keyword) === -1;
      });
    });
  });

  var chips = document.querySelectorAll('[data-filter-chip]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var value = chip.getAttribute('data-filter-chip') || '';
      var cards = document.querySelectorAll('[data-filter-card]');
      chips.forEach(function (item) {
        item.classList.toggle('is-active', item === chip);
      });
      cards.forEach(function (card) {
        var text = card.getAttribute('data-filter-card') || '';
        card.hidden = value !== 'all' && text.indexOf(value) === -1;
      });
    });
  });
});
