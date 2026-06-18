(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("is-open");
        menuButton.textContent = mobilePanel.classList.contains("is-open") ? "×" : "☰";
      });
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var input = panel.querySelector("[data-filter-input]");
      var list = document.querySelector("[data-filter-list]");

      if (!input || !list) {
        return;
      }

      var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

      input.addEventListener("input", function () {
        var keyword = input.value.trim().toLowerCase();

        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          card.classList.toggle("is-filter-hidden", keyword && text.indexOf(keyword) === -1);
        });
      });
    });
  });
})();
