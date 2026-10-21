// Kana dril: ukáže znak, uživatel napíše čtení, hned dostane zpětnou vazbu.
// Použití: <div class="drill" data-script="hiragana" data-sets="zakladni,dakuten"></div>
// Chybné znaky se v kole vrací znovu a ukládají se (localStorage), aby šly procvičit zvlášť.
(function () {
  const ROUND = 20;

  function load(key) {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* bez úložiště to funguje i tak */ }
  }
  function norm(s) { return s.trim().toLowerCase().replace(/\s+/g, ""); }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function label(row) {
    return row[2] && row[2] !== row[1] ? row[1] + " (č. " + row[2] + ")" : row[1];
  }

  function mount(root) {
    const script = root.dataset.script || "hiragana";
    const allSets = window.KANA[script];
    const sets = (root.dataset.sets || Object.keys(allSets).join(",")).split(",");
    const storeKey = "kaizen-ja-misses-" + script;
    const names = { zakladni: "Základní", dakuten: "S čárkami a kroužkem", yoon: script === "katakana" ? "Spojení (キャ…)" : "Spojení (きゃ…)", cizi: "Cizí slova (ファ…)" };

    root.innerHTML =
      '<div class="controls"></div>' +
      '<div class="progress"></div>' +
      '<div class="card kana" aria-live="polite"></div>' +
      '<div class="answer"><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Čtení znaku" placeholder="čtení…">' +
      '<button class="primary">Zkontrolovat</button></div>' +
      '<div class="feedback"></div>' +
      '<div class="misses"></div>';
    const controls = root.querySelector(".controls");
    const progress = root.querySelector(".progress");
    const card = root.querySelector(".card");
    const input = root.querySelector("input");
    const btn = root.querySelector(".answer button");
    const feedback = root.querySelector(".feedback");
    const missesEl = root.querySelector(".misses");

    let queue = [], current = null, waiting = false, timer = null, done = 0, firstTry = 0, roundMisses = [];

    sets.forEach(function (s) {
      const b = document.createElement("button");
      b.textContent = names[s] || s;
      b.onclick = function () { start(allSets[s]); };
      controls.appendChild(b);
    });
    const mixBtn = document.createElement("button");
    mixBtn.textContent = "Mix všeho";
    mixBtn.onclick = function () { start(sets.flatMap(function (s) { return allSets[s]; })); };
    controls.appendChild(mixBtn);
    const missBtn = document.createElement("button");
    missBtn.textContent = "Moje chyby";
    missBtn.onclick = function () {
      const m = load(storeKey);
      const pool = sets.flatMap(function (s) { return allSets[s]; }).filter(function (r) { return m[r[0]]; });
      if (!pool.length) { feedback.innerHTML = '<span class="muted">Zatím žádné uložené chyby.</span>'; return; }
      start(pool);
    };
    controls.appendChild(missBtn);

    function start(pool) {
      // Znaky, ve kterých se chybovalo, mají větší šanci dostat se do kola.
      const m = load(storeKey);
      const weighted = shuffle(pool.slice()).sort(function (a, b) { return (m[b[0]] || 0) - (m[a[0]] || 0) + (Math.random() - .5) * 2; });
      queue = shuffle(weighted.slice(0, Math.min(ROUND, pool.length)));
      done = 0; firstTry = 0; roundMisses = [];
      missesEl.innerHTML = "";
      input.disabled = false; btn.disabled = false;
      next();
    }

    function next() {
      clearTimeout(timer);
      waiting = false;
      if (!queue.length) return finish();
      current = queue.shift();
      card.textContent = current[0];
      input.value = ""; input.focus();
      feedback.textContent = "";
      btn.textContent = "Zkontrolovat";
      progress.textContent = "Zbývá " + (queue.length + 1);
    }

    function check() {
      if (!current) return;
      if (waiting) return next();
      const val = norm(input.value);
      if (!val) return;
      const ok = current.slice(1).some(function (a) { return norm(a) === val; });
      const m = load(storeKey);
      if (ok) {
        feedback.innerHTML = '<span class="ok">Správně: ' + label(current) + "</span>";
        if (!current.missed) { firstTry++; if (m[current[0]]) { m[current[0]]--; if (!m[current[0]]) delete m[current[0]]; } }
        done++;
        save(storeKey, m);
        timer = setTimeout(next, 600);
        waiting = true;
        return;
      }
      feedback.innerHTML = '<span class="bad">Ne, je to ' + label(current) + "</span>";
      if (!current.missed) {
        m[current[0]] = (m[current[0]] || 0) + 2;
        save(storeKey, m);
        roundMisses.push(current);
      }
      // Chybný znak se vrátí o kus dál v tomtéž kole.
      const again = current.slice(); again.missed = true;
      queue.splice(Math.min(3, queue.length), 0, again);
      waiting = true;
      btn.textContent = "Další";
    }

    function finish() {
      current = null;
      card.textContent = "おわり";
      input.disabled = true; btn.disabled = true;
      progress.textContent = "";
      feedback.innerHTML = "Napoprvé správně: <strong>" + firstTry + " / " + done + "</strong>";
      missesEl.innerHTML = roundMisses.length
        ? "<p>Tyhle si zapiš a zítra začni s tlačítkem „Moje chyby“:</p><p>" +
          roundMisses.map(function (r) { return '<span class="kana">' + r[0] + "</span>" + label(r); }).join(" · ") + "</p>"
        : '<p class="ok">Bez jediné chyby. Zkus „Mix všeho“.</p>';
    }

    btn.onclick = check;
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); check(); } });
    card.innerHTML = '<span class="muted" style="font-size:1rem">Vyber sadu nahoře</span>';
    input.disabled = true; btn.disabled = true;
  }

  document.querySelectorAll(".drill[data-script]").forEach(mount);
})();
