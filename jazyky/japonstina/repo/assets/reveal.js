// Vybavovací karty: ukáže zadání česky, uživatel odpoví nahlas nebo na papír,
// pak si odkryje řešení a sám ohodnotí, jestli ho měl. Pořadí se míchá.
// Data: <script type="application/json" class="reveal-data">[{q, a, note}]</script>
(function () {
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  document.querySelectorAll("script.reveal-data").forEach(function (data) {
    const cards = shuffle(JSON.parse(data.textContent));
    const root = document.createElement("div");
    root.className = "reveal";
    root.innerHTML =
      '<div class="progress"></div><div class="prompt"></div>' +
      '<div class="solution" hidden></div>' +
      '<div class="actions"><button class="primary show">Ukázat řešení</button>' +
      '<button class="got" hidden>Měl jsem to</button><button class="miss" hidden>Neměl</button></div>';
    data.after(root);
    const $ = function (s) { return root.querySelector(s); };
    let i = 0, got = 0, missed = [];

    function render() {
      if (i >= cards.length) {
        $(".prompt").innerHTML = "Hotovo: <strong>" + got + " / " + cards.length + "</strong>";
        $(".solution").hidden = !missed.length;
        $(".solution").innerHTML = missed.length ? "Zopakuj si: " + missed.map(function (c) { return c.q; }).join(" · ") : "";
        $(".actions").hidden = true;
        $(".progress").textContent = "";
        return;
      }
      const c = cards[i];
      $(".progress").textContent = (i + 1) + " / " + cards.length;
      $(".prompt").innerHTML = c.q;
      $(".solution").hidden = true;
      $(".solution").innerHTML = '<span class="jp">' + c.a + "</span>" + (c.note ? '<small class="muted">' + c.note + "</small>" : "");
      $(".show").hidden = false; $(".got").hidden = true; $(".miss").hidden = true;
    }
    $(".show").onclick = function () {
      $(".solution").hidden = false;
      $(".show").hidden = true; $(".got").hidden = false; $(".miss").hidden = false;
    };
    $(".got").onclick = function () { got++; i++; render(); };
    $(".miss").onclick = function () { missed.push(cards[i]); i++; render(); };
    render();
  });
})();
