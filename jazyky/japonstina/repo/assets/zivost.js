// Živost: maskot Tanu (tanuki), denní cíl, série dní, jeny za cíl a zajímavosti o Japonsku.
// Drily, kvízy a karty volají Zivost.answer(ok). Vše se ukládá jen v prohlížeči (localStorage).
(function () {
  const KEY = "kaizen-ja-zivost";
  const GOALS = [0, 10, 20, 30, 50];

  function load() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* bez úložiště jedeme z paměti */ }
    p = p || {};
    p.days = p.days || {}; p.gdone = p.gdone || {}; p.best = p.best || {};
    if (p.goal == null) p.goal = 20;
    p.yen = p.yen || 0;
    return p;
  }
  const P = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { /* nevadí */ } }
  function dstr(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function today() { return dstr(new Date()); }

  function streak() {
    const g = P.goal || 1; let n = 0; const d = new Date();
    if ((P.days[dstr(d)] || 0) < g) d.setDate(d.getDate() - 1);
    while ((P.days[dstr(d)] || 0) >= g) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function plural(n, one, few, many) { return n === 1 ? one : n >= 2 && n <= 4 ? few : many; }
  function dayWord(n) { return plural(n, "den", "dny", "dní"); }

  /* ---------- Tanu ---------- */
  // Pózy: idle, hura, oops, mysli. Kresba je SVG v kódu, barvy z proměnných ve style.css.
  function tanu(w, pose, label) {
    pose = pose || "idle";
    const eyes = pose === "hura"
      ? '<path class="tl" d="M70 84q8-9 16 0M114 84q8-9 16 0" stroke-width="3.5"/>'
      : pose === "oops"
      ? '<path class="tl" d="M70 78l12 6-12 6M130 78l-12 6 12 6" stroke-width="3.5"/>'
      : '<g class="tn-blink"><circle cx="78" cy="84" r="6.5" fill="var(--tn-ink)"/><circle cx="122" cy="84" r="6.5" fill="var(--tn-ink)"/>' +
        '<circle cx="80.5" cy="81.5" r="2.2" fill="#fff"/><circle cx="124.5" cy="81.5" r="2.2" fill="#fff"/></g>';
    const mouth = pose === "hura"
      ? '<path d="M92 106q8 11 16 0z" fill="var(--tn-ink)"/>'
      : pose === "oops"
      ? '<path class="tl" d="M90 110q5-5 10 0t10 0" stroke-width="2.5"/>'
      : '<path class="tl" d="M93 104q7 6 14 0" stroke-width="2.5"/>';
    const paws = pose === "hura"
      ? '<g class="tn-cheer"><ellipse class="tn-fur" cx="40" cy="104" rx="11" ry="9"/><ellipse class="tn-fur" cx="160" cy="104" rx="11" ry="9"/></g>'
      : pose === "mysli"
      ? '<ellipse class="tn-fur" cx="80" cy="150" rx="11" ry="9"/><ellipse class="tn-fur" cx="118" cy="118" rx="11" ry="9"/>'
      : '<ellipse class="tn-fur" cx="80" cy="150" rx="11" ry="9"/><ellipse class="tn-fur" cx="120" cy="150" rx="11" ry="9"/>';
    const extra = pose === "oops"
      ? '<path d="M152 56q-6 9 0 12q6-3 0-12z" fill="#7cc4ff" stroke="var(--tn-ink)" stroke-width="1.5"/>'
      : pose === "mysli"
      ? '<g fill="var(--card)" stroke="var(--tn-ink)" stroke-width="1.5"><circle cx="158" cy="48" r="3"/><circle cx="166" cy="36" r="5"/><circle cx="178" cy="20" r="8"/></g>'
      : pose === "hura"
      ? '<g class="tn-spark" fill="var(--tn-leaf)"><path d="M30 60l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M170 54l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/></g>'
      : "";
    return '<svg class="tanu" viewBox="0 0 200 180" width="' + w + '" height="' + Math.round(w * .9) + '" role="img" aria-label="' +
      (label || "Maskot Tanu, buclatý tanuki s lístkem na hlavě") + '">' +
      // ocas, tělo, uši, hlava, maska, bříško
      '<path class="tn-tail" d="M150 150q40 0 34-34q-4-14-18-6q6 22-20 26z"/>' +
      '<ellipse class="tn-fur" cx="100" cy="132" rx="52" ry="42"/>' +
      '<ellipse class="tn-belly" cx="100" cy="140" rx="30" ry="26"/>' +
      '<circle class="tn-fur" cx="58" cy="44" r="15"/><circle class="tn-fur" cx="142" cy="44" r="15"/>' +
      '<circle cx="58" cy="44" r="7" fill="var(--tn-dark)"/><circle cx="142" cy="44" r="7" fill="var(--tn-dark)"/>' +
      '<ellipse class="tn-fur" cx="100" cy="82" rx="54" ry="44"/>' +
      '<path d="M54 84q12-18 34-6q12 8 24 0q22-12 34 6q-10 18-34 10q-12-4-24 0q-24 8-34-10z" fill="var(--tn-dark)"/>' +
      '<ellipse cx="100" cy="98" rx="20" ry="13" fill="var(--tn-light)"/>' +
      '<ellipse cx="100" cy="95" rx="6" ry="4.5" fill="var(--tn-ink)"/>' +
      // lístek na hlavě (podle pověsti si ho tanuki klade na hlavu, když se proměňuje)
      '<g class="tn-leafg"><path d="M100 40q-22-16-4-34q18 14 4 34z" fill="var(--tn-leaf)" stroke="var(--tn-ink)" stroke-width="2"/>' +
      '<path d="M100 40q-6-14-2-30" fill="none" stroke="var(--tn-ink)" stroke-width="1.5"/></g>' +
      eyes + mouth + paws + extra + "</svg>";
  }

  /* ---------- Zajímavosti ---------- */
  const FACTS = [
    ["Tři písma najednou", "V běžném japonském textu se míchá hiragana, katakana a kanji, občas i latinka (rōmaji)."],
    ["Kana z čínských znaků", "Hiragana i katakana vznikly zjednodušením čínských znaků, které se používaly jen kvůli zvuku."],
    ["Káva po holandsku", "コーヒー (kōhī, káva) se do japonštiny dostala z nizozemštiny, z koffie."],
    ["Chleba po portugalsku", "パン (pan, chléb) je z portugalského pão. Portugalci byli v 16. století mezi prvními Evropany v Japonsku."],
    ["Brigáda po německu", "アルバイト (arubaito) znamená brigáda a pochází z německého Arbeit. Často se zkracuje na バイト."],
    ["Prázdný orchestr", "カラオケ (karaoke) = から (prázdný) + zkrácené オーケストラ (orchestr). Hudba bez zpěvu."],
    ["Most, nebo hůlky?", "はし může být most (橋) i hůlky (箸). V řeči je liší výška tónu, v písmu znak kanji."],
    ["Tanuki", "Tanuki (psík mývalovitý) je v japonských pověstech šibal, který mění podobu. K proměně si prý klade na hlavu lístek."],
    ["Manga zprava doleva", "Manga se čte zprava doleva a text v bublinách se píše svisle shora dolů, stejně jako tradiční japonský text."],
    ["Furigana", "Malé čtení nad kanji se jmenuje furigana. V manze pro mladší čtenáře bývá u všech kanji, takže stačí znát kanu."],
    ["Tři struny", "Šamisen (三味線) je tradiční loutna se třemi strunami. Zazní v kabuki i v lidových písních."],
    ["Enka", "Enka (演歌) je žánr sentimentálních balad, typický zdobným, chvějivým přednesem zvaným kobuši (こぶし). Je oblíbený hlavně u starší generace."]
  ];

  /* ---------- UI ---------- */
  let bar, buddy, bubble, row = 0, timer;

  function renderBar() {
    if (!bar) return;
    const n = P.days[today()] || 0, g = P.goal, st = streak();
    bar.innerHTML =
      '<span class="zv-st" title="Dny v řadě se splněným cílem">' + (st ? "🔥 " + st + " " + dayWord(st) : "Série začíná dnes") + "</span>" +
      (g ? '<span class="zv-goal"><span class="zv-bar"><i style="width:' + Math.min(100, n / g * 100) + '%"></i></span>Dnes ' + n + " / " + g + "</span>"
         : '<span class="zv-goal">Dnes ' + n + " " + plural(n, "odpověď", "odpovědi", "odpovědí") + "</span>") +
      '<span class="zv-yen" title="Jeny za splněné denní cíle">¥ ' + P.yen + "</span>";
  }

  function say(text, pose, ms) {
    if (!buddy) return;
    buddy.querySelector(".zv-pic").innerHTML = tanu(76, pose);
    bubble.innerHTML = text;
    buddy.classList.add("open");
    clearTimeout(timer);
    timer = setTimeout(function () {
      buddy.classList.remove("open");
      buddy.querySelector(".zv-pic").innerHTML = tanu(76, "idle");
    }, ms || 3500);
  }

  function answer(ok) {
    const t = today(), before = P.days[t] || 0;
    P.days[t] = before + 1;
    if (ok) {
      row++;
      if (row === 5) say("Pět správně v řadě! すごい!", "hura");
      else if (row === 10) say("Deset v řadě! Tanu tancuje.", "hura");
      else if (row % 10 === 0) say(row + " v řadě. To už je řemeslo.", "hura");
    } else {
      if (row >= 5) say("Série přerušená, ale nevadí. Chyba je místo, kde se učíš.", "oops");
      row = 0;
    }
    if (P.goal && before < P.goal && before + 1 >= P.goal && !P.gdone[t]) {
      P.gdone[t] = 1; P.yen += 100;
      setTimeout(function () { say("Denní cíl splněný! Tanu ti hází do kasičky 100 ¥.", "hura", 5000); }, 300);
    }
    save(); renderBar();
  }

  function goalPicker(el) {
    el.innerHTML = '<span class="muted">Denní cíl (odpovědí):</span> ' + GOALS.map(function (v) {
      return '<button type="button" data-goal="' + v + '"' + (P.goal === v ? ' class="primary"' : "") + ">" + (v || "vypnuto") + "</button>";
    }).join(" ");
    el.onclick = function (e) {
      const b = e.target.closest("[data-goal]"); if (!b) return;
      P.goal = +b.dataset.goal; save(); renderBar(); goalPicker(el);
    };
  }

  function factBox(el) {
    const f = FACTS[Math.floor(Math.random() * FACTS.length)];
    el.innerHTML = '<div class="zv-fact-pic">' + tanu(96, "mysli") + '</div><div><span class="kicker">Tanu ti vzkazuje</span>' +
      "<h3>" + f[0] + "</h3><p>" + f[1] + "</p></div>";
  }

  function init() {
    const main = document.querySelector("main");
    if (!main) return;
    bar = document.createElement("div");
    bar.className = "zv-bar-top";
    main.insertBefore(bar, main.firstChild);
    renderBar();

    buddy = document.createElement("div");
    buddy.className = "zv-buddy";
    buddy.innerHTML = '<div class="zv-bubble" role="status" aria-live="polite"></div><button type="button" class="zv-pic" aria-label="Tanu: řekni mi zajímavost"></button>';
    document.body.appendChild(buddy);
    bubble = buddy.querySelector(".zv-bubble");
    buddy.querySelector(".zv-pic").innerHTML = tanu(76, "idle");
    buddy.querySelector(".zv-pic").onclick = function () {
      const f = FACTS[Math.floor(Math.random() * FACTS.length)];
      say("<strong>" + f[0] + ".</strong> " + f[1], "mysli", 7000);
    };

    document.querySelectorAll(".zv-fact").forEach(factBox);
    document.querySelectorAll(".zv-goals").forEach(goalPicker);
  }

  window.Zivost = { answer: answer, tanu: tanu, say: say, best: P.best, save: save };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
