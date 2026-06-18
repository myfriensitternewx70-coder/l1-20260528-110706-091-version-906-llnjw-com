(function() {
    var header = document.querySelector("[data-header]");
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");
    var backTop = document.querySelector("[data-back-top]");

    function onScroll() {
        var scrolled = window.scrollY > 24;
        if (header) {
            header.classList.toggle("is-scrolled", scrolled);
        }
        if (backTop) {
            backTop.classList.toggle("is-visible", window.scrollY > 520);
        }
    }

    if (menuToggle && mobilePanel && header) {
        menuToggle.addEventListener("click", function() {
            var opened = mobilePanel.classList.toggle("is-open");
            header.classList.toggle("menu-open", opened);
        });
    }

    if (backTop) {
        backTop.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var hero = document.querySelector("[data-hero]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("is-active", i === active);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("is-active", i === active);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function() {
                show(active + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function() {
                show(active - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(active + 1);
                start();
            });
        }

        dots.forEach(function(dot, i) {
            dot.addEventListener("click", function() {
                show(i);
                start();
            });
        });

        show(0);
        start();
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    if (filterPanel) {
        var input = filterPanel.querySelector("[data-filter-input]");
        var categorySelect = filterPanel.querySelector("[data-filter-category]");
        var yearSelect = filterPanel.querySelector("[data-filter-year]");
        var regionSelect = filterPanel.querySelector("[data-filter-region]");
        var resetButton = filterPanel.querySelector("[data-filter-reset]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
        var noResults = document.querySelector("[data-no-results]");
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || "").toLowerCase().replace(/\s+/g, "");
        }

        function applyFilter() {
            var text = normalize(input ? input.value : "");
            var category = categorySelect ? categorySelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            var region = normalize(regionSelect ? regionSelect.value : "");
            var visible = 0;

            cards.forEach(function(card) {
                var search = normalize(card.getAttribute("data-search"));
                var cardCategory = card.getAttribute("data-category") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var cardRegion = normalize(card.getAttribute("data-region"));
                var ok = true;

                if (text && search.indexOf(text) === -1) {
                    ok = false;
                }
                if (category && cardCategory !== category) {
                    ok = false;
                }
                if (year && cardYear !== year) {
                    ok = false;
                }
                if (region && cardRegion.indexOf(region) === -1) {
                    ok = false;
                }

                card.classList.toggle("is-hidden", !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (noResults) {
                noResults.classList.toggle("is-visible", visible === 0);
            }
        }

        [input, categorySelect, yearSelect, regionSelect].forEach(function(el) {
            if (el) {
                el.addEventListener("input", applyFilter);
                el.addEventListener("change", applyFilter);
            }
        });

        if (resetButton) {
            resetButton.addEventListener("click", function() {
                if (input) {
                    input.value = "";
                }
                if (categorySelect) {
                    categorySelect.value = "";
                }
                if (yearSelect) {
                    yearSelect.value = "";
                }
                if (regionSelect) {
                    regionSelect.value = "";
                }
                applyFilter();
            });
        }

        applyFilter();
    }
})();
