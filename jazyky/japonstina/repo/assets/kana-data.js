// Data kany pro drily a reference.
// Každý řádek: [kana, Hepburn, česká transkripce, ...další přijímané zápisy]
window.KANA = {
  hiragana: {
    zakladni: [
      ["あ","a","a"],["い","i","i"],["う","u","u"],["え","e","e"],["お","o","o"],
      ["か","ka","ka"],["き","ki","ki"],["く","ku","ku"],["け","ke","ke"],["こ","ko","ko"],
      ["さ","sa","sa"],["し","shi","ši","si"],["す","su","su"],["せ","se","se"],["そ","so","so"],
      ["た","ta","ta"],["ち","chi","či","ti"],["つ","tsu","cu","tu"],["て","te","te"],["と","to","to"],
      ["な","na","na"],["に","ni","ni"],["ぬ","nu","nu"],["ね","ne","ne"],["の","no","no"],
      ["は","ha","ha"],["ひ","hi","hi"],["ふ","fu","fu","hu"],["へ","he","he"],["ほ","ho","ho"],
      ["ま","ma","ma"],["み","mi","mi"],["む","mu","mu"],["め","me","me"],["も","mo","mo"],
      ["や","ya","ja"],["ゆ","yu","ju"],["よ","yo","jo"],
      ["ら","ra","ra"],["り","ri","ri"],["る","ru","ru"],["れ","re","re"],["ろ","ro","ro"],
      ["わ","wa","wa"],["を","o","o","wo"],
      ["ん","n","n","nn"]
    ],
    dakuten: [
      ["が","ga","ga"],["ぎ","gi","gi"],["ぐ","gu","gu"],["げ","ge","ge"],["ご","go","go"],
      ["ざ","za","za"],["じ","ji","dži","zi"],["ず","zu","zu"],["ぜ","ze","ze"],["ぞ","zo","zo"],
      ["だ","da","da"],["ぢ","ji","dži","zi","di","dzi"],["づ","zu","zu","du","dzu"],["で","de","de"],["ど","do","do"],
      ["ば","ba","ba"],["び","bi","bi"],["ぶ","bu","bu"],["べ","be","be"],["ぼ","bo","bo"],
      ["ぱ","pa","pa"],["ぴ","pi","pi"],["ぷ","pu","pu"],["ぺ","pe","pe"],["ぽ","po","po"]
    ],
    yoon: [
      ["きゃ","kya","kja"],["きゅ","kyu","kju"],["きょ","kyo","kjo"],
      ["しゃ","sha","ša","sya"],["しゅ","shu","šu","syu"],["しょ","sho","šo","syo"],
      ["ちゃ","cha","ča","tya"],["ちゅ","chu","ču","tyu"],["ちょ","cho","čo","tyo"],
      ["にゃ","nya","nja","ňa"],["にゅ","nyu","nju","ňu"],["にょ","nyo","njo","ňo"],
      ["ひゃ","hya","hja"],["ひゅ","hyu","hju"],["ひょ","hyo","hjo"],
      ["みゃ","mya","mja"],["みゅ","myu","mju"],["みょ","myo","mjo"],
      ["りゃ","rya","rja"],["りゅ","ryu","rju"],["りょ","ryo","rjo"],
      ["ぎゃ","gya","gja"],["ぎゅ","gyu","gju"],["ぎょ","gyo","gjo"],
      ["じゃ","ja","dža","zya","jya"],["じゅ","ju","džu","zyu","jyu"],["じょ","jo","džo","zyo","jyo"],
      ["びゃ","bya","bja"],["びゅ","byu","bju"],["びょ","byo","bjo"],
      ["ぴゃ","pya","pja"],["ぴゅ","pyu","pju"],["ぴょ","pyo","pjo"]
    ]
  }
};

// Katakana má stejné čtení jako hiragana, znaky leží v Unicode o 0x60 dál.
(function () {
  function toKata(s) {
    return s.replace(/[ぁ-ゖ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) + 0x60); });
  }
  const kata = {};
  Object.keys(window.KANA.hiragana).forEach(function (set) {
    kata[set] = window.KANA.hiragana[set].map(function (row) { return [toKata(row[0])].concat(row.slice(1)); });
  });
  // Spojení pro cizí slova, která v hiraganě nejsou.
  kata.cizi = [
    ["ファ","fa","fa"],["フィ","fi","fi"],["フェ","fe","fe"],["フォ","fo","fo"],
    ["ティ","ti","ti"],["ディ","di","di"],["トゥ","tu","tu"],["ドゥ","du","du"],
    ["ウィ","wi","wi","ui"],["ウェ","we","we","ue"],["ウォ","wo","wo","uo"],
    ["シェ","she","še"],["ジェ","je","dže"],["チェ","che","če"],["ツァ","tsa","ca"],
    ["ヴ","vu","vu"]
  ];
  window.KANA.katakana = kata;
})();
