// Živost pro japonštinu: klíč v localStorage se nesmí změnit, je v něm uložený postup.
// Musí se načíst před sdíleným assets/zivost.js.
window.ZIVOST_CONFIG = {
  key: "kaizen-ja-zivost",
  text: {
    five: "Pět správně v řadě! すごい!",
    goalDone: "Denní cíl splněný! Tanu ti hází do kasičky 100 ¥.",
    coin: "¥",
    coinTitle: "Jeny za splněné denní cíle"
  },
  facts: [
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
  ]
};
