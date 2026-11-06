// Vstupní test: úkoly seřazené podle obtížnosti, uživatel větu napíše nebo řekne, odkryje vzor a sám se ohodnotí.
// Na konci ukáže skóre po úrovních a doporučí, kde začít.
// Data: <script type="application/json" class="hladina-data">[{level, q, a, note}]</script>
(function () {
  document.querySelectorAll("script.hladina-data").forEach(function (data) {
    const items = JSON.parse(data.textContent);
    const levels = items.map(function (x) { return x.level; })
      .filter(function (l, i, all) { return all.indexOf(l) === i; });
    const root = document.createElement("div");
    root.className = "hladina";
    root.innerHTML =
      '<div class="progress"></div><div class="prompt"></div>' +
      '<textarea aria-label="Tvoje odpověď" placeholder="Napiš větu anglicky…"></textarea>' +
      '<div class="solution" hidden></div>' +
      '<div class="actions"><button type="button" class="primary show">Ukázat vzor</button>' +
      '<button type="button" class="got" hidden>Měl/a jsem to</button><button type="button" class="miss" hidden>Neměl/a</button></div>';
    data.after(root);
    const $ = function (s) { return root.querySelector(s); };
    const score = {};
    levels.forEach(function (l) { score[l] = { got: 0, all: 0 }; });
    let i = 0;

    function finish() {
      const line = levels.map(function (l) { return l + " " + score[l].got + "/" + score[l].all; }).join(" · ");
      const weak = levels.find(function (l) { return score[l].got / score[l].all < 2 / 3; });
      $(".progress").textContent = "Hotovo";
      $("textarea").hidden = true;
      $(".actions").hidden = true;
      $(".prompt").innerHTML = "<strong>" + line + "</strong>";
      $(".solution").hidden = false;
      $(".solution").innerHTML = weak
        ? "Nejdřív zpevni úroveň <strong>" + weak + "</strong>: tam se první chyby opakovaly a nové věci by na tom stály."
        : "Všechny úrovně v téhle ukázce zvládáš. Můžeš mířit výš a soustředit se na plynulost.";
      $(".solution").innerHTML += "<small>Je to orientační odhad z pár vět, ne certifikát. Pošli tenhle řádek učiteli, podle něj se vybere další lekce.</small>";
    }

    function render() {
      if (i >= items.length) { finish(); return; }
      $(".progress").textContent = (i + 1) + " / " + items.length;
      $(".prompt").innerHTML = items[i].q;
      $("textarea").value = "";
      $(".solution").hidden = true;
      $(".show").hidden = false; $(".got").hidden = true; $(".miss").hidden = true;
    }
    function rate(ok) {
      const s = score[items[i].level];
      s.all++; if (ok) s.got++;
      if (window.Zivost) window.Zivost.answer(ok);
      i++; render();
    }
    $(".show").onclick = function () {
      const c = items[i];
      $(".solution").innerHTML = "<strong>" + c.a + "</strong>" + (c.note ? "<small>" + c.note + "</small>" : "");
      $(".solution").hidden = false;
      $(".show").hidden = true; $(".got").hidden = false; $(".miss").hidden = false;
    };
    $(".got").onclick = function () { rate(true); };
    $(".miss").onclick = function () { rate(false); };
    render();
  });
})();
