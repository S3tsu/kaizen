// Živost pro security: vlastní série a denní cíl, ježek Bit a zajímavosti z oboru.
// Musí se načíst před sdíleným assets/zivost.js.
(function () {
  // Pózy: idle, hura, oops, mysli. Barvy jsou v style.css.
  function bit(w, pose, label) {
    pose = pose || "idle";
    const eyes = pose === "hura"
      ? '<path class="bt-l" d="M92 92q7-8 14 0M126 92q7-8 14 0" stroke-width="3.5"/>'
      : pose === "oops"
      ? '<path class="bt-l" d="M92 86l11 6-11 6M140 86l-11 6 11 6" stroke-width="3.5"/>'
      : '<circle cx="99" cy="92" r="6" fill="var(--bt-ink)"/><circle cx="133" cy="92" r="6" fill="var(--bt-ink)"/>' +
        '<circle cx="101" cy="90" r="2" fill="#fff"/><circle cx="135" cy="90" r="2" fill="#fff"/>';
    const mouth = pose === "hura"
      ? '<path d="M108 116q8 11 16 0z" fill="var(--bt-ink)"/>'
      : pose === "oops"
      ? '<path class="bt-l" d="M106 120q5-5 10 0t10 0" stroke-width="2.5"/>'
      : '<path class="bt-l" d="M109 116q7 6 14 0" stroke-width="2.5"/>';
    const extra = pose === "oops"
      ? '<path d="M152 60q-6 9 0 12q6-3 0-12z" fill="#7cc4ff" stroke="var(--bt-ink)" stroke-width="1.5"/>'
      : pose === "mysli"
      ? '<g fill="var(--card)" stroke="var(--bt-ink)" stroke-width="1.5"><circle cx="158" cy="56" r="3"/><circle cx="168" cy="42" r="5"/><circle cx="180" cy="24" r="8"/></g>'
      : pose === "hura"
      ? '<g fill="var(--accent)"><path d="M168 56l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M22 40l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/></g>'
      : "";
    return '<svg class="bit" viewBox="0 0 200 180" width="' + w + '" height="' + Math.round(w * .9) + '" role="img" aria-label="' +
      (label || "Maskot Bit, kulatý ježek") + '">' +
      // bodliny, tělo, obličej, nos, tlapky
      '<path class="bt-spines" d="M24 134l-14-14 18-2-16-20 20 2-10-24 22 8-4-26 20 14 4-26 16 20 12-24 10 24 16-18 2 26 18-8-6 22 14 6-110 110z"/>' +
      '<path class="bt-spines" d="M30 150q-12-70 54-92q50-14 72 34q10 58-44 68z"/>' +
      '<ellipse class="bt-face" cx="116" cy="108" rx="48" ry="42"/>' +
      '<ellipse cx="116" cy="106" rx="7" ry="5.5" fill="var(--bt-ink)"/>' +
      '<ellipse class="bt-face" cx="72" cy="160" rx="14" ry="8"/><ellipse class="bt-face" cx="128" cy="160" rx="14" ry="8"/>' +
      eyes + mouth + extra + "</svg>";
  }

  window.ZIVOST_CONFIG = {
    key: "kaizen-sec-zivost",
    mascot: bit,
    text: {
      ten: "Deset v řadě! Bit je spokojený.",
      goalDone: "Denní cíl splněný! Bit ti přidává 100 bodů.",
      factKicker: "Bit ti vzkazuje",
      askFact: "Bit: řekni mi zajímavost"
    },
    facts: [
      ["SSH vzniklo po útoku", "Tatu Ylönen napsal první SSH v roce 1995 poté, co útočník na síti jeho univerzity odposlouchával hesla."],
      ["Proč zrovna port 22", "Ylönen si port 22 vyžádal u IANA, protože leží mezi FTP (21) a telnetem (23), které mělo SSH nahradit."],
      ["Půl sekundy navíc", "Zadní vrátka v liblzma z balíku xz odhalil v roce 2024 vývojář Andres Freund, když si všiml, že přihlášení přes SSH bere nápadně moc procesoru. V jeho měření trvalo 0,8 sekundy místo 0,3."],
      ["Kerckhoffsův princip", "Šifrovací systém nesmí vyžadovat utajení a nesmí vadit, když padne do rukou nepřítele. Auguste Kerckhoffs to napsal už v roce 1883. Dnes se to shrnuje tak, že tajný má být jen klíč."],
      ["Červ z roku 1988", "Morrisův červ se v listopadu 1988 rozšířil internetem a podle hrubého odhadu zasáhl asi 6 000 počítačů, zhruba desetinu těch připojených. V reakci na tento útok vzniklo CERT/CC."],
      ["Důvěra v překladač", "Ken Thompson v přednášce k Turingově ceně, vydané v roce 1984, ukázal, jak schovat zadní vrátka do přeloženého překladače. Ve zdrojovém kódu programu ani překladače je pak nenajdeš."],
      ["Heartbleed", "Chyba v OpenSSL, odhalená v roce 2014, dovolovala číst paměť serveru i klienta, až 64 kB na jeden požadavek. Příčinou byla chybějící kontrola délky uvedené v požadavku."],
      ["Výkupné na disketách", "Jeden z prvních známých ransomwarů, AIDS Trojan z roku 1989, se šířil poštou na disketách."]
    ]
  };
})();
