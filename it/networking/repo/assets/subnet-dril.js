// Dril subnettingu: generuje úlohy, uživatel píše odpověď, hned dostane zpětnou vazbu s postupem.
// Použití: <div class="subnet-dril"></div>. Chybné typy úloh se ukládají (localStorage) a dostávají přednost.
(function () {
  const ROUND = 10, KEY = "kaizen-net-subnet";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(v) {
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* bez úložiště to funguje i tak */ }
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function ipStr(n) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); }
  function maskOf(p) { return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0; }

  // Čistá logika úloh je oddělená od DOM, aby šla testovat.
  const TYPES = {
    network: { label: "Síťová adresa", make: function (ip, p) {
      return { q: "Síťová adresa pro <code>" + ipStr(ip) + "/" + p + "</code>?", a: ipStr((ip & maskOf(p)) >>> 0) };
    } },
    broadcast: { label: "Broadcast", make: function (ip, p) {
      return { q: "Broadcastová adresa pro <code>" + ipStr(ip) + "/" + p + "</code>?", a: ipStr((ip | ~maskOf(p)) >>> 0) };
    } },
    hosts: { label: "Počet hostů", make: function (ip, p) {
      return { q: "Kolik adres pro hosty má síť <code>/" + p + "</code>?", a: String(Math.pow(2, 32 - p) - 2) };
    } },
    mask: { label: "Maska", make: function (ip, p) {
      return { q: "Maska pro <code>/" + p + "</code>?", a: ipStr(maskOf(p)) };
    } },
    wildcard: { label: "Wildcard", make: function (ip, p) {
      return { q: "Wildcard maska pro <code>/" + p + "</code>?", a: ipStr(~maskOf(p) >>> 0) };
    } }
  };

  function explain(ip, p) {
    const block = Math.pow(2, 32 - p);
    return "Blok /" + p + " má " + block + " adres. Rozsah: " + ipStr((ip & maskOf(p)) >>> 0) + " až " + ipStr((ip | ~maskOf(p)) >>> 0) + ".";
  }

  function task(type) {
    const p = 18 + rnd(13); // /18 až /30
    const ip = ((10 << 24) | (rnd(256) << 16) | (rnd(256) << 8) | rnd(256)) >>> 0;
    const t = TYPES[type].make(ip, p);
    t.type = type; t.why = explain(ip, p);
    return t;
  }

  function pick(stats) {
    // Typ s nejvíc chybami dostane větší váhu.
    const names = Object.keys(TYPES), bag = [];
    names.forEach(function (n) {
      const w = 1 + Math.min(3, stats[n] || 0);
      for (let i = 0; i < w; i++) bag.push(n);
    });
    return bag[rnd(bag.length)];
  }

  function mount(root) {
    root.innerHTML =
      '<div class="progress"></div><div class="card"></div>' +
      '<div class="answer"><input type="text" autocomplete="off" spellcheck="false" inputmode="decimal" aria-label="Odpověď">' +
      '<button type="button" class="primary check">Ověřit</button></div>' +
      '<div class="feedback" role="status" aria-live="polite"></div>';
    const $ = function (s) { return root.querySelector(s); };
    const stats = load();
    let queue, done, right, current, waiting;

    function start() {
      queue = []; done = 0; right = 0;
      for (let i = 0; i < ROUND; i++) queue.push(task(pick(stats)));
      $(".answer").hidden = false;
      next();
    }
    function next() {
      waiting = false;
      if (!queue.length) {
        $(".progress").textContent = "";
        $(".card").innerHTML = "Hotovo: <strong>" + right + " / " + done + "</strong>";
        $(".feedback").innerHTML = '<button type="button" class="again">Další kolo</button>';
        $(".again").onclick = start;
        $(".answer").hidden = true;
        return;
      }
      current = queue.shift();
      $(".progress").textContent = (done + 1) + " · zbývá " + queue.length + " · " + TYPES[current.type].label;
      $(".card").innerHTML = current.q;
      $(".feedback").textContent = "";
      $("input").value = "";
      $(".check").textContent = "Ověřit";
      $("input").focus({ preventScroll: true });
    }
    function check() {
      if (waiting) { next(); return; }
      const given = $("input").value.trim().replace(/\s+/g, "");
      if (!given) return;
      const ok = given === current.a;
      done++;
      if (ok) {
        right++;
        stats[current.type] = Math.max(0, (stats[current.type] || 0) - 1);
      } else {
        stats[current.type] = (stats[current.type] || 0) + 1;
        if (!current.retry) { // stejný typ, nová čísla, ale jen jednou, aby kolo skončilo
          const again = task(current.type);
          again.retry = true;
          queue.push(again);
        }
      }
      save(stats);
      if (window.Zivost) window.Zivost.answer(ok);
      $(".feedback").innerHTML = (ok ? '<span class="ok">Správně.</span> ' : '<span class="bad">Vedle, správně je <code>' + current.a + "</code>.</span> ") + current.why;
      $(".check").textContent = "Další";
      waiting = true;
    }
    $(".check").onclick = check;
    $("input").addEventListener("keydown", function (e) { if (e.key === "Enter") check(); });
    start();
  }

  if (typeof document !== "undefined") document.querySelectorAll(".subnet-dril").forEach(mount);
  if (typeof module !== "undefined") module.exports = { TYPES: TYPES, ipStr: ipStr, maskOf: maskOf };
})();
