// Rychlovka: kolik znaků kany přečteš za 60 sekund. Čtyři možnosti, klávesy 1–4.
// Použití: <div class="rychlovka"></div>. Rekord se ukládá přes Zivost (jinak jen v paměti).
// Hra se nepočítá do denního cíle, je na oddech.
(function () {
  const SECONDS = 60;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function mount(root) {
    const best = (window.Zivost && window.Zivost.best) || {};
    const pools = {
      hiragana: window.KANA.hiragana.zakladni.concat(window.KANA.hiragana.dakuten),
      katakana: window.KANA.katakana.zakladni.concat(window.KANA.katakana.dakuten)
    };
    pools.mix = pools.hiragana.concat(pools.katakana);
    const labels = { hiragana: "Hiragana", katakana: "Katakana", mix: "Obojí" };

    root.innerHTML =
      '<div class="controls"></div>' +
      '<div class="rv-head"><span class="rv-time"></span><span class="rv-score"></span></div>' +
      '<div class="card kana"></div><div class="rv-opts"></div><div class="feedback"></div>';
    const $ = function (s) { return root.querySelector(s); };
    let pool, cur, score, wrong, left, tick, mode, lock = false;

    Object.keys(labels).forEach(function (m) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = labels[m] + (best["rv-" + m] ? " (rekord " + best["rv-" + m] + ")" : "");
      b.onclick = function () { start(m); };
      $(".controls").appendChild(b);
    });
    $(".card").innerHTML = '<span class="muted" style="font-size:1rem">Vyber písmo a jede se: 60 sekund</span>';

    function start(m) {
      mode = m; pool = pools[m]; score = 0; wrong = 0; left = SECONDS;
      $(".controls").hidden = true; $(".feedback").textContent = "";
      clearInterval(tick);
      tick = setInterval(function () { left--; head(); if (left <= 0) end(); }, 1000);
      head(); next();
    }
    function head() {
      $(".rv-time").textContent = "⏱ " + left + " s";
      $(".rv-score").textContent = "✓ " + score + (wrong ? "  ✗ " + wrong : "");
    }
    function next() {
      cur = pool[Math.floor(Math.random() * pool.length)];
      // tři špatné možnosti s jiným čtením než správná
      const others = shuffle(pool.filter(function (r) { return r[1] !== cur[1]; }));
      const opts = [cur[1]];
      for (let i = 0; i < others.length && opts.length < 4; i++) if (opts.indexOf(others[i][1]) < 0) opts.push(others[i][1]);
      shuffle(opts);
      $(".card").textContent = cur[0];
      $(".rv-opts").innerHTML = opts.map(function (o, i) {
        return '<button type="button" data-o="' + o + '"><small>' + (i + 1) + "</small> " + o + "</button>";
      }).join("");
      lock = false;
    }
    function pick(o, btn) {
      if (lock || left <= 0) return;
      if (o === cur[1]) { score++; next(); }
      else {
        wrong++; lock = true;
        btn.classList.add("wrong");
        $(".rv-opts [data-o='" + cur[1] + "']").classList.add("right");
        setTimeout(next, 700);
      }
      head();
    }
    function end() {
      clearInterval(tick); left = 0;
      $(".rv-opts").innerHTML = "";
      const key = "rv-" + mode, rec = score > (best[key] || 0);
      if (rec) { best[key] = score; if (window.Zivost) window.Zivost.save(); }
      $(".card").textContent = "おわり";
      $(".feedback").innerHTML = "Přečteno <strong>" + score + "</strong> " + (score === 1 ? "znak" : score >= 2 && score <= 4 ? "znaky" : "znaků") + ", chyb " + wrong + "." + (rec ? ' <span class="ok">Nový rekord!</span>' : "");
      if (rec && window.Zivost) window.Zivost.say("Nový rekord v Rychlovce: " + score + "!", "hura", 4000);
      $(".controls").querySelectorAll("button").forEach(function (b, i) {
        const m = Object.keys(labels)[i];
        b.textContent = labels[m] + (best["rv-" + m] ? " (rekord " + best["rv-" + m] + ")" : "");
      });
      $(".controls").hidden = false;
    }

    $(".rv-opts").onclick = function (e) { const b = e.target.closest("[data-o]"); if (b) pick(b.dataset.o, b); };
    document.addEventListener("keydown", function (e) {
      if (!pool || left <= 0 || !/^[1-4]$/.test(e.key)) return;
      if (e.target.closest && e.target.closest("input, textarea")) return;
      const b = $(".rv-opts").children[+e.key - 1];
      if (b) pick(b.dataset.o, b);
    });
  }

  document.querySelectorAll(".rychlovka").forEach(mount);
})();
