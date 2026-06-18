(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let heroIndex = 0;
    let heroTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        heroIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('active', i === heroIndex);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('active', i === heroIndex);
        });
    }

    function startHero() {
        if (heroTimer) {
            clearInterval(heroTimer);
        }
        if (slides.length > 1) {
            heroTimer = setInterval(function () {
                showSlide(heroIndex + 1);
            }, 5600);
        }
    }

    if (slides.length) {
        showSlide(0);
        startHero();
    }

    if (prev) {
        prev.addEventListener('click', function () {
            showSlide(heroIndex - 1);
            startHero();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(heroIndex + 1);
            startHero();
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const index = Number(dot.getAttribute('data-hero-dot'));
            showSlide(index);
            startHero();
        });
    });

    function renderSearch(input) {
        const panel = input.parentElement.querySelector('[data-search-results]') || input.nextElementSibling;
        if (!panel || !Array.isArray(window.SEARCH_ITEMS)) {
            return;
        }
        const value = input.value.trim().toLowerCase();
        if (!value) {
            panel.innerHTML = '';
            panel.classList.remove('active');
            return;
        }
        const results = window.SEARCH_ITEMS.filter(function (item) {
            return item.text.indexOf(value) !== -1;
        }).slice(0, 12);
        if (!results.length) {
            panel.innerHTML = '<a href="categories.html">浏览全部分类<small>换一个关键词继续查找</small></a>';
            panel.classList.add('active');
            return;
        }
        panel.innerHTML = results.map(function (item) {
            return '<a href="' + item.url + '">' + item.title + '<small>' + item.meta + '</small></a>';
        }).join('');
        panel.classList.add('active');
    }

    document.querySelectorAll('[data-site-search]').forEach(function (input) {
        input.addEventListener('input', function () {
            renderSearch(input);
        });
        input.addEventListener('focus', function () {
            renderSearch(input);
        });
    });

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.header-search') && !event.target.closest('.mobile-search') && !event.target.closest('.hero-search-card')) {
            document.querySelectorAll('[data-search-results]').forEach(function (panel) {
                panel.classList.remove('active');
            });
        }
    });

    document.querySelectorAll('[data-card-filter]').forEach(function (input) {
        const section = input.closest('section');
        const cards = section ? Array.from(section.querySelectorAll('.movie-card')) : [];
        input.addEventListener('input', function () {
            const value = input.value.trim().toLowerCase();
            cards.forEach(function (card) {
                const text = (card.getAttribute('data-filter-text') || '').toLowerCase();
                card.style.display = !value || text.indexOf(value) !== -1 ? '' : 'none';
            });
        });
    });
})();
