const legacyStorageKey = "kanaSprintProgressV3";
const profileStorageKey = "kanaSprintProfilesV1";
const sessionStorageKey = "kanaSprintSessionV1";
const progressStoragePrefix = "kanaSprintProgressV4::";
const remoteSaveDelay = 420;
const leaderboardStaleMs = 18000;

const recentLimits = {
  quiz: 6,
  reading: 5,
  context: 5,
  phrases: 5,
  cloze: 5,
  dictation: 5,
  confusion: 5,
  builder: 5,
};

const rankLadder = [
  { xp: 0, title: "Novato" },
  { xp: 120, title: "Viajante" },
  { xp: 260, title: "Leitor" },
  { xp: 460, title: "Duelista" },
  { xp: 720, title: "Guardiao" },
  { xp: 1040, title: "Mestre Kana" },
];

const phraseCategories = ["saudacoes", "viagem", "conversa", "anime"];

const xpTable = {
  recognition: { correct: 10, wrong: -6 },
  reading: { correct: 12, wrong: -7, reveal: -4 },
  context: { correct: 14, wrong: -8, reveal: -5 },
  phrases: { correct: 18, wrong: -10, reveal: -6 },
  cloze: { correct: 11, wrong: -6 },
  dictation: { correct: 14, wrong: -8, reveal: -5 },
  confusion: { correct: 10, wrong: -6 },
  builder: { correct: 14, wrong: -8, reveal: -5 },
  arcadeShurikenHit: 5,
  arcadeShurikenMiss: -4,
  arcadeFoodHit: 8,
  arcadeFoodMiss: -6,
  arcadePairsHit: 7,
  arcadePairsMiss: -5,
};

const irregularNotes = {
  "し": "Excecao da linha S: soa shi.",
  "ち": "Excecao da linha T: soa chi.",
  "つ": "Excecao da linha T: soa tsu.",
  "ふ": "Nao leia hu. Aqui o som e fu.",
  "を": "Na pratica soa como o e aparece muito como particula.",
  "ん": "Som final n, sem vogal.",
  "シ": "Compare com ツ: os tracos pequenos caem para baixo.",
  "ツ": "Compare com シ: os tracos pequenos apontam para a direita.",
  "ソ": "Pode confundir com ン; repare onde o risco curto nasce.",
  "ン": "Pode confundir com ソ; repare na inclinacao e altura.",
  "フ": "No katakana o som continua sendo fu.",
  "ヲ": "Quase nao aparece no japones moderno.",
};

const baseLibrary = {
  hiragana: buildScriptEntries("hiragana", [
    {
      family: "Linha A",
      consonant: "",
      note: "Comece por aqui. Estas cinco vogais servem de base para todas as outras familias.",
      items: [
        ["あ", "a", "あさ (asa) • manha"],
        ["い", "i", "いえ (ie) • casa"],
        ["う", "u", "うみ (umi) • mar"],
        ["え", "e", "えき (eki) • estacao"],
        ["お", "o", "おと (oto) • som"],
      ],
    },
    {
      family: "Linha K",
      consonant: "k",
      note: "Linha bem regular: lembre do K e troque so a vogal.",
      items: [
        ["か", "ka", "かさ (kasa) • guarda-chuva"],
        ["き", "ki", "きた (kita) • norte"],
        ["く", "ku", "くも (kumo) • nuvem"],
        ["け", "ke", "けむり (kemuri) • fumaca"],
        ["こ", "ko", "こえ (koe) • voz"],
      ],
    },
    {
      family: "Linha S",
      consonant: "s",
      note: "Quase regular. A excecao importante aqui e し = shi.",
      items: [
        ["さ", "sa", "さかな (sakana) • peixe"],
        ["し", "shi", "しお (shio) • sal"],
        ["す", "su", "すし (sushi) • sushi"],
        ["せ", "se", "せかい (sekai) • mundo"],
        ["そ", "so", "そら (sora) • ceu"],
      ],
    },
    {
      family: "Linha T",
      consonant: "t",
      note: "Outra familia com excecoes: ち = chi e つ = tsu.",
      items: [
        ["た", "ta", "たこ (tako) • polvo"],
        ["ち", "chi", "ちず (chizu) • mapa"],
        ["つ", "tsu", "つき (tsuki) • lua"],
        ["て", "te", "て (te) • mao"],
        ["と", "to", "とり (tori) • passaro"],
      ],
    },
    {
      family: "Linha N",
      consonant: "n",
      note: "Boa familia para destravar leitura. Tente soletrar e juntar sem correr.",
      items: [
        ["な", "na", "なつ (natsu) • verao"],
        ["に", "ni", "にく (niku) • carne"],
        ["ぬ", "nu", "いぬ (inu) • cachorro"],
        ["ね", "ne", "ねこ (neko) • gato"],
        ["の", "no", "のど (nodo) • garganta"],
      ],
    },
    {
      family: "Linha H",
      consonant: "h",
      note: "A unica irregular importante aqui e ふ, que soa como fu.",
      items: [
        ["は", "ha", "はな (hana) • flor"],
        ["ひ", "hi", "ひと (hito) • pessoa"],
        ["ふ", "fu", "ふね (fune) • barco"],
        ["へ", "he", "へや (heya) • quarto"],
        ["ほ", "ho", "ほし (hoshi) • estrela"],
      ],
    },
    {
      family: "Linha M",
      consonant: "m",
      note: "Linha regular. Boa para fixar o padrao consonante + vogal.",
      items: [
        ["ま", "ma", "まど (mado) • janela"],
        ["み", "mi", "みず (mizu) • agua"],
        ["む", "mu", "むし (mushi) • inseto"],
        ["め", "me", "め (me) • olho"],
        ["も", "mo", "もり (mori) • floresta"],
      ],
    },
    {
      family: "Linha Y",
      consonant: "y",
      note: "So tres sons: ya, yu e yo. Pense neles como uma mini-familia.",
      items: [
        ["や", "ya", "やま (yama) • montanha"],
        ["ゆ", "yu", "ゆき (yuki) • neve"],
        ["よ", "yo", "よる (yoru) • noite"],
      ],
    },
    {
      family: "Linha R",
      consonant: "r",
      note: "O R japones e leve, entre um r e um l.",
      items: [
        ["ら", "ra", "らく (raku) • conforto"],
        ["り", "ri", "りす (risu) • esquilo"],
        ["る", "ru", "るす (rusu) • ausencia"],
        ["れ", "re", "れきし (rekishi) • historia"],
        ["ろ", "ro", "ろうそく (rousoku) • vela"],
      ],
    },
    {
      family: "Linha W",
      consonant: "w",
      note: "Aqui entram formas mais limitadas. を quase sempre aparece como particula.",
      items: [
        ["わ", "wa", "わに (wani) • crocodilo"],
        ["を", "o", "みずを のむ • beber agua"],
      ],
    },
    {
      family: "Final",
      consonant: "n",
      note: "ん fecha a silaba. Nao recebe vogal depois.",
      items: [["ん", "n", "ほん (hon) • livro"]],
    },
  ]),
  katakana: buildScriptEntries("katakana", [
    {
      family: "Linha A",
      consonant: "",
      note: "Mesmo sistema das vogais do hiragana, mas com tracos mais retos.",
      items: [
        ["ア", "a", "アイス (aisu) • sorvete"],
        ["イ", "i", "イヤホン (iyahon) • fone"],
        ["ウ", "u", "ウニ (uni) • uni"],
        ["エ", "e", "エコ (eko) • eco"],
        ["オ", "o", "オムレツ (omuretsu) • omelete"],
      ],
    },
    {
      family: "Linha K",
      consonant: "k",
      note: "Linha regular. Se souber K + vogal, metade do trabalho ja foi.",
      items: [
        ["カ", "ka", "カメラ (kamera) • camera"],
        ["キ", "ki", "キウイ (kiui) • kiwi"],
        ["ク", "ku", "クラス (kurasu) • turma"],
        ["ケ", "ke", "ケーキ (keeki) • bolo"],
        ["コ", "ko", "ココア (kokoa) • cocoa"],
      ],
    },
    {
      family: "Linha S",
      consonant: "s",
      note: "A excecao aqui continua sendo シ = shi.",
      items: [
        ["サ", "sa", "サラダ (sarada) • salada"],
        ["シ", "shi", "シール (shiiru) • adesivo"],
        ["ス", "su", "スープ (suupu) • sopa"],
        ["セ", "se", "セミナー (seminaa) • seminario"],
        ["ソ", "so", "ソファ (sofa) • sofa"],
      ],
    },
    {
      family: "Linha T",
      consonant: "t",
      note: "Repete as irregularidades do hiragana: チ = chi e ツ = tsu.",
      items: [
        ["タ", "ta", "タオル (taoru) • toalha"],
        ["チ", "chi", "チーム (chiimu) • time"],
        ["ツ", "tsu", "ツナ (tsuna) • atum"],
        ["テ", "te", "テスト (tesuto) • teste"],
        ["ト", "to", "トマト (tomato) • tomate"],
      ],
    },
    {
      family: "Linha N",
      consonant: "n",
      note: "Boa para pratica visual. O ritmo continua o mesmo da tabela base.",
      items: [
        ["ナ", "na", "ナイフ (naifu) • faca"],
        ["ニ", "ni", "ニット (nitto) • malha"],
        ["ヌ", "nu", "ヌードル (nuudoru) • noodles"],
        ["ネ", "ne", "ネオン (neon) • neon"],
        ["ノ", "no", "ノート (nooto) • caderno"],
      ],
    },
    {
      family: "Linha H",
      consonant: "h",
      note: "Aqui tambem vale lembrar: フ soa como fu.",
      items: [
        ["ハ", "ha", "ハム (hamu) • presunto"],
        ["ヒ", "hi", "ヒント (hinto) • dica"],
        ["フ", "fu", "フネ (fune) • barco"],
        ["ヘ", "he", "ヘルメット (herumetto) • capacete"],
        ["ホ", "ho", "ホテル (hoteru) • hotel"],
      ],
    },
    {
      family: "Linha M",
      consonant: "m",
      note: "Linha regular e facil de revisar em bloco.",
      items: [
        ["マ", "ma", "マスク (masuku) • mascara"],
        ["ミ", "mi", "ミルク (miruku) • leite"],
        ["ム", "mu", "ムード (muudo) • clima"],
        ["メ", "me", "メモ (memo) • anotacao"],
        ["モ", "mo", "モデル (moderu) • modelo"],
      ],
    },
    {
      family: "Linha Y",
      consonant: "y",
      note: "A mini-familia continua: ya, yu e yo.",
      items: [
        ["ヤ", "ya", "ヤクルト (yakuruto) • Yakult"],
        ["ユ", "yu", "ユニット (yunitto) • unidade"],
        ["ヨ", "yo", "ヨガ (yoga) • yoga"],
      ],
    },
    {
      family: "Linha R",
      consonant: "r",
      note: "Treine esta linha com leitura em voz alta. O R segue leve.",
      items: [
        ["ラ", "ra", "ラジオ (rajio) • radio"],
        ["リ", "ri", "リズム (rizumu) • ritmo"],
        ["ル", "ru", "ルール (ruuru) • regra"],
        ["レ", "re", "レモン (remon) • limao"],
        ["ロ", "ro", "ロボット (robotto) • robo"],
      ],
    },
    {
      family: "Linha W",
      consonant: "w",
      note: "ヲ e raro no japones moderno, mas vale reconhecer o formato.",
      items: [
        ["ワ", "wa", "ワイン (wain) • vinho"],
        ["ヲ", "o", "ヲ e raro hoje em dia"],
      ],
    },
    {
      family: "Final",
      consonant: "n",
      note: "ン fecha a silaba. Visualmente ele costuma ser confundido com ソ.",
      items: [["ン", "n", "パン (pan) • pao"]],
    },
  ]),
};

const extendedLibrary = {
  hiragana: [
    ["が", "ga", "Linha G", "k", "Mesma forma de か com duas marcas.", "がくせい (gakusei) • estudante"],
    ["ぎ", "gi", "Linha G", "k", "Mesma familia da linha K, so que sonora.", "ぎんこう (ginkou) • banco"],
    ["ぐ", "gu", "Linha G", "k", "Pense em K com voz.", "ぐあい (guai) • condicao"],
    ["げ", "ge", "Linha G", "k", "Mesmo desenho-base de け com dakuten.", "げんき (genki) • bem"],
    ["ご", "go", "Linha G", "k", "K com voz vira G.", "ごはん (gohan) • arroz/refeicao"],
    ["ざ", "za", "Linha Z", "s", "Linha S com som sonoro.", "ざせき (zaseki) • assento"],
    ["じ", "ji", "Linha Z", "s", "Vem da forma de し com voz.", "じかん (jikan) • tempo"],
    ["ず", "zu", "Linha Z", "s", "Mesma familia de す, mas sonora.", "みず (mizu) • agua"],
    ["ぜ", "ze", "Linha Z", "s", "S com voz.", "ぜんぶ (zenbu) • tudo"],
    ["ぞ", "zo", "Linha Z", "s", "S com voz.", "ぞう (zou) • elefante"],
    ["だ", "da", "Linha D", "t", "Linha T com voz.", "だいがく (daigaku) • universidade"],
    ["で", "de", "Linha D", "t", "Linha T sonora.", "でんき (denki) • eletricidade"],
    ["ど", "do", "Linha D", "t", "Linha T sonora.", "どあ (doa) • porta"],
    ["ば", "ba", "Linha B", "h", "Linha H com voz.", "ばす (basu) • onibus"],
    ["び", "bi", "Linha B", "h", "Mesma base visual de ひ com voz.", "びょういん (byouin) • hospital"],
    ["ぶ", "bu", "Linha B", "h", "Linha H sonora.", "ぶた (buta) • porco"],
    ["べ", "be", "Linha B", "h", "Linha H sonora.", "べんとう (bentou) • marmita"],
    ["ぼ", "bo", "Linha B", "h", "Linha H sonora.", "ぼうし (boushi) • chapeu"],
    ["ぱ", "pa", "Linha P", "h", "Linha H com circulo.", "ぱん (pan) • pao"],
    ["ぴ", "pi", "Linha P", "h", "Linha H com circulo.", "ぴざ (piza) • pizza"],
    ["ぷ", "pu", "Linha P", "h", "Linha H com circulo.", "ぷりん (purin) • pudim"],
    ["ぺ", "pe", "Linha P", "h", "Linha H com circulo.", "ぺん (pen) • caneta"],
    ["ぽ", "po", "Linha P", "h", "Linha H com circulo.", "ぽけっと (poketto) • bolso"],
  ].map(createExtendedEntry("hiragana")),
  katakana: [
    ["ガ", "ga", "Linha G", "k", "Linha K com voz.", "ガム (gamu) • chiclete"],
    ["ギ", "gi", "Linha G", "k", "Mesma forma-base de キ com voz.", "ギフト (gifuto) • presente"],
    ["グ", "gu", "Linha G", "k", "Linha K sonora.", "グミ (gumi) • goma"],
    ["ゲ", "ge", "Linha G", "k", "Linha K sonora.", "ゲーム (geemu) • jogo"],
    ["ゴ", "go", "Linha G", "k", "Linha K sonora.", "ゴム (gomu) • borracha"],
    ["ザ", "za", "Linha Z", "s", "Linha S com voz.", "ザラザラ (zarazara) • aspereza"],
    ["ジ", "ji", "Linha Z", "s", "Forma de シ com voz.", "ジム (jimu) • academia"],
    ["ズ", "zu", "Linha Z", "s", "Linha S sonora.", "ズボン (zubon) • calca"],
    ["ゼ", "ze", "Linha Z", "s", "Linha S sonora.", "ゼロ (zero) • zero"],
    ["ゾ", "zo", "Linha Z", "s", "Linha S sonora.", "ゾーン (zoon) • zona"],
    ["ダ", "da", "Linha D", "t", "Linha T com voz.", "ダンス (dansu) • danca"],
    ["デ", "de", "Linha D", "t", "Linha T sonora.", "データ (deeta) • dados"],
    ["ド", "do", "Linha D", "t", "Linha T sonora.", "ドア (doa) • porta"],
    ["バ", "ba", "Linha B", "h", "Linha H com voz.", "バナナ (banana) • banana"],
    ["ビ", "bi", "Linha B", "h", "Linha H sonora.", "ビール (biiru) • cerveja"],
    ["ブ", "bu", "Linha B", "h", "Linha H sonora.", "ブラシ (burashi) • escova"],
    ["ベ", "be", "Linha B", "h", "Linha H sonora.", "ベッド (beddo) • cama"],
    ["ボ", "bo", "Linha B", "h", "Linha H sonora.", "ボタン (botan) • botao"],
    ["パ", "pa", "Linha P", "h", "Linha H com circulo.", "パン (pan) • pao"],
    ["ピ", "pi", "Linha P", "h", "Linha H com circulo.", "ピザ (piza) • pizza"],
    ["プ", "pu", "Linha P", "h", "Linha H com circulo.", "プリン (purin) • pudim"],
    ["ペ", "pe", "Linha P", "h", "Linha H com circulo.", "ペン (pen) • caneta"],
    ["ポ", "po", "Linha P", "h", "Linha H com circulo.", "ポスト (posuto) • correio"],
  ].map(createExtendedEntry("katakana")),
};

const readingDecks = createReadingDecks({
  hiragana: {
    base: [
      ["いえ", "ie", "い・え", "casa"],
      ["うえ", "ue", "う・え", "acima"],
      ["あさ", "asa", "あ・さ", "manha"],
      ["かお", "kao", "か・お", "rosto"],
      ["ねこ", "neko", "ね・こ", "gato"],
      ["いぬ", "inu", "い・ぬ", "cachorro"],
      ["すし", "sushi", "す・し", "sushi"],
      ["さかな", "sakana", "さ・か・な", "peixe"],
      ["のき", "noki", "の・き", "treino", true],
      ["かぬ", "kanu", "か・ぬ", "treino", true],
      ["むさ", "musa", "む・さ", "treino", true],
      ["せみ", "semi", "せ・み", "cigarra"],
    ],
    extended: [
      ["かぎ", "kagi", "か・ぎ", "chave"],
      ["ごはん", "gohan", "ご・は・ん", "refeicao"],
      ["ぶた", "buta", "ぶ・た", "porco"],
      ["ぱん", "pan", "ぱ・ん", "pao"],
      ["でんき", "denki", "で・ん・き", "eletricidade"],
      ["ぞう", "zou", "ぞ・う", "elefante"],
    ],
  },
  katakana: {
    base: [
      ["アイス", "aisu", "ア・イ・ス", "sorvete"],
      ["カメラ", "kamera", "カ・メ・ラ", "camera"],
      ["テスト", "tesuto", "テ・ス・ト", "teste"],
      ["ホテル", "hoteru", "ホ・テ・ル", "hotel"],
      ["メモ", "memo", "メ・モ", "anotacao"],
      ["レモン", "remon", "レ・モ・ン", "limao"],
      ["ノキ", "noki", "ノ・キ", "treino", true],
      ["ムサ", "musa", "ム・サ", "treino", true],
      ["ツナ", "tsuna", "ツ・ナ", "atum"],
      ["ネコ", "neko", "ネ・コ", "gato"],
    ],
    extended: [
      ["ガム", "gamu", "ガ・ム", "chiclete"],
      ["パン", "pan", "パ・ン", "pao"],
      ["バナナ", "banana", "バ・ナ・ナ", "banana"],
      ["ペン", "pen", "ペ・ン", "caneta"],
      ["ゴム", "gomu", "ゴ・ム", "borracha"],
      ["ジム", "jimu", "ジ・ム", "academia"],
    ],
  },
});

const builderDecks = createBuilderDecks({
  hiragana: {
    base: [
      ["いえ", ["i", "e"], "casa"],
      ["かお", ["ka", "o"], "rosto"],
      ["ねこ", ["ne", "ko"], "gato"],
      ["いぬ", ["i", "nu"], "cachorro"],
      ["すし", ["su", "shi"], "sushi"],
      ["さかな", ["sa", "ka", "na"], "peixe"],
    ],
    extended: [
      ["かぎ", ["ka", "gi"], "chave"],
      ["ぱん", ["pa", "n"], "pao"],
      ["ぶた", ["bu", "ta"], "porco"],
      ["でんき", ["de", "n", "ki"], "eletricidade"],
      ["ごはん", ["go", "ha", "n"], "refeicao"],
      ["ぞう", ["zo", "u"], "elefante"],
    ],
  },
  katakana: {
    base: [
      ["アイス", ["a", "i", "su"], "sorvete"],
      ["カメラ", ["ka", "me", "ra"], "camera"],
      ["テスト", ["te", "su", "to"], "teste"],
      ["メモ", ["me", "mo"], "anotacao"],
      ["ツナ", ["tsu", "na"], "atum"],
      ["ネコ", ["ne", "ko"], "gato"],
    ],
    extended: [
      ["ガム", ["ga", "mu"], "chiclete"],
      ["パン", ["pa", "n"], "pao"],
      ["ペン", ["pe", "n"], "caneta"],
      ["バナナ", ["ba", "na", "na"], "banana"],
      ["ゴム", ["go", "mu"], "borracha"],
      ["ジム", ["ji", "mu"], "academia"],
    ],
  },
});

const contextDecks = createContextDecks({
  hiragana: {
    base: [
      ["\u304a\u306f\u3088\u3046", "ohayou", "o / ha / yo / u", "bom dia", "expressao"],
      ["\u3053\u3093\u306b\u3061\u306f", "konnichiha", "ko / n / ni / chi / ha", "ola", "expressao"],
      ["\u3055\u3088\u3046\u306a\u3089", "sayounara", "sa / yo / u / na / ra", "ate logo", "expressao"],
      ["\u306e\u308a\u3082\u306e", "norimono", "no / ri / mo / no", "veiculo", "palavra"],
      ["\u3053\u3053\u308d", "kokoro", "ko / ko / ro", "coracao", "palavra"],
      ["\u305d\u3089\u3092\u307f\u308b", "sorawomiru", "so / ra / o / mi / ru", "olhar o ceu", "frase"],
      ["\u3044\u3048\u306b\u3044\u304f", "ieniiku", "i / e / ni / i / ku", "ir para casa", "frase"],
      ["\u3044\u306c\u3068\u306d\u3053", "inutoneko", "i / nu / to / ne / ko", "cachorro e gato", "frase"],
      ["\u3075\u3086\u306e\u3088\u308b", "fuyunoyoru", "fu / yu / no / yo / ru", "noite de inverno", "frase"],
      ["\u3084\u3055\u3044", "yasai", "ya / sa / i", "verduras", "palavra"],
    ],
    extended: [
      ["\u3042\u308a\u304c\u3068\u3046", "arigatou", "a / ri / ga / to / u", "obrigado", "expressao"],
      ["\u304a\u306d\u304c\u3044\u3057\u307e\u3059", "onegaishimasu", "o / ne / ga / i / shi / ma / su", "por favor", "expressao"],
      ["\u3044\u305f\u3060\u304d\u307e\u3059", "itadakimasu", "i / ta / da / ki / ma / su", "antes de comer", "expressao"],
      ["\u305f\u3079\u3082\u306e", "tabemono", "ta / be / mo / no", "comida", "palavra"],
      ["\u306e\u307f\u3082\u306e", "nomimono", "no / mi / mo / no", "bebida", "palavra"],
      ["\u3042\u3055\u3054\u306f\u3093", "asagohan", "a / sa / go / ha / n", "cafe da manha", "palavra"],
      ["\u307f\u305a\u3092\u306e\u3080", "mizuwonomu", "mi / zu / o / no / mu", "beber agua", "frase"],
      ["\u3054\u306f\u3093\u3092\u305f\u3079\u308b", "gohanwotaberu", "go / ha / n / o / ta / be / ru", "comer refeicao", "frase"],
      ["\u306d\u3053\u304c\u3044\u308b", "nekogairu", "ne / ko / ga / i / ru", "ha um gato", "frase"],
      ["\u3067\u3093\u304d\u304c\u3064\u304f", "denkigatsuku", "de / n / ki / ga / tsu / ku", "a luz acende", "frase"],
    ],
  },
  katakana: {
    base: [
      ["\u30ab\u30e1\u30e9", "kamera", "ka / me / ra", "camera", "palavra"],
      ["\u30db\u30c6\u30eb", "hoteru", "ho / te / ru", "hotel", "palavra"],
      ["\u30ec\u30e2\u30f3", "remon", "re / mo / n", "limao", "palavra"],
      ["\u30e1\u30ed\u30f3", "meron", "me / ro / n", "melao", "palavra"],
      ["\u30ab\u30bf\u30ab\u30ca", "katakana", "ka / ta / ka / na", "katakana", "palavra"],
      ["\u30ec\u30b9\u30c8\u30e9\u30f3", "resutoran", "re / su / to / ra / n", "restaurante", "palavra"],
      ["\u30a2\u30a4\u30b9\u30b3\u30b3\u30a2", "aisukokoa", "a / i / su / ko / ko / a", "cocoa gelado", "composto"],
      ["\u30ca\u30a4\u30d5", "naifu", "na / i / fu", "faca", "palavra"],
      ["\u30c8\u30de\u30c8", "tomato", "to / ma / to", "tomate", "palavra"],
      ["\u30af\u30e9\u30b9", "kurasu", "ku / ra / su", "turma", "palavra"],
    ],
    extended: [
      ["\u30d0\u30ca\u30ca", "banana", "ba / na / na", "banana", "palavra"],
      ["\u30e9\u30b8\u30aa", "rajio", "ra / ji / o", "radio", "palavra"],
      ["\u30b8\u30e0", "jimu", "ji / mu", "academia", "palavra"],
      ["\u30ac\u30e9\u30b9", "garasu", "ga / ra / su", "vidro", "palavra"],
      ["\u30dc\u30bf\u30f3", "botan", "bo / ta / n", "botao", "palavra"],
      ["\u30b5\u30e9\u30c0", "sarada", "sa / ra / da", "salada", "palavra"],
      ["\u30c8\u30de\u30c8\u30b5\u30e9\u30c0", "tomatosarada", "to / ma / to / sa / ra / da", "salada de tomate", "composto"],
      ["\u30ac\u30e9\u30b9\u30dc\u30c8\u30eb", "garasubotoru", "ga / ra / su / bo / to / ru", "garrafa de vidro", "composto"],
      ["\u30e9\u30b8\u30aa\u30c9\u30e9\u30de", "rajiodorama", "ra / ji / o / do / ra / ma", "radio drama", "composto"],
      ["\u30d0\u30ca\u30ca\u30dc\u30a6\u30eb", "bananabouru", "ba / na / na / bo / u / ru", "tigela de banana", "composto"],
    ],
  },
});

const phraseDecks = createPhraseDecks({
  base: [
    [
      "saudacoes",
      "\u3053\u3093\u306b\u3061\u306f\u305d\u3089\u306f\u3042\u304a\u3044\u3067\u3059",
      "konnichihasorahaaoidesu",
      "ko / n / ni / chi / ha / so / ra / ha / a / o / i / de / su",
      "ola, o ceu esta azul",
      "abrindo a conversa com calma"
    ],
    [
      "saudacoes",
      "\u307e\u305f\u3042\u3068\u3067\u3053\u3053\u3067\u3042\u3046",
      "mataatodekokodeau",
      "ma / ta / a / to / de / ko / ko / de / a / u",
      "a gente se ve aqui mais tarde",
      "combinando um reencontro"
    ],
    [
      "viagem",
      "\u3048\u304d\u307e\u3067\u3042\u308b\u3044\u3066\u3044\u304f",
      "ekimadearuiteiku",
      "e / ki / ma / de / a / ru / i / te / i / ku",
      "vou andando ate a estacao",
      "indo para a estacao"
    ],
    [
      "viagem",
      "\u307b\u3066\u308b\u306e\u3078\u3084\u3067\u306b\u3082\u3064\u3092\u304a\u304f",
      "hoterunoheyadenimotsuwooku",
      "ho / te / ru / no / he / ya / de / ni / mo / tsu / o / o / ku",
      "deixo a bagagem no quarto do hotel",
      "chegando na hospedagem"
    ],
    [
      "conversa",
      "\u3044\u307e\u306a\u306b\u3092\u3057\u3066\u3044\u308b\u306e\u3067\u3059\u304b",
      "imananiwoshiteirunodesuka",
      "i / ma / na / ni / o / shi / te / i / ru / no / de / su / ka",
      "o que voce esta fazendo agora?",
      "puxando assunto"
    ],
    [
      "conversa",
      "\u308f\u305f\u3057\u306f\u3053\u306e\u3046\u305f\u304c\u3059\u304d\u3067\u3059",
      "watashihakonoutagasukidesu",
      "wa / ta / shi / ha / ko / no / u / ta / ga / su / ki / de / su",
      "eu gosto desta musica",
      "falando de gosto pessoal"
    ],
    [
      "anime",
      "\u3053\u306e\u3042\u306b\u3081\u306f\u3055\u3044\u3054\u307e\u3067\u307f\u305f\u3044",
      "konoanimehasaigomademitai",
      "ko / no / a / ni / me / ha / sa / i / go / ma / de / mi / ta / i",
      "quero ver este anime ate o fim",
      "comentando uma serie"
    ],
    [
      "anime",
      "\u3064\u304e\u306e\u306f\u306a\u3057\u3082\u307e\u305f\u307f\u308b",
      "tsuginohanashimomatamiru",
      "tsu / gi / no / ha / na / shi / mo / ma / ta / mi / ru",
      "vou ver o proximo episodio tambem",
      "continuando a historia"
    ],
  ],
  extended: [
    [
      "saudacoes",
      "\u304a\u306f\u3088\u3046\u3054\u3056\u3044\u307e\u3059\u307e\u305f\u3042\u3068\u3067\u3042\u3046",
      "ohayougozaimasumataatodeau",
      "o / ha / yo / u / go / za / i / ma / su / ma / ta / a / to / de / a / u",
      "bom dia, nos vemos mais tarde",
      "falando com mais educacao"
    ],
    [
      "saudacoes",
      "\u304a\u3084\u3059\u307f\u306d\u3080\u308b\u307e\u3048\u306b\u307e\u3069\u3092\u3057\u3081\u3066\u306d",
      "oyasuminemurumaaenimadowoshimetene",
      "o / ya / su / mi / ne / mu / ru / ma / e / ni / ma / do / o / shi / me / te / ne",
      "boa noite, feche a janela antes de dormir",
      "encerrando o dia"
    ],
    [
      "viagem",
      "\u3070\u3059\u306e\u3058\u304b\u3093\u3092\u3057\u3089\u3079\u3066\u304b\u3089\u3067\u308b",
      "basunojikanwoshirabetekaraderu",
      "ba / su / no / ji / ka / n / o / shi / ra / be / te / ka / ra / de / ru",
      "eu vejo o horario do onibus antes de sair",
      "planejando a rota"
    ],
    [
      "viagem",
      "\u307f\u3061\u304c\u308f\u304b\u3089\u306a\u3044\u306e\u3067\u3048\u304d\u3044\u3093\u306b\u304d\u304f",
      "michigawakaranainodeekiinnikiku",
      "mi / chi / ga / wa / ka / ra / na / i / no / de / e / ki / i / n / ni / ki / ku",
      "como nao sei o caminho, pergunto para a pessoa da estacao",
      "pedindo ajuda"
    ],
    [
      "conversa",
      "\u305d\u306e\u306f\u306a\u3057\u3092\u304d\u3044\u3066\u3068\u3066\u3082\u3042\u3093\u3057\u3093\u3057\u305f",
      "sonohanashiwokiitetotemoanshinshita",
      "so / no / ha / na / shi / o / ki / i / te / to / te / mo / a / n / shi / n / shi / ta",
      "fiquei muito aliviado depois de ouvir isso",
      "respondendo com emocao"
    ],
    [
      "conversa",
      "\u3053\u3093\u3069\u306e\u3084\u3059\u307f\u306b\u3069\u3053\u3078\u3044\u304d\u305f\u3044\u3067\u3059\u304b",
      "kondonoyasuminidokoheikitaidesuka",
      "ko / n / do / no / ya / su / mi / ni / do / ko / he / i / ki / ta / i / de / su / ka",
      "nas proximas ferias, para onde voce quer ir?",
      "planejando algo junto"
    ],
    [
      "anime",
      "\u3053\u306e\u3042\u306b\u3081\u306e\u3064\u3065\u304d\u304c\u3068\u3066\u3082\u304d\u306b\u306a\u308b",
      "konoanimenotsudukigatotemokininaru",
      "ko / no / a / ni / me / no / tsu / du / ki / ga / to / te / mo / ki / ni / na / ru",
      "estou muito curioso com a continuacao deste anime",
      "falando do proximo arco"
    ],
    [
      "anime",
      "\u3055\u3044\u3054\u306e\u305b\u308a\u3075\u304c\u3053\u3053\u308d\u306b\u306e\u3053\u308a\u307e\u3057\u305f",
      "saigonoserifugakokoroninokorimashita",
      "sa / i / go / no / se / ri / fu / ga / ko / ko / ro / ni / no / ko / ri / ma / shi / ta",
      "a fala final ficou no meu coracao",
      "lembrando uma cena forte"
    ],
  ],
});

const contextBuilderDecks = createBuilderDecksFromContext(contextDecks);

const confusionDecks = createConfusionDecks({
  hiragana: [
    ['Qual deles representa o som "nu"?', "nu", ["ぬ", "め"], "ぬ", "ぬ fecha com um laco mais solto; め parece mais apertado."],
    ['Qual deles representa o som "re"?', "re", ["れ", "ね"], "れ", "ね fecha um circulo mais completo; れ termina mais aberta."],
    ['Qual deles representa o som "a"?', "a", ["あ", "お"], "あ", "あ abre mais no centro; お ganha um tracinho extra."],
    ['Qual deles representa o som "ki"?', "ki", ["さ", "き"], "き", "き tem cortes mais verticais; さ fica mais solta em muitas fontes."],
    ['Qual deles representa o som "shi"?', "shi", ["し", "つ"], "し", "し desce mais suave; つ abre como um arco mais curto."],
  ],
  katakana: [
    ['Qual deles representa o som "shi"?', "shi", ["シ", "ツ"], "シ", "Em シ os tracos pequenos caem para baixo; em ツ apontam para a direita."],
    ['Qual deles representa o som final "n"?', "n", ["ソ", "ン"], "ン", "ン comeca mais alto e despenca mais seco; ソ deixa o risco curto mais baixo."],
    ['Qual deles representa o som "ku"?', "ku", ["ク", "ケ"], "ク", "ク parece um unico gancho descendo; ケ abre com dois gestos."],
    ['Qual deles representa o som "nu"?', "nu", ["ヌ", "ス"], "ヌ", "ヌ fecha com um cruzamento; ス parece mais limpo e solto."],
  ],
  mixed: [
    ['Qual deles esta em hiragana para o som "shi"?', "shi", ["し", "シ"], "し", "Hiragana tende a ser mais curvo; katakana, mais reto."],
    ['Qual deles esta em katakana para o som "tsu"?', "tsu", ["つ", "ツ"], "ツ", "Mesmo som, desenho mais angular no katakana."],
    ['Qual deles esta em katakana para o som final "n"?', "n", ["ん", "ン"], "ン", "Os dois fecham a silaba com N, mas em sistemas diferentes."],
    ['Qual deles esta em hiragana para o som "fu"?', "fu", ["ふ", "フ"], "ふ", "Mesmo som, grafias de sistemas diferentes."],
  ],
});

const confusionSets = {
  hiragana: [
    ["あ / お", "Em あ a curva central se abre mais. Em お aparece um tracinho extra que ajuda a segurar o som redondo."],
    ["ぬ / め", "ぬ costuma fechar em um laco mais solto. め parece mais compacto, quase apertado no meio."],
    ["れ / ね", "ね fecha com um laco completo. れ termina mais aberta, sem fechar o mesmo circulo."],
    ["さ / き", "Em fontes de estudo, さ costuma parecer mais solta. き tem os cortes mais marcados na vertical."],
  ],
  katakana: [
    ["シ / ツ", "Olhe a direcao dos dois tracos pequenos: em シ eles caem para baixo; em ツ apontam mais para a direita."],
    ["ソ / ン", "ソ tem um risco curto mais baixo; ン comeca mais alto e despenca mais seco."],
    ["ク / ケ", "ケ abre com dois gestos; ク parece um unico gancho descendo."],
    ["ヌ / ス", "ヌ fecha com um cruzamento; ス parece mais limpo, com a perna descendo para fora."],
  ],
  mixed: [
    ["し / シ", "Mesmo som, mas estilos diferentes. Um e curvo, o outro reto."],
    ["つ / ツ", "O som e o mesmo, mas o desenho do katakana tende a ficar mais angular."],
    ["ん / ン", "Os dois fecham a silaba com N. Compare a versao cursiva com a versao reta."],
    ["ふ / フ", "Ambos soam fu. Tente reconhecer o som antes de pensar na escrita."],
  ],
};

const arcadeCatalog = [
  {
    id: "shuriken",
    icon: "🥷",
    title: "Shuriken no Kana",
    jpTitle: "\u624b\u88cf\u5263\u306e\u4eee\u540d",
    description: "Um kana cai na arena. Digite o romaji antes de tocar o chao.",
    tags: ["Hiragana", "Katakana", "Digitacao"],
    difficulty: 2,
  },
  {
    id: "foods",
    icon: "🍣",
    title: "Pratos do Japao",
    jpTitle: "\u65e5\u672c\u306e\u6599\u7406",
    description: "Veja o prato tipico e escolha a traducao correta antes do tempo acabar.",
    tags: ["Vocabulario", "Comida", "Escolha"],
    difficulty: 1,
  },
  {
    id: "pairs",
    icon: "🀄",
    title: "Parear Kana",
    jpTitle: "\u4eee\u540d\u5408\u308f\u305b",
    description: "Encontre os pares de kana e romaji o mais rapido possivel.",
    tags: ["Memoria", "Kana", "Rapidez"],
    difficulty: 1,
  },
];

const arcadeFoodDeck = [
  {
    id: "takoyaki",
    emoji: "🐙",
    kana: "\u305f\u3053\u713c\u304d",
    romaji: "takoyaki",
    region: "Osaka",
    answer: "bolinho de polvo",
    options: ["lamen", "bolinho de polvo", "cha verde matcha", "sopa de miso"],
  },
  {
    id: "ramen",
    emoji: "🍜",
    kana: "\u30e9\u30fc\u30e1\u30f3",
    romaji: "raamen",
    region: "Fukuoka",
    answer: "lamen",
    options: ["lamen", "arroz com curry", "omelete", "sushi prensado"],
  },
  {
    id: "onigiri",
    emoji: "🍙",
    kana: "\u304a\u306b\u304e\u308a",
    romaji: "onigiri",
    region: "Tokyo",
    answer: "bolinho de arroz",
    options: ["bolinho de arroz", "tempura", "cha verde matcha", "sobremesa de feijao"],
  },
  {
    id: "tempura",
    emoji: "🍤",
    kana: "\u5929\u3077\u3089",
    romaji: "tenpura",
    region: "Tokyo",
    answer: "fritura leve",
    options: ["peixe grelhado", "fritura leve", "ensopado", "pao recheado"],
  },
  {
    id: "matcha",
    emoji: "🍵",
    kana: "\u62b9\u8336",
    romaji: "matcha",
    region: "Kyoto",
    answer: "cha verde matcha",
    options: ["cha verde matcha", "sopa fria", "macarrao grosso", "doce de arroz"],
  },
  {
    id: "okonomiyaki",
    emoji: "🥞",
    kana: "\u304a\u597d\u307f\u713c\u304d",
    romaji: "okonomiyaki",
    region: "Hiroshima",
    answer: "panqueca salgada",
    options: ["panqueca salgada", "tigela de peixe", "sushi prensado", "tofu frito"],
  },
  {
    id: "miso",
    emoji: "🥣",
    kana: "\u5473\u564c\u6c41",
    romaji: "misoshiru",
    region: "Nagoya",
    answer: "sopa de miso",
    options: ["sopa de miso", "bolinho doce", "cha de cevada", "lamen gelado"],
  },
  {
    id: "curry",
    emoji: "🍛",
    kana: "\u30ab\u30ec\u30fc\u30e9\u30a4\u30b9",
    romaji: "kareeraisu",
    region: "Yokohama",
    answer: "arroz com curry",
    options: ["arroz com curry", "bolinho de polvo", "omelete", "soba gelado"],
  },
];

const allEntries = [
  ...baseLibrary.hiragana,
  ...baseLibrary.katakana,
  ...extendedLibrary.hiragana,
  ...extendedLibrary.katakana,
];

const entryIndex = new Map(allEntries.map((entry) => [entry.id, entry]));
const charIndex = new Map(allEntries.map((entry) => [entry.char, entry]));

hydrateDeckCharIds(readingDecks);
hydrateDeckCharIds(builderDecks);
hydrateDeckCharIds(contextDecks);
hydrateDeckCharIds(phraseDecks);
hydrateDeckCharIds(contextBuilderDecks);
hydrateDeckCharIds(confusionDecks);

function createArcadeState() {
  return {
    screen: "hub",
    shuriken: createShurikenState(),
    foods: createFoodState(),
    pairs: createPairsState(),
  };
}

function createShurikenState() {
  return {
    running: false,
    score: 0,
    combo: 0,
    lives: 3,
    current: null,
    x: 50,
    y: 0,
    rotation: 0,
    speed: 110,
    lastFrame: 0,
    rafId: 0,
    status: "Kana caindo em 3 vidas. O ritmo acelera quando voce engata combo.",
  };
}

function createFoodState() {
  return {
    running: false,
    score: 0,
    lives: 3,
    timeLeft: 60,
    timerId: 0,
    current: null,
    options: [],
    status: "Sessao de 60 segundos com 3 vidas.",
  };
}

function createPairsState() {
  return {
    running: false,
    board: [],
    moves: 0,
    found: 0,
    seconds: 0,
    timerId: 0,
    timeoutId: 0,
    firstIndex: null,
    lock: false,
    status: "Monte 8 pares usando o alfabeto ativo do topo.",
  };
}

const elements = {
  authGate: document.getElementById("auth-gate"),
  authToggle: document.getElementById("auth-toggle"),
  authKicker: document.getElementById("auth-kicker"),
  authCopy: document.getElementById("auth-copy"),
  loginForm: document.getElementById("login-form"),
  signupForm: document.getElementById("signup-form"),
  loginName: document.getElementById("login-name"),
  loginPassword: document.getElementById("login-password"),
  signupName: document.getElementById("signup-name"),
  signupPassword: document.getElementById("signup-password"),
  authFeedback: document.getElementById("auth-feedback"),
  sectionNav: document.getElementById("section-nav"),
  trainNav: document.getElementById("train-nav"),
  scriptToggle: document.getElementById("script-toggle"),
  levelToggle: document.getElementById("level-toggle"),
  focusToggle: document.getElementById("focus-toggle"),
  profileName: document.getElementById("profile-name"),
  profileRank: document.getElementById("profile-rank"),
  syncBadge: document.getElementById("sync-badge"),
  logoutButton: document.getElementById("logout-button"),
  studiedCount: document.getElementById("studied-count"),
  masteredCount: document.getElementById("mastered-count"),
  reviewCount: document.getElementById("review-count"),
  bestStreak: document.getElementById("best-streak"),
  kanaGrid: document.getElementById("kana-grid"),
  detailScript: document.getElementById("detail-script"),
  detailFamily: document.getElementById("detail-family"),
  detailCharacter: document.getElementById("detail-character"),
  revealCard: document.getElementById("reveal-card"),
  detailAnswer: document.getElementById("detail-answer"),
  detailRomaji: document.getElementById("detail-romaji"),
  detailFormula: document.getElementById("detail-formula"),
  detailNote: document.getElementById("detail-note"),
  detailExample: document.getElementById("detail-example"),
  detailStats: document.getElementById("detail-stats"),
  detailVoice: document.getElementById("detail-voice"),
  prevCard: document.getElementById("prev-card"),
  randomCard: document.getElementById("random-card"),
  nextCard: document.getElementById("next-card"),
  quizModeLabel: document.getElementById("quiz-mode-label"),
  quizStreakLabel: document.getElementById("quiz-streak-label"),
  quizInstruction: document.getElementById("quiz-instruction"),
  quizPrompt: document.getElementById("quiz-prompt"),
  quizOptions: document.getElementById("quiz-options"),
  quizFeedback: document.getElementById("quiz-feedback"),
  nextQuiz: document.getElementById("next-quiz"),
  readingWord: document.getElementById("reading-word"),
  readingForm: document.getElementById("reading-form"),
  readingInput: document.getElementById("reading-input"),
  readingFeedback: document.getElementById("reading-feedback"),
  readingVoice: document.getElementById("reading-voice"),
  showReadingAnswer: document.getElementById("show-reading-answer"),
  nextReading: document.getElementById("next-reading"),
  readingStreakLabel: document.getElementById("reading-streak-label"),
  contextKindLabel: document.getElementById("context-kind-label"),
  contextWord: document.getElementById("context-word"),
  contextBreakdown: document.getElementById("context-breakdown"),
  contextMeaning: document.getElementById("context-meaning"),
  contextForm: document.getElementById("context-form"),
  contextInput: document.getElementById("context-input"),
  contextFeedback: document.getElementById("context-feedback"),
  contextVoice: document.getElementById("context-voice"),
  showContextAnswer: document.getElementById("show-context-answer"),
  nextContext: document.getElementById("next-context"),
  contextStreakLabel: document.getElementById("context-streak-label"),
  phraseCategories: document.getElementById("phrase-categories"),
  phraseCategoryLabel: document.getElementById("phrase-category-label"),
  phraseStreakLabel: document.getElementById("phrase-streak-label"),
  phraseScene: document.getElementById("phrase-scene"),
  phraseWord: document.getElementById("phrase-word"),
  phraseBreakdown: document.getElementById("phrase-breakdown"),
  phraseMeaning: document.getElementById("phrase-meaning"),
  phraseForm: document.getElementById("phrase-form"),
  phraseInput: document.getElementById("phrase-input"),
  phraseFeedback: document.getElementById("phrase-feedback"),
  phraseVoice: document.getElementById("phrase-voice"),
  showPhraseAnswer: document.getElementById("show-phrase-answer"),
  nextPhrase: document.getElementById("next-phrase"),
  clozeKindLabel: document.getElementById("cloze-kind-label"),
  clozeInstruction: document.getElementById("cloze-instruction"),
  clozeWord: document.getElementById("cloze-word"),
  clozeMeaning: document.getElementById("cloze-meaning"),
  clozeOptions: document.getElementById("cloze-options"),
  clozeFeedback: document.getElementById("cloze-feedback"),
  clozeStreakLabel: document.getElementById("cloze-streak-label"),
  nextCloze: document.getElementById("next-cloze"),
  dictationKindLabel: document.getElementById("dictation-kind-label"),
  dictationMeaning: document.getElementById("dictation-meaning"),
  dictationForm: document.getElementById("dictation-form"),
  dictationInput: document.getElementById("dictation-input"),
  dictationFeedback: document.getElementById("dictation-feedback"),
  dictationVoice: document.getElementById("dictation-voice"),
  showDictationAnswer: document.getElementById("show-dictation-answer"),
  nextDictation: document.getElementById("next-dictation"),
  dictationStreakLabel: document.getElementById("dictation-streak-label"),
  confusionInstruction: document.getElementById("confusion-instruction"),
  confusionPrompt: document.getElementById("confusion-prompt"),
  confusionOptions: document.getElementById("confusion-options"),
  confusionFeedback: document.getElementById("confusion-feedback"),
  confusionStreakLabel: document.getElementById("confusion-streak-label"),
  nextConfusion: document.getElementById("next-confusion"),
  builderRomaji: document.getElementById("builder-romaji"),
  builderMeaning: document.getElementById("builder-meaning"),
  builderSlots: document.getElementById("builder-slots"),
  builderBank: document.getElementById("builder-bank"),
  builderFeedback: document.getElementById("builder-feedback"),
  builderStreakLabel: document.getElementById("builder-streak-label"),
  builderVoice: document.getElementById("builder-voice"),
  builderUndo: document.getElementById("builder-undo"),
  builderClear: document.getElementById("builder-clear"),
  showBuilderAnswer: document.getElementById("show-builder-answer"),
  nextBuilder: document.getElementById("next-builder"),
  focusModeLabel: document.getElementById("focus-mode-label"),
  weakCountLabel: document.getElementById("weak-count-label"),
  focusSummary: document.getElementById("focus-summary"),
  weakList: document.getElementById("weak-list"),
  focusModeLabelReview: document.getElementById("focus-mode-label-review"),
  weakCountLabelReview: document.getElementById("weak-count-label-review"),
  focusSummaryReview: document.getElementById("focus-summary-review"),
  weakListReview: document.getElementById("weak-list-review"),
  activateWeakFocus: document.getElementById("activate-weak-focus"),
  clearFocus: document.getElementById("clear-focus"),
  confusionGrid: document.getElementById("confusion-grid"),
  resetProgress: document.getElementById("reset-progress"),
  arcadeShell: document.getElementById("arcade-shell"),
  arcadeLevel: document.getElementById("arcade-level"),
  arcadeXp: document.getElementById("arcade-xp"),
  arcadeStars: document.getElementById("arcade-stars"),
  arcadeLastMode: document.getElementById("arcade-last-mode"),
  arcadeLastLaunch: document.getElementById("arcade-last-launch"),
  arcadeFeatureTitle: document.getElementById("arcade-feature-title"),
  arcadeFeatureCopy: document.getElementById("arcade-feature-copy"),
  arcadeFeatureProgress: document.getElementById("arcade-feature-progress"),
  arcadeFeatureMeta: document.getElementById("arcade-feature-meta"),
  arcadeCardPreview: document.getElementById("arcade-card-preview"),
  arcadeCardList: document.getElementById("arcade-card-list"),
  arcadeGamesPreview: document.getElementById("arcade-games-preview"),
  arcadeGameList: document.getElementById("arcade-game-list"),
  arcadeRecordGrid: document.getElementById("arcade-record-grid"),
  arcadeRankingList: document.getElementById("arcade-ranking-list"),
  rankingKicker: document.getElementById("ranking-kicker"),
  rankingHeading: document.getElementById("ranking-heading"),
  rankingCount: document.getElementById("ranking-count"),
  shurikenArena: document.getElementById("shuriken-arena"),
  shurikenToken: document.getElementById("shuriken-token"),
  shurikenInput: document.getElementById("shuriken-input"),
  shurikenStart: document.getElementById("shuriken-start"),
  shurikenScore: document.getElementById("shuriken-score"),
  shurikenCombo: document.getElementById("shuriken-combo"),
  shurikenRecord: document.getElementById("shuriken-record"),
  shurikenLives: document.getElementById("shuriken-lives"),
  shurikenStatus: document.getElementById("shuriken-status"),
  foodStart: document.getElementById("food-start"),
  foodScore: document.getElementById("food-score"),
  foodLives: document.getElementById("food-lives"),
  foodTime: document.getElementById("food-time"),
  foodRecord: document.getElementById("food-record"),
  foodEmoji: document.getElementById("food-emoji"),
  foodKana: document.getElementById("food-kana"),
  foodRomaji: document.getElementById("food-romaji"),
  foodRegion: document.getElementById("food-region"),
  foodOptions: document.getElementById("food-options"),
  foodStatus: document.getElementById("food-status"),
  pairsStart: document.getElementById("pairs-start"),
  pairsMoves: document.getElementById("pairs-moves"),
  pairsFound: document.getElementById("pairs-found"),
  pairsTime: document.getElementById("pairs-time"),
  pairsRecord: document.getElementById("pairs-record"),
  pairsGrid: document.getElementById("pairs-grid"),
  pairsStatus: document.getElementById("pairs-status"),
  storageCopy: document.getElementById("storage-copy"),
};

const runtime = {
  mode: "local",
  bridge: null,
  saveTimer: 0,
  savePromise: Promise.resolve(),
  leaderboardPromise: null,
};

const state = {
  section: "today",
  trainMode: "recognition",
  script: "hiragana",
  level: "base",
  focus: "all",
  phraseCategory: "saudacoes",
  currentUser: null,
  currentUserId: null,
  authMode: "login",
  storageMode: "local",
  syncStatus: "local",
  sharedRanking: [],
  leaderboardLoadedAt: 0,
  selectedId: null,
  revealCard: false,
  quizStreak: 0,
  readingStreak: 0,
  contextStreak: 0,
  phraseStreak: 0,
  clozeStreak: 0,
  dictationStreak: 0,
  confusionStreak: 0,
  builderStreak: 0,
  progress: defaultProgress(),
  arcade: createArcadeState(),
  recent: {
    quiz: [],
    reading: [],
    context: [],
    phrases: [],
    cloze: [],
    dictation: [],
    confusion: [],
    builder: [],
  },
  quiz: null,
  reading: null,
  context: null,
  phrase: null,
  cloze: null,
  dictation: null,
  confusion: null,
  builder: null,
};

void bootstrap();

async function bootstrap() {
  bindControls();
  await initializeRuntime();

  if (isCloudMode()) {
    const restoredSession = await restoreSharedSession();
    if (restoredSession) {
      applyAuthenticatedState(restoredSession, { refresh: false });
    }
  } else {
    const restoredUser = restoreLocalSession();
    if (restoredUser) {
      applyAuthenticatedState(
        {
          userName: restoredUser,
          progress: loadProgress(restoredUser),
        },
        { refresh: false }
      );
    }
  }
  ensureSelection();
  generateQuiz();
  generateReading();
  generateContext();
  generateCloze();
  generateDictation();
  generateConfusion();
  generateBuilder();
  renderAll();
  renderIdentity();

  if (state.currentUser) {
    hideAuthGate();
  } else {
    showAuthGate("login");
  }
}

async function initializeRuntime() {
  const config = await loadRuntimeConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    state.storageMode = "local";
    runtime.mode = "local";
    setSyncStatus("local");
    return;
  }

  try {
    const bridgeModule = await import("./supabase-bridge.js");
    runtime.bridge = bridgeModule.createSupabaseBridge({
      url: config.supabaseUrl,
      anonKey: config.supabaseAnonKey,
    });
    runtime.mode = "cloud";
    state.storageMode = "cloud";
    setSyncStatus("ready");
  } catch (error) {
    console.error("Nao foi possivel iniciar o modo online.", error);
    runtime.mode = "local";
    runtime.bridge = null;
    state.storageMode = "local";
    setSyncStatus("error");
  }
}

async function loadRuntimeConfig() {
  const localConfig =
    window.KANA_SPRINT_CONFIG && typeof window.KANA_SPRINT_CONFIG === "object"
      ? window.KANA_SPRINT_CONFIG
      : {};

  if (!window.location.protocol.startsWith("http")) {
    return localConfig;
  }

  try {
    const response = await fetch("/api/runtime-config", {
      cache: "no-store",
      headers: {
        accept: "application/json",
      },
    });
    if (!response.ok) {
      return localConfig;
    }
    const serverConfig = await response.json();
    return {
      ...localConfig,
      ...serverConfig,
    };
  } catch {
    return localConfig;
  }
}

function isCloudMode() {
  return runtime.mode === "cloud" && Boolean(runtime.bridge);
}

function normalizeLoadedProgress(progress) {
  const normalized = {
    ...defaultProgress(),
    ...(progress || {}),
    charStats: progress?.charStats || progress?.stats || {},
    itemStats: progress?.itemStats || {},
  };
  normalized.xp = Number.isFinite(Number(normalized.xp))
    ? Math.max(0, Number(normalized.xp))
    : computeLegacyXp(normalized);
  return normalized;
}

function computeLegacyXp(progress = defaultProgress()) {
  const practicedEntries = Object.entries(progress.charStats || {}).filter(([, value]) => {
    const total = (value?.hits || 0) + (value?.misses || 0);
    return total > 0;
  });

  const masteredCount = practicedEntries.filter(([id, value]) => {
    if (!entryIndex.has(id)) {
      return false;
    }
    const total = value.hits + value.misses;
    return value.hits >= 4 && total >= 5 && value.hits / total >= 0.78;
  }).length;

  const clearedGames = Number((progress.bestArcadeShuriken || 0) > 0) +
    Number((progress.bestArcadeFoods || 0) > 0) +
    Number((progress.bestArcadePairs || 0) > 0);

  return practicedEntries.length * 8 + masteredCount * 14 + clearedGames * 24;
}

function applyXpDelta(delta) {
  const current = Number(state.progress.xp || 0);
  const next = Math.max(0, current + delta);
  state.progress.xp = next;
  return next - current;
}

function formatXpDelta(delta) {
  return `${delta > 0 ? "+" : ""}${delta} XP`;
}

function setSyncStatus(status) {
  state.syncStatus = status;
  renderStorageChrome();
}

function setAuthMode(mode) {
  state.authMode = mode === "signup" ? "signup" : "login";
  elements.authToggle?.querySelectorAll("[data-auth-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === state.authMode);
  });
  elements.loginForm?.classList.toggle("is-hidden", state.authMode !== "login");
  elements.signupForm?.classList.toggle("is-hidden", state.authMode !== "signup");
  if (elements.authFeedback) {
    elements.authFeedback.textContent = "";
  }
}

function showAuthGate(mode = "login") {
  setAuthMode(mode);
  elements.authGate?.classList.remove("is-hidden");
  if (state.authMode === "login") {
    elements.loginName?.focus();
  } else {
    elements.signupName?.focus();
  }
}

function hideAuthGate() {
  elements.authGate?.classList.add("is-hidden");
}

async function handleLoginSubmit() {
  const userName = normalizeProfileName(elements.loginName?.value || "");
  const password = elements.loginPassword?.value || "";

  if (!userName || !password) {
    elements.authFeedback.textContent = "Preencha nome e senha para entrar.";
    return;
  }

  if (isCloudMode()) {
    try {
      setSyncStatus("saving");
      const restoredSession = await runtime.bridge.signIn(userName, password);
      applyAuthenticatedState(restoredSession);
      elements.loginPassword.value = "";
      elements.authFeedback.textContent = "";
      setSyncStatus("synced");
      return;
    } catch (error) {
      console.error(error);
      elements.authFeedback.textContent = getCloudErrorMessage(
        error,
        "Nao foi possivel entrar agora."
      );
      setSyncStatus("error");
      return;
    }
  }

  const profiles = loadProfiles();
  const profile = profiles.find((item) => item.userName === userName);
  if (!profile) {
    elements.authFeedback.textContent = "Esse perfil ainda nao existe neste navegador.";
    return;
  }

  if (profile.passwordHash !== hashPassword(password)) {
    elements.authFeedback.textContent = "Senha incorreta.";
    return;
  }

  applyAuthenticatedState({
    userName,
    progress: loadProgress(userName),
  });
  elements.loginPassword.value = "";
  elements.authFeedback.textContent = "";
}

async function handleSignupSubmit() {
  const userName = normalizeProfileName(elements.signupName?.value || "");
  const password = elements.signupPassword?.value || "";
  const minPasswordLength = isCloudMode() ? 6 : 4;

  if (userName.length < 3) {
    elements.authFeedback.textContent = "Escolha um nome com pelo menos 3 caracteres.";
    return;
  }

  if (password.length < minPasswordLength) {
    elements.authFeedback.textContent = `Use uma senha com pelo menos ${minPasswordLength} caracteres.`;
    return;
  }

  if (isCloudMode()) {
    try {
      setSyncStatus("saving");
      const localSeed = loadProgress(userName);
      const createdSession = await runtime.bridge.signUp(userName, password);

      if (createdSession.pendingConfirmation) {
        elements.authFeedback.textContent =
          "No Supabase, desative a confirmacao por email para usar apenas nome e senha.";
        setSyncStatus("ready");
        return;
      }

      applyAuthenticatedState({
        ...createdSession,
        progress: hasStoredProgress(localSeed) ? localSeed : createdSession.progress,
      });
      await saveProgress({ immediate: true });
      elements.signupPassword.value = "";
      elements.authFeedback.textContent = "";
      setSyncStatus("synced");
      return;
    } catch (error) {
      console.error(error);
      elements.authFeedback.textContent = getCloudErrorMessage(
        error,
        "Nao foi possivel criar a conta agora."
      );
      setSyncStatus("error");
      return;
    }
  }

  const profiles = loadProfiles();
  if (profiles.some((item) => item.userName === userName)) {
    elements.authFeedback.textContent = "Esse nome ja foi usado neste navegador.";
    return;
  }

  profiles.push({
    userName,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  });
  saveProfiles(profiles);

  applyAuthenticatedState({
    userName,
    progress: loadProgress(userName),
  });
  saveProgress({ immediate: true });
  elements.signupPassword.value = "";
  elements.authFeedback.textContent = "";
}

function applyAuthenticatedState(sessionData, options = {}) {
  const { refresh = true } = options;
  state.currentUser = sessionData.userName;
  state.currentUserId = sessionData.userId || null;
  state.progress = normalizeLoadedProgress(sessionData.progress);
  if (Array.isArray(sessionData.leaderboard)) {
    state.sharedRanking = sessionData.leaderboard;
    state.leaderboardLoadedAt = Date.now();
  }
  persistSession(sessionData.userName);
  hideAuthGate();
  if (refresh) {
    refreshPracticeState();
  }
  renderIdentity();
}

async function logoutCurrentUser() {
  stopArcadeGames();
  await flushPendingProgressSave();
  if (isCloudMode()) {
    try {
      await runtime.bridge.signOut();
    } catch (error) {
      console.error("Falha ao encerrar a sessao online.", error);
    }
  }
  clearSession();
  state.currentUser = null;
  state.currentUserId = null;
  state.progress = defaultProgress();
  state.sharedRanking = [];
  state.leaderboardLoadedAt = 0;
  state.arcade = createArcadeState();
  state.section = "today";
  setSyncStatus(isCloudMode() ? "ready" : "local");
  renderAll();
  renderIdentity();
  showAuthGate("login");
}

function renderIdentity() {
  const summary = summarizeProgress(state.progress);
  renderStorageChrome();
  if (elements.profileName) {
    elements.profileName.textContent = state.currentUser || "Visitante";
  }
  if (elements.profileRank) {
    elements.profileRank.textContent = `${summary.rank} - LV ${summary.level}`;
  }
  if (elements.logoutButton) {
    elements.logoutButton.disabled = !state.currentUser;
  }
}

function renderStorageChrome() {
  if (elements.authKicker) {
    elements.authKicker.textContent = isCloudMode() ? "Conta sincronizada" : "Perfil local";
  }
  if (elements.authCopy) {
    elements.authCopy.textContent = isCloudMode()
      ? "Entre com nome e senha. Seu progresso e ranking ficam sincronizados entre celular e PC."
      : "Entre com nome e senha. Sem Supabase, o app continua funcionando neste navegador.";
  }
  if (elements.storageCopy) {
    elements.storageCopy.textContent = isCloudMode()
      ? "Seu progresso esta sendo sincronizado com a nuvem. Se o audio nao falar, o resto do treino continua normalmente."
      : "Progresso salvo neste navegador. Se o audio nao falar, o resto do treino continua normalmente.";
  }
  if (elements.resetProgress) {
    elements.resetProgress.textContent = isCloudMode()
      ? "Zerar meu progresso"
      : "Zerar progresso salvo";
  }
  if (elements.rankingKicker) {
    elements.rankingKicker.textContent = isCloudMode() ? "Ranking compartilhado" : "Ranking local";
  }
  if (elements.rankingHeading) {
    elements.rankingHeading.textContent = isCloudMode()
      ? "Melhores perfis da turma"
      : "Perfis deste navegador";
  }
  if (elements.syncBadge) {
    elements.syncBadge.className = "sync-badge";
    const labels = {
      local: "Modo local",
      ready: "Nuvem pronta",
      saving: "Sincronizando",
      synced: "Sincronizado",
      error: "Falha na sync",
    };
    const classes = {
      local: "is-local",
      ready: "is-cloud",
      saving: "is-saving",
      synced: "is-synced",
      error: "is-error",
    };
    const key = state.syncStatus || "local";
    elements.syncBadge.classList.add(classes[key] || "is-local");
    elements.syncBadge.textContent = labels[key] || "Modo local";
  }
}

function hasStoredProgress(progress) {
  const normalized = normalizeLoadedProgress(progress);
  return (
    Object.keys(normalized.charStats || {}).length > 0 ||
    Object.keys(normalized.itemStats || {}).length > 0 ||
    (normalized.bestArcadeShuriken || 0) > 0 ||
    (normalized.bestArcadeFoods || 0) > 0 ||
    (normalized.bestArcadePairs || 0) > 0
  );
}

function getCloudErrorMessage(error, fallbackMessage) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) {
    return "Nome ou senha incorretos.";
  }
  if (message.includes("user already registered")) {
    return "Esse nome ja esta em uso.";
  }
  if (message.includes("password")) {
    return "No modo online, a senha precisa ter pelo menos 6 caracteres.";
  }
  if (message.includes("email rate limit")) {
    return "Tente de novo em alguns instantes.";
  }
  return fallbackMessage;
}

async function restoreSharedSession() {
  if (!runtime.bridge) {
    return null;
  }

  try {
    setSyncStatus("saving");
    const restoredSession = await runtime.bridge.restoreSession();
    setSyncStatus(restoredSession ? "synced" : "ready");
    return restoredSession;
  } catch (error) {
    console.error("Falha ao restaurar a sessao online.", error);
    setSyncStatus("error");
    return null;
  }
}

function restoreLocalSession() {
  const userName = localStorage.getItem(sessionStorageKey);
  if (!userName) {
    return null;
  }
  const exists = loadProfiles().some((profile) => profile.userName === userName);
  return exists ? userName : null;
}

function persistSession(userName) {
  localStorage.setItem(sessionStorageKey, userName);
}

function clearSession() {
  localStorage.removeItem(sessionStorageKey);
}

function loadProfiles() {
  try {
    const raw = localStorage.getItem(profileStorageKey);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProfiles(profiles) {
  localStorage.setItem(profileStorageKey, JSON.stringify(profiles));
}

function normalizeProfileName(value) {
  return value.trim().replace(/\s+/g, " ").slice(0, 24);
}

function hashPassword(value) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `h${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function bindControls() {
  if (elements.authToggle) {
    elements.authToggle.addEventListener("click", (event) => {
      const button = event.target.closest("[data-auth-mode]");
      if (!button) {
        return;
      }
      setAuthMode(button.dataset.authMode);
    });
  }

  if (elements.loginForm) {
    elements.loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleLoginSubmit();
    });
  }

  if (elements.signupForm) {
    elements.signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await handleSignupSubmit();
    });
  }

  elements.sectionNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-section-target]");
    if (!button) {
      return;
    }
    setSection(button.dataset.sectionTarget, button.dataset.trainTarget);
    if (button.dataset.arcadeScreen) {
      setArcadeScreen(button.dataset.arcadeScreen);
    }
  });

  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("[data-section-target]");
    if (!button || button.closest("#section-nav")) {
      return;
    }
    setSection(button.dataset.sectionTarget, button.dataset.trainTarget);
  });

  document.body.addEventListener("click", (event) => {
    const arcadeScreenButton = event.target.closest("[data-arcade-screen]");
    if (arcadeScreenButton) {
      setSection("arcade");
      setArcadeScreen(arcadeScreenButton.dataset.arcadeScreen);
      return;
    }

    const arcadeLaunchButton = event.target.closest("[data-arcade-launch]");
    if (arcadeLaunchButton) {
      launchArcadeGame(arcadeLaunchButton.dataset.arcadeLaunch);
      return;
    }

    const pairButton = event.target.closest("[data-pair-index]");
    if (pairButton) {
      handlePairSelection(Number(pairButton.dataset.pairIndex));
    }
  });

  if (elements.trainNav) {
    elements.trainNav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-train-target]");
      if (!button) {
        return;
      }
      state.trainMode = button.dataset.trainTarget;
      state.section = "training";
      renderSectionNav();
      renderTrainNav();
    });
  }

  elements.scriptToggle.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-script]");
    if (!button) {
      return;
    }
    state.script = button.dataset.script;
    state.revealCard = false;
    setActiveToggle(elements.scriptToggle, "script", state.script);
    refreshPracticeState();
  });

  elements.levelToggle.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-level]");
    if (!button) {
      return;
    }
    state.level = button.dataset.level;
    state.revealCard = false;
    setActiveToggle(elements.levelToggle, "level", state.level);
    refreshPracticeState();
  });

  elements.focusToggle.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-focus]");
    if (!button) {
      return;
    }
    setFocusMode(button.dataset.focus);
  });

  elements.activateWeakFocus.addEventListener("click", () => {
    setFocusMode("weak");
    setSection("review");
  });
  elements.clearFocus.addEventListener("click", () => setFocusMode("all"));

  elements.revealCard.addEventListener("click", () => {
    state.revealCard = !state.revealCard;
    renderDetailCard();
  });

  elements.detailVoice.addEventListener("click", () => {
    const entry = getSelectedEntry();
    if (entry) {
      speakText(entry.char);
    }
  });

  elements.prevCard.addEventListener("click", () => moveSelection(-1));
  elements.nextCard.addEventListener("click", () => moveSelection(1));
  elements.randomCard.addEventListener("click", () => {
    const pool = getStudyPool();
    const chosen = pickAdaptive(pool, "quiz", (entry) => entry.id, (entry) =>
      computeCharWeight(entry)
    );
    if (!chosen) {
      return;
    }
    state.selectedId = chosen.id;
    state.revealCard = false;
    renderAll();
  });

  elements.nextQuiz.addEventListener("click", () => {
    generateQuiz();
    renderQuiz();
  });

  elements.readingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkReading();
  });

  elements.readingVoice.addEventListener("click", () => {
    if (state.reading) {
      speakText(state.reading.text);
    }
  });

  elements.showReadingAnswer.addEventListener("click", () => {
    if (!state.reading) {
      return;
    }
    state.readingStreak = 0;
    markItemProgress(state.reading.id, false);
    markTextProgress(state.reading.text, false);
    const delta = applyXpDelta(xpTable.reading.reveal);
    elements.readingStreakLabel.textContent = `Sequencia: ${state.readingStreak}`;
    elements.readingFeedback.textContent =
      `${state.reading.answer} • ${state.reading.breakdown}${state.reading.pseudo ? " • combinacao de treino" : ""}`;
    elements.readingFeedback.textContent =
      `${state.reading.answer} - ${state.reading.breakdown}${state.reading.pseudo ? " - combinacao de treino" : ""} (${formatXpDelta(delta)})`;
    saveProgress();
    renderStats();
    renderDetailCard();
    renderFocusRadar();
  });

  elements.nextReading.addEventListener("click", () => {
    generateReading();
    renderReading();
  });

  elements.contextForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkContext();
  });

  elements.contextVoice.addEventListener("click", () => {
    if (state.context) {
      speakText(state.context.text);
    }
  });

  elements.showContextAnswer.addEventListener("click", () => {
    if (!state.context) {
      return;
    }
    state.contextStreak = 0;
    markItemProgress(state.context.id, false);
    markTextProgress(state.context.text, false);
    const delta = applyXpDelta(xpTable.context.reveal);
    elements.contextStreakLabel.textContent = `Sequencia: ${state.contextStreak}`;
    elements.contextFeedback.textContent =
      `${state.context.answer} | ${state.context.breakdown} | ${state.context.meaning}`;
    elements.contextFeedback.textContent =
      `${state.context.answer} | ${state.context.breakdown} | ${state.context.meaning} (${formatXpDelta(delta)})`;
    saveProgress();
    renderStats();
    renderDetailCard();
    renderFocusRadar();
  });

  elements.nextContext.addEventListener("click", () => {
    generateContext();
    renderContext();
  });

  elements.phraseCategories?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-phrase-category]");
    if (!button) {
      return;
    }
    setPhraseCategory(button.dataset.phraseCategory);
  });

  elements.phraseForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    checkPhrase();
  });

  elements.phraseVoice?.addEventListener("click", () => {
    if (state.phrase) {
      speakText(state.phrase.text);
    }
  });

  elements.showPhraseAnswer?.addEventListener("click", () => {
    if (!state.phrase) {
      return;
    }
    state.phraseStreak = 0;
    markItemProgress(state.phrase.id, false);
    markTextProgress(state.phrase.text, false);
    const delta = applyXpDelta(xpTable.phrases.reveal);
    elements.phraseStreakLabel.textContent = `Sequencia: ${state.phraseStreak}`;
    elements.phraseFeedback.textContent =
      `${state.phrase.answer} | ${state.phrase.breakdown} | ${state.phrase.meaning} (${formatXpDelta(delta)})`;
    saveProgress();
    renderStats();
    renderDetailCard();
    renderFocusRadar();
  });

  elements.nextPhrase?.addEventListener("click", () => {
    generatePhrase();
    renderPhrase();
  });

  elements.nextCloze.addEventListener("click", () => {
    generateCloze();
    renderCloze();
  });

  elements.dictationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    checkDictation();
  });

  elements.dictationVoice.addEventListener("click", () => {
    if (state.dictation) {
      speakText(state.dictation.text);
    }
  });

  elements.showDictationAnswer.addEventListener("click", () => {
    if (!state.dictation) {
      return;
    }
    state.dictationStreak = 0;
    markItemProgress(state.dictation.id, false);
    markTextProgress(state.dictation.text, false);
    const delta = applyXpDelta(xpTable.dictation.reveal);
    elements.dictationStreakLabel.textContent = `Sequencia: ${state.dictationStreak}`;
    elements.dictationFeedback.textContent =
      `${state.dictation.answer} | ${state.dictation.breakdown} | ${state.dictation.meaning}`;
    elements.dictationFeedback.textContent =
      `${state.dictation.answer} | ${state.dictation.breakdown} | ${state.dictation.meaning} (${formatXpDelta(delta)})`;
    saveProgress();
    renderStats();
    renderDetailCard();
    renderFocusRadar();
  });

  elements.nextDictation.addEventListener("click", () => {
    generateDictation();
    renderDictation();
  });

  elements.nextConfusion.addEventListener("click", () => {
    generateConfusion();
    renderConfusion();
  });

  elements.builderVoice.addEventListener("click", () => {
    if (state.builder) {
      speakText(state.builder.text);
    }
  });

  elements.builderUndo.addEventListener("click", () => {
    if (!state.builder || state.builder.locked || !state.builder.selected.length) {
      return;
    }
    state.builder.selected.pop();
    renderBuilder();
  });

  elements.builderClear.addEventListener("click", () => {
    if (!state.builder || state.builder.locked) {
      return;
    }
    state.builder.selected = [];
    renderBuilder();
  });

  elements.showBuilderAnswer.addEventListener("click", () => {
    if (!state.builder) {
      return;
    }
    state.builder.selected = [...state.builder.chars];
    state.builder.locked = true;
    state.builderStreak = 0;
    markItemProgress(state.builder.id, false);
    markTextProgress(state.builder.text, false);
    const delta = applyXpDelta(xpTable.builder.reveal);
    elements.builderFeedback.textContent =
      `${state.builder.text} • ${state.builder.romajiLabel} • ${state.builder.meaning}`;
    elements.builderFeedback.textContent =
      `${state.builder.text} - ${state.builder.romajiLabel} - ${state.builder.meaning} (${formatXpDelta(delta)})`;
    saveProgress();
    renderStats();
    renderBuilder();
    renderDetailCard();
    renderFocusRadar();
  });

  elements.nextBuilder.addEventListener("click", () => {
    generateBuilder();
    renderBuilder();
  });

  elements.resetProgress.addEventListener("click", async () => {
    const message = isCloudMode()
      ? "Zerar o seu progresso sincronizado desta conta?"
      : "Zerar o progresso salvo deste navegador?";
    if (!window.confirm(message)) {
      return;
    }
    state.progress = defaultProgress();
    state.recent = {
      quiz: [],
      reading: [],
      context: [],
      phrases: [],
      cloze: [],
      dictation: [],
      confusion: [],
      builder: [],
    };
    state.quizStreak = 0;
    state.readingStreak = 0;
    state.contextStreak = 0;
    state.phraseStreak = 0;
    state.clozeStreak = 0;
    state.dictationStreak = 0;
    state.confusionStreak = 0;
    state.builderStreak = 0;
    await saveProgress({ immediate: true });
    refreshPracticeState();
  });

  if (elements.arcadeLastLaunch) {
    elements.arcadeLastLaunch.addEventListener("click", () => {
      launchArcadeGame(state.progress.arcadeLastGame || "shuriken");
    });
  }

  if (elements.logoutButton) {
    elements.logoutButton.addEventListener("click", () => {
      logoutCurrentUser();
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      void flushPendingProgressSave();
    }
  });

  if (elements.shurikenStart) {
    elements.shurikenStart.addEventListener("click", () => startShurikenGame());
  }

  if (elements.shurikenInput) {
    elements.shurikenInput.addEventListener("input", () => {
      if (!state.arcade.shuriken.running || !state.arcade.shuriken.current) {
        return;
      }

      const typed = normalizeRomanization(elements.shurikenInput.value);
      const expected = normalizeRomanization(state.arcade.shuriken.current.romaji);
      if (typed !== expected) {
        return;
      }

      markCharProgress(state.arcade.shuriken.current.id, true);
      const delta = applyXpDelta(xpTable.arcadeShurikenHit);
      state.arcade.shuriken.score += 10 + state.arcade.shuriken.combo * 3;
      state.arcade.shuriken.combo += 1;
      state.progress.bestArcadeShuriken = Math.max(
        state.progress.bestArcadeShuriken || 0,
        state.arcade.shuriken.score
      );
      state.arcade.shuriken.status =
        `${state.arcade.shuriken.current.char} dominado. Proximo arremesso. (${formatXpDelta(delta)})`;
      saveProgress();
      spawnShurikenToken();
      renderArcade();
    });
  }

  if (elements.foodStart) {
    elements.foodStart.addEventListener("click", () => startFoodGame());
  }

  if (elements.foodOptions) {
    elements.foodOptions.addEventListener("click", (event) => {
      const button = event.target.closest("[data-food-choice]");
      if (!button) {
        return;
      }
      handleFoodChoice(button.dataset.foodChoice);
    });
  }

  if (elements.pairsStart) {
    elements.pairsStart.addEventListener("click", () => startPairsGame());
  }
}

function setSection(section, trainTarget) {
  if (state.section === "arcade" && section !== "arcade") {
    stopArcadeGames();
  }
  state.section = section;
  if (trainTarget) {
    state.trainMode = trainTarget;
  }
  renderSectionNav();
  renderTrainNav();
  renderArcade();
}

function setActiveToggle(container, key, value) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset[key] === value);
  });
}

function setFocusMode(mode) {
  state.focus = mode;
  setActiveToggle(elements.focusToggle, "focus", state.focus);
  refreshPracticeState();
}

function refreshPracticeState() {
  stopArcadeGames();
  elements.quizFeedback.textContent = "";
  elements.readingFeedback.textContent = "";
  elements.contextFeedback.textContent = "";
  elements.phraseFeedback.textContent = "";
  elements.clozeFeedback.textContent = "";
  elements.dictationFeedback.textContent = "";
  elements.confusionFeedback.textContent = "";
  elements.builderFeedback.textContent = "";
  ensureSelection();
  generateQuiz();
  generateReading();
  generateContext();
  generatePhrase();
  generateCloze();
  generateDictation();
  generateConfusion();
  generateBuilder();
  renderAll();
}

function renderAll() {
  renderSectionNav();
  renderTrainNav();
  renderIdentity();
  renderStats();
  renderKanaGrid();
  renderDetailCard();
  renderQuiz();
  renderReading();
  renderContext();
  renderPhrase();
  renderCloze();
  renderDictation();
  renderConfusion();
  renderBuilder();
  renderFocusRadar();
  renderConfusionNotes();
  renderArcade();
}

function renderSectionNav() {
  document.querySelectorAll("#section-nav [data-section-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.sectionTarget === state.section);
  });
  document.querySelectorAll("[data-section-panel]").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.sectionPanel === state.section);
  });
}

function renderTrainNav() {
  if (!elements.trainNav) {
    return;
  }

  elements.trainNav.querySelectorAll("[data-train-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.trainTarget === state.trainMode);
  });

  document.querySelectorAll("[data-train-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.trainPanel === state.trainMode);
  });
}

function summarizeProgress(progress = state.progress) {
  const practicedEntries = Object.entries(progress.charStats || {}).filter(([, value]) => {
    const total = value.hits + value.misses;
    return total > 0;
  });

  const masteredCount = practicedEntries.filter(([id, value]) => {
    if (!entryIndex.has(id)) {
      return false;
    }
    const total = value.hits + value.misses;
    return value.hits >= 4 && total >= 5 && value.hits / total >= 0.78;
  }).length;

  const clearedGames = Number((progress.bestArcadeShuriken || 0) > 0) +
    Number((progress.bestArcadeFoods || 0) > 0) +
    Number((progress.bestArcadePairs || 0) > 0);
  const xp = Math.max(0, Number(progress.xp || 0));
  const level = Math.max(1, 1 + Math.floor(xp / 140));
  const rank = getRankTitle(xp);

  return {
    practicedCount: practicedEntries.length,
    masteredCount,
    clearedGames,
    xp,
    level,
    rank,
  };
}

function getRankTitle(xp) {
  let current = rankLadder[0].title;
  rankLadder.forEach((step) => {
    if (xp >= step.xp) {
      current = step.title;
    }
  });
  return current;
}

function setArcadeScreen(screen) {
  if (!screen) {
    return;
  }

  if (!isArcadeGameScreen(screen)) {
    stopArcadeGames();
  }

  state.arcade.screen = screen;
  renderArcade();
}

function launchArcadeGame(gameId) {
  if (gameId === "shuriken") {
    startShurikenGame();
    return;
  }

  if (gameId === "foods") {
    startFoodGame();
    return;
  }

  if (gameId === "pairs") {
    startPairsGame();
  }
}

function isArcadeGameScreen(screen) {
  return ["shuriken", "foods", "pairs"].includes(screen);
}

function stopArcadeGames() {
  stopShurikenGame();
  stopFoodGame();
  stopPairsGame();
}

function stopShurikenGame() {
  if (state.arcade.shuriken.rafId) {
    cancelAnimationFrame(state.arcade.shuriken.rafId);
    state.arcade.shuriken.rafId = 0;
  }
  state.arcade.shuriken.running = false;
}

function stopFoodGame() {
  if (state.arcade.foods.timerId) {
    window.clearInterval(state.arcade.foods.timerId);
    state.arcade.foods.timerId = 0;
  }
  state.arcade.foods.running = false;
}

function stopPairsGame() {
  if (state.arcade.pairs.timerId) {
    window.clearInterval(state.arcade.pairs.timerId);
    state.arcade.pairs.timerId = 0;
  }
  if (state.arcade.pairs.timeoutId) {
    window.clearTimeout(state.arcade.pairs.timeoutId);
    state.arcade.pairs.timeoutId = 0;
  }
  state.arcade.pairs.running = false;
  state.arcade.pairs.lock = false;
}

function renderArcade() {
  if (!elements.arcadeShell) {
    return;
  }

  const summary = summarizeProgress(state.progress);
  const stars = Math.min(5, summary.clearedGames + Math.floor(summary.masteredCount / 10));

  elements.arcadeLevel.textContent = String(summary.level);
  elements.arcadeXp.textContent = String(summary.xp);
  elements.arcadeStars.textContent = `${stars}/5`;

  const lastGame = arcadeCatalog.find((item) => item.id === (state.progress.arcadeLastGame || "shuriken"));
  if (lastGame) {
    elements.arcadeLastMode.textContent = lastGame.title;
  }

  elements.arcadeFeatureTitle.textContent =
    state.script === "mixed"
      ? "Mixed Circuit"
      : state.script === "hiragana"
        ? "Hiragana Route"
        : "Katakana Route";
  elements.arcadeFeatureCopy.textContent =
    state.level === "base"
      ? "Blocos mais curtos para ganhar fluidez, ritmo e leitura sem travar."
      : "Rodadas com vozes, palavras maiores e mais pressao de memoria para fixar melhor.";
  elements.arcadeFeatureProgress.innerHTML = "";

  for (let index = 0; index < arcadeCatalog.length; index += 1) {
    const step = document.createElement("span");
      step.className = `arcade-progress-step${index < summary.clearedGames ? " is-filled" : ""}`;
      elements.arcadeFeatureProgress.appendChild(step);
  }

  elements.arcadeFeatureMeta.textContent = `${summary.clearedGames}/3 jogos com recorde salvo`;

  elements.arcadeShell.querySelectorAll(".arcade-rail-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.arcadeScreen === state.arcade.screen);
  });

  elements.arcadeShell.querySelectorAll("[data-arcade-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.arcadePanel === state.arcade.screen);
  });

  renderArcadeHub();
  renderArcadeCards();
  renderArcadeGames();
  renderArcadeRecords();
  renderShuriken();
  renderFoodGame();
  renderPairsGame();
}

function renderArcadeHub() {
  const previewItems = getArcadePhraseItems(2);
  renderArcadePhraseCollection(elements.arcadeCardPreview, previewItems, true);
  renderArcadeGameCollection(elements.arcadeGamesPreview, arcadeCatalog.slice(0, 2), true);
}

function renderArcadeCards() {
  renderArcadePhraseCollection(elements.arcadeCardList, getArcadePhraseItems(6), false);
}

function renderArcadeGames() {
  renderArcadeGameCollection(elements.arcadeGameList, arcadeCatalog, false);
}

function renderArcadeRecords() {
  if (!elements.arcadeRecordGrid) {
    return;
  }

  const cards = [
    {
      label: "Shuriken no Kana",
      value: String(state.progress.bestArcadeShuriken || 0),
      note: "Melhor pontuacao em digitacao sob pressao.",
    },
    {
      label: "Pratos do Japao",
      value: String(state.progress.bestArcadeFoods || 0),
      note: "Melhor pontuacao no modo de vocabulario com tempo.",
    },
    {
      label: "Parear Kana",
      value: state.progress.bestArcadePairs ? `${state.progress.bestArcadePairs}s` : "-",
      note: "Melhor tempo para fechar todos os pares.",
    },
    {
      label: "Progresso geral",
      value: `${elements.masteredCount.textContent}/${elements.studiedCount.textContent}`,
      note: "Kana dominados versus kana ja praticados no seu progresso atual.",
    },
  ];

  elements.arcadeRecordGrid.innerHTML = "";
  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "arcade-record-card";
    article.innerHTML = `
      <p class="arcade-record-label">${card.label}</p>
      <strong class="arcade-record-value">${card.value}</strong>
      <p class="arcade-record-note">${card.note}</p>
    `;
    elements.arcadeRecordGrid.appendChild(article);
  });

  if (isCloudMode() && state.currentUser) {
    void refreshSharedLeaderboard();
  }
  renderRanking();
}

function renderArcadePhraseCollection(container, items, compact) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  const className = compact ? "arcade-phrase-card is-compact" : "arcade-phrase-card";

  items.forEach((item) => {
    const stats = getItemStats(item.id);
    const total = stats.hits + stats.misses;
    const progress = total ? Math.round((stats.hits / total) * 100) : 0;
    const article = document.createElement("article");
    article.className = className;

    const header = document.createElement("div");
    header.className = "arcade-phrase-head";
    header.innerHTML = `
      <div>
        <h4>${item.text}</h4>
        <p>${item.answer}</p>
      </div>
      <button type="button" class="arcade-audio-button">Ouvir</button>
    `;
    header.querySelector("button").addEventListener("click", () => speakText(item.text));
    article.appendChild(header);

    const meaning = document.createElement("p");
    meaning.className = "arcade-phrase-meaning";
    meaning.textContent = item.meaning;
    article.appendChild(meaning);

    const example = document.createElement("div");
    example.className = "arcade-phrase-example";
    example.innerHTML = `
      <span>${item.text}</span>
      <em>${item.breakdown}</em>
    `;
    article.appendChild(example);

    const progressTrack = document.createElement("div");
    progressTrack.className = "arcade-progress-bar";
    progressTrack.innerHTML = `<span style="width: ${progress}%"></span>`;
    article.appendChild(progressTrack);

    const footer = document.createElement("div");
    footer.className = "arcade-phrase-footer";
    footer.innerHTML = `
      <span>${labelForTextGroup(item.group)}</span>
      <strong>${progress}%</strong>
    `;

    if (!compact) {
      const practiceButton = document.createElement("button");
      practiceButton.type = "button";
      practiceButton.className = "arcade-inline-button";
      practiceButton.textContent = "Treinar";
      practiceButton.dataset.sectionTarget = "training";
      practiceButton.dataset.trainTarget = "context";
      footer.appendChild(practiceButton);
    }

    article.appendChild(footer);
    container.appendChild(article);
  });
}

function renderArcadeGameCollection(container, items, compact) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  items.forEach((game) => {
    const article = document.createElement("article");
    article.className = compact ? "arcade-game-card is-compact" : "arcade-game-card";
    article.innerHTML = `
      <div class="arcade-game-icon">${game.icon}</div>
      <div class="arcade-game-body">
        <div class="arcade-game-head">
          <div>
            <h4>${game.title}</h4>
            <p>${game.description}</p>
          </div>
          <span class="arcade-game-jp">${game.jpTitle}</span>
        </div>
        <div class="arcade-game-meta">
          <span>${game.tags.join(" / ")}</span>
          <strong>${"★".repeat(game.difficulty)}${"·".repeat(Math.max(0, 3 - game.difficulty))}</strong>
        </div>
        <button type="button" class="arcade-launch-button" data-arcade-launch="${game.id}">
          Jogar
        </button>
      </div>
    `;
    container.appendChild(article);
  });
}

function getArcadePhraseItems(limit) {
  const deck = [...getActiveContextDeck()];
  return deck
    .sort((left, right) => {
      const leftStats = getItemStats(left.id);
      const rightStats = getItemStats(right.id);
      const leftTotal = leftStats.hits + leftStats.misses;
      const rightTotal = rightStats.hits + rightStats.misses;
      const leftScore = leftStats.misses * 3 - leftStats.hits + (leftTotal === 0 ? 2 : 0);
      const rightScore = rightStats.misses * 3 - rightStats.hits + (rightTotal === 0 ? 2 : 0);
      return rightScore - leftScore;
    })
    .slice(0, limit);
}

function getArcadeClearedCount() {
  return Number((state.progress.bestArcadeShuriken || 0) > 0) +
    Number((state.progress.bestArcadeFoods || 0) > 0) +
    Number((state.progress.bestArcadePairs || 0) > 0);
}

function getLocalLeaderboard() {
  return loadProfiles()
    .map((profile) => {
      const progress = loadProgress(profile.userName);
      const summary = summarizeProgress(progress);
      return {
        userName: profile.userName,
        progress,
        summary,
      };
    })
    .sort((left, right) => {
      if (right.summary.xp !== left.summary.xp) {
        return right.summary.xp - left.summary.xp;
      }
      if (right.summary.masteredCount !== left.summary.masteredCount) {
        return right.summary.masteredCount - left.summary.masteredCount;
      }
      return left.userName.localeCompare(right.userName);
    });
}

function renderRanking() {
  if (!elements.arcadeRankingList || !elements.rankingCount) {
    return;
  }

  const leaderboard = isCloudMode() ? state.sharedRanking : getLocalLeaderboard();
  elements.rankingCount.textContent = `${leaderboard.length} perfis`;
  elements.arcadeRankingList.innerHTML = "";

  if (!leaderboard.length) {
    const empty = document.createElement("p");
    empty.className = "arcade-record-note";
    empty.textContent = isCloudMode()
      ? "Entre em uma conta para carregar o ranking compartilhado."
      : "Crie o primeiro perfil para comecar o ranking local.";
    elements.arcadeRankingList.appendChild(empty);
    return;
  }

  leaderboard.forEach((entry, index) => {
    const row = document.createElement("div");
    row.className = `ranking-row${entry.userName === state.currentUser ? " is-current" : ""}`;
    row.innerHTML = `
      <span class="ranking-position">#${index + 1}</span>
      <div class="ranking-meta">
        <strong>${entry.userName}</strong>
        <p>${entry.summary.rank} - LV ${entry.summary.level}</p>
      </div>
      <div class="ranking-points">
        <strong>${entry.summary.xp}</strong>
        <span>XP</span>
      </div>
    `;
    elements.arcadeRankingList.appendChild(row);
  });
}

async function refreshSharedLeaderboard(force = false) {
  if (!isCloudMode() || !runtime.bridge || !state.currentUser) {
    return;
  }
  if (runtime.leaderboardPromise) {
    return runtime.leaderboardPromise;
  }
  const isStale = Date.now() - state.leaderboardLoadedAt > leaderboardStaleMs;
  if (!force && state.sharedRanking.length && !isStale) {
    return;
  }

  runtime.leaderboardPromise = runtime.bridge
    .loadLeaderboard()
    .then((leaderboard) => {
      state.sharedRanking = leaderboard;
      state.leaderboardLoadedAt = Date.now();
      if (state.section === "arcade" && state.arcade.screen === "records") {
        renderRanking();
      }
    })
    .catch((error) => {
      console.error("Falha ao atualizar o ranking compartilhado.", error);
      setSyncStatus("error");
    })
    .finally(() => {
      runtime.leaderboardPromise = null;
    });

  return runtime.leaderboardPromise;
}

function startShurikenGame() {
  stopArcadeGames();
  state.section = "arcade";
  state.arcade.screen = "shuriken";
  state.progress.arcadeLastGame = "shuriken";
  state.arcade.shuriken = createShurikenState();
  state.arcade.shuriken.running = true;
  saveProgress();
  renderSectionNav();
  spawnShurikenToken();
  renderArcade();
  elements.shurikenInput.focus();
}

function spawnShurikenToken() {
  const next = pickAdaptive(getPracticePool(), "quiz", (entry) => entry.id, (entry) =>
    computeCharWeight(entry)
  );

  if (!next) {
    finishShurikenGame("Sem kana disponivel para este modo.");
    return;
  }

  stopShurikenGame();
  state.arcade.shuriken.running = true;
  state.arcade.shuriken.current = next;
  state.arcade.shuriken.x = 14 + Math.random() * 72;
  state.arcade.shuriken.y = 10;
  state.arcade.shuriken.rotation = -18 + Math.random() * 36;
  state.arcade.shuriken.speed = Math.min(
    280,
    95 + state.arcade.shuriken.combo * 12 + state.arcade.shuriken.score * 0.15
  );
  state.arcade.shuriken.lastFrame = 0;
  elements.shurikenInput.value = "";
  state.arcade.shuriken.rafId = requestAnimationFrame(stepShuriken);
}

function stepShuriken(timestamp) {
  if (!state.arcade.shuriken.running || !state.arcade.shuriken.current) {
    return;
  }

  if (!state.arcade.shuriken.lastFrame) {
    state.arcade.shuriken.lastFrame = timestamp;
  }

  const delta = (timestamp - state.arcade.shuriken.lastFrame) / 1000;
  state.arcade.shuriken.lastFrame = timestamp;
  state.arcade.shuriken.y += state.arcade.shuriken.speed * delta;

  const arenaHeight = elements.shurikenArena ? elements.shurikenArena.clientHeight : 420;
  if (state.arcade.shuriken.y >= Math.max(200, arenaHeight - 110)) {
    handleShurikenMiss();
    return;
  }

  renderShuriken();
  state.arcade.shuriken.rafId = requestAnimationFrame(stepShuriken);
}

function handleShurikenMiss() {
  if (state.arcade.shuriken.current) {
    markCharProgress(state.arcade.shuriken.current.id, false);
  }

  const delta = applyXpDelta(xpTable.arcadeShurikenMiss);
  state.arcade.shuriken.combo = 0;
  state.arcade.shuriken.lives -= 1;
  state.arcade.shuriken.status =
    `Passou do tempo. O mesmo tipo de leitura volta mais cedo agora. (${formatXpDelta(delta)})`;
  saveProgress();

  if (state.arcade.shuriken.lives <= 0) {
    finishShurikenGame(`Fim de rodada com ${state.arcade.shuriken.score} pontos.`);
    return;
  }

  spawnShurikenToken();
  renderArcade();
}

function finishShurikenGame(message) {
  stopShurikenGame();
  state.arcade.shuriken.status = message;
  state.progress.bestArcadeShuriken = Math.max(
    state.progress.bestArcadeShuriken || 0,
    state.arcade.shuriken.score
  );
  saveProgress();
  renderArcade();
}

function renderShuriken() {
  if (!elements.shurikenToken) {
    return;
  }

  elements.shurikenScore.textContent = String(state.arcade.shuriken.score);
  elements.shurikenCombo.textContent = `x${state.arcade.shuriken.combo}`;
  elements.shurikenRecord.textContent = String(state.progress.bestArcadeShuriken || 0);
  elements.shurikenLives.textContent = "♥".repeat(Math.max(0, state.arcade.shuriken.lives));
  elements.shurikenStatus.textContent = state.arcade.shuriken.status;
  elements.shurikenInput.disabled = !state.arcade.shuriken.running;
  elements.shurikenStart.textContent = state.arcade.shuriken.running ? "Reiniciar" : "Comecar";

  if (state.arcade.shuriken.current) {
    elements.shurikenToken.textContent = state.arcade.shuriken.current.char;
    elements.shurikenToken.style.left = `${state.arcade.shuriken.x}%`;
    elements.shurikenToken.style.top = `${state.arcade.shuriken.y}px`;
    elements.shurikenToken.style.transform = `translateX(-50%) rotate(${state.arcade.shuriken.rotation}deg)`;
  }
}

function startFoodGame() {
  stopArcadeGames();
  state.section = "arcade";
  state.arcade.screen = "foods";
  state.progress.arcadeLastGame = "foods";
  state.arcade.foods = createFoodState();
  state.arcade.foods.running = true;
  nextFoodQuestion();
  state.arcade.foods.timerId = window.setInterval(() => {
    state.arcade.foods.timeLeft -= 1;
    if (state.arcade.foods.timeLeft <= 0) {
      finishFoodGame(`Tempo encerrado com ${state.arcade.foods.score} pontos.`);
      return;
    }
    renderFoodGame();
  }, 1000);
  saveProgress();
  renderSectionNav();
  renderArcade();
}

function nextFoodQuestion() {
  const pool = arcadeFoodDeck.filter((item) => item.id !== state.arcade.foods.current?.id);
  const chosen = shuffle([...pool])[0] || arcadeFoodDeck[0];
  state.arcade.foods.current = chosen;
  state.arcade.foods.options = shuffle([...chosen.options]);
}

function handleFoodChoice(choice) {
  if (!state.arcade.foods.running || !state.arcade.foods.current) {
    return;
  }

  const isCorrect = choice === state.arcade.foods.current.answer;
  const delta = applyXpDelta(isCorrect ? xpTable.arcadeFoodHit : xpTable.arcadeFoodMiss);
  if (isCorrect) {
    state.arcade.foods.score += 14;
    state.arcade.foods.status =
      `${state.arcade.foods.current.romaji} acertado. (${formatXpDelta(delta)})`;
  } else {
    state.arcade.foods.lives -= 1;
    state.arcade.foods.status =
      `A resposta certa era ${state.arcade.foods.current.answer}. (${formatXpDelta(delta)})`;
  }

  state.progress.bestArcadeFoods = Math.max(
    state.progress.bestArcadeFoods || 0,
    state.arcade.foods.score
  );
  saveProgress();

  if (state.arcade.foods.lives <= 0) {
    finishFoodGame(`Vidas esgotadas com ${state.arcade.foods.score} pontos.`);
    return;
  }

  nextFoodQuestion();
  renderFoodGame();
}

function finishFoodGame(message) {
  stopFoodGame();
  state.arcade.foods.status = message;
  state.progress.bestArcadeFoods = Math.max(
    state.progress.bestArcadeFoods || 0,
    state.arcade.foods.score
  );
  saveProgress();
  renderArcade();
}

function renderFoodGame() {
  if (!elements.foodScore) {
    return;
  }

  elements.foodScore.textContent = String(state.arcade.foods.score);
  elements.foodLives.textContent = "♥".repeat(Math.max(0, state.arcade.foods.lives));
  elements.foodTime.textContent = `${state.arcade.foods.timeLeft}s`;
  elements.foodRecord.textContent = String(state.progress.bestArcadeFoods || 0);
  elements.foodStatus.textContent = state.arcade.foods.status;
  elements.foodStart.textContent = state.arcade.foods.running ? "Reiniciar" : "Comecar";

  if (!state.arcade.foods.current) {
    return;
  }

  elements.foodEmoji.textContent = state.arcade.foods.current.emoji;
  elements.foodKana.textContent = state.arcade.foods.current.kana;
  elements.foodRomaji.textContent = `${state.arcade.foods.current.romaji}`;
  elements.foodRegion.textContent = state.arcade.foods.current.region;

  elements.foodOptions.innerHTML = "";
  state.arcade.foods.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "retro-choice-button";
    button.textContent = option;
    button.dataset.foodChoice = option;
    button.disabled = !state.arcade.foods.running;
    elements.foodOptions.appendChild(button);
  });
}

function startPairsGame() {
  stopArcadeGames();
  state.section = "arcade";
  state.arcade.screen = "pairs";
  state.progress.arcadeLastGame = "pairs";

  const source = shuffle([...getStudyPool()]).slice(0, Math.min(8, getStudyPool().length));
  const board = shuffle(
    source.flatMap((entry) => [
      {
        uid: `${entry.id}-char`,
        pairId: entry.id,
        label: entry.char,
        kind: "char",
        flipped: false,
        matched: false,
      },
      {
        uid: `${entry.id}-romaji`,
        pairId: entry.id,
        label: entry.romaji,
        kind: "romaji",
        flipped: false,
        matched: false,
      },
    ])
  );

  state.arcade.pairs = createPairsState();
  state.arcade.pairs.running = true;
  state.arcade.pairs.board = board;
  state.arcade.pairs.timerId = window.setInterval(() => {
    state.arcade.pairs.seconds += 1;
    renderPairsGame();
  }, 1000);
  saveProgress();
  renderSectionNav();
  renderArcade();
}

function handlePairSelection(index) {
  const game = state.arcade.pairs;
  const item = game.board[index];
  if (!game.running || game.lock || !item || item.flipped || item.matched) {
    return;
  }

  item.flipped = true;

  if (game.firstIndex === null) {
    game.firstIndex = index;
    game.status = "Agora encontre o par correspondente.";
    renderPairsGame();
    return;
  }

  const first = game.board[game.firstIndex];
  game.moves += 1;

  if (first.pairId === item.pairId && first.uid !== item.uid) {
    const delta = applyXpDelta(xpTable.arcadePairsHit);
    first.matched = true;
    item.matched = true;
    game.firstIndex = null;
    game.found += 1;
    game.status = `Par fechado. (${formatXpDelta(delta)})`;
    markCharProgress(first.pairId, true);
    if (game.found >= Math.max(1, Math.floor(game.board.length / 2))) {
      finishPairsGame(
        `Tabuleiro completo em ${game.seconds}s e ${game.moves} jogadas.`
      );
      return;
    }
    saveProgress();
    renderPairsGame();
    return;
  }

  game.lock = true;
  markCharProgress(first.pairId, false);
  markCharProgress(item.pairId, false);
  const delta = applyXpDelta(xpTable.arcadePairsMiss);
  game.status = `Nao era esse par. (${formatXpDelta(delta)})`;
  renderPairsGame();

  game.timeoutId = window.setTimeout(() => {
    first.flipped = false;
    item.flipped = false;
    game.firstIndex = null;
    game.lock = false;
    renderPairsGame();
  }, 650);
}

function finishPairsGame(message) {
  stopPairsGame();
  state.arcade.pairs.status = message;
  const current = state.arcade.pairs.seconds;
  if (!state.progress.bestArcadePairs || current < state.progress.bestArcadePairs) {
    state.progress.bestArcadePairs = current;
  }
  saveProgress();
  renderArcade();
}

function renderPairsGame() {
  if (!elements.pairsGrid) {
    return;
  }

  const totalPairs = Math.floor(state.arcade.pairs.board.length / 2);

  elements.pairsMoves.textContent = String(state.arcade.pairs.moves);
  elements.pairsFound.textContent = `${state.arcade.pairs.found}/${totalPairs}`;
  elements.pairsTime.textContent = `${state.arcade.pairs.seconds}s`;
  elements.pairsRecord.textContent = state.progress.bestArcadePairs
    ? `${state.progress.bestArcadePairs}s`
    : "-";
  elements.pairsStatus.textContent = state.arcade.pairs.status;
  elements.pairsStart.textContent = state.arcade.pairs.running ? "Reiniciar" : "Embaralhar";

  elements.pairsGrid.innerHTML = "";
  state.arcade.pairs.board.forEach((card, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `pair-card${card.flipped || card.matched ? " is-revealed" : ""}${card.matched ? " is-matched" : ""}`;
    button.dataset.pairIndex = String(index);
    button.disabled = !state.arcade.pairs.running && !card.matched;
    button.innerHTML = `
      <span class="pair-card-face pair-card-front">?</span>
      <span class="pair-card-face pair-card-back ${card.kind === "char" ? "is-kana" : ""}">${card.label}</span>
    `;
    elements.pairsGrid.appendChild(button);
  });
}

function renderStats() {
  const practicedEntries = Object.entries(state.progress.charStats).filter(([, value]) => {
    const total = value.hits + value.misses;
    return total > 0;
  });

  const masteredCount = practicedEntries.filter(([id, value]) => {
    if (!entryIndex.has(id)) {
      return false;
    }
    const total = value.hits + value.misses;
    return value.hits >= 4 && total >= 5 && value.hits / total >= 0.78;
  }).length;

  const reviewCount = getWeakEntries(getStudyPool()).length;
  const bestStreak = Math.max(
    state.progress.bestQuizStreak || 0,
    state.progress.bestReadingStreak || 0,
    state.progress.bestContextStreak || 0,
    state.progress.bestPhraseStreak || 0,
    state.progress.bestClozeStreak || 0,
    state.progress.bestDictationStreak || 0,
    state.progress.bestConfusionStreak || 0,
    state.progress.bestBuilderStreak || 0
  );

  elements.studiedCount.textContent = String(practicedEntries.length);
  elements.masteredCount.textContent = String(masteredCount);
  elements.reviewCount.textContent = String(reviewCount);
  elements.bestStreak.textContent = String(bestStreak);
  elements.quizStreakLabel.textContent = `Sequencia: ${state.quizStreak}`;
  elements.readingStreakLabel.textContent = `Sequencia: ${state.readingStreak}`;
  elements.contextStreakLabel.textContent = `Sequencia: ${state.contextStreak}`;
  elements.phraseStreakLabel.textContent = `Sequencia: ${state.phraseStreak}`;
  elements.clozeStreakLabel.textContent = `Sequencia: ${state.clozeStreak}`;
  elements.dictationStreakLabel.textContent = `Sequencia: ${state.dictationStreak}`;
  elements.confusionStreakLabel.textContent = `Sequencia: ${state.confusionStreak}`;
  elements.builderStreakLabel.textContent = `Sequencia: ${state.builderStreak}`;
  renderIdentity();
}

function renderKanaGrid() {
  const scripts = getActiveScripts();
  elements.kanaGrid.innerHTML = "";

  scripts.forEach((scriptName) => {
    const pool =
      state.level === "base"
        ? baseLibrary[scriptName]
        : [...baseLibrary[scriptName], ...extendedLibrary[scriptName]];

    const block = document.createElement("section");
    block.className = "script-block";

    const head = document.createElement("div");
    head.className = "script-head";
    head.innerHTML = `
      <h3>${labelForScript(scriptName)}</h3>
      <p class="script-note">${scriptName === "hiragana" ? "Curvo e mais fluido." : "Reto e mais angular."}</p>
    `;
    block.appendChild(head);

    groupByFamily(pool).forEach(([family, entries]) => {
      const group = document.createElement("div");
      group.className = "family-group";

      const familyLabel = document.createElement("p");
      familyLabel.className = "family-label";
      familyLabel.textContent = family;
      group.appendChild(familyLabel);

      const row = document.createElement("div");
      row.className = "tile-row";

      entries.forEach((entry) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `kana-tile${entry.id === state.selectedId ? " is-active" : ""}`;
        button.innerHTML = `
          <span class="char">${entry.char}</span>
          <span class="sound">${entry.romaji}</span>
        `;
        button.addEventListener("click", () => {
          state.selectedId = entry.id;
          state.revealCard = false;
          renderAll();
        });
        row.appendChild(button);
      });

      group.appendChild(row);
      block.appendChild(group);
    });

    elements.kanaGrid.appendChild(block);
  });
}

function renderDetailCard() {
  const entry = getSelectedEntry();
  if (!entry) {
    return;
  }

  const stats = getCharStats(entry.id);
  const total = stats.hits + stats.misses;
  const accuracy = total ? Math.round((stats.hits / total) * 100) : 0;

  elements.detailScript.textContent = labelForScript(entry.script);
  elements.detailFamily.textContent = entry.family;
  elements.detailCharacter.textContent = entry.char;
  elements.detailRomaji.textContent = entry.romaji;
  elements.detailFormula.textContent = entry.formula;
  elements.detailNote.textContent = entry.note;
  elements.detailExample.textContent = entry.example;
  elements.detailStats.textContent =
    total === 0
      ? "Ainda sem historico neste navegador."
      : `${stats.hits} acertos, ${stats.misses} erros • ${accuracy}% de acerto`;

  elements.detailAnswer.classList.toggle("is-hidden", !state.revealCard);
  elements.revealCard.textContent = state.revealCard ? "Esconder resposta" : "Mostrar resposta";
}

function generateQuiz() {
  const pool = getPracticePool();
  if (!pool.length) {
    state.quiz = null;
    return;
  }

  const correct = pickAdaptive(pool, "quiz", (entry) => entry.id, (entry) =>
    computeCharWeight(entry)
  );
  const promptType =
    state.script === "mixed"
      ? Math.random() > 0.5
        ? "kana-to-romaji"
        : "romaji-to-kana"
      : Math.random() > 0.35
        ? "kana-to-romaji"
        : "romaji-to-kana";

  const options =
    promptType === "kana-to-romaji"
      ? buildRomajiOptions(pool, correct)
      : buildKanaOptions(pool, correct);

  state.quiz = { correct, promptType, options, answered: false };
  elements.quizFeedback.textContent = "";
}

function renderQuiz() {
  if (!state.quiz) {
    return;
  }

  const { correct, promptType, options, answered } = state.quiz;
  const kanaToRomaji = promptType === "kana-to-romaji";

  elements.quizModeLabel.textContent = kanaToRomaji ? "Kana para som" : "Som para kana";
  elements.quizInstruction.textContent = kanaToRomaji
    ? "Qual e o som deste caractere?"
    : `Qual caractere representa o som "${correct.romaji}"?`;
  elements.quizPrompt.textContent = kanaToRomaji ? correct.char : correct.romaji;
  elements.quizOptions.innerHTML = "";

  options.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = value;
    button.disabled = answered;
    button.addEventListener("click", () => checkQuizAnswer(value, button));
    elements.quizOptions.appendChild(button);
  });
}

function checkQuizAnswer(choice, button) {
  if (!state.quiz || state.quiz.answered) {
    return;
  }

  const { correct, promptType } = state.quiz;
  const expected = promptType === "kana-to-romaji" ? correct.romaji : correct.char;
  const isCorrect = choice === expected;

  state.quiz.answered = true;
  markCharProgress(correct.id, isCorrect);
  const delta = applyXpDelta(
    isCorrect ? xpTable.recognition.correct : xpTable.recognition.wrong
  );

  if (isCorrect) {
    state.quizStreak += 1;
    state.progress.bestQuizStreak = Math.max(
      state.progress.bestQuizStreak || 0,
      state.quizStreak
    );
    button.classList.add("correct");
    elements.quizFeedback.textContent =
      `Certo. ${correct.char} = ${correct.romaji}. (${formatXpDelta(delta)})`;
  } else {
    state.quizStreak = 0;
    button.classList.add("wrong");
    elements.quizFeedback.textContent =
      `Ainda nao. ${correct.char} = ${correct.romaji}. (${formatXpDelta(delta)})`;
  }

  Array.from(elements.quizOptions.children).forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.textContent === expected) {
      optionButton.classList.add("correct");
    }
  });

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function generateReading() {
  const deck = getActiveReadingDeck();
  state.reading = pickAdaptive(deck, "reading", (item) => item.id, (item) =>
    computeItemWeight(item)
  );
  elements.readingInput.value = "";
  elements.readingFeedback.textContent = "";
}

function renderReading() {
  if (!state.reading) {
    return;
  }
  elements.readingWord.textContent = state.reading.text;
}

function checkReading() {
  if (!state.reading) {
    return;
  }

  const typed = normalizeRomanization(elements.readingInput.value);
  const expected = normalizeRomanization(state.reading.answer);
  const isCorrect = typed === expected;

  markItemProgress(state.reading.id, isCorrect);
  markTextProgress(state.reading.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.reading.correct : xpTable.reading.wrong);

  if (isCorrect) {
    state.readingStreak += 1;
    state.progress.bestReadingStreak = Math.max(
      state.progress.bestReadingStreak || 0,
      state.readingStreak
    );
    elements.readingFeedback.textContent =
      `Boa. ${state.reading.breakdown} = ${state.reading.answer}. (${formatXpDelta(delta)})`;
  } else {
    state.readingStreak = 0;
    elements.readingFeedback.textContent =
      `Resposta: ${state.reading.answer} • ${state.reading.breakdown}${state.reading.pseudo ? " • combinacao de treino" : ""}`;
  }

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function generateContext() {
  const deck = getActiveContextDeck();
  state.context = pickAdaptive(deck, "context", (item) => item.id, (item) =>
    computeItemWeight(item)
  );
  elements.contextInput.value = "";
  elements.contextFeedback.textContent = "";
}

function renderContext() {
  if (!state.context) {
    return;
  }

  elements.contextKindLabel.textContent = labelForTextGroup(state.context.group);
  elements.contextWord.textContent = state.context.text;
  elements.contextBreakdown.textContent = state.context.breakdown;
  elements.contextMeaning.textContent = state.context.meaning;
}

function setPhraseCategory(category) {
  state.phraseCategory = phraseCategories.includes(category) ? category : phraseCategories[0];
  generatePhrase();
  renderPhrase();
}

function getActivePhraseDeck() {
  const fullDeck =
    state.level === "base" ? phraseDecks.base : [...phraseDecks.base, ...phraseDecks.extended];
  const filteredDeck = fullDeck.filter((item) => item.category === state.phraseCategory);
  return filteredDeck.length ? filteredDeck : fullDeck;
}

function generatePhrase() {
  const deck = getActivePhraseDeck();
  state.phrase = pickAdaptive(deck, "phrases", (item) => item.id, (item) =>
    computeItemWeight(item)
  );
  elements.phraseInput.value = "";
  elements.phraseFeedback.textContent = "";
}

function renderPhrase() {
  if (!state.phrase) {
    return;
  }

  elements.phraseCategories.querySelectorAll("[data-phrase-category]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.phraseCategory === state.phraseCategory);
  });

  elements.phraseCategoryLabel.textContent = labelForPhraseCategory(state.phrase.category);
  elements.phraseScene.textContent = state.phrase.scene;
  elements.phraseWord.textContent = state.phrase.text;
  elements.phraseBreakdown.textContent = state.phrase.breakdown;
  elements.phraseMeaning.textContent = state.phrase.meaning;
}

function checkPhrase() {
  if (!state.phrase) {
    return;
  }

  const typed = normalizeRomanization(elements.phraseInput.value);
  const expected = normalizeRomanization(state.phrase.answer);
  const isCorrect = typed === expected;

  markItemProgress(state.phrase.id, isCorrect);
  markTextProgress(state.phrase.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.phrases.correct : xpTable.phrases.wrong);

  if (isCorrect) {
    state.phraseStreak += 1;
    state.progress.bestPhraseStreak = Math.max(
      state.progress.bestPhraseStreak || 0,
      state.phraseStreak
    );
    elements.phraseFeedback.textContent =
      `Boa. ${state.phrase.breakdown} = ${state.phrase.answer}. (${formatXpDelta(delta)})`;
  } else {
    state.phraseStreak = 0;
    elements.phraseFeedback.textContent =
      `Resposta: ${state.phrase.answer} | ${state.phrase.breakdown} | ${state.phrase.meaning} (${formatXpDelta(delta)})`;
  }

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function checkContext() {
  if (!state.context) {
    return;
  }

  const typed = normalizeRomanization(elements.contextInput.value);
  const expected = normalizeRomanization(state.context.answer);
  const isCorrect = typed === expected;

  markItemProgress(state.context.id, isCorrect);
  markTextProgress(state.context.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.context.correct : xpTable.context.wrong);

  if (isCorrect) {
    state.contextStreak += 1;
    state.progress.bestContextStreak = Math.max(
      state.progress.bestContextStreak || 0,
      state.contextStreak
    );
    elements.contextFeedback.textContent =
      `Boa. ${state.context.breakdown} = ${state.context.answer}. (${formatXpDelta(delta)})`;
  } else {
    state.contextStreak = 0;
    elements.contextFeedback.textContent =
      `Resposta: ${state.context.answer} | ${state.context.breakdown} | ${state.context.meaning} (${formatXpDelta(delta)})`;
  }

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function generateCloze() {
  const deck = getActiveContextDeck().filter((item) => item.chars.length >= 3);
  const item = pickAdaptive(deck, "cloze", (entry) => entry.id, (entry) =>
    computeItemWeight(entry)
  );

  if (!item) {
    state.cloze = null;
    return;
  }

  const hiddenIndex = pickHiddenIndex(item.chars);
  const correctChar = item.chars[hiddenIndex];
  const options = buildKanaChoicesForScript(correctChar, item.script);

  state.cloze = {
    ...item,
    hiddenIndex,
    correctChar,
    options,
    answered: false,
  };

  elements.clozeFeedback.textContent = "";
}

function renderCloze() {
  if (!state.cloze) {
    return;
  }

  elements.clozeKindLabel.textContent = `${labelForTextGroup(state.cloze.group)} com lacuna`;
  elements.clozeInstruction.textContent = "Qual kana completa este item?";
  elements.clozeWord.textContent = buildMaskedText(state.cloze.text, state.cloze.hiddenIndex);
  elements.clozeMeaning.textContent = state.cloze.meaning;
  elements.clozeOptions.innerHTML = "";

  state.cloze.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.textContent = option;
    button.disabled = state.cloze.answered;
    button.addEventListener("click", () => checkClozeAnswer(option, button));
    elements.clozeOptions.appendChild(button);
  });
}

function checkClozeAnswer(choice, button) {
  if (!state.cloze || state.cloze.answered) {
    return;
  }

  state.cloze.answered = true;
  const isCorrect = choice === state.cloze.correctChar;
  markItemProgress(state.cloze.id, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.cloze.correct : xpTable.cloze.wrong);
  const entry = charIndex.get(state.cloze.correctChar);
  if (entry) {
    markCharProgress(entry.id, isCorrect);
  }

  if (isCorrect) {
    state.clozeStreak += 1;
    state.progress.bestClozeStreak = Math.max(
      state.progress.bestClozeStreak || 0,
      state.clozeStreak
    );
    button.classList.add("correct");
    elements.clozeFeedback.textContent =
      `Certo. ${state.cloze.text} = ${state.cloze.meaning}. (${formatXpDelta(delta)})`;
  } else {
    state.clozeStreak = 0;
    button.classList.add("wrong");
    elements.clozeFeedback.textContent =
      `Era ${state.cloze.text} | ${state.cloze.answer} | ${state.cloze.meaning}. (${formatXpDelta(delta)})`;
  }

  Array.from(elements.clozeOptions.children).forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.textContent === state.cloze.correctChar) {
      optionButton.classList.add("correct");
    }
  });

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function generateDictation() {
  const deck = getActiveContextDeck();
  state.dictation = pickAdaptive(deck, "dictation", (item) => item.id, (item) =>
    computeItemWeight(item)
  );
  elements.dictationInput.value = "";
  elements.dictationFeedback.textContent = "";
}

function renderDictation() {
  if (!state.dictation) {
    return;
  }

  elements.dictationKindLabel.textContent = `${labelForTextGroup(state.dictation.group)} em audio`;
  elements.dictationMeaning.textContent = state.dictation.meaning;
}

function checkDictation() {
  if (!state.dictation) {
    return;
  }

  const typed = normalizeRomanization(elements.dictationInput.value);
  const expected = normalizeRomanization(state.dictation.answer);
  const isCorrect = typed === expected;

  markItemProgress(state.dictation.id, isCorrect);
  markTextProgress(state.dictation.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.dictation.correct : xpTable.dictation.wrong);

  if (isCorrect) {
    state.dictationStreak += 1;
    state.progress.bestDictationStreak = Math.max(
      state.progress.bestDictationStreak || 0,
      state.dictationStreak
    );
    elements.dictationFeedback.textContent =
      `Boa. ${state.dictation.answer} | ${state.dictation.meaning}. (${formatXpDelta(delta)})`;
  } else {
    state.dictationStreak = 0;
    elements.dictationFeedback.textContent =
      `Resposta: ${state.dictation.text} | ${state.dictation.answer} | ${state.dictation.meaning} (${formatXpDelta(delta)})`;
  }

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function generateConfusion() {
  const deck = getActiveConfusionDeck();
  const card = pickAdaptive(deck, "confusion", (item) => item.id, (item) =>
    computeItemWeight(item)
  );
  state.confusion = {
    ...card,
    options: shuffle([...card.options]),
    answered: false,
  };
  elements.confusionFeedback.textContent = "";
}

function renderConfusion() {
  if (!state.confusion) {
    return;
  }

  elements.confusionInstruction.textContent = state.confusion.instruction;
  elements.confusionPrompt.textContent = state.confusion.prompt;
  elements.confusionOptions.innerHTML = "";

  state.confusion.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "duel-button";
    button.textContent = option;
    button.disabled = state.confusion.answered;
    button.addEventListener("click", () => checkConfusionAnswer(option, button));
    elements.confusionOptions.appendChild(button);
  });
}

function checkConfusionAnswer(choice, button) {
  if (!state.confusion || state.confusion.answered) {
    return;
  }

  state.confusion.answered = true;
  const isCorrect = choice === state.confusion.answer;
  markItemProgress(state.confusion.id, isCorrect);
  markCharsByList(state.confusion.charIds, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.confusion.correct : xpTable.confusion.wrong);

  if (isCorrect) {
    state.confusionStreak += 1;
    state.progress.bestConfusionStreak = Math.max(
      state.progress.bestConfusionStreak || 0,
      state.confusionStreak
    );
    button.classList.add("correct");
    elements.confusionFeedback.textContent =
      `Certo. ${state.confusion.note} (${formatXpDelta(delta)})`;
  } else {
    state.confusionStreak = 0;
    button.classList.add("wrong");
    elements.confusionFeedback.textContent =
      `Quase. ${state.confusion.note} (${formatXpDelta(delta)})`;
  }

  Array.from(elements.confusionOptions.children).forEach((optionButton) => {
    optionButton.disabled = true;
    if (optionButton.textContent === state.confusion.answer) {
      optionButton.classList.add("correct");
    }
  });

  saveProgress();
  renderStats();
  renderDetailCard();
  renderFocusRadar();
}

function generateBuilder() {
  const deck = getActiveBuilderDeck();
  const word = pickAdaptive(deck, "builder", (item) => item.id, (item) =>
    computeItemWeight(item)
  );
  const distractorPool = getStudyPool()
    .filter((entry) => entry.script === word.script && !word.chars.includes(entry.char))
    .map((entry) => entry.char);
  const distractors = shuffle([...new Set(distractorPool)]).slice(
    0,
    Math.max(2, Math.min(4, word.chars.length + 1))
  );

  state.builder = {
    ...word,
    bank: shuffle([...word.chars, ...distractors]),
    selected: [],
    locked: false,
  };

  elements.builderFeedback.textContent = "";
}

function renderBuilder() {
  if (!state.builder) {
    return;
  }

  elements.builderRomaji.textContent = state.builder.romajiLabel;
  elements.builderMeaning.textContent = state.builder.meaning;
  elements.builderSlots.innerHTML = "";
  elements.builderBank.innerHTML = "";

  state.builder.chars.forEach((_, index) => {
    const slot = document.createElement("div");
    slot.className = `builder-slot${state.builder.selected[index] ? "" : " placeholder"}`;
    slot.textContent = state.builder.selected[index] || "escolha";
    elements.builderSlots.appendChild(slot);
  });

  state.builder.bank.forEach((char) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "bank-button";
    button.textContent = char;

    const usedCount = countOccurrences(state.builder.selected, char);
    const availableCount = countOccurrences(state.builder.bank, char);
    const isUsed = usedCount >= availableCount;

    if (isUsed) {
      button.classList.add("used");
    }

    button.disabled = state.builder.locked || isUsed;
    button.addEventListener("click", () => handleBuilderChoice(char));
    elements.builderBank.appendChild(button);
  });
}

function handleBuilderChoice(char) {
  if (!state.builder || state.builder.locked) {
    return;
  }

  state.builder.selected.push(char);

  if (state.builder.selected.length === state.builder.chars.length) {
    checkBuilder();
    return;
  }

  renderBuilder();
}

function checkBuilder() {
  if (!state.builder) {
    return;
  }

  state.builder.locked = true;
  const attempt = state.builder.selected.join("");
  const expected = state.builder.text;
  const isCorrect = attempt === expected;

  markItemProgress(state.builder.id, isCorrect);
  markTextProgress(expected, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.builder.correct : xpTable.builder.wrong);

  if (isCorrect) {
    state.builderStreak += 1;
    state.progress.bestBuilderStreak = Math.max(
      state.progress.bestBuilderStreak || 0,
      state.builderStreak
    );
    elements.builderFeedback.textContent =
      `Boa. ${expected} = ${state.builder.romajiLabel}. (${formatXpDelta(delta)})`;
  } else {
    state.builderStreak = 0;
    elements.builderFeedback.textContent =
      `Era ${expected} • ${state.builder.romajiLabel} • ${state.builder.meaning}.`;
  }

  saveProgress();
  renderStats();
  renderDetailCard();
  renderBuilder();
  renderFocusRadar();
}

function renderFocusRadar() {
  const ranked = getRankedReviewItems(getStudyPool()).slice(0, 8);
  const weakItems = getWeakEntries(getStudyPool());
  const focusLabel = state.focus === "weak" ? "Foco atual: meus erros" : "Foco atual: tudo";
  const summaryText = buildFocusSummary(weakItems.length);

  elements.focusModeLabel.textContent = focusLabel;
  elements.focusModeLabelReview.textContent = focusLabel;
  elements.weakCountLabel.textContent = `${weakItems.length} kana em revisao`;
  elements.weakCountLabelReview.textContent = `${weakItems.length} kana em revisao`;
  elements.focusSummary.textContent = summaryText;
  elements.focusSummaryReview.textContent = summaryText;
  elements.activateWeakFocus.disabled = state.focus === "weak";
  elements.clearFocus.disabled = state.focus === "all";

  renderWeakList(elements.weakList, ranked);
  renderWeakList(elements.weakListReview, ranked);
}

function renderWeakList(container, ranked) {
  container.innerHTML = "";
  ranked.forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "weak-chip";
    chip.innerHTML = `
      <span class="weak-char">${item.entry.char}</span>
      <span class="weak-meta">${item.entry.romaji}</span>
      <span class="weak-meta">${formatReviewMeta(item)}</span>
    `;
    chip.addEventListener("click", () => {
      state.selectedId = item.entry.id;
      state.revealCard = false;
      setSection("study");
      renderAll();
    });
    container.appendChild(chip);
  });
}

function renderConfusionNotes() {
  const set = confusionSets[state.script] || confusionSets.mixed;
  elements.confusionGrid.innerHTML = "";

  set.forEach(([pair, note]) => {
    const card = document.createElement("article");
    card.className = "confusion-card";
    card.innerHTML = `
      <p class="confusion-pair">${pair}</p>
      <p>${note}</p>
    `;
    elements.confusionGrid.appendChild(card);
  });
}

function buildRomajiOptions(pool, correct) {
  const options = [correct.romaji];
  const used = new Set(options);
  shuffle([...pool]).forEach((entry) => {
    if (used.size >= 4) {
      return;
    }
    if (!used.has(entry.romaji)) {
      used.add(entry.romaji);
      options.push(entry.romaji);
    }
  });
  return shuffle(options);
}

function buildKanaOptions(pool, correct) {
  const sameScriptPool = pool.filter((entry) => entry.script === correct.script);
  const options = [correct.char];
  const used = new Set(options);
  shuffle([...sameScriptPool]).forEach((entry) => {
    if (used.size >= 4) {
      return;
    }
    if (!used.has(entry.char)) {
      used.add(entry.char);
      options.push(entry.char);
    }
  });
  return shuffle(options);
}

function buildKanaChoicesForScript(correctChar, script) {
  const pool = getStudyPool().filter((entry) => entry.script === script);
  const options = [correctChar];
  const used = new Set(options);

  shuffle([...pool]).forEach((entry) => {
    if (used.size >= 4) {
      return;
    }
    if (!used.has(entry.char)) {
      used.add(entry.char);
      options.push(entry.char);
    }
  });

  return shuffle(options);
}

function getStudyPool() {
  const base =
    state.script === "mixed"
      ? [...baseLibrary.hiragana, ...baseLibrary.katakana]
      : [...baseLibrary[state.script]];

  if (state.level === "base") {
    return base;
  }

  const extra =
    state.script === "mixed"
      ? [...extendedLibrary.hiragana, ...extendedLibrary.katakana]
      : [...extendedLibrary[state.script]];

  return [...base, ...extra];
}

function getPracticePool() {
  return getStudyPool();
}

function getActiveScripts() {
  return state.script === "mixed" ? ["hiragana", "katakana"] : [state.script];
}

function getActiveReadingDeck() {
  const scripts = getActiveScripts();
  return scripts.flatMap((scriptName) => {
    const base = readingDecks[scriptName].base;
    return state.level === "base" ? base : [...base, ...readingDecks[scriptName].extended];
  });
}

function getActiveContextDeck() {
  const scripts = getActiveScripts();
  return scripts.flatMap((scriptName) => {
    const base = contextDecks[scriptName].base;
    return state.level === "base" ? base : [...base, ...contextDecks[scriptName].extended];
  });
}

function getActiveBuilderDeck() {
  const scripts = getActiveScripts();
  return scripts.flatMap((scriptName) => {
    const base = [...builderDecks[scriptName].base, ...contextBuilderDecks[scriptName].base];
    return state.level === "base"
      ? base
      : [...base, ...builderDecks[scriptName].extended, ...contextBuilderDecks[scriptName].extended];
  });
}

function getActiveConfusionDeck() {
  return confusionDecks[state.script] || confusionDecks.mixed;
}

function getSelectedEntry() {
  return getStudyPool().find((entry) => entry.id === state.selectedId) || getStudyPool()[0];
}

function ensureSelection() {
  const pool = getStudyPool();
  if (!pool.length) {
    state.selectedId = null;
    return;
  }

  const stillExists = pool.some((entry) => entry.id === state.selectedId);
  if (!stillExists) {
    state.selectedId = pool[0].id;
  }
}

function moveSelection(direction) {
  const pool = getStudyPool();
  if (!pool.length) {
    return;
  }
  const currentIndex = Math.max(
    0,
    pool.findIndex((entry) => entry.id === state.selectedId)
  );
  const nextIndex = (currentIndex + direction + pool.length) % pool.length;
  state.selectedId = pool[nextIndex].id;
  state.revealCard = false;
  renderAll();
}

function defaultProgress() {
  return {
    charStats: {},
    itemStats: {},
    xp: 0,
    bestQuizStreak: 0,
    bestReadingStreak: 0,
    bestContextStreak: 0,
    bestPhraseStreak: 0,
    bestClozeStreak: 0,
    bestDictationStreak: 0,
    bestConfusionStreak: 0,
    bestBuilderStreak: 0,
    bestArcadeShuriken: 0,
    bestArcadeFoods: 0,
    bestArcadePairs: 0,
    arcadeLastGame: "shuriken",
  };
}

function getProgressStorageKey(userName = state.currentUser) {
  return userName ? `${progressStoragePrefix}${userName}` : null;
}

function loadProgress(userName = state.currentUser) {
  if (!userName) {
    return defaultProgress();
  }

  try {
    const raw = localStorage.getItem(getProgressStorageKey(userName));
    if (!raw) {
      const legacyRaw = localStorage.getItem(legacyStorageKey);
      if (!legacyRaw) {
        return defaultProgress();
      }

      const legacyParsed = JSON.parse(legacyRaw);
      return normalizeLoadedProgress({
        ...defaultProgress(),
        ...legacyParsed,
        charStats: legacyParsed.charStats || legacyParsed.stats || {},
        itemStats: legacyParsed.itemStats || {},
      });
    }

    const parsed = JSON.parse(raw);
    return normalizeLoadedProgress({
      ...defaultProgress(),
      ...parsed,
      charStats: parsed.charStats || parsed.stats || {},
      itemStats: parsed.itemStats || {},
    });
  } catch {
    return defaultProgress();
  }
}

function saveProgress(options = {}) {
  const { immediate = false } = options;
  const key = getProgressStorageKey();
  if (!key) {
    return Promise.resolve();
  }
  localStorage.setItem(key, JSON.stringify(state.progress));

  if (!isCloudMode() || !state.currentUser) {
    return Promise.resolve();
  }

  const commit = async () => {
    const snapshot = JSON.parse(JSON.stringify(state.progress));
    const summary = summarizeProgress(snapshot);
    setSyncStatus("saving");

    try {
      await runtime.bridge.saveProgress({
        userId: state.currentUserId,
        userName: state.currentUser,
        progress: snapshot,
        summary,
      });
      state.leaderboardLoadedAt = 0;
      setSyncStatus("synced");
      if (state.section === "arcade" && state.arcade.screen === "records") {
        void refreshSharedLeaderboard(true);
      }
    } catch (error) {
      console.error("Falha ao salvar o progresso online.", error);
      setSyncStatus("error");
    }
  };

  if (immediate) {
    if (runtime.saveTimer) {
      window.clearTimeout(runtime.saveTimer);
      runtime.saveTimer = 0;
    }
    runtime.savePromise = runtime.savePromise.then(commit);
    return runtime.savePromise;
  }

  if (runtime.saveTimer) {
    window.clearTimeout(runtime.saveTimer);
  }
  runtime.saveTimer = window.setTimeout(() => {
    runtime.saveTimer = 0;
    runtime.savePromise = runtime.savePromise.then(commit);
  }, remoteSaveDelay);

  return runtime.savePromise;
}

async function flushPendingProgressSave() {
  if (!isCloudMode()) {
    return;
  }
  if (runtime.saveTimer) {
    window.clearTimeout(runtime.saveTimer);
    runtime.saveTimer = 0;
    await saveProgress({ immediate: true });
    return;
  }
  await runtime.savePromise;
}

function getCharStats(id) {
  return state.progress.charStats[id] || { hits: 0, misses: 0 };
}

function getItemStats(id) {
  return state.progress.itemStats[id] || { hits: 0, misses: 0 };
}

function markCharProgress(id, success) {
  if (!state.progress.charStats[id]) {
    state.progress.charStats[id] = { hits: 0, misses: 0 };
  }
  if (success) {
    state.progress.charStats[id].hits += 1;
  } else {
    state.progress.charStats[id].misses += 1;
  }
}

function markItemProgress(id, success) {
  if (!state.progress.itemStats[id]) {
    state.progress.itemStats[id] = { hits: 0, misses: 0 };
  }
  if (success) {
    state.progress.itemStats[id].hits += 1;
  } else {
    state.progress.itemStats[id].misses += 1;
  }
}

function markTextProgress(text, success) {
  [...text].forEach((char) => {
    const entry = charIndex.get(char);
    if (entry) {
      markCharProgress(entry.id, success);
    }
  });
}

function markCharsByList(charIds, success) {
  charIds.forEach((id) => markCharProgress(id, success));
}

function isWeakEntry(entry) {
  const stats = getCharStats(entry.id);
  const total = stats.hits + stats.misses;
  if (stats.misses >= 1) {
    return true;
  }
  if (total >= 4 && stats.hits / total < 0.72) {
    return true;
  }
  return false;
}

function getWeakEntries(entries) {
  return entries.filter((entry) => isWeakEntry(entry));
}

function getRankedReviewItems(entries) {
  return entries
    .map((entry) => {
      const stats = getCharStats(entry.id);
      const total = stats.hits + stats.misses;
      const accuracy = total ? stats.hits / total : 0;
      const weak = isWeakEntry(entry);
      const mastered = total >= 5 && accuracy >= 0.78 && stats.hits >= 4;
      return { entry, stats, total, accuracy, weak, mastered };
    })
    .sort((left, right) => {
      if (Number(right.weak) !== Number(left.weak)) {
        return Number(right.weak) - Number(left.weak);
      }
      if (right.stats.misses !== left.stats.misses) {
        return right.stats.misses - left.stats.misses;
      }
      if (left.mastered !== right.mastered) {
        return Number(left.mastered) - Number(right.mastered);
      }
      if (left.total !== right.total) {
        return left.total - right.total;
      }
      return left.entry.romaji.localeCompare(right.entry.romaji);
    });
}

function computeCharWeight(entry) {
  const stats = getCharStats(entry.id);
  const total = stats.hits + stats.misses;
  const accuracy = total ? stats.hits / total : 0;
  const weak = isWeakEntry(entry);

  let weight = 1;

  if (total === 0) {
    weight += 2.6;
  } else {
    weight += Math.max(0, 0.84 - accuracy) * 5.4;
  }

  weight += stats.misses * 1.35;

  if (stats.hits >= 5 && accuracy >= 0.9) {
    weight *= 0.28;
  }

  if (state.focus === "weak") {
    weight *= weak ? 2.7 : 0.4;
  }

  return Math.max(0.08, weight);
}

function computeItemWeight(item) {
  const stats = getItemStats(item.id);
  const total = stats.hits + stats.misses;
  const accuracy = total ? stats.hits / total : 0;
  const relatedEntries = item.charIds.map((id) => entryIndex.get(id)).filter(Boolean);
  const averageCharWeight =
    relatedEntries.reduce((sum, entry) => sum + computeCharWeight(entry), 0) /
    Math.max(1, relatedEntries.length);
  const touchesWeakEntry = relatedEntries.some((entry) => isWeakEntry(entry));

  let weight = 0.75 + averageCharWeight * 0.7;

  if (total === 0) {
    weight += 1.6;
  } else {
    weight += Math.max(0, 0.86 - accuracy) * 4.8;
  }

  weight += stats.misses * 1.2;

  if (stats.hits >= 4 && accuracy >= 0.88) {
    weight *= 0.38;
  }

  if (state.focus === "weak") {
    weight *= touchesWeakEntry ? 2.15 : 0.45;
  }

  return Math.max(0.08, weight);
}

function pickAdaptive(items, mode, getId, getWeight) {
  if (!items.length) {
    return null;
  }

  const recentIds = new Set(state.recent[mode]);
  const freshItems = items.filter((item) => !recentIds.has(getId(item)));
  const candidatePool = freshItems.length >= Math.min(4, items.length) ? freshItems : items;

  const weighted = candidatePool.map((item) => ({
    item,
    id: getId(item),
    weight: getWeight(item),
  }));

  const chosen = weightedSample(weighted);
  rememberRecent(mode, getId(chosen));
  return chosen;
}

function rememberRecent(mode, id) {
  const recent = state.recent[mode];
  const next = recent.filter((item) => item !== id);
  next.unshift(id);
  state.recent[mode] = next.slice(0, recentLimits[mode]);
}

function weightedSample(weightedItems) {
  const totalWeight = weightedItems.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    return weightedItems[Math.floor(Math.random() * weightedItems.length)].item;
  }

  let threshold = Math.random() * totalWeight;
  for (const weightedItem of weightedItems) {
    threshold -= weightedItem.weight;
    if (threshold <= 0) {
      return weightedItem.item;
    }
  }

  return weightedItems[weightedItems.length - 1].item;
}

function buildFocusSummary(weakCount) {
  if (weakCount > 0 && state.focus === "weak") {
    return "Agora o sorteio esta puxando com mais frequencia os kana e palavras que ainda estao falhando.";
  }
  if (weakCount > 0) {
    return "Os chips abaixo mostram os gargalos do momento. Se quiser, ligue o foco em erros para forcar a repeticao nesses pontos.";
  }
  if (state.focus === "weak") {
    return "Ainda nao ha erros suficientes salvos. Enquanto isso, o sistema usa itens menos praticados para nao deixar o bloco vazio.";
  }
  return "Ainda nao existe historico forte o bastante para apontar gargalos. Conforme voce pratica, este radar vai ficando mais esperto.";
}

function formatReviewMeta(item) {
  if (!item.total) {
    return "novo";
  }
  const accuracy = Math.round(item.accuracy * 100);
  return `${accuracy}% • ${item.stats.hits}/${item.total}`;
}

function labelForScript(script) {
  return script === "hiragana" ? "Hiragana" : "Katakana";
}

function labelForTextGroup(group) {
  const labels = {
    palavra: "Palavra maior",
    expressao: "Expressao",
    frase: "Frase simples",
    composto: "Composto",
  };

  return labels[group] || "Leitura longa";
}

function labelForPhraseCategory(category) {
  const labels = {
    saudacoes: "Saudacoes",
    viagem: "Viagem",
    conversa: "Conversa",
    anime: "Anime",
  };

  return labels[category] || "Frases";
}

function buildScriptEntries(script, families) {
  return families.flatMap((familyData) =>
    familyData.items.map(([char, romaji, example]) =>
      createBaseEntry(script, familyData, char, romaji, example)
    )
  );
}

function createBaseEntry(script, familyData, char, romaji, example) {
  const vowel = romaji.slice(-1);
  const formula =
    familyData.consonant === ""
      ? "Vogal pura"
      : familyData.family === "Final"
        ? "Som final"
        : familyData.items.length === 2 && familyData.family === "Linha W"
          ? `w + ${vowel}`
          : `${familyData.consonant} + ${vowel}`;

  return {
    id: `${script}-${char}`,
    char,
    romaji,
    script,
    family: familyData.family,
    consonant: familyData.consonant,
    example,
    formula,
    note: irregularNotes[char] || familyData.note,
  };
}

function createExtendedEntry(script) {
  return ([char, romaji, family, consonant, note, example]) => ({
    id: `${script}-${char}`,
    char,
    romaji,
    script,
    family,
    consonant,
    example,
    formula: `${romaji[0]} + ${romaji.slice(-1)} com marca sonora`,
    note,
  });
}

function createReadingDecks(config) {
  return Object.fromEntries(
    Object.entries(config).map(([script, levels]) => [
      script,
      Object.fromEntries(
        Object.entries(levels).map(([level, items]) => [
          level,
          items.map(([text, answer, breakdown, meaning, pseudo], index) => ({
            id: `reading-${script}-${level}-${index}-${text}`,
            script,
            text,
            answer,
            breakdown,
            meaning,
            pseudo: Boolean(pseudo),
            chars: [...text],
            charIds: [],
          })),
        ])
      ),
    ])
  );
}

function createBuilderDecks(config) {
  return Object.fromEntries(
    Object.entries(config).map(([script, levels]) => [
      script,
      Object.fromEntries(
        Object.entries(levels).map(([level, items]) => [
          level,
          items.map(([text, romajiParts, meaning], index) => ({
            id: `builder-${script}-${level}-${index}-${text}`,
            script,
            text,
            chars: [...text],
            romajiParts,
            romajiLabel: romajiParts.join(" • "),
            meaning,
            charIds: [],
          })),
        ])
      ),
    ])
  );
}

function createContextDecks(config) {
  return Object.fromEntries(
    Object.entries(config).map(([script, levels]) => [
      script,
      Object.fromEntries(
        Object.entries(levels).map(([level, items]) => [
          level,
          items.map(([text, answer, breakdown, meaning, group], index) => ({
            id: `context-${script}-${level}-${index}-${text}`,
            script,
            text,
            answer,
            breakdown: normalizeBreakdown(breakdown),
            meaning,
            group,
            chars: [...text],
            charIds: [],
          })),
        ])
      ),
    ])
  );
}

function createPhraseDecks(config) {
  return Object.fromEntries(
    Object.entries(config).map(([level, items]) => [
      level,
      items.map(([category, text, answer, breakdown, meaning, scene], index) => ({
        id: `phrase-${level}-${category}-${index}-${text}`,
        category,
        text,
        answer,
        breakdown: normalizeBreakdown(breakdown),
        meaning,
        scene,
        chars: [...text],
        charIds: [],
      })),
    ])
  );
}

function createBuilderDecksFromContext(deckGroup) {
  return Object.fromEntries(
    Object.entries(deckGroup).map(([script, levels]) => [
      script,
      Object.fromEntries(
        Object.entries(levels).map(([level, items]) => [
          level,
          items.map((item, index) => ({
            id: `builder-context-${script}-${level}-${index}-${item.text}`,
            script,
            text: item.text,
            chars: [...item.text],
            romajiParts: item.breakdown.split(" / "),
            romajiLabel: item.breakdown,
            meaning: item.meaning,
            charIds: [],
          })),
        ])
      ),
    ])
  );
}

function createConfusionDecks(config) {
  return Object.fromEntries(
    Object.entries(config).map(([script, items]) => [
      script,
      items.map(([instruction, prompt, options, answer, note], index) => ({
        id: `confusion-${script}-${index}-${prompt}`,
        script,
        instruction,
        prompt,
        options,
        answer,
        note,
        chars: [...new Set(options)],
        charIds: [],
      })),
    ])
  );
}

function hydrateDeckCharIds(deckGroup) {
  Object.values(deckGroup).forEach((group) => {
    if (Array.isArray(group)) {
      group.forEach(hydrateItemCharIds);
      return;
    }

    Object.values(group).forEach((items) => items.forEach(hydrateItemCharIds));
  });
}

function hydrateItemCharIds(item) {
  const sourceChars = item.chars || [...item.text || ""];
  item.charIds = sourceChars
    .map((char) => charIndex.get(char))
    .filter(Boolean)
    .map((entry) => entry.id);
}

function groupByFamily(entries) {
  const map = new Map();
  entries.forEach((entry) => {
    if (!map.has(entry.family)) {
      map.set(entry.family, []);
    }
    map.get(entry.family).push(entry);
  });
  return [...map.entries()];
}

function normalizeRomanization(value) {
  return value.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");
}

function countOccurrences(list, target) {
  return list.filter((item) => item === target).length;
}

function normalizeBreakdown(value) {
  return value
    .replace(/Ã¢â‚¬Â¢/g, "/")
    .replace(/â€¢/g, "/")
    .replace(/•/g, "/")
    .replace(/\s*\/\s*/g, " / ");
}

function buildMaskedText(text, hiddenIndex) {
  return [...text]
    .map((char, index) => (index === hiddenIndex ? "_" : char))
    .join("");
}

function pickHiddenIndex(chars) {
  const candidates = chars
    .map((char, index) => ({ char, index }))
    .filter(({ char }) => Boolean(charIndex.get(char)));

  if (!candidates.length) {
    return 0;
  }

  return candidates[Math.floor(Math.random() * candidates.length)].index;
}

function speakText(text) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";
  utterance.rate = 0.85;

  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("ja"));
  if (japaneseVoice) {
    utterance.voice = japaneseVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function shuffle(list) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}
