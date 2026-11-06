// Kvíz s výběrem odpovědi. Otázky jsou v <script type="application/json" class="quiz-data">
// jako [{q, a: [správná, ...špatné], why}]. Pořadí možností se pokaždé zamíchá,
// takže na pozici správné odpovědi se nedá spoléhat.
(function () {
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  document.querySelectorAll("script.quiz-data").forEach(function (data) {
    const questions = JSON.parse(data.textContent);
    const root = document.createElement("div");
    root.className = "quiz";
    const score = document.createElement("p");
    score.className = "muted";
    let answered = 0, right = 0;

    questions.forEach(function (item, n) {
      const box = document.createElement("div");
      box.className = "quiz-q";
      box.innerHTML = "<p><strong>" + (n + 1) + ".</strong> " + item.q + "</p>";
      const opts = document.createElement("div");
      opts.className = "opts";
      const why = document.createElement("div");
      why.className = "why";
      const choices = shuffle(item.a.map(function (text, i) { return { text: text, correct: i === 0 }; }));
      choices.forEach(function (c) {
        const b = document.createElement("button");
        b.innerHTML = c.text;
        b.onclick = function () {
          opts.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
          b.classList.add(c.correct ? "right" : "wrong");
          if (!c.correct) {
            const idx = choices.findIndex(function (x) { return x.correct; });
            opts.children[idx].classList.add("right");
          }
          why.innerHTML = (c.correct ? '<span class="ok">Správně.</span> ' : '<span class="bad">Vedle.</span> ') + (item.why || "");
          answered++; if (c.correct) right++;
          if (window.Zivost) window.Zivost.answer(c.correct);
          score.textContent = "Skóre: " + right + " / " + answered + (answered === questions.length ? " (hotovo)" : "");
        };
        opts.appendChild(b);
      });
      box.appendChild(opts);
      box.appendChild(why);
      root.appendChild(box);
    });
    root.appendChild(score);
    data.after(root);
  });
})();
