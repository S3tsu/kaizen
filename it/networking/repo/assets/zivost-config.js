// Živost pro networking: maskot Hop (králík s kabelem), hlášky a zajímavosti.
// Musí se načíst před sdíleným assets/zivost.js.
(function () {
  function hop(w, pose, label) {
    pose = pose || "idle";
    const eyes = pose === "hura"
      ? '<path class="hl" d="M72 92q8-9 16 0M112 92q8-9 16 0" stroke-width="3.5"/>'
      : pose === "oops"
      ? '<path class="hl" d="M72 86l12 6-12 6M128 86l-12 6 12 6" stroke-width="3.5"/>'
      : '<g class="hp-blink"><circle cx="80" cy="90" r="6" fill="var(--hp-ink)"/><circle cx="120" cy="90" r="6" fill="var(--hp-ink)"/>' +
        '<circle cx="82" cy="88" r="2" fill="#fff"/><circle cx="122" cy="88" r="2" fill="#fff"/></g>';
    const mouth = pose === "hura"
      ? '<path d="M92 108q8 11 16 0z" fill="var(--hp-ink)"/>'
      : pose === "oops"
      ? '<path class="hl" d="M90 112q5-5 10 0t10 0" stroke-width="2.5"/>'
      : '<path class="hl" d="M100 106v5M92 113q4 4 8-2q4 6 8 2" stroke-width="2.5"/>';
    const paws = pose === "hura"
      ? '<g class="hp-cheer"><ellipse class="hp-fur" cx="40" cy="110" rx="11" ry="9"/><ellipse class="hp-fur" cx="160" cy="110" rx="11" ry="9"/></g>'
      : pose === "mysli"
      ? '<ellipse class="hp-fur" cx="80" cy="154" rx="11" ry="9"/><ellipse class="hp-fur" cx="118" cy="126" rx="11" ry="9"/>'
      : '<ellipse class="hp-fur" cx="80" cy="154" rx="11" ry="9"/><ellipse class="hp-fur" cx="120" cy="154" rx="11" ry="9"/>';
    const extra = pose === "oops"
      ? '<path d="M150 62q-6 9 0 12q6-3 0-12z" fill="#7cc4ff" stroke="var(--hp-ink)" stroke-width="1.5"/>'
      : pose === "mysli"
      ? '<g fill="var(--card)" stroke="var(--hp-ink)" stroke-width="1.5"><circle cx="156" cy="56" r="3"/><circle cx="165" cy="44" r="5"/><circle cx="178" cy="28" r="8"/></g>'
      : pose === "hura"
      ? '<g fill="var(--hp-cable)"><path d="M28 66l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/><path d="M172 60l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z"/></g>'
      : "";
    return '<svg class="hop" viewBox="0 0 200 180" width="' + w + '" height="' + Math.round(w * .9) + '" role="img" aria-label="' +
      (label || "Maskot Hop, králík s ethernetovým kabelem místo ocásku") + '">' +
      // kabel s konektorem RJ45 místo ocásku, tělo, uši, hlava
      '<path class="hp-cable" d="M146 150q30 8 34-14t-14-24"/>' +
      '<rect x="156" y="98" width="20" height="16" rx="2" fill="var(--card)" stroke="var(--hp-ink)" stroke-width="2.5"/>' +
      '<path class="hl" d="M161 98v-5M166 98v-5M171 98v-5" stroke-width="2"/>' +
      '<ellipse class="hp-fur" cx="100" cy="138" rx="48" ry="36"/>' +
      '<path class="hp-fur" d="M66 62q-12-48 4-54t24 54z"/>' +
      '<path class="hp-in" d="M74 54q-8-32 0-38t14 38z"/>' +
      '<g class="hp-ear"><path class="hp-fur" d="M106 62q0-46 18-50t8 56z"/>' +
      '<path class="hp-in" d="M114 54q2-30 10-34t2 38z"/></g>' +
      '<ellipse class="hp-fur" cx="100" cy="94" rx="48" ry="38"/>' +
      '<path d="M95 101h10l-5 5z" fill="var(--hp-pink)" stroke="var(--hp-ink)" stroke-width="1.5" stroke-linejoin="round"/>' +
      eyes + mouth + paws + extra + "</svg>";
  }

  window.ZIVOST_CONFIG = {
    key: "kaizen-net-zivost",
    mascot: hop,
    reward: 100,
    text: {
      five: "Pět správně v řadě. Žádná ztráta paketů.",
      ten: "Deset v řadě! Hop skáče o hop dál.",
      tens: " v řadě. Linka drží.",
      broken: "Série přerušená. Retransmise je normální.",
      goalDone: "Denní cíl splněný! Hop ti doručil 100 paketů.",
      coin: "pkt",
      coinTitle: "Pakety za splněné denní cíle",
      factKicker: "Hop ti vzkazuje",
      askFact: "Hop: řekni mi zajímavost"
    },
    facts: [
      ["Ping a sonar", "Program ping napsal Mike Muuss v prosinci 1983 a pojmenoval ho podle zvuku sonaru."],
      ["Traceroute a TTL", "Traceroute napsal Van Jacobson. Posílá pakety s rostoucím TTL a z ICMP chyb skládá cestu."],
      ["Éter v názvu", "Ethernet dostal jméno podle světlonosného éteru, hypotetického média, kterým se podle starých teorií šířilo světlo."],
      ["IP přes holuby", "RFC 1149 z 1. dubna 1990 popisuje přenos IP pomocí ptačích nosičů. V roce 2001 to v norském Bergenu vyzkoušeli s holuby."],
      ["RFC 1", "První RFC napsal Steve Crocker v dubnu 1969. Jmenuje se Host Software."],
      ["Doba před DNS", "Před DNS se jména strojů udržovala v jediném souboru HOSTS.TXT, který se stahoval z centrálního serveru."],
      ["13 jmen, tisíce serverů", "Kořenových DNS serverů je 13 identit (a až m). Díky anycastu běží ve více než dvou tisících instancí, které provozuje 12 organizací."],
      ["Báseň o stromu", "Radia Perlman, autorka Spanning Tree Protocolu, k němu napsala báseň Algorhyme."],
      ["Protokol na ubrouscích", "BGP se přezdívá protokol na dvou ubrouscích, první návrh prý vznikl při obědě na konferenci IETF v roce 1989."],
      ["Konec IPv4", "IANA rozdala poslední volné bloky /8 v únoru 2011. RIPE NCC došly volné IPv4 adresy v listopadu 2019."]
    ]
  };
})();
