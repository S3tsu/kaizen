// Diagnostika po oblastech: kvíz, který na konci ukáže skóre za každou oblast.
// Data: <script type="application/json" class="diag-data">[{area, q, a: [správná, ...špatné], why}]</script>
// Možnost „Nevím“ je vždy poslední a počítá se jako mezera, aby tipování nezkreslovalo výsledek.
(function () {
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  document.querySelectorAll("script.diag-data").forEach(function (data) {
    const questions = JSON.parse(data.textContent);
    const root = document.createElement("div");
    root.className = "quiz";
    const result = document.createElement("div");
    result.className = "diag-result";
    const areas = {};
    let answered = 0;

    questions.forEach(function (item, n) {
      areas[item.area] = areas[item.area] || { right: 0, total: 0 };
      areas[item.area].total++;
      const box = document.createElement("div");
      box.className = "quiz-q";
      box.innerHTML = "<p><strong>" + (n + 1) + ".</strong> " + item.q + "</p>";
      const opts = document.createElement("div");
      opts.className = "opts";
      const why = document.createElement("div");
      why.className = "why";
      const choices = shuffle(item.a.map(function (text, i) { return { text: text, correct: i === 0 }; }));
      choices.push({ text: "Nevím", correct: false, unknown: true });
      choices.forEach(function (c, i) {
        const b = document.createElement("button");
        b.innerHTML = c.text;
        b.onclick = function () {
          opts.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          if (!c.unknown) b.classList.add(c.correct ? "right" : "wrong");
          if (!c.correct) opts.children[choices.findIndex(function (x) { return x.correct; })].classList.add("right");
          why.innerHTML = (c.correct ? '<span class="ok">Správně.</span> ' : c.unknown ? "" : '<span class="bad">Vedle.</span> ') + item.why;
          if (c.correct) areas[item.area].right++;
          answered++;
          if (window.Zivost) window.Zivost.answer(c.correct);
          if (answered === questions.length) showResult();
        };
        opts.appendChild(b);
      });
      box.appendChild(opts);
      box.appendChild(why);
      root.appendChild(box);
    });

    function showResult() {
      const names = Object.keys(areas).sort(function (x, y) { return areas[x].right / areas[x].total - areas[y].right / areas[y].total; });
      const text = "Diagnostika sítí: " + names.map(function (a) { return a + " " + areas[a].right + "/" + areas[a].total; }).join(", ");
      result.innerHTML = "<h3>Tvoje mapa mezer</h3><table><tr><th>Oblast</th><th>Skóre</th></tr>" +
        names.map(function (a) { return "<tr><td>" + a + "</td><td>" + areas[a].right + " / " + areas[a].total + "</td></tr>"; }).join("") +
        '</table><p><button type="button" class="primary diag-copy">Zkopírovat výsledek</button> <span class="muted diag-copied"></span></p>';
      result.querySelector(".diag-copy").onclick = function () {
        const note = result.querySelector(".diag-copied");
        if (!navigator.clipboard) { note.textContent = text; return; }
        navigator.clipboard.writeText(text).then(
          function () { note.textContent = "Zkopírováno."; },
          function () { note.textContent = text; }
        );
      };
    }

    data.after(root);
    root.after(result);
  });
})();
