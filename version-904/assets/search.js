(function () {
  function getQuery() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("q") || "").trim();
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderCard(movie) {
    return [
      '<a class="movie-card" href="' + escapeHtml(movie.detail) + '" title="' + escapeHtml(movie.title) + '">',
      '  <div class="poster-wrap">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <div class="poster-shade"><span class="play-icon">▶</span></div>',
      '  </div>',
      '  <div class="movie-card-body">',
      '    <h3>' + escapeHtml(movie.title) + '</h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-meta-row">',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '    </div>',
      '  </div>',
      '</a>'
    ].join("\n");
  }

  function searchMovies(query) {
    var source = window.MOVIE_INDEX || [];

    if (!query) {
      return source.slice(0, 60);
    }

    var keyword = query.toLowerCase();

    return source.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.year,
        movie.genreRaw,
        movie.oneLine,
        (movie.tags || []).join(" ")
      ].join(" ").toLowerCase();

      return haystack.indexOf(keyword) !== -1;
    });
  }

  function init() {
    var query = getQuery();
    var input = document.querySelector('.large-search input[name="q"]');
    var resultsBox = document.querySelector("[data-search-results]");
    var title = document.querySelector("[data-search-title]");
    var count = document.querySelector("[data-search-count]");

    if (input) {
      input.value = query;
    }

    if (!resultsBox) {
      return;
    }

    var results = searchMovies(query);

    if (title) {
      title.textContent = query ? '“' + query + '”的搜索结果' : "热门影片推荐";
    }

    if (count) {
      count.textContent = results.length + " Results";
    }

    if (!results.length) {
      resultsBox.innerHTML = '<p class="story-card">没有找到匹配影片，请尝试更换关键词。</p>';
      return;
    }

    resultsBox.innerHTML = results.map(renderCard).join("\n");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
