(function () {
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");

  function setHeader() {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  if (menu && menuToggle) {
    menuToggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let index = 0;
    let timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  });

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function readQuery() {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get("q") || "",
      year: params.get("year") || "",
      category: params.get("category") || ""
    };
  }

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    const input = scope.querySelector("[data-search-input]");
    const categorySelect = scope.querySelector("[data-category-filter]");
    const yearButtons = Array.from(scope.querySelectorAll("[data-year-filter]"));
    const cards = Array.from(scope.querySelectorAll("[data-card]"));
    const empty = scope.querySelector("[data-empty-state]");
    let selectedYear = "all";

    const query = readQuery();
    if (input && query.q) {
      input.value = query.q;
    }
    if (categorySelect && query.category) {
      categorySelect.value = query.category;
    }
    if (query.year) {
      selectedYear = query.year;
      yearButtons.forEach(function (button) {
        button.classList.toggle("is-active", button.getAttribute("data-year-filter") === query.year);
      });
    }

    function apply() {
      const term = normalize(input ? input.value : "");
      const category = categorySelect ? categorySelect.value : "all";
      let visible = 0;

      cards.forEach(function (card) {
        const text = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-category"),
          card.getAttribute("data-region"),
          card.getAttribute("data-tags")
        ].join(" "));
        const matchesTerm = !term || text.indexOf(term) !== -1;
        const matchesCategory = category === "all" || card.getAttribute("data-category") === category;
        const matchesYear = selectedYear === "all" || card.getAttribute("data-year") === selectedYear;
        const showCard = matchesTerm && matchesCategory && matchesYear;
        card.hidden = !showCard;
        if (showCard) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener("input", apply);
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", apply);
    }
    yearButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        selectedYear = button.getAttribute("data-year-filter") || "all";
        yearButtons.forEach(function (item) {
          item.classList.toggle("is-active", item === button);
        });
        apply();
      });
    });
    apply();
  });
})();
