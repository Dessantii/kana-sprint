const legacyStorageKey = "kanaSprintProgressV3";
const profileStorageKey = "kanaSprintProfilesV1";
const sessionStorageKey = "kanaSprintSessionV1";
const sessionMetaStorageKey = "kanaSprintSessionMetaV1";
const cloudSessionCacheKey = "kanaSprintCloudSessionV1";
const progressStoragePrefix = "kanaSprintProgressV4::";
const pendingSyncPrefix = "kanaSprintPendingSyncV1::";
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
const contentRotationModes = [
  "quiz",
  "reading",
  "context",
  "phrases",
  "cloze",
  "dictation",
  "confusion",
  "builder",
];
const contentRotationMeta = [
  { mode: "quiz", label: "Teste" },
  { mode: "reading", label: "Leitura" },
  { mode: "context", label: "Palavras" },
  { mode: "phrases", label: "Frases" },
  { mode: "cloze", label: "Lacunas" },
  { mode: "dictation", label: "Ditado" },
  { mode: "confusion", label: "Confusoes" },
  { mode: "builder", label: "Montagem" },
];
const rotationExemptReviewBuckets = new Set(["learning", "today"]);

const rankLadder = [
  { xp: 0, title: "Novato" },
  { xp: 120, title: "Viajante" },
  { xp: 260, title: "Leitor" },
  { xp: 460, title: "Duelista" },
  { xp: 720, title: "Guardiao" },
  { xp: 1040, title: "Mestre Kana" },
];

const phraseCategories = ["saudacoes", "viagem", "conversa", "anime"];
const activityWindowDays = 7;
const reviewBucketOrder = ["new", "learning", "today", "tomorrow", "later"];
const reviewBucketMeta = {
  new: { label: "Novo", note: "ainda nao visto" },
  learning: { label: "Aprendendo", note: "voltando cedo" },
  today: { label: "Hoje", note: "vence agora" },
  tomorrow: { label: "Amanha", note: "vence em breve" },
  later: { label: "Depois", note: "mais estavel" },
};
const dailyMissionCatalog = [
  {
    id: "answers",
    label: "10 acertos",
    description: "Resolva dez respostas corretas em qualquer modo.",
    target: 10,
  },
  {
    id: "review",
    label: "6 revisoes vencendo",
    description: "Enfrente blocos que estavam pedindo volta hoje.",
    target: 6,
  },
  {
    id: "phrases",
    label: "3 blocos de contexto",
    description: "Passe por frases, audio ou contexto real.",
    target: 3,
  },
  {
    id: "arcade",
    label: "1 minigame",
    description: "Entre em pelo menos um jogo do arcade.",
    target: 1,
  },
];
const distractionGatePresets = [
  {
    id: "warmup",
    label: "Curto",
    title: "Destravar rapido",
    description: "12 acertos, 2 revisoes vencendo e 1 bloco de contexto ou frase.",
    targets: { answers: 12, review: 2, phrases: 1 },
  },
  {
    id: "missions",
    label: "Licoes do dia",
    title: "Fechar as licoes do dia",
    description: "Complete as 4 missoes diarias antes de se liberar.",
    missionsComplete: true,
  },
  {
    id: "deep",
    label: "Pesado",
    title: "Bloco forte antes das redes",
    description: "25 acertos, 4 revisoes vencendo e 2 blocos de contexto ou frase.",
    targets: { answers: 25, review: 4, phrases: 2 },
  },
];
const distractionRewards = {
  youtube: {
    label: "YouTube",
    url: "https://www.youtube.com/",
  },
  instagram: {
    label: "Instagram",
    url: "https://www.instagram.com/",
  },
};
const trackCatalog = [
  {
    id: "foundations",
    label: "Fundamentos",
    note: "familias base e reflexo de kana",
    action: { section: "training", trainTarget: "recognition" },
  },
  {
    id: "saudacoes",
    label: "Saudacoes",
    note: "cumprimentos e entradas de conversa",
    category: "saudacoes",
    action: { section: "training", trainTarget: "phrases", phraseCategory: "saudacoes" },
  },
  {
    id: "viagem",
    label: "Viagem",
    note: "placas, deslocamento e situacoes de rota",
    category: "viagem",
    action: { section: "training", trainTarget: "phrases", phraseCategory: "viagem" },
  },
  {
    id: "conversa",
    label: "Conversa",
    note: "trocas do cotidiano e respostas naturais",
    category: "conversa",
    action: { section: "training", trainTarget: "phrases", phraseCategory: "conversa" },
  },
  {
    id: "anime",
    label: "Anime",
    note: "falas mais longas e ritmo de cena",
    category: "anime",
    action: { section: "training", trainTarget: "phrases", phraseCategory: "anime" },
  },
  {
    id: "arcade",
    label: "Arcade",
    note: "reflexo, memoria e leitura sob pressao",
    action: { section: "arcade", arcadeScreen: "games" },
  },
];
const coreTrainModes = ["recognition", "reading", "context", "phrases"];
const extraTrainModes = ["confusion", "cloze", "dictation", "builder"];
const allTrainModes = [...coreTrainModes, ...extraTrainModes];
const quickSessionDurations = [2, 5, 10];
const trainBlockTarget = 8;
const trainModeMeta = {
  recognition: {
    label: "Reflexo",
    copy: "Reconheca o caractere ou o som correto com rapidez e clareza.",
  },
  reading: {
    label: "Curtas",
    copy: "Leia palavras menores por blocos e descubra onde a leitura ainda trava.",
  },
  context: {
    label: "Contexto",
    copy: "Junte palavras maiores e expressoes sem perder a leitura por partes.",
  },
  phrases: {
    label: "Frases",
    copy: "Pratique frases por situacao para conectar leitura, ritmo e vocabulario.",
  },
  confusion: {
    label: "Confusos",
    copy: "Separe pares parecidos e force o olho a notar o detalhe que diferencia.",
  },
  cloze: {
    label: "Lacunas",
    copy: "Complete a estrutura do item pelo kana que esta faltando no meio da leitura.",
  },
  dictation: {
    label: "Audio",
    copy: "Escute primeiro e transforme o som em romaji antes de confirmar a resposta.",
  },
  builder: {
    label: "Montagem",
    copy: "Monte a palavra kana por kana para reforcar forma, ordem e som ao mesmo tempo.",
  },
};

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

function createQuickSessionState() {
  return {
    durationMinutes: 5,
    active: false,
    startedAt: 0,
    endsAt: 0,
    actionId: "adaptive",
    eventCount: 0,
    correctCount: 0,
    wrongCount: 0,
    xpDelta: 0,
    startXp: 0,
    startPracticedCount: 0,
    startWeakIds: [],
    lastSummary: null,
  };
}

function createTrainBlockMap() {
  return Object.fromEntries(
    allTrainModes.map((mode) => [mode, { answered: 0, correct: 0, wrong: 0 }])
  );
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
  audioRateToggle: document.getElementById("audio-rate-toggle"),
  audioRepeatToggle: document.getElementById("audio-repeat-toggle"),
  profileName: document.getElementById("profile-name"),
  profileRank: document.getElementById("profile-rank"),
  syncBadge: document.getElementById("sync-badge"),
  logoutButton: document.getElementById("logout-button"),
  installApp: document.getElementById("install-app"),
  installStatus: document.getElementById("install-status"),
  studiedCount: document.getElementById("studied-count"),
  masteredCount: document.getElementById("mastered-count"),
  reviewCount: document.getElementById("review-count"),
  bestStreak: document.getElementById("best-streak"),
  todayPrimaryKicker: document.getElementById("today-primary-kicker"),
  todayPrimaryTitle: document.getElementById("today-primary-title"),
  todayPrimaryCopy: document.getElementById("today-primary-copy"),
  todayPrimaryAction: document.getElementById("today-primary-action"),
  todayPlanPill: document.getElementById("today-plan-pill"),
  todayPlanList: document.getElementById("today-plan-list"),
  rotationWindowLabel: document.getElementById("rotation-window-label"),
  rotationSeenCount: document.getElementById("rotation-seen-count"),
  rotationTotalCount: document.getElementById("rotation-total-count"),
  rotationProgress: document.getElementById("rotation-progress"),
  rotationProgressFill: document.getElementById("rotation-progress-fill"),
  rotationRenewal: document.getElementById("rotation-renewal"),
  rotationModeList: document.getElementById("rotation-mode-list"),
  gateStatusPill: document.getElementById("gate-status-pill"),
  gateCopy: document.getElementById("gate-copy"),
  gatePresets: document.getElementById("gate-presets"),
  gateProgressCopy: document.getElementById("gate-progress-copy"),
  gateProgressFill: document.getElementById("gate-progress-fill"),
  gateToggle: document.getElementById("gate-toggle"),
  gateOpenYoutube: document.getElementById("gate-open-youtube"),
  gateOpenInstagram: document.getElementById("gate-open-instagram"),
  gateNote: document.getElementById("gate-note"),
  sessionBanner: document.getElementById("session-banner"),
  sessionBannerKicker: document.getElementById("session-banner-kicker"),
  sessionBannerTitle: document.getElementById("session-banner-title"),
  sessionBannerXp: document.getElementById("session-banner-xp"),
  sessionBannerCorrect: document.getElementById("session-banner-correct"),
  sessionBannerWrong: document.getElementById("session-banner-wrong"),
  sessionTimeLeft: document.getElementById("session-time-left"),
  sessionProgressLabel: document.getElementById("session-progress-label"),
  sessionProgressFill: document.getElementById("session-progress-fill"),
  sessionStop: document.getElementById("session-stop"),
  sessionDurationPill: document.getElementById("session-duration-pill"),
  sessionStartCopy: document.getElementById("session-start-copy"),
  sessionStartTarget: document.getElementById("session-start-target"),
  sessionDurationToggle: document.getElementById("session-duration-toggle"),
  sessionStart: document.getElementById("session-start"),
  dailyStreakPill: document.getElementById("daily-streak-pill"),
  todayDuePill: document.getElementById("today-due-pill"),
  todayMissionList: document.getElementById("today-mission-list"),
  todayReviewBuckets: document.getElementById("today-review-buckets"),
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
  reviewDueSummary: document.getElementById("review-due-summary"),
  reviewPriorityList: document.getElementById("review-priority-list"),
  progressRankPill: document.getElementById("progress-rank-pill"),
  progressXpTotal: document.getElementById("progress-xp-total"),
  progressWeeklyXp: document.getElementById("progress-weekly-xp"),
  progressDailyStreak: document.getElementById("progress-daily-streak"),
  progressDueTotal: document.getElementById("progress-due-total"),
  progressMissionStatus: document.getElementById("progress-mission-status"),
  progressMissionList: document.getElementById("progress-mission-list"),
  progressReviewBuckets: document.getElementById("progress-review-buckets"),
  progressReviewList: document.getElementById("progress-review-list"),
  activitySummary: document.getElementById("activity-summary"),
  activityTimeline: document.getElementById("activity-timeline"),
  trackGrid: document.getElementById("track-grid"),
  toggleTrainNav: document.getElementById("toggle-train-nav"),
  trainRailKicker: document.getElementById("train-rail-kicker"),
  trainRailTitle: document.getElementById("train-rail-title"),
  trainRailCopy: document.getElementById("train-rail-copy"),
  trainRailFocus: document.getElementById("train-rail-focus"),
  trainRailSession: document.getElementById("train-rail-session"),
  trainRailStatus: document.getElementById("train-rail-status"),
  trainRailAnswered: document.getElementById("train-rail-answered"),
  trainRailCorrect: document.getElementById("train-rail-correct"),
  trainRailWrong: document.getElementById("train-rail-wrong"),
  trainRailAccuracy: document.getElementById("train-rail-accuracy"),
  trainRailProgressFill: document.getElementById("train-rail-progress-fill"),
  trainBlockReset: document.getElementById("train-block-reset"),
  trainBlockNext: document.getElementById("train-block-next"),
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
  rankingViewToggle: document.getElementById("ranking-view-toggle"),
  rankingSeasonNote: document.getElementById("ranking-season-note"),
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
  sessionSummary: document.getElementById("session-summary"),
  sessionSummaryKicker: document.getElementById("session-summary-kicker"),
  sessionSummaryTitle: document.getElementById("session-summary-title"),
  sessionSummaryCopy: document.getElementById("session-summary-copy"),
  sessionSummaryTime: document.getElementById("session-summary-time"),
  sessionSummaryXp: document.getElementById("session-summary-xp"),
  sessionSummaryImprovedLabel: document.getElementById("session-summary-improved-label"),
  sessionSummaryImproved: document.getElementById("session-summary-improved"),
  sessionSummaryWeakLabel: document.getElementById("session-summary-weak-label"),
  sessionSummaryWeak: document.getElementById("session-summary-weak"),
  sessionSummaryNext: document.getElementById("session-summary-next"),
  sessionSummaryClose: document.getElementById("session-summary-close"),
};

const runtime = {
  mode: "local",
  bridge: null,
  sessionReady: false,
  saveTimer: 0,
  savePromise: Promise.resolve(),
  reconnectPromise: null,
  leaderboardPromise: null,
  installPrompt: null,
  serviceWorkerReady: false,
  quickSessionTimer: 0,
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
  currentUserCloudBacked: false,
  authMode: "login",
  storageMode: "local",
  syncStatus: "local",
  trainNavExpanded: false,
  audioRate: 0.9,
  audioRepeat: 1,
  rankingView: "overall",
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
  quickSession: createQuickSessionState(),
  trainBlocks: createTrainBlockMap(),
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
  registerPwaFeatures();
  await initializeRuntime();

  const restoredSession = await restoreInitialSession();
  if (restoredSession) {
    applyAuthenticatedState(restoredSession, { refresh: false });
  }
  ensureSelection();
  ensureDailyState();
  generateQuiz();
  generateReading();
  generateContext();
  generatePhrase();
  generateCloze();
  generateDictation();
  generateConfusion();
  generateBuilder();
  renderAll();
  renderIdentity();

  if (state.currentUser) {
    hideAuthGate();
    if (hasPendingSync() && canUseCloudSync()) {
      void syncPendingProgress();
    }
  } else {
    showAuthGate("login");
  }
}

async function restoreInitialSession() {
  if (canUseCloudSync()) {
    const restoredSession = await restoreSharedSession();
    if (restoredSession) {
      const pendingSync = loadPendingSync(restoredSession.userName);
      if (pendingSync) {
        return {
          ...restoredSession,
          progress: pendingSync.progress,
          pendingSync: true,
        };
      }
      return restoredSession;
    }
  }

  return restoreLocalSession();
}

async function initializeRuntime() {
  const config = await loadRuntimeConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    state.storageMode = "local";
    runtime.mode = "local";
    runtime.sessionReady = false;
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
    runtime.sessionReady = false;
    state.storageMode = canUseCloudSync() ? "cloud" : "local";
    setSyncStatus(canUseCloudSync() ? "ready" : "local");
  } catch (error) {
    console.error("Nao foi possivel iniciar o modo online.", error);
    runtime.mode = "local";
    runtime.bridge = null;
    runtime.sessionReady = false;
    state.storageMode = "local";
    setSyncStatus(navigator.onLine === false ? "local" : "error");
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

function registerPwaFeatures() {
  renderInstallChrome();

  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        runtime.serviceWorkerReady = true;
        renderInstallChrome();
      })
      .catch((error) => {
        console.error("Nao foi possivel registrar o service worker.", error);
      });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    runtime.installPrompt = event;
    renderInstallChrome();
  });

  window.addEventListener("appinstalled", () => {
    runtime.installPrompt = null;
    renderInstallChrome();
  });

  window.addEventListener("online", () => {
    void handleConnectivityChange(true);
  });

  window.addEventListener("offline", () => {
    handleConnectivityChange(false);
  });

  window.matchMedia?.("(display-mode: standalone)")?.addEventListener("change", () => {
    renderInstallChrome();
  });
}

async function requestInstallPrompt() {
  if (!runtime.installPrompt) {
    renderInstallChrome();
    return;
  }

  const promptEvent = runtime.installPrompt;
  runtime.installPrompt = null;
  await promptEvent.prompt();
  await promptEvent.userChoice.catch(() => null);
  renderInstallChrome();
}

function isCloudMode() {
  return canUseCloudSync() && state.storageMode === "cloud";
}

function hasCloudBridge() {
  return runtime.mode === "cloud" && Boolean(runtime.bridge);
}

function canUseCloudSync() {
  return hasCloudBridge() && navigator.onLine !== false;
}

function readCloudSessionSnapshot() {
  try {
    const raw = localStorage.getItem(cloudSessionCacheKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.userName === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function getCachedCloudIdentity(userName = state.currentUser) {
  const cached = readCloudSessionSnapshot();
  if (!cached?.userName) {
    return null;
  }
  if (userName && cached.userName !== userName) {
    return null;
  }
  return cached;
}

function cacheCloudSessionSnapshot(sessionData) {
  if (!sessionData?.userName) {
    return;
  }
  const fallback = getCachedCloudIdentity(sessionData.userName);
  localStorage.setItem(
    cloudSessionCacheKey,
    JSON.stringify({
      userId: sessionData.userId || fallback?.userId || null,
      userName: sessionData.userName,
      cachedAt: Date.now(),
    })
  );
}

function clearCloudSessionSnapshot() {
  localStorage.removeItem(cloudSessionCacheKey);
}

function isCloudBackedUser(userName = state.currentUser) {
  if (!userName) {
    return false;
  }
  if (userName === state.currentUser) {
    return Boolean(state.currentUserCloudBacked);
  }
  return Boolean(getCachedCloudIdentity(userName));
}

function readSessionMeta() {
  try {
    const raw = localStorage.getItem(sessionMetaStorageKey);
    if (!raw) {
      const legacyUserName = localStorage.getItem(sessionStorageKey);
      return legacyUserName ? { userName: legacyUserName, cloudBacked: false } : null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.userName !== "string") {
      return null;
    }

    return {
      userName: parsed.userName,
      cloudBacked: Boolean(parsed.cloudBacked),
    };
  } catch {
    const legacyUserName = localStorage.getItem(sessionStorageKey);
    return legacyUserName ? { userName: legacyUserName, cloudBacked: false } : null;
  }
}

function getPendingSyncKey(userName = state.currentUser) {
  return userName ? `${pendingSyncPrefix}${userName}` : null;
}

function loadPendingSync(userName = state.currentUser) {
  const key = getPendingSyncKey(userName);
  if (!key) {
    return null;
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    const resolvedUser = parsed.userName || userName;
    const normalizedProgress = normalizeLoadedProgress(parsed.progress);
    return {
      userId: parsed.userId || getCachedCloudIdentity(resolvedUser)?.userId || null,
      userName: resolvedUser,
      progress: normalizedProgress,
      summary:
        parsed.summary && typeof parsed.summary === "object"
          ? parsed.summary
          : summarizeProgress(normalizedProgress),
      queuedAt: Number(parsed.queuedAt || Date.now()),
    };
  } catch {
    return null;
  }
}

function hasPendingSync(userName = state.currentUser) {
  return Boolean(loadPendingSync(userName));
}

function createSyncSnapshot(progress = state.progress, options = {}) {
  const userName = options.userName || state.currentUser;
  const userId = options.userId || state.currentUserId || getCachedCloudIdentity(userName)?.userId;
  const snapshot = JSON.parse(JSON.stringify(progress || defaultProgress()));
  return {
    userId: userId || null,
    userName,
    progress: snapshot,
    summary: summarizeProgress(snapshot),
    queuedAt: Date.now(),
  };
}

function queuePendingSync(snapshot) {
  if (!snapshot?.userName) {
    return;
  }
  localStorage.setItem(getPendingSyncKey(snapshot.userName), JSON.stringify(snapshot));
}

function clearPendingSync(userName = state.currentUser) {
  const key = getPendingSyncKey(userName);
  if (key) {
    localStorage.removeItem(key);
  }
}

function resolveStorageMode() {
  return state.currentUser &&
    isCloudBackedUser(state.currentUser) &&
    runtime.sessionReady &&
    canUseCloudSync()
    ? "cloud"
    : "local";
}

function refreshSyncState() {
  state.storageMode = resolveStorageMode();

  if (!state.currentUser) {
    setSyncStatus(canUseCloudSync() ? "ready" : "local");
    return;
  }

  if (state.storageMode === "cloud") {
    setSyncStatus(hasPendingSync() ? "queued" : "synced");
    return;
  }

  setSyncStatus("local");
}

async function handleConnectivityChange(isOnline) {
  if (!isOnline) {
    state.storageMode = "local";
    setSyncStatus("local");
    return;
  }

  if (state.currentUser && isCloudBackedUser(state.currentUser)) {
    void syncPendingProgress();
    return;
  }

  if (!hasCloudBridge()) {
    await initializeRuntime();
  }
  refreshSyncState();
}

async function syncPendingProgress() {
  if (!state.currentUser || !isCloudBackedUser(state.currentUser)) {
    refreshSyncState();
    return;
  }

  if (runtime.reconnectPromise) {
    return runtime.reconnectPromise;
  }

  runtime.reconnectPromise = (async () => {
    if (!canUseCloudSync()) {
      if (!hasCloudBridge()) {
        await initializeRuntime();
      }
      if (!canUseCloudSync()) {
        refreshSyncState();
        return;
      }
    }

    const pending = loadPendingSync();
    setSyncStatus(pending ? "saving" : "ready");
    const restoredSession = await restoreSharedSession({ quiet: true });
    if (!restoredSession || restoredSession.userName !== state.currentUser) {
      refreshSyncState();
      return;
    }

    cacheCloudSessionSnapshot(restoredSession);
    state.currentUserId = restoredSession.userId || state.currentUserId;
    if (Array.isArray(restoredSession.leaderboard)) {
      state.sharedRanking = restoredSession.leaderboard;
      state.leaderboardLoadedAt = Date.now();
    }
    state.storageMode = "cloud";

    const queued = pending || loadPendingSync();
    if (!queued) {
      setSyncStatus("synced");
      if (state.currentUser) {
        renderIdentity();
      }
      return;
    }

    await runtime.bridge.saveProgress({
      userId: restoredSession.userId || queued.userId || state.currentUserId,
      userName: queued.userName || restoredSession.userName,
      progress: queued.progress,
      summary: queued.summary || summarizeProgress(queued.progress),
    });

    state.progress = normalizeLoadedProgress(queued.progress);
    state.currentUserCloudBacked = true;
    clearPendingSync(queued.userName || state.currentUser);
    state.leaderboardLoadedAt = 0;
    setSyncStatus("synced");
    if (state.section === "arcade" && state.arcade.screen === "records") {
      await refreshSharedLeaderboard(true);
    }
    if (state.currentUser) {
      renderAll();
    }
  })()
    .catch((error) => {
      console.error("Falha ao sincronizar o progresso pendente.", error);
      setSyncStatus(navigator.onLine === false ? "local" : "queued");
    })
    .finally(() => {
      runtime.reconnectPromise = null;
      if (state.currentUser) {
        renderIdentity();
      } else {
        renderStorageChrome();
      }
    });

  return runtime.reconnectPromise;
}

function normalizeLoadedProgress(progress) {
  const normalized = {
    ...defaultProgress(),
    ...(progress || {}),
    charStats: progress?.charStats || progress?.stats || {},
    itemStats: progress?.itemStats || {},
    charReview: progress?.charReview || {},
    itemReview: progress?.itemReview || {},
    daily: progress?.daily || createDailyProgressState(),
    activityLog: Array.isArray(progress?.activityLog) ? progress.activityLog : [],
    distractionGate: progress?.distractionGate || createDistractionGateState(),
    contentRotation: progress?.contentRotation || createContentRotationState(),
  };
  normalized.xp = Number.isFinite(Number(normalized.xp))
    ? Math.max(0, Number(normalized.xp))
    : computeLegacyXp(normalized);
  normalized.completedStreakDays = Number.isFinite(Number(normalized.completedStreakDays))
    ? Math.max(0, Number(normalized.completedStreakDays))
    : 0;
  normalized.bestDailyStreak = Number.isFinite(Number(normalized.bestDailyStreak))
    ? Math.max(0, Number(normalized.bestDailyStreak))
    : 0;
  normalized.daily = normalizeDailyProgress(normalized.daily);
  normalized.activityLog = normalizeActivityLog(normalized.activityLog);
  normalized.charReview = normalizeReviewMap(normalized.charReview);
  normalized.itemReview = normalizeReviewMap(normalized.itemReview);
  normalized.distractionGate = normalizeDistractionGateState(normalized.distractionGate);
  normalized.contentRotation = normalizeContentRotationState(normalized.contentRotation);
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

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDateKey(dateKey, days) {
  const date = new Date(`${dateKey}T12:00:00`);
  date.setDate(date.getDate() + days);
  return getDateKey(date);
}

function createDailyProgressState(dateKey = getDateKey()) {
  return {
    dateKey,
    missions: {},
  };
}

function getRotationWindowKey(date = new Date()) {
  const anchor = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = anchor.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  anchor.setDate(anchor.getDate() + offset);
  return `week:${getDateKey(anchor)}`;
}

function getRotationWindowDates(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const day = start.getDay();
  start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const renewal = new Date(start);
  renewal.setDate(renewal.getDate() + 7);
  return { start, end, renewal };
}

function createContentRotationState(windowKey = getRotationWindowKey()) {
  return {
    windowKey,
    seenByMode: Object.fromEntries(contentRotationModes.map((mode) => [mode, []])),
  };
}

function normalizeContentRotationState(rotation) {
  const currentWindowKey = getRotationWindowKey();
  if (!rotation || typeof rotation !== "object" || rotation.windowKey !== currentWindowKey) {
    return createContentRotationState(currentWindowKey);
  }

  return {
    windowKey: currentWindowKey,
    seenByMode: Object.fromEntries(
      contentRotationModes.map((mode) => [
        mode,
        Array.isArray(rotation.seenByMode?.[mode])
          ? [...new Set(rotation.seenByMode[mode].filter((id) => typeof id === "string" && id))]
          : [],
      ])
    ),
  };
}

function getCurrentContentRotation(progress = state.progress) {
  if (!progress || typeof progress !== "object") {
    return createContentRotationState();
  }

  const normalized = normalizeContentRotationState(progress.contentRotation);
  if (progress.contentRotation !== normalized) {
    progress.contentRotation = normalized;
  }
  return progress.contentRotation;
}

function getRotationSeenIds(mode) {
  if (!contentRotationModes.includes(mode)) {
    return new Set();
  }
  return new Set(getCurrentContentRotation().seenByMode[mode] || []);
}

function markRotationSeen(mode, id) {
  if (!contentRotationModes.includes(mode) || !id) {
    return false;
  }

  const rotation = getCurrentContentRotation();
  const current = rotation.seenByMode[mode] || [];
  if (current.includes(id)) {
    return false;
  }

  rotation.seenByMode[mode] = [...current, id];
  return true;
}

function getContentRotationDecks() {
  const contextDeck = getActiveContextDeck();
  return {
    quiz: getPracticePool(),
    reading: getActiveReadingDeck(),
    context: contextDeck,
    phrases: getActivePhraseDeck(),
    cloze: contextDeck.filter((item) => item.chars.length >= 3),
    dictation: contextDeck,
    confusion: getActiveConfusionDeck(),
    builder: getActiveBuilderDeck(),
  };
}

function getContentRotationSnapshot() {
  const rotation = getCurrentContentRotation();
  const decks = getContentRotationDecks();
  const modes = contentRotationMeta.map(({ mode, label }) => {
    const deck = decks[mode] || [];
    const availableIds = new Set(deck.map((item) => item.id));
    const seen = (rotation.seenByMode[mode] || []).filter((id) => availableIds.has(id)).length;
    const total = availableIds.size;
    return {
      mode,
      label,
      seen,
      total,
      percent: total ? Math.round((seen / total) * 100) : 0,
    };
  });
  const seen = modes.reduce((sum, mode) => sum + mode.seen, 0);
  const total = modes.reduce((sum, mode) => sum + mode.total, 0);

  return {
    modes,
    seen,
    total,
    percent: total ? Math.round((seen / total) * 100) : 0,
    ...getRotationWindowDates(),
  };
}

function normalizeDailyProgress(daily) {
  return {
    ...createDailyProgressState(daily?.dateKey || getDateKey()),
    ...(daily || {}),
    missions: daily?.missions && typeof daily.missions === "object" ? daily.missions : {},
  };
}

function createDistractionGateState() {
  return {
    enabled: false,
    presetId: "missions",
  };
}

function normalizeDistractionGateState(gate) {
  const presetExists = distractionGatePresets.some((preset) => preset.id === gate?.presetId);
  return {
    ...createDistractionGateState(),
    ...(gate || {}),
    enabled: Boolean(gate?.enabled),
    presetId: presetExists ? gate.presetId : "missions",
  };
}

function normalizeActivityLog(log) {
  return [...new Map(
    (Array.isArray(log) ? log : [])
      .filter((entry) => entry && typeof entry.dateKey === "string")
      .map((entry) => [
        entry.dateKey,
        {
          dateKey: entry.dateKey,
          xp: Number.isFinite(Number(entry.xp)) ? Number(entry.xp) : 0,
          correct: Number.isFinite(Number(entry.correct)) ? Number(entry.correct) : 0,
          wrong: Number.isFinite(Number(entry.wrong)) ? Number(entry.wrong) : 0,
          sessions: Number.isFinite(Number(entry.sessions)) ? Number(entry.sessions) : 0,
        },
      ])
  ).values()]
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
    .slice(-30);
}

function normalizeReviewRecord(record) {
  return {
    dueAt: Number.isFinite(Number(record?.dueAt)) ? Number(record.dueAt) : 0,
    intervalHours: Number.isFinite(Number(record?.intervalHours))
      ? Math.max(0, Number(record.intervalHours))
      : 0,
    ease: Number.isFinite(Number(record?.ease)) ? Number(record.ease) : 2.15,
    streak: Number.isFinite(Number(record?.streak)) ? Math.max(0, Number(record.streak)) : 0,
    lapses: Number.isFinite(Number(record?.lapses)) ? Math.max(0, Number(record.lapses)) : 0,
    lastSeenAt: Number.isFinite(Number(record?.lastSeenAt)) ? Number(record.lastSeenAt) : 0,
    lastResult: record?.lastResult === "success" ? "success" : "miss",
  };
}

function normalizeReviewMap(reviewMap) {
  return Object.fromEntries(
    Object.entries(reviewMap || {}).map(([id, record]) => [id, normalizeReviewRecord(record)])
  );
}

function isRotationExemptEntry(entry) {
  if (!entry) {
    return false;
  }

  const review = getReviewRecord(state.progress.charReview, entry.id);
  if (rotationExemptReviewBuckets.has(getReviewBucket(review))) {
    return true;
  }

  return isWeakEntry(entry);
}

function isRotationExemptItem(item) {
  if (!item) {
    return false;
  }

  const review = getReviewRecord(state.progress.itemReview, item.id);
  if (rotationExemptReviewBuckets.has(getReviewBucket(review))) {
    return true;
  }

  return (item.charIds || [])
    .map((id) => entryIndex.get(id))
    .filter(Boolean)
    .some((entry) => isWeakEntry(entry));
}

function getMissionValue(daily, missionId) {
  return Math.max(0, Number(daily?.missions?.[missionId] || 0));
}

function areDailyMissionsComplete(daily = state.progress.daily) {
  return dailyMissionCatalog.every((mission) => getMissionValue(daily, mission.id) >= mission.target);
}

function getDistractionGatePreset(presetId) {
  return distractionGatePresets.find((preset) => preset.id === presetId) || distractionGatePresets[1];
}

function getDistractionGateStatus(progress = state.progress) {
  const gate = normalizeDistractionGateState(progress?.distractionGate);
  const daily = normalizeDailyProgress(progress?.daily);
  const preset = getDistractionGatePreset(gate.presetId);

  if (preset.missionsComplete) {
    const completedCount = dailyMissionCatalog.filter((mission) =>
      getMissionValue(daily, mission.id) >= mission.target
    ).length;
    const totalCount = dailyMissionCatalog.length;
    const unlocked = gate.enabled && completedCount >= totalCount;
    return {
      gate,
      preset,
      unlocked,
      progressPercent: Math.round((completedCount / totalCount) * 100),
      progressLabel: `${completedCount}/${totalCount} missoes fechadas`,
      remainingCopy: unlocked
        ? "Meta do dia concluida. Seus atalhos foram liberados."
        : completedCount === 0
          ? "Nenhuma das missoes do dia foi fechada ainda."
          : `Faltam ${totalCount - completedCount} missoes para destravar.`,
    };
  }

  const checks = [
    {
      label: "acertos",
      current: getMissionValue(daily, "answers"),
      target: preset.targets.answers,
    },
    {
      label: "revisoes",
      current: getMissionValue(daily, "review"),
      target: preset.targets.review,
    },
    {
      label: "blocos de contexto",
      current: getMissionValue(daily, "phrases"),
      target: preset.targets.phrases,
    },
  ];
  const progressPercent = Math.round(
    checks.reduce((total, check) => total + Math.min(1, check.current / check.target), 0) /
      checks.length * 100
  );
  const unlocked = gate.enabled && checks.every((check) => check.current >= check.target);
  const remaining = checks
    .filter((check) => check.current < check.target)
    .map((check) => `${check.target - check.current} ${check.label}`);

  return {
    gate,
    preset,
    unlocked,
    progressPercent,
    progressLabel: checks
      .map((check) => `${Math.min(check.current, check.target)}/${check.target} ${check.label}`)
      .join(" • "),
    remainingCopy: unlocked
      ? "Meta batida. Seus atalhos foram liberados."
      : `Falta ${remaining.join(", ")}.`,
  };
}

function getDisplayDailyStreak(progress = state.progress) {
  return Math.max(0, Number(progress.completedStreakDays || 0)) +
    Number(areDailyMissionsComplete(progress.daily));
}

function ensureDailyState(progress = state.progress) {
  const todayKey = getDateKey();
  progress.daily = normalizeDailyProgress(progress.daily);

  if (progress.daily.dateKey === todayKey) {
    return progress.daily;
  }

  const previousDaily = progress.daily;
  const yesterdayKey = shiftDateKey(todayKey, -1);

  if (areDailyMissionsComplete(previousDaily)) {
    progress.completedStreakDays =
      previousDaily.dateKey === yesterdayKey
        ? Math.max(1, Number(progress.completedStreakDays || 0) + 1)
        : 1;
    progress.bestDailyStreak = Math.max(
      Number(progress.bestDailyStreak || 0),
      Number(progress.completedStreakDays || 0)
    );
  } else {
    progress.completedStreakDays = 0;
  }

  progress.daily = createDailyProgressState(todayKey);
  return progress.daily;
}

function updateActivityLog({ xpDelta = 0, success = null } = {}) {
  const dateKey = getDateKey();
  const existing = state.progress.activityLog.find((entry) => entry.dateKey === dateKey);
  const target = existing || {
    dateKey,
    xp: 0,
    correct: 0,
    wrong: 0,
    sessions: 0,
  };

  target.xp += Number.isFinite(Number(xpDelta)) ? Number(xpDelta) : 0;
  target.correct += Number(success === true);
  target.wrong += Number(success === false);
  target.sessions += 1;

  if (!existing) {
    state.progress.activityLog.push(target);
  }

  state.progress.activityLog = normalizeActivityLog(state.progress.activityLog);
}

function recordActivityEvent({
  xpDelta = 0,
  success = null,
  wasDue = false,
  phraseBlock = false,
  arcadeStart = false,
} = {}) {
  const daily = ensureDailyState();

  if (success === true) {
    daily.missions.answers = getMissionValue(daily, "answers") + 1;
  }

  if (wasDue) {
    daily.missions.review = getMissionValue(daily, "review") + 1;
  }

  if (phraseBlock) {
    daily.missions.phrases = getMissionValue(daily, "phrases") + 1;
  }

  if (arcadeStart) {
    daily.missions.arcade = Math.max(1, getMissionValue(daily, "arcade") + 1);
  }

  if (success !== null || xpDelta !== 0) {
    updateActivityLog({ xpDelta, success });
  }

  state.progress.bestDailyStreak = Math.max(
    Number(state.progress.bestDailyStreak || 0),
    getDisplayDailyStreak()
  );

  if (state.quickSession.active && (success !== null || xpDelta !== 0)) {
    state.quickSession.eventCount += 1;
    state.quickSession.correctCount += Number(success === true);
    state.quickSession.wrongCount += Number(success === false);
    state.quickSession.xpDelta += Number.isFinite(Number(xpDelta)) ? Number(xpDelta) : 0;
    renderQuickSession();
  }
}

function getActivityWindowEntries(log = state.progress.activityLog) {
  const source = new Map(normalizeActivityLog(log).map((entry) => [entry.dateKey, entry]));
  const days = [];
  for (let offset = activityWindowDays - 1; offset >= 0; offset -= 1) {
    const dateKey = shiftDateKey(getDateKey(), -offset);
    days.push(
      source.get(dateKey) || {
        dateKey,
        xp: 0,
        correct: 0,
        wrong: 0,
        sessions: 0,
      }
    );
  }
  return days;
}

function getWeeklyXp(log = state.progress.activityLog) {
  return getActivityWindowEntries(log).reduce((sum, entry) => sum + Number(entry.xp || 0), 0);
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

  if (canUseCloudSync()) {
    try {
      setSyncStatus("saving");
      const restoredSession = await runtime.bridge.signIn(userName, password);
      const pendingSync = loadPendingSync(userName);
      runtime.sessionReady = true;
      applyAuthenticatedState(
        pendingSync
          ? {
              ...restoredSession,
              progress: pendingSync.progress,
              cloudBacked: true,
            }
          : restoredSession
      );
      elements.loginPassword.value = "";
      elements.authFeedback.textContent = "";
      if (pendingSync) {
        void syncPendingProgress();
      } else {
        refreshSyncState();
      }
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
  const minPasswordLength = canUseCloudSync() ? 6 : 4;

  if (userName.length < 3) {
    elements.authFeedback.textContent = "Escolha um nome com pelo menos 3 caracteres.";
    return;
  }

  if (password.length < minPasswordLength) {
    elements.authFeedback.textContent = `Use uma senha com pelo menos ${minPasswordLength} caracteres.`;
    return;
  }

  if (canUseCloudSync()) {
    try {
      setSyncStatus("saving");
      const localSeed = loadProgress(userName);
      const createdSession = await runtime.bridge.signUp(userName, password);

      if (createdSession.pendingConfirmation) {
        elements.authFeedback.textContent =
          "No Supabase, desative a confirmacao por email para usar apenas nome e senha.";
        runtime.sessionReady = false;
        setSyncStatus("ready");
        return;
      }

      runtime.sessionReady = true;
      applyAuthenticatedState({
        ...createdSession,
        progress: hasStoredProgress(localSeed) ? localSeed : createdSession.progress,
      });
      await saveProgress({ immediate: true });
      elements.signupPassword.value = "";
      elements.authFeedback.textContent = "";
      refreshSyncState();
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
  const cloudBacked = Boolean(
    sessionData.userId || sessionData.offlineFallback || sessionData.cloudBacked
  );
  state.currentUser = sessionData.userName;
  state.currentUserCloudBacked = cloudBacked;
  state.currentUserId =
    sessionData.userId || (cloudBacked ? getCachedCloudIdentity(sessionData.userName)?.userId : null) || null;
  state.progress = normalizeLoadedProgress(sessionData.progress);
  if (Array.isArray(sessionData.leaderboard)) {
    state.sharedRanking = sessionData.leaderboard;
    state.leaderboardLoadedAt = Date.now();
  }
  if (cloudBacked) {
    cacheCloudSessionSnapshot({
      userId: state.currentUserId,
      userName: sessionData.userName,
    });
  }
  persistSession(sessionData.userName, { cloudBacked });
  hideAuthGate();
  if (refresh) {
    refreshPracticeState();
  }
  refreshSyncState();
  renderIdentity();
}

async function logoutCurrentUser() {
  stopArcadeGames();
  clearQuickSessionRuntime();
  await flushPendingProgressSave();
  if (canUseCloudSync()) {
    try {
      await runtime.bridge.signOut();
    } catch (error) {
      console.error("Falha ao encerrar a sessao online.", error);
    }
  }
  clearSession();
  clearCloudSessionSnapshot();
  runtime.sessionReady = false;
  state.currentUser = null;
  state.currentUserId = null;
  state.currentUserCloudBacked = false;
  state.progress = defaultProgress();
  state.sharedRanking = [];
  state.leaderboardLoadedAt = 0;
  state.arcade = createArcadeState();
  state.quickSession = createQuickSessionState();
  state.section = "today";
  state.storageMode = "local";
  setSyncStatus(canUseCloudSync() ? "ready" : "local");
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
  const sharedAccount = Boolean(state.currentUser && isCloudBackedUser(state.currentUser));
  const cloudActive = state.storageMode === "cloud";
  const cloudReady = canUseCloudSync();

  if (elements.authKicker) {
    elements.authKicker.textContent =
      cloudActive || cloudReady ? "Conta sincronizada" : "Perfil local";
  }
  if (elements.authCopy) {
    elements.authCopy.textContent = cloudActive || cloudReady
      ? "Entre com nome e senha. Seu progresso e ranking ficam sincronizados entre celular e PC."
      : sharedAccount
        ? "Modo local ativo neste aparelho. O progresso continua salvo aqui e volta a sincronizar depois."
        : "Entre com nome e senha. Sem Supabase, o app continua funcionando neste navegador.";
  }
  if (elements.storageCopy) {
    elements.storageCopy.textContent = cloudActive
      ? "Seu progresso esta sendo sincronizado com a nuvem. Se a internet cair, o aparelho continua guardando tudo."
      : sharedAccount
        ? "Modo local ativo: o aparelho guarda seu progresso offline e sincroniza quando a internet voltar."
        : cloudReady
          ? "Quando voce entrar, o progresso pode sincronizar entre aparelhos. Se o audio nao falar, o treino continua normalmente."
          : "Progresso salvo neste navegador. Se o audio nao falar, o resto do treino continua normalmente.";
  }
  if (elements.resetProgress) {
    elements.resetProgress.textContent = cloudActive || sharedAccount
      ? "Zerar meu progresso"
      : "Zerar progresso salvo";
  }
  if (elements.rankingKicker) {
    elements.rankingKicker.textContent = cloudActive ? "Ranking compartilhado" : "Ranking do aparelho";
  }
  if (elements.rankingHeading) {
    elements.rankingHeading.textContent = cloudActive
      ? "Melhores perfis da turma"
      : "Perfis salvos neste aparelho";
  }
  if (elements.syncBadge) {
    elements.syncBadge.className = "sync-badge";
    const labels = {
      local: "Modo local",
      ready: "Nuvem pronta",
      queued: "Fila local",
      saving: "Sincronizando",
      synced: "Sincronizado",
      error: "Falha na sync",
    };
    const classes = {
      local: "is-local",
      ready: "is-cloud",
      queued: "is-pending",
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

async function restoreSharedSession(options = {}) {
  const { quiet = false } = options;
  if (!runtime.bridge || navigator.onLine === false) {
    return null;
  }

  try {
    if (!quiet) {
      setSyncStatus("saving");
    }
    const restoredSession = await runtime.bridge.restoreSession();
    runtime.sessionReady = Boolean(restoredSession);
    if (restoredSession?.userName) {
      cacheCloudSessionSnapshot(restoredSession);
    }
    if (!quiet) {
      setSyncStatus(
        restoredSession
          ? loadPendingSync(restoredSession.userName)
            ? "queued"
            : "synced"
          : "ready"
      );
    }
    return restoredSession;
  } catch (error) {
    console.error("Falha ao restaurar a sessao online.", error);
    runtime.sessionReady = false;
    if (!quiet) {
      setSyncStatus(navigator.onLine === false ? "local" : "error");
    }
    return null;
  }
}

function restoreLocalSession() {
  const sessionMeta = readSessionMeta();
  if (!sessionMeta?.userName) {
    return null;
  }
  const { userName, cloudBacked } = sessionMeta;
  const exists = loadProfiles().some((profile) => profile.userName === userName);
  const cachedCloud = getCachedCloudIdentity(userName);

  if (cloudBacked && cachedCloud) {
    return {
      userName: cachedCloud.userName,
      userId: cachedCloud.userId || null,
      progress: loadProgress(cachedCloud.userName),
      offlineFallback: true,
      cloudBacked: true,
    };
  }

  if (exists) {
    return {
      userName,
      progress: loadProgress(userName),
      cloudBacked: false,
    };
  }
  if (!cachedCloud) {
    return null;
  }
  return {
    userName: cachedCloud.userName,
    userId: cachedCloud.userId || null,
    progress: loadProgress(cachedCloud.userName),
    offlineFallback: true,
    cloudBacked: true,
  };
}

function persistSession(userName, options = {}) {
  const { cloudBacked = state.currentUserCloudBacked } = options;
  localStorage.setItem(sessionStorageKey, userName);
  localStorage.setItem(
    sessionMetaStorageKey,
    JSON.stringify({
      userName,
      cloudBacked: Boolean(cloudBacked),
    })
  );
}

function clearSession() {
  localStorage.removeItem(sessionStorageKey);
  localStorage.removeItem(sessionMetaStorageKey);
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

function setDistractionGatePreset(presetId) {
  state.progress.distractionGate = normalizeDistractionGateState({
    ...state.progress.distractionGate,
    presetId,
  });
  renderDistractionGate();
  saveProgress();
}

function toggleDistractionGate() {
  const current = normalizeDistractionGateState(state.progress.distractionGate);
  state.progress.distractionGate = {
    ...current,
    enabled: !current.enabled,
  };
  renderDistractionGate();
  saveProgress();
}

function openDistractionReward(rewardId) {
  const reward = distractionRewards[rewardId];
  const status = getDistractionGateStatus();
  if (!reward || !status.gate.enabled || !status.unlocked) {
    return;
  }
  window.open(reward.url, "_blank", "noopener");
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
    const todayActionButton = event.target.closest("[data-today-action]");
    if (todayActionButton) {
      runTodayAction(todayActionButton.dataset.todayAction);
      return;
    }

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
      if (extraTrainModes.includes(button.dataset.trainTarget)) {
        state.trainNavExpanded = true;
      }
      state.trainMode = button.dataset.trainTarget;
      state.section = "training";
      renderSectionNav();
      renderTrainNav();
      renderTrainRail();
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

  elements.gatePresets?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gate-preset]");
    if (!button) {
      return;
    }
    setDistractionGatePreset(button.dataset.gatePreset);
  });

  elements.gateToggle?.addEventListener("click", () => {
    toggleDistractionGate();
  });

  elements.gateOpenYoutube?.addEventListener("click", () => {
    openDistractionReward("youtube");
  });

  elements.gateOpenInstagram?.addEventListener("click", () => {
    openDistractionReward("instagram");
  });

  elements.toggleTrainNav?.addEventListener("click", () => {
    state.trainNavExpanded = !state.trainNavExpanded;
    renderTrainNav();
  });

  elements.trainBlockReset?.addEventListener("click", () => {
    resetTrainBlock();
  });

  elements.trainBlockNext?.addEventListener("click", () => {
    const target = elements.trainBlockNext?.dataset.trainTarget;
    if (!target) {
      return;
    }
    setSection("training", target);
    renderAll();
  });

  elements.sessionDurationToggle?.addEventListener("click", (event) => {
    if (state.quickSession.active) {
      return;
    }

    const button = event.target.closest("[data-session-duration]");
    if (!button) {
      return;
    }

    const duration = Number(button.dataset.sessionDuration);
    if (!quickSessionDurations.includes(duration)) {
      return;
    }

    state.quickSession.durationMinutes = duration;
    renderQuickSession();
  });

  elements.sessionStart?.addEventListener("click", () => {
    startQuickSession();
  });

  elements.sessionStop?.addEventListener("click", () => {
    finishQuickSession({ completed: false });
  });

  elements.sessionSummaryClose?.addEventListener("click", () => {
    closeQuickSessionSummary();
  });

  elements.sessionSummaryNext?.addEventListener("click", () => {
    const actionId = elements.sessionSummaryNext.dataset.todayAction || "";
    closeQuickSessionSummary();
    if (actionId) {
      runTodayAction(actionId);
      return;
    }
    setSection("today");
    renderAll();
  });

  elements.sessionSummary?.addEventListener("click", (event) => {
    if (event.target === elements.sessionSummary) {
      closeQuickSessionSummary();
    }
  });

  elements.audioRateToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-audio-rate]");
    if (!button) {
      return;
    }
    state.audioRate = Number(button.dataset.audioRate) || 0.9;
    renderAudioControls();
  });

  elements.audioRepeatToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-audio-repeat]");
    if (!button) {
      return;
    }
    state.audioRepeat = Number(button.dataset.audioRepeat) || 1;
    renderAudioControls();
  });

  elements.installApp?.addEventListener("click", async () => {
    await requestInstallPrompt();
  });

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
    const chosen = pickAdaptive(
      pool,
      "quiz",
      (entry) => entry.id,
      (entry) => computeCharWeight(entry),
      { trackRotation: false }
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
    const message = state.currentUser && isCloudBackedUser(state.currentUser)
      ? state.storageMode === "cloud"
        ? "Zerar o seu progresso sincronizado desta conta?"
        : "Zerar o progresso salvo neste aparelho e sincronizar essa limpeza quando a internet voltar?"
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
    state.trainBlocks = createTrainBlockMap();
    await saveProgress({ immediate: true });
    refreshPracticeState();
  });

  if (elements.arcadeLastLaunch) {
    elements.arcadeLastLaunch.addEventListener("click", () => {
      launchArcadeGame(state.progress.arcadeLastGame || "shuriken");
    });
  }

  elements.trackGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-track-id]");
    if (!button) {
      return;
    }
    launchTrack(button.dataset.trackId);
  });

  elements.rankingViewToggle?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-ranking-view]");
    if (!button) {
      return;
    }
    state.rankingView = button.dataset.rankingView === "weekly" ? "weekly" : "overall";
    renderRanking();
  });

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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.quickSession.lastSummary) {
      closeQuickSessionSummary();
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

  bindEnhancedActivityHandlers();
}

function bindEnhancedActivityHandlers() {
  elements.showReadingAnswer?.addEventListener(
    "click",
    (event) => {
      if (!state.reading) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      state.readingStreak = 0;
      const itemMeta = markItemProgress(state.reading.id, false);
      const charMetas = markTextProgress(state.reading.text, false);
      const delta = applyXpDelta(xpTable.reading.reveal);
      recordActivityEvent({
        xpDelta: delta,
        success: false,
        wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
      });
      recordTrainBlockAttempt("reading", false);
      queueMicrotask(() => {
        setFeedbackMessage(
          elements.readingFeedback,
          "info",
          `${state.reading.answer} - ${state.reading.breakdown}${state.reading.pseudo ? " - combinacao de treino" : ""} (${formatXpDelta(delta)})`
        );
      });
      elements.readingStreakLabel.textContent = `Sequencia: ${state.readingStreak}`;
      elements.readingFeedback.textContent =
        `${state.reading.answer} - ${state.reading.breakdown}${state.reading.pseudo ? " - combinacao de treino" : ""} (${formatXpDelta(delta)})`;
      saveProgress();
      renderStats();
      renderDetailCard();
      renderFocusRadar();
    },
    true
  );

  elements.showContextAnswer?.addEventListener(
    "click",
    (event) => {
      if (!state.context) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      state.contextStreak = 0;
      const itemMeta = markItemProgress(state.context.id, false);
      const charMetas = markTextProgress(state.context.text, false);
      const delta = applyXpDelta(xpTable.context.reveal);
      recordActivityEvent({
        xpDelta: delta,
        success: false,
        wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
        phraseBlock: true,
      });
      recordTrainBlockAttempt("context", false);
      queueMicrotask(() => {
        setFeedbackMessage(
          elements.contextFeedback,
          "info",
          `${state.context.answer} | ${state.context.breakdown} | ${state.context.meaning} (${formatXpDelta(delta)})`
        );
      });
      elements.contextStreakLabel.textContent = `Sequencia: ${state.contextStreak}`;
      elements.contextFeedback.textContent =
        `${state.context.answer} | ${state.context.breakdown} | ${state.context.meaning} (${formatXpDelta(delta)})`;
      saveProgress();
      renderStats();
      renderDetailCard();
      renderFocusRadar();
    },
    true
  );

  elements.showPhraseAnswer?.addEventListener(
    "click",
    (event) => {
      if (!state.phrase) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      state.phraseStreak = 0;
      const itemMeta = markItemProgress(state.phrase.id, false);
      const charMetas = markTextProgress(state.phrase.text, false);
      const delta = applyXpDelta(xpTable.phrases.reveal);
      recordActivityEvent({
        xpDelta: delta,
        success: false,
        wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
        phraseBlock: true,
      });
      recordTrainBlockAttempt("phrases", false);
      queueMicrotask(() => {
        setFeedbackMessage(
          elements.phraseFeedback,
          "info",
          `${state.phrase.answer} | ${state.phrase.breakdown} | ${state.phrase.meaning} (${formatXpDelta(delta)})`
        );
      });
      elements.phraseStreakLabel.textContent = `Sequencia: ${state.phraseStreak}`;
      elements.phraseFeedback.textContent =
        `${state.phrase.answer} | ${state.phrase.breakdown} | ${state.phrase.meaning} (${formatXpDelta(delta)})`;
      saveProgress();
      renderStats();
      renderDetailCard();
      renderFocusRadar();
    },
    true
  );

  elements.showDictationAnswer?.addEventListener(
    "click",
    (event) => {
      if (!state.dictation) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      state.dictationStreak = 0;
      const itemMeta = markItemProgress(state.dictation.id, false);
      const charMetas = markTextProgress(state.dictation.text, false);
      const delta = applyXpDelta(xpTable.dictation.reveal);
      recordActivityEvent({
        xpDelta: delta,
        success: false,
        wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
        phraseBlock: true,
      });
      recordTrainBlockAttempt("dictation", false);
      queueMicrotask(() => {
        setFeedbackMessage(
          elements.dictationFeedback,
          "info",
          `${state.dictation.answer} | ${state.dictation.breakdown} | ${state.dictation.meaning} (${formatXpDelta(delta)})`
        );
      });
      elements.dictationStreakLabel.textContent = `Sequencia: ${state.dictationStreak}`;
      elements.dictationFeedback.textContent =
        `${state.dictation.answer} | ${state.dictation.breakdown} | ${state.dictation.meaning} (${formatXpDelta(delta)})`;
      saveProgress();
      renderStats();
      renderDetailCard();
      renderFocusRadar();
    },
    true
  );

  elements.showBuilderAnswer?.addEventListener(
    "click",
    (event) => {
      if (!state.builder) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      state.builder.selected = [...state.builder.chars];
      state.builder.locked = true;
      state.builderStreak = 0;
      const itemMeta = markItemProgress(state.builder.id, false);
      const charMetas = markTextProgress(state.builder.text, false);
      const delta = applyXpDelta(xpTable.builder.reveal);
      recordActivityEvent({
        xpDelta: delta,
        success: false,
        wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
      });
      recordTrainBlockAttempt("builder", false);
      queueMicrotask(() => {
        setFeedbackMessage(
          elements.builderFeedback,
          "info",
          `${state.builder.text} - ${state.builder.romajiLabel} - ${state.builder.meaning} (${formatXpDelta(delta)})`
        );
      });
      elements.builderFeedback.textContent =
        `${state.builder.text} - ${state.builder.romajiLabel} - ${state.builder.meaning} (${formatXpDelta(delta)})`;
      saveProgress();
      renderStats();
      renderBuilder();
      renderDetailCard();
      renderFocusRadar();
    },
    true
  );

  elements.shurikenInput?.addEventListener(
    "input",
    (event) => {
      if (!state.arcade.shuriken.running || !state.arcade.shuriken.current) {
        return;
      }

      const typed = normalizeRomanization(event.target.value);
      const expected = normalizeRomanization(state.arcade.shuriken.current.romaji);
      if (typed !== expected) {
        return;
      }

      event.stopImmediatePropagation();
      const reviewMeta = markCharProgress(state.arcade.shuriken.current.id, true);
      const delta = applyXpDelta(xpTable.arcadeShurikenHit);
      recordActivityEvent({
        xpDelta: delta,
        success: true,
        wasDue: reviewMeta.wasDue,
      });
      state.arcade.shuriken.score += 10 + state.arcade.shuriken.combo * 3;
      state.arcade.shuriken.combo += 1;
      state.progress.bestArcadeShuriken = Math.max(
        state.progress.bestArcadeShuriken || 0,
        state.arcade.shuriken.score
      );
      state.arcade.shuriken.status =
        `${state.arcade.shuriken.current.char} dominado. Proximo arremesso. (${formatXpDelta(delta)})`;
      saveProgress();
      renderStats();
      spawnShurikenToken();
      renderArcade();
    },
    true
  );
}

function setSection(section, trainTarget) {
  if (state.section === "arcade" && section !== "arcade") {
    stopArcadeGames();
  }
  state.section = section;
  if (trainTarget) {
    state.trainMode = trainTarget;
    if (extraTrainModes.includes(trainTarget)) {
      state.trainNavExpanded = true;
    }
  }
  renderSectionNav();
  renderTrainNav();
  renderTrainRail();
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
  clearFeedbackMessage(elements.quizFeedback);
  clearFeedbackMessage(elements.readingFeedback);
  clearFeedbackMessage(elements.contextFeedback);
  clearFeedbackMessage(elements.phraseFeedback);
  clearFeedbackMessage(elements.clozeFeedback);
  clearFeedbackMessage(elements.dictationFeedback);
  clearFeedbackMessage(elements.confusionFeedback);
  clearFeedbackMessage(elements.builderFeedback);
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
  ensureDailyState();
  renderSectionNav();
  renderTrainNav();
  renderTrainRail();
  renderAudioControls();
  renderInstallChrome();
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
  renderProgressDashboard();
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

  const expanded = state.trainNavExpanded || extraTrainModes.includes(state.trainMode);
  state.trainNavExpanded = expanded;

  elements.trainNav.querySelectorAll("[data-train-target]").forEach((button) => {
    const isExtra = button.dataset.trainPriority === "extra";
    const shouldHide = isExtra && !expanded;
    button.hidden = shouldHide;
    button.classList.toggle("is-active", button.dataset.trainTarget === state.trainMode);
  });

  if (elements.toggleTrainNav) {
    const hiddenCount = extraTrainModes.length;
    elements.toggleTrainNav.textContent = expanded
      ? "Menos modos"
      : `Mais modos (${hiddenCount})`;
  }

  document.querySelectorAll("[data-train-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.trainPanel === state.trainMode);
  });
}

function getTrainBlock(mode = state.trainMode) {
  if (!state.trainBlocks || typeof state.trainBlocks !== "object") {
    state.trainBlocks = createTrainBlockMap();
  }

  if (!state.trainBlocks[mode]) {
    state.trainBlocks[mode] = { answered: 0, correct: 0, wrong: 0 };
  }

  return state.trainBlocks[mode];
}

function resetTrainBlock(mode = state.trainMode) {
  state.trainBlocks[mode] = { answered: 0, correct: 0, wrong: 0 };
  renderTrainRail();
}

function recordTrainBlockAttempt(mode, success) {
  const block = getTrainBlock(mode);
  block.answered += 1;
  block.correct += Number(success === true);
  block.wrong += Number(success === false);
  renderTrainRail();
}

function getTrainModeStreak(mode = state.trainMode) {
  switch (mode) {
    case "recognition":
      return state.quizStreak;
    case "reading":
      return state.readingStreak;
    case "context":
      return state.contextStreak;
    case "phrases":
      return state.phraseStreak;
    case "confusion":
      return state.confusionStreak;
    case "cloze":
      return state.clozeStreak;
    case "dictation":
      return state.dictationStreak;
    case "builder":
      return state.builderStreak;
    default:
      return 0;
  }
}

function getNextTrainMode(mode = state.trainMode) {
  const index = allTrainModes.indexOf(mode);
  if (index === -1) {
    return allTrainModes[0];
  }
  return allTrainModes[(index + 1) % allTrainModes.length];
}

function clearFeedbackMessage(element) {
  if (!element) {
    return;
  }

  element.textContent = "";
  element.classList.remove("has-message", "is-success", "is-danger", "is-info");
}

function setFeedbackMessage(element, tone, message) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove("is-success", "is-danger", "is-info");
  element.classList.add("has-message");

  if (tone === "success") {
    element.classList.add("is-success");
    return;
  }

  if (tone === "danger") {
    element.classList.add("is-danger");
    return;
  }

  element.classList.add("is-info");
}

function renderTrainRail() {
  if (!elements.trainRailTitle) {
    return;
  }

  const meta = trainModeMeta[state.trainMode] || trainModeMeta.recognition;
  const block = getTrainBlock(state.trainMode);
  const progressCount = Math.min(block.answered, trainBlockTarget);
  const accuracy = block.answered ? Math.round((block.correct / block.answered) * 100) : 0;
  const nextMode = getNextTrainMode(state.trainMode);
  const nextMeta = trainModeMeta[nextMode] || trainModeMeta.recognition;
  const completed = progressCount >= trainBlockTarget;
  const focusLabel = state.focus === "weak" ? "Foco: meus erros" : "Foco: tudo";
  const sessionLabel = state.quickSession.active
    ? `Sprint ${formatSessionClock(Math.max(0, state.quickSession.endsAt - Date.now()))}`
    : "Sessao livre";

  if (elements.trainRailKicker) {
    elements.trainRailKicker.textContent = state.quickSession.active ? "Agora" : "Bloco atual";
  }
  elements.trainRailTitle.textContent = meta.label;
  elements.trainRailCopy.textContent = meta.copy;
  if (elements.trainRailFocus) {
    elements.trainRailFocus.textContent = focusLabel;
  }
  if (elements.trainRailSession) {
    elements.trainRailSession.textContent = sessionLabel;
  }
  if (elements.trainRailStatus) {
    elements.trainRailStatus.textContent = completed
      ? "Concluido"
      : `${progressCount}/${trainBlockTarget}`;
  }
  if (elements.trainRailAnswered) {
    elements.trainRailAnswered.textContent = `${progressCount}/${trainBlockTarget}`;
  }
  if (elements.trainRailCorrect) {
    elements.trainRailCorrect.textContent = String(block.correct);
  }
  if (elements.trainRailWrong) {
    elements.trainRailWrong.textContent = String(block.wrong);
  }
  if (elements.trainRailAccuracy) {
    elements.trainRailAccuracy.textContent = `${accuracy}%`;
  }
  if (elements.trainRailProgressFill) {
    elements.trainRailProgressFill.style.width = `${Math.min(100, (progressCount / trainBlockTarget) * 100)}%`;
  }
  if (elements.trainBlockReset) {
    elements.trainBlockReset.disabled = block.answered === 0;
  }
  if (elements.trainBlockNext) {
    elements.trainBlockNext.textContent = completed
      ? `Seguir para ${nextMeta.label}`
      : `Trocar para ${nextMeta.label}`;
    elements.trainBlockNext.dataset.trainTarget = nextMode;
  }
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
  const weeklyXp = getWeeklyXp(progress.activityLog || []);
  const level = Math.max(1, 1 + Math.floor(xp / 140));
  const rank = getRankTitle(xp);

  return {
    practicedCount: practicedEntries.length,
    masteredCount,
    clearedGames,
    xp,
    weeklyXp,
    level,
    rank,
    dailyStreak: getDisplayDailyStreak(progress),
    bestDailyStreak: Math.max(
      Number(progress.bestDailyStreak || 0),
      getDisplayDailyStreak(progress)
    ),
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

  if (state.storageMode === "cloud" && state.currentUser) {
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

function getStoredProgressUserNames() {
  const userNames = new Set();

  try {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key || !key.startsWith(progressStoragePrefix)) {
        continue;
      }
      userNames.add(key.slice(progressStoragePrefix.length));
    }
  } catch {
    return [];
  }

  return [...userNames];
}

function getDeviceLeaderboard() {
  const deviceUserNames = new Set([
    ...loadProfiles().map((profile) => profile.userName),
    ...getStoredProgressUserNames(),
  ]);

  const entries = new Map(
    [...deviceUserNames].map((userName) => {
      const progress = loadProgress(userName);
      return [
        userName,
        {
          userName,
          progress,
          summary: summarizeProgress(progress),
        },
      ];
    })
  );

  if (state.currentUser && !entries.has(state.currentUser)) {
    entries.set(state.currentUser, {
      userName: state.currentUser,
      progress: normalizeLoadedProgress(state.progress),
      summary: summarizeProgress(state.progress),
    });
  }

  return [...entries.values()].sort((left, right) => left.userName.localeCompare(right.userName));
}

function sortLeaderboardEntries(entries) {
  return [...entries].sort((left, right) => {
    if (state.rankingView === "weekly") {
      if (right.summary.weeklyXp !== left.summary.weeklyXp) {
        return right.summary.weeklyXp - left.summary.weeklyXp;
      }
      if (right.summary.dailyStreak !== left.summary.dailyStreak) {
        return right.summary.dailyStreak - left.summary.dailyStreak;
      }
    }

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

  const leaderboard = sortLeaderboardEntries(
    state.storageMode === "cloud" ? state.sharedRanking : getDeviceLeaderboard()
  );
  const isWeekly = state.rankingView === "weekly";
  elements.rankingCount.textContent = `${leaderboard.length} perfis`;
  elements.arcadeRankingList.innerHTML = "";
  elements.rankingViewToggle?.querySelectorAll("[data-ranking-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.rankingView === state.rankingView);
  });
  if (elements.rankingSeasonNote) {
    elements.rankingSeasonNote.textContent = isWeekly
      ? "Semana rolando: o placar olha o XP liquido dos ultimos 7 dias e desempata por streak."
      : "Ranking geral: o placar olha o XP total e usa dominio de kana como desempate.";
  }

  if (!leaderboard.length) {
    const empty = document.createElement("p");
    empty.className = "arcade-record-note";
    empty.textContent = state.storageMode === "cloud"
      ? "Entre em uma conta para carregar o ranking compartilhado."
      : "Pratique neste aparelho para comecar o ranking local.";
    elements.arcadeRankingList.appendChild(empty);
    return;
  }

  leaderboard.forEach((entry, index) => {
    const points = isWeekly ? entry.summary.weeklyXp || 0 : entry.summary.xp || 0;
    const row = document.createElement("div");
    row.className = `ranking-row${entry.userName === state.currentUser ? " is-current" : ""}`;
    row.innerHTML = `
      <span class="ranking-position">#${index + 1}</span>
      <div class="ranking-meta">
        <strong>${entry.userName}</strong>
        <p>${entry.summary.rank} - LV ${entry.summary.level} - streak ${entry.summary.dailyStreak || 0}d</p>
      </div>
      <div class="ranking-points">
        <strong>${points}</strong>
        <span>${isWeekly ? "XP 7d" : "XP"}</span>
      </div>
    `;
    elements.arcadeRankingList.appendChild(row);
  });
}

async function refreshSharedLeaderboard(force = false) {
  if (!canUseCloudSync() || !runtime.bridge || !state.currentUser || state.storageMode !== "cloud") {
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
  recordActivityEvent({ arcadeStart: true });
  saveProgress();
  renderSectionNav();
  spawnShurikenToken();
  renderArcade();
  elements.shurikenInput.focus();
}

function spawnShurikenToken() {
  const next = pickAdaptive(
    getPracticePool(),
    "quiz",
    (entry) => entry.id,
    (entry) => computeCharWeight(entry),
    { trackRotation: false }
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
  let wasDue = false;
  if (state.arcade.shuriken.current) {
    const reviewMeta = markCharProgress(state.arcade.shuriken.current.id, false);
    wasDue = reviewMeta.wasDue;
  }

  const delta = applyXpDelta(xpTable.arcadeShurikenMiss);
  recordActivityEvent({
    xpDelta: delta,
    success: false,
    wasDue,
  });
  state.arcade.shuriken.combo = 0;
  state.arcade.shuriken.lives -= 1;
  state.arcade.shuriken.status =
    `Passou do tempo. O mesmo tipo de leitura volta mais cedo agora. (${formatXpDelta(delta)})`;
  saveProgress();
  renderStats();

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
  recordActivityEvent({ arcadeStart: true });
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
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
  });
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
  renderStats();

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
  recordActivityEvent({ arcadeStart: true });

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
    const reviewMeta = markCharProgress(first.pairId, true);
    recordActivityEvent({
      xpDelta: delta,
      success: true,
      wasDue: reviewMeta.wasDue,
    });
    if (game.found >= Math.max(1, Math.floor(game.board.length / 2))) {
      finishPairsGame(
        `Tabuleiro completo em ${game.seconds}s e ${game.moves} jogadas.`
      );
      return;
    }
    saveProgress();
    renderStats();
    renderPairsGame();
    return;
  }

  game.lock = true;
  const firstMeta = markCharProgress(first.pairId, false);
  const secondMeta = markCharProgress(item.pairId, false);
  const delta = applyXpDelta(xpTable.arcadePairsMiss);
  recordActivityEvent({
    xpDelta: delta,
    success: false,
    wasDue: firstMeta.wasDue || secondMeta.wasDue,
  });
  game.status = `Nao era esse par. (${formatXpDelta(delta)})`;
  saveProgress();
  renderStats();
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
  renderProgressDashboard();
}

function renderAudioControls() {
  elements.audioRateToggle?.querySelectorAll("[data-audio-rate]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.audioRate === String(state.audioRate));
  });
  elements.audioRepeatToggle?.querySelectorAll("[data-audio-repeat]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.audioRepeat === String(state.audioRepeat)
    );
  });
}

function isStandaloneMode() {
  return Boolean(
    window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone
  );
}

function renderInstallChrome() {
  if (!elements.installApp || !elements.installStatus) {
    return;
  }

  const standalone = isStandaloneMode();
  const canPrompt = Boolean(runtime.installPrompt);
  const httpContext = window.location.protocol.startsWith("http");

  elements.installApp.disabled = standalone || !httpContext;

  if (standalone) {
    elements.installApp.textContent = "App instalado";
    elements.installStatus.textContent =
      "Ja esta com cara de app. O shell principal fica disponivel offline depois da primeira visita.";
    return;
  }

  elements.installApp.textContent = canPrompt ? "Instalar agora" : "Instalar no celular";

  if (!httpContext) {
    elements.installStatus.textContent =
      "Para instalar, abra a versao do Vercel ou um servidor local em vez do arquivo offline.";
    return;
  }

  if (canPrompt) {
    elements.installStatus.textContent =
      "Pronto para instalar neste aparelho. Depois da primeira carga, o shell principal abre offline.";
    return;
  }

  const isiPhone =
    /iphone|ipad|ipod/i.test(window.navigator.userAgent || "") &&
    /safari/i.test(window.navigator.userAgent || "");

  elements.installStatus.textContent = isiPhone
    ? "No iPhone, use Compartilhar > Adicionar a Tela de Inicio."
    : "Abra este link no navegador do celular para instalar quando o navegador liberar o atalho.";
}

function getPhraseDeckByCategory(category) {
  const fullDeck =
    state.level === "base" ? phraseDecks.base : [...phraseDecks.base, ...phraseDecks.extended];
  return fullDeck.filter((item) => item.category === category);
}

function getActiveReviewItemPool() {
  const pool = new Map();
  [...getActiveReadingDeck(), ...getActiveContextDeck(), ...getPhraseDeckByCategory("saudacoes"), ...getPhraseDeckByCategory("viagem"), ...getPhraseDeckByCategory("conversa"), ...getPhraseDeckByCategory("anime")].forEach((item) => {
    pool.set(item.id, item);
  });
  return [...pool.values()];
}

function getReviewRecord(reviewMap, id) {
  return normalizeReviewRecord(reviewMap?.[id]);
}

function getReviewBucket(record, now = Date.now()) {
  if (!record.lastSeenAt) {
    return "new";
  }
  if (record.streak < 2 && record.dueAt > now) {
    return "learning";
  }
  if (!record.dueAt || record.dueAt <= now) {
    return "today";
  }
  if (record.dueAt <= now + 24 * 60 * 60 * 1000) {
    return "tomorrow";
  }
  return "later";
}

function getReviewDueText(record, now = Date.now()) {
  const bucket = getReviewBucket(record, now);
  if (bucket === "new") {
    return "ainda sem historico";
  }
  if (bucket === "learning") {
    return "voltando em breve";
  }
  if (bucket === "today") {
    return "vence agora";
  }
  if (bucket === "tomorrow") {
    return "vence amanha";
  }
  return "mais estavel";
}

function computeReviewPriority(record, baseWeight = 1, now = Date.now()) {
  let score = Math.max(0.1, baseWeight);
  const bucket = getReviewBucket(record, now);

  if (bucket === "new") {
    score += 2.2;
  } else if (bucket === "learning") {
    score += 3.2;
  } else if (bucket === "today") {
    score += 4.4 + Math.min(2.4, Math.max(0, now - record.dueAt) / (1000 * 60 * 60 * 12));
  } else if (bucket === "tomorrow") {
    score += 1.3;
  } else {
    score += 0.18;
  }

  score += (record.lapses || 0) * 0.35;
  return score;
}

function getTrackProgress(track) {
  if (track.id === "foundations") {
    const pool = getStudyPool();
    const practiced = pool.filter((entry) => {
      const stats = getCharStats(entry.id);
      return stats.hits + stats.misses > 0;
    }).length;
    const mastered = pool.filter((entry) => {
      const stats = getCharStats(entry.id);
      const total = stats.hits + stats.misses;
      return total >= 5 && stats.hits >= 4 && stats.hits / total >= 0.78;
    }).length;
    const percent = Math.round(((practiced + mastered) / Math.max(1, pool.length * 2)) * 100);
    return {
      percent,
      meta: `${mastered}/${pool.length} dominados`,
    };
  }

  if (track.id === "arcade") {
    const cleared = getArcadeClearedCount();
    return {
      percent: Math.round((cleared / 3) * 100),
      meta: `${cleared}/3 cartuchos vencidos`,
    };
  }

  const deck = getPhraseDeckByCategory(track.category);
  const practiced = deck.filter((item) => {
    const stats = getItemStats(item.id);
    return stats.hits + stats.misses > 0;
  }).length;
  const stable = deck.filter((item) => {
    const stats = getItemStats(item.id);
    const total = stats.hits + stats.misses;
    return total >= 3 && stats.hits / total >= 0.72;
  }).length;

  return {
    percent: Math.round(((practiced + stable) / Math.max(1, deck.length * 2)) * 100),
    meta: `${practiced}/${deck.length} vistas • ${stable} estaveis`,
  };
}

function buildReviewSnapshot() {
  const now = Date.now();
  const bucketCounts = Object.fromEntries(reviewBucketOrder.map((bucket) => [bucket, 0]));
  const queue = [];

  getStudyPool().forEach((entry) => {
    const record = getReviewRecord(state.progress.charReview, entry.id);
    const bucket = getReviewBucket(record, now);
    bucketCounts[bucket] += 1;
    queue.push({
      id: entry.id,
      title: entry.char,
      copy: `${entry.romaji} • ${entry.family} • ${getReviewDueText(record, now)}`,
      tag: labelForScript(entry.script),
      bucket,
      priority: computeReviewPriority(record, computeCharWeight(entry), now),
    });
  });

  getActiveReviewItemPool().forEach((item) => {
    const record = getReviewRecord(state.progress.itemReview, item.id);
    const bucket = getReviewBucket(record, now);
    bucketCounts[bucket] += 1;
    queue.push({
      id: item.id,
      title: item.text,
      copy: `${item.meaning} • ${getReviewDueText(record, now)}`,
      tag: item.category ? labelForPhraseCategory(item.category) : labelForTextGroup(item.group),
      bucket,
      priority: computeReviewPriority(record, computeItemWeight(item) + 0.2, now),
    });
  });

  queue.sort((left, right) => right.priority - left.priority || left.title.localeCompare(right.title));

  return {
    bucketCounts,
    queue,
    dueToday: bucketCounts.today + bucketCounts.learning,
  };
}

function renderMissionList(container, missions) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  missions.forEach((mission) => {
    const item = document.createElement("article");
    item.className = `mission-item${mission.complete ? " is-complete" : ""}`;
    item.innerHTML = `
      <div class="mission-head">
        <strong>${mission.label}</strong>
        <span>${Math.min(mission.value, mission.target)}/${mission.target}</span>
      </div>
      <p class="mission-copy">${mission.description}</p>
      <div class="mission-progress"><span style="width: ${mission.ratio}%"></span></div>
    `;
    container.appendChild(item);
  });
}

function renderReviewBucketGrid(container, bucketCounts) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  reviewBucketOrder.forEach((bucket) => {
    const card = document.createElement("article");
    card.className = "review-bucket-card";
    card.innerHTML = `
      <span>${reviewBucketMeta[bucket].label}</span>
      <strong>${bucketCounts[bucket] || 0}</strong>
      <p class="track-card-copy">${reviewBucketMeta[bucket].note}</p>
    `;
    container.appendChild(card);
  });
}

function renderReviewQueue(container, items) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "review-item";
    article.innerHTML = `
      <div class="review-item-head">
        <strong>${item.title}</strong>
        <span class="review-item-tag">${reviewBucketMeta[item.bucket].label}</span>
      </div>
      <p class="review-item-copy">${item.copy}</p>
      <div class="review-item-footer">
        <span class="track-card-tag">${item.tag}</span>
      </div>
    `;
    container.appendChild(article);
  });
}

function renderActivityTimeline() {
  if (!elements.activityTimeline || !elements.activitySummary) {
    return;
  }

  const entries = getActivityWindowEntries();
  const maxXp = Math.max(20, ...entries.map((entry) => Math.max(0, entry.xp)));

  elements.activitySummary.textContent = `${getWeeklyXp()} XP nos ultimos 7 dias`;
  elements.activityTimeline.innerHTML = "";

  entries.forEach((entry) => {
    const article = document.createElement("article");
    article.className = "activity-bar";
    const dayLabel = new Date(`${entry.dateKey}T12:00:00`).toLocaleDateString("pt-BR", {
      weekday: "short",
    });
    const height = Math.max(8, Math.round((Math.max(0, entry.xp) / maxXp) * 100));
    article.innerHTML = `
      <div class="activity-bar-track">
        <span class="activity-fill" style="height: ${height}%"></span>
      </div>
      <div class="activity-bar-head">
        <strong>${Math.round(entry.xp)}</strong>
        <span>${entry.correct}/${entry.wrong}</span>
      </div>
      <p class="activity-day">${dayLabel}</p>
      <p class="activity-bar-meta">${entry.sessions} blocos</p>
    `;
    elements.activityTimeline.appendChild(article);
  });
}

function renderTrackGrid() {
  if (!elements.trackGrid) {
    return;
  }

  elements.trackGrid.innerHTML = "";
  trackCatalog.forEach((track) => {
    const progress = getTrackProgress(track);
    const article = document.createElement("article");
    article.className = "track-card";
    article.innerHTML = `
      <div class="track-card-head">
        <strong>${track.label}</strong>
        <span>${progress.percent}%</span>
      </div>
      <p class="track-card-copy">${track.note}</p>
      <div class="track-progress"><span style="width: ${progress.percent}%"></span></div>
      <div class="track-card-footer">
        <span class="track-card-tag">${progress.meta}</span>
        <button type="button" class="ghost-button progress-jump" data-track-id="${track.id}">
          Abrir
        </button>
      </div>
    `;
    elements.trackGrid.appendChild(article);
  });
}

function buildTodayActionPlan(summary, reviewSnapshot) {
  const practicedCount = Number(summary.practicedCount || 0);
  const weakCount = getWeakEntries(getStudyPool()).length;
  const steps = [];
  const used = new Set();

  const pushStep = (step) => {
    if (!step || used.has(step.actionId) || steps.length >= 3) {
      return;
    }
    used.add(step.actionId);
    steps.push(step);
  };

  let primary;

  if (reviewSnapshot.dueToday > 0) {
    primary = {
      kicker: "Agora",
      title: `Revisar ${reviewSnapshot.dueToday} itens que venceram`,
      copy: "Comece pela fila urgente para limpar o que esta pedindo volta antes de abrir outros modos.",
      button: "Continuar pela revisao",
      actionId: "review",
    };
    pushStep({
      title: "Limpar a fila urgente",
      copy: `${reviewSnapshot.dueToday} itens estao vencendo agora e precisam aparecer primeiro.`,
      button: "Revisar",
      actionId: "review",
    });
  } else if (weakCount > 0) {
    primary = {
      kicker: "Agora",
      title: "Atacar os pontos que mais travam",
      copy: `${weakCount} kana ainda estao oscilando. Entre por eles primeiro e deixe o treino mais produtivo.`,
      button: "Treinar meus erros",
      actionId: "weak-reading",
    };
    pushStep({
      title: "Forcar seus gargalos",
      copy: `${weakCount} kana estao voltando como erro com mais frequencia.`,
      button: "Abrir",
      actionId: "weak-reading",
    });
  } else if (practicedCount === 0) {
    primary = {
      kicker: "Comeco",
      title: "Abrir o mapa base antes do primeiro treino",
      copy: "Veja as familias principais primeiro para entrar no treino com menos travas.",
      button: "Comecar pelo mapa",
      actionId: "study-map",
    };
    pushStep({
      title: "Passar pelo mapa rapido",
      copy: "Uma olhada nas familias base ja melhora bastante o primeiro bloco.",
      button: "Abrir",
      actionId: "study-map",
    });
  } else {
    primary = {
      kicker: "Agora",
      title: "Ganhar ritmo com o treino adaptativo",
      copy: "O app ja puxa o que precisa aparecer mais e segura o que voce esta acertando com folga.",
      button: "Continuar de onde parei",
      actionId: "adaptive",
    };
    pushStep({
      title: "Entrar no bloco adaptativo",
      copy: "Bom para destravar o estudo sem precisar escolher entre muitos modos.",
      button: "Abrir",
      actionId: "adaptive",
    });
  }

  pushStep({
    title: "Fazer uma leitura curta",
    copy: "Palavras menores ajudam a entrar no ritmo antes de frases mais longas.",
    button: "Treinar",
    actionId: weakCount > 0 ? "weak-reading" : "reading",
  });

  pushStep({
    title: state.level === "base" ? "Fechar um bloco de contexto" : "Fechar uma frase por tema",
    copy:
      state.level === "base"
        ? "Use expressoes e palavras maiores para juntar os kana em leitura real."
        : "Puxe frases maiores para ligar leitura, memoria e vocabulario.",
    button: "Abrir",
    actionId: state.level === "base" ? "context" : "phrases",
  });

  pushStep({
    title: "Respirar com o mapa",
    copy: "Se cansar do treino, volte ao estudo visual para consolidar familia e forma.",
    button: "Estudar",
    actionId: "study-map",
  });

  return {
    primary,
    steps: steps.slice(0, 3),
  };
}

function renderTodayFocus(summary, reviewSnapshot) {
  if (!elements.todayPrimaryAction || !elements.todayPlanList) {
    return;
  }

  const { primary, steps } = buildTodayActionPlan(summary, reviewSnapshot);

  if (elements.todayPrimaryKicker) {
    elements.todayPrimaryKicker.textContent = primary.kicker;
  }
  if (elements.todayPrimaryTitle) {
    elements.todayPrimaryTitle.textContent = primary.title;
  }
  if (elements.todayPrimaryCopy) {
    elements.todayPrimaryCopy.textContent = primary.copy;
  }
  elements.todayPrimaryAction.textContent = primary.button;
  elements.todayPrimaryAction.dataset.todayAction = primary.actionId;
  if (elements.todayPlanPill) {
    elements.todayPlanPill.textContent = `${steps.length} passos`;
  }

  elements.todayPlanList.innerHTML = "";
  steps.forEach((step, index) => {
    const article = document.createElement("article");
    article.className = "today-plan-item";
    article.innerHTML = `
      <span class="today-plan-step">${String(index + 1).padStart(2, "0")}</span>
      <div class="today-plan-body">
        <strong>${step.title}</strong>
        <p>${step.copy}</p>
      </div>
      <button type="button" class="secondary-button today-plan-button" data-today-action="${step.actionId}">
        ${step.button}
      </button>
    `;
    elements.todayPlanList.appendChild(article);
  });
}

function renderDistractionGate() {
  if (!elements.gateToggle || !elements.gatePresets) {
    return;
  }

  const status = getDistractionGateStatus();
  const { gate, preset, unlocked, progressPercent, progressLabel, remainingCopy } = status;

  elements.gatePresets.querySelectorAll("[data-gate-preset]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.gatePreset === gate.presetId);
  });

  if (elements.gateStatusPill) {
    elements.gateStatusPill.textContent = !gate.enabled
      ? "Desligado"
      : unlocked
        ? "Liberado"
        : "Bloqueado";
    elements.gateStatusPill.classList.toggle("muted", !unlocked);
  }

  if (elements.gateCopy) {
    elements.gateCopy.textContent = gate.enabled
      ? `${preset.title}. ${preset.description}`
      : "Ative um contrato simples: o app so libera seus atalhos de YouTube e Instagram depois de bater a meta escolhida.";
  }

  if (elements.gateProgressCopy) {
    elements.gateProgressCopy.textContent = gate.enabled
      ? `${progressLabel}. ${remainingCopy}`
      : "Escolha a meta e ative a trava quando quiser levar o estudo mais a serio.";
  }

  if (elements.gateProgressFill) {
    elements.gateProgressFill.style.width = `${gate.enabled ? progressPercent : 0}%`;
  }

  if (elements.gateToggle) {
    elements.gateToggle.textContent = gate.enabled ? "Desativar trava" : "Ativar trava";
    elements.gateToggle.className = gate.enabled ? "ghost-button" : "primary-button";
  }

  if (elements.gateOpenYoutube) {
    elements.gateOpenYoutube.disabled = !gate.enabled || !unlocked;
  }
  if (elements.gateOpenInstagram) {
    elements.gateOpenInstagram.disabled = !gate.enabled || !unlocked;
  }

  if (elements.gateNote) {
    elements.gateNote.textContent = unlocked
      ? "Atalhos liberados. Se quiser repetir o contrato amanha, e so deixar a trava ligada."
      : "Dentro do app eu consigo segurar a liberacao. Para bloquear os apps no aparelho inteiro, voce ainda vai precisar do controle do sistema.";
  }
}

function formatRotationDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(" de ", " ")
    .replace(".", "");
}

function renderContentRotation() {
  if (!elements.rotationModeList) {
    return;
  }

  const snapshot = getContentRotationSnapshot();
  if (elements.rotationWindowLabel) {
    elements.rotationWindowLabel.textContent = `${formatRotationDate(snapshot.start)} a ${formatRotationDate(snapshot.end)}`;
  }
  if (elements.rotationSeenCount) {
    elements.rotationSeenCount.textContent = String(snapshot.seen);
  }
  if (elements.rotationTotalCount) {
    elements.rotationTotalCount.textContent = String(snapshot.total);
  }
  if (elements.rotationProgress) {
    elements.rotationProgress.setAttribute("aria-valuenow", String(snapshot.percent));
  }
  if (elements.rotationProgressFill) {
    elements.rotationProgressFill.style.width = `${snapshot.percent}%`;
  }
  if (elements.rotationRenewal) {
    elements.rotationRenewal.textContent = `Renova automaticamente em ${formatRotationDate(snapshot.renewal)}.`;
  }

  elements.rotationModeList.innerHTML = snapshot.modes
    .map(
      (mode, index) => `
        <div class="rotation-mode-item${mode.seen >= mode.total && mode.total ? " is-complete" : ""}">
          <span class="rotation-mode-index">${String(index + 1).padStart(2, "0")}</span>
          <div class="rotation-mode-copy">
            <strong>${mode.label}</strong>
            <span>${mode.seen}/${mode.total}</span>
          </div>
          <span class="rotation-mode-track" aria-hidden="true">
            <i style="width: ${mode.percent}%"></i>
          </span>
        </div>
      `
    )
    .join("");
}

function renderProgressDashboard() {
  const summary = summarizeProgress();
  const missions = dailyMissionCatalog.map((mission) => {
    const value = getMissionValue(state.progress.daily, mission.id);
    return {
      ...mission,
      value,
      complete: value >= mission.target,
      ratio: Math.max(0, Math.min(100, Math.round((value / mission.target) * 100))),
    };
  });
  const reviewSnapshot = buildReviewSnapshot();

  if (elements.dailyStreakPill) {
    elements.dailyStreakPill.textContent = `${summary.dailyStreak} dias`;
  }
  if (elements.todayDuePill) {
    elements.todayDuePill.textContent = `${reviewSnapshot.dueToday} itens hoje`;
  }
  if (elements.progressRankPill) {
    elements.progressRankPill.textContent = `${summary.rank} • LV ${summary.level}`;
  }
  if (elements.progressXpTotal) {
    elements.progressXpTotal.textContent = String(summary.xp);
  }
  if (elements.progressWeeklyXp) {
    elements.progressWeeklyXp.textContent = String(summary.weeklyXp);
  }
  if (elements.progressDailyStreak) {
    elements.progressDailyStreak.textContent = String(summary.dailyStreak);
  }
  if (elements.progressDueTotal) {
    elements.progressDueTotal.textContent = String(reviewSnapshot.dueToday);
  }
  if (elements.progressMissionStatus) {
    const completed = missions.filter((mission) => mission.complete).length;
    elements.progressMissionStatus.textContent = `${completed}/${missions.length}`;
  }
  if (elements.reviewDueSummary) {
    elements.reviewDueSummary.textContent = `${reviewSnapshot.dueToday} itens vencendo`;
  }

  renderMissionList(elements.todayMissionList, missions);
  renderMissionList(elements.progressMissionList, missions);
  renderReviewBucketGrid(elements.todayReviewBuckets, reviewSnapshot.bucketCounts);
  renderReviewBucketGrid(elements.progressReviewBuckets, reviewSnapshot.bucketCounts);
  renderReviewQueue(elements.progressReviewList, reviewSnapshot.queue.slice(0, 8));
  renderReviewQueue(elements.reviewPriorityList, reviewSnapshot.queue.slice(0, 5));
  renderTodayFocus(summary, reviewSnapshot);
  renderContentRotation();
  renderDistractionGate();
  renderQuickSession(summary, reviewSnapshot);
  renderActivityTimeline();
  renderTrackGrid();
}

function runTodayAction(actionId) {
  switch (actionId) {
    case "review":
      setFocusMode("weak");
      setSection("review");
      return;
    case "weak-reading":
      setFocusMode("weak");
      setSection("training", "reading");
      return;
    case "adaptive":
      setFocusMode("all");
      setSection("training", "recognition");
      return;
    case "reading":
      setFocusMode("all");
      setSection("training", "reading");
      return;
    case "context":
      setFocusMode("all");
      setSection("training", "context");
      return;
    case "phrases":
      setFocusMode("all");
      setSection("training", "phrases");
      return;
    case "study-map":
      setSection("study");
      return;
    default:
      setFocusMode("all");
      setSection("training", "recognition");
  }
}

function formatSessionClock(totalMs) {
  const totalSeconds = Math.max(0, Math.ceil(totalMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getQuickSessionActionLabel(actionId) {
  switch (actionId) {
    case "review":
      return "revisao";
    case "weak-reading":
      return "leitura dos erros";
    case "reading":
      return "leitura curta";
    case "context":
      return "contexto";
    case "phrases":
      return "frases";
    case "study-map":
      return "mapa de estudo";
    case "adaptive":
    default:
      return "treino adaptativo";
  }
}

function getWeakEntryIds(entries = getStudyPool()) {
  return getWeakEntries(entries).map((entry) => entry.id);
}

function clearQuickSessionRuntime() {
  if (runtime.quickSessionTimer) {
    clearInterval(runtime.quickSessionTimer);
    runtime.quickSessionTimer = 0;
  }
}

function getNextTodayAction(plan, currentActionId) {
  const ordered = [plan?.primary, ...(plan?.steps || [])];
  const seen = new Set();

  for (const step of ordered) {
    if (!step || seen.has(step.actionId)) {
      continue;
    }
    seen.add(step.actionId);
    if (step.actionId !== currentActionId) {
      return step;
    }
  }

  return null;
}

function renderQuickSession(summary = summarizeProgress(), reviewSnapshot = buildReviewSnapshot()) {
  const session = state.quickSession;
  const plan = buildTodayActionPlan(summary, reviewSnapshot);
  const primary = plan.primary || {
    title: "Ganhar ritmo com o treino adaptativo",
    actionId: "adaptive",
  };

  if (elements.sessionDurationPill) {
    elements.sessionDurationPill.textContent = session.active
      ? `rodando ${session.durationMinutes} min`
      : `${session.durationMinutes} min`;
  }

  elements.sessionDurationToggle?.querySelectorAll("[data-session-duration]").forEach((button) => {
    const duration = Number(button.dataset.sessionDuration);
    button.classList.toggle("is-active", duration === session.durationMinutes);
    button.disabled = session.active;
  });

  if (elements.sessionStartCopy) {
    if (session.active) {
      elements.sessionStartCopy.textContent =
        "Sessao ativa. Pode treinar em qualquer aba e o bloco fecha sozinho com resumo no final.";
    } else if (session.lastSummary) {
      elements.sessionStartCopy.textContent =
        "Ultimo bloco fechado. Quando quiser, rode outro sprint curto com um fim bem definido.";
    } else {
      elements.sessionStartCopy.textContent =
        "Escolha um tempo, abra o proximo bloco recomendado e feche com um resumo util no final.";
    }
  }

  if (elements.sessionStartTarget) {
    elements.sessionStartTarget.textContent = session.active
      ? `Bloco ativo: ${getQuickSessionActionLabel(session.actionId)}`
      : `Vai abrir: ${primary.title}`;
  }

  if (elements.sessionStart) {
    elements.sessionStart.textContent = session.active
      ? "Sessao em andamento"
      : `Iniciar sprint de ${session.durationMinutes} min`;
    elements.sessionStart.disabled = session.active;
  }

  if (elements.sessionBanner) {
    elements.sessionBanner.classList.toggle("is-hidden", !session.active);
  }

  if (session.active) {
    const totalMs = session.durationMinutes * 60 * 1000;
    const remainingMs = Math.max(0, session.endsAt - Date.now());
    const elapsedMs = Math.max(0, Math.min(totalMs, Date.now() - session.startedAt));
    const progress = totalMs > 0 ? Math.round((elapsedMs / totalMs) * 100) : 0;

    if (elements.sessionBannerKicker) {
      elements.sessionBannerKicker.textContent = "Sprint ativo";
    }
    if (elements.sessionBannerTitle) {
      elements.sessionBannerTitle.textContent = getQuickSessionActionLabel(session.actionId);
    }
    if (elements.sessionBannerXp) {
      elements.sessionBannerXp.textContent = formatXpDelta(session.xpDelta);
    }
    if (elements.sessionBannerCorrect) {
      elements.sessionBannerCorrect.textContent = String(session.correctCount);
    }
    if (elements.sessionBannerWrong) {
      elements.sessionBannerWrong.textContent = String(session.wrongCount);
    }
    if (elements.sessionTimeLeft) {
      elements.sessionTimeLeft.textContent = formatSessionClock(remainingMs);
    }
    if (elements.sessionProgressLabel) {
      elements.sessionProgressLabel.textContent = `${progress}%`;
    }
    if (elements.sessionProgressFill) {
      elements.sessionProgressFill.style.width = `${progress}%`;
    }
  }

  const summaryData = session.lastSummary;
  if (elements.sessionSummary) {
    elements.sessionSummary.classList.toggle("is-hidden", !summaryData);
    elements.sessionSummary.setAttribute("aria-hidden", String(!summaryData));
  }
  document.body.classList.toggle("session-summary-open", Boolean(summaryData));

  if (!summaryData) {
    if (elements.sessionSummaryNext) {
      elements.sessionSummaryNext.dataset.todayAction = "";
    }
    return;
  }

  if (elements.sessionSummaryKicker) {
    elements.sessionSummaryKicker.textContent = summaryData.kicker;
  }
  if (elements.sessionSummaryTitle) {
    elements.sessionSummaryTitle.textContent = summaryData.title;
  }
  if (elements.sessionSummaryCopy) {
    elements.sessionSummaryCopy.textContent = summaryData.copy;
  }
  if (elements.sessionSummaryTime) {
    elements.sessionSummaryTime.textContent = summaryData.timeLabel;
  }
  if (elements.sessionSummaryXp) {
    elements.sessionSummaryXp.textContent = summaryData.xpLabel;
  }
  if (elements.sessionSummaryImprovedLabel) {
    elements.sessionSummaryImprovedLabel.textContent = summaryData.improvedLabel;
  }
  if (elements.sessionSummaryImproved) {
    elements.sessionSummaryImproved.textContent = String(summaryData.improvedValue);
  }
  if (elements.sessionSummaryWeakLabel) {
    elements.sessionSummaryWeakLabel.textContent = summaryData.weakLabel;
  }
  if (elements.sessionSummaryWeak) {
    elements.sessionSummaryWeak.textContent = String(summaryData.weakValue);
  }
  if (elements.sessionSummaryNext) {
    elements.sessionSummaryNext.textContent = summaryData.nextButton;
    elements.sessionSummaryNext.dataset.todayAction = summaryData.nextActionId || "";
  }

  renderTrainRail();
}

function startQuickSession() {
  if (state.quickSession.active) {
    return;
  }

  const durationMinutes = Number(state.quickSession.durationMinutes || 5);
  const summary = summarizeProgress();
  const reviewSnapshot = buildReviewSnapshot();
  const plan = buildTodayActionPlan(summary, reviewSnapshot);
  const primary = plan.primary || { actionId: "adaptive" };

  clearQuickSessionRuntime();
  state.quickSession = {
    ...createQuickSessionState(),
    durationMinutes,
    active: true,
    startedAt: Date.now(),
    endsAt: Date.now() + durationMinutes * 60 * 1000,
    actionId: primary.actionId || "adaptive",
    startXp: Number(state.progress.xp || 0),
    startPracticedCount: Number(summary.practicedCount || 0),
    startWeakIds: getWeakEntryIds(getStudyPool()),
  };

  runtime.quickSessionTimer = window.setInterval(() => {
    tickQuickSession();
  }, 1000);

  runTodayAction(state.quickSession.actionId);
  renderQuickSession(summary, reviewSnapshot);
}

function tickQuickSession() {
  if (!state.quickSession.active) {
    clearQuickSessionRuntime();
    return;
  }

  if (Date.now() >= state.quickSession.endsAt) {
    finishQuickSession({ completed: true });
    return;
  }

  renderQuickSession();
}

function buildQuickSessionSummary(completed) {
  const session = state.quickSession;
  const summary = summarizeProgress();
  const reviewSnapshot = buildReviewSnapshot();
  const plan = buildTodayActionPlan(summary, reviewSnapshot);
  const nextStep = getNextTodayAction(plan, session.actionId);
  const weakNow = new Set(getWeakEntryIds(getStudyPool()));
  const startingWeakIds = Array.isArray(session.startWeakIds) ? session.startWeakIds : [];
  const resolvedWeak = startingWeakIds.filter((id) => !weakNow.has(id)).length;
  const remainingWeak = startingWeakIds.filter((id) => weakNow.has(id)).length;
  const practicedDelta = Math.max(
    0,
    Number(summary.practicedCount || 0) - Number(session.startPracticedCount || 0)
  );
  const elapsedMs = Math.max(
    0,
    Math.min(session.durationMinutes * 60 * 1000, Date.now() - Number(session.startedAt || Date.now()))
  );
  const xpDelta = Number(state.progress.xp || 0) - Number(session.startXp || 0);
  const improvedLabel = startingWeakIds.length > 0 ? "Melhoraram" : "Novos vistos";
  const improvedValue = startingWeakIds.length > 0 ? resolvedWeak : practicedDelta;
  const weakLabel = startingWeakIds.length > 0 ? "Ainda fracos" : "Em revisao";
  const weakValue = startingWeakIds.length > 0 ? remainingWeak : weakNow.size;

  let copy = "O bloco terminou e o proximo passo ja ficou separado para voce continuar sem travar.";
  if (!completed && session.eventCount > 0) {
    copy = "Voce encerrou antes do fim, mas o resumo preserva o que melhorou e o que ainda merece voltar.";
  } else if (!completed) {
    copy = "Sessao encerrada cedo. Quando quiser, rode outro sprint curto para voltar ao ritmo.";
  } else if (completed && session.eventCount === 0) {
    copy = "O tempo fechou com pouco movimento. Ainda assim, ficou claro onde retomar sem precisar pensar muito.";
  }

  return {
    kicker: completed ? "Sessao concluida" : "Sessao interrompida",
    title: completed ? "Bloco fechado." : "Sessao encerrada antes do fim.",
    copy,
    timeLabel: formatSessionClock(elapsedMs),
    xpLabel: formatXpDelta(xpDelta),
    improvedLabel,
    improvedValue,
    weakLabel,
    weakValue,
    nextActionId: nextStep?.actionId || "",
    nextButton: nextStep
      ? `Abrir ${getQuickSessionActionLabel(nextStep.actionId)}`
      : "Voltar para hoje",
  };
}

function finishQuickSession({ completed = true } = {}) {
  if (!state.quickSession.active) {
    return;
  }

  clearQuickSessionRuntime();
  const summaryData = buildQuickSessionSummary(completed);
  state.quickSession.active = false;
  state.quickSession.endsAt = Date.now();
  state.quickSession.lastSummary = summaryData;
  setSection("today");
  renderAll();
}

function closeQuickSessionSummary() {
  if (!state.quickSession.lastSummary) {
    return;
  }

  state.quickSession.lastSummary = null;
  renderQuickSession();
}

function launchTrack(trackId) {
  const track = trackCatalog.find((item) => item.id === trackId);
  if (!track) {
    return;
  }

  if (track.action.phraseCategory) {
    state.phraseCategory = track.action.phraseCategory;
    generatePhrase();
  }

  if (track.action.section === "arcade") {
    setSection("arcade");
    setArcadeScreen(track.action.arcadeScreen || "games");
    return;
  }

  setSection(track.action.section || "training", track.action.trainTarget);
  renderAll();
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

  const correct = pickAdaptive(
    pool,
    "quiz",
    (entry) => entry.id,
    (entry) => computeCharWeight(entry),
    { isRotationExempt: isRotationExemptEntry }
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
  clearFeedbackMessage(elements.quizFeedback);
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
  const reviewMeta = markCharProgress(correct.id, isCorrect);
  const delta = applyXpDelta(
    isCorrect ? xpTable.recognition.correct : xpTable.recognition.wrong
  );
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: reviewMeta.wasDue,
  });
  recordTrainBlockAttempt("recognition", isCorrect);

  if (isCorrect) {
    state.quizStreak += 1;
    state.progress.bestQuizStreak = Math.max(
      state.progress.bestQuizStreak || 0,
      state.quizStreak
    );
    button.classList.add("correct");
    setFeedbackMessage(
      elements.quizFeedback,
      "success",
      `Certo. ${correct.char} = ${correct.romaji}. (${formatXpDelta(delta)})`
    );
  } else {
    state.quizStreak = 0;
    button.classList.add("wrong");
    setFeedbackMessage(
      elements.quizFeedback,
      "danger",
      `Ainda nao. ${correct.char} = ${correct.romaji}. (${formatXpDelta(delta)})`
    );
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
  state.reading = pickAdaptive(
    deck,
    "reading",
    (item) => item.id,
    (item) => computeItemWeight(item),
    { isRotationExempt: isRotationExemptItem }
  );
  elements.readingInput.value = "";
  clearFeedbackMessage(elements.readingFeedback);
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

  const itemMeta = markItemProgress(state.reading.id, isCorrect);
  const charMetas = markTextProgress(state.reading.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.reading.correct : xpTable.reading.wrong);
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
  });
  recordTrainBlockAttempt("reading", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.readingFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Boa. ${state.reading.breakdown} = ${state.reading.answer}. (${formatXpDelta(delta)})`
        : `Resposta: ${state.reading.answer} - ${state.reading.breakdown}${state.reading.pseudo ? " - combinacao de treino" : ""}`
    );
  });

  if (isCorrect) {
    state.readingStreak += 1;
    state.progress.bestReadingStreak = Math.max(
      state.progress.bestReadingStreak || 0,
      state.readingStreak
    );
    setFeedbackMessage(
      elements.readingFeedback,
      "success",
      `Boa. ${state.reading.breakdown} = ${state.reading.answer}. (${formatXpDelta(delta)})`
    );
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
  state.context = pickAdaptive(
    deck,
    "context",
    (item) => item.id,
    (item) => computeItemWeight(item),
    { isRotationExempt: isRotationExemptItem }
  );
  elements.contextInput.value = "";
  clearFeedbackMessage(elements.contextFeedback);
}

function renderContext() {
  if (!state.context) {
    return;
  }

  elements.contextKindLabel.textContent = labelForTextGroup(state.context.group);
  elements.contextWord.textContent = state.context.text;
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
  const filteredDeck = getPhraseDeckByCategory(state.phraseCategory);
  return filteredDeck.length ? filteredDeck : fullDeck;
}

function generatePhrase() {
  const deck = getActivePhraseDeck();
  state.phrase = pickAdaptive(
    deck,
    "phrases",
    (item) => item.id,
    (item) => computeItemWeight(item),
    { isRotationExempt: isRotationExemptItem }
  );
  elements.phraseInput.value = "";
  clearFeedbackMessage(elements.phraseFeedback);
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

  const itemMeta = markItemProgress(state.phrase.id, isCorrect);
  const charMetas = markTextProgress(state.phrase.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.phrases.correct : xpTable.phrases.wrong);
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
    phraseBlock: true,
  });
  recordTrainBlockAttempt("phrases", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.phraseFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Boa. ${state.phrase.breakdown} = ${state.phrase.answer}. (${formatXpDelta(delta)})`
        : `Resposta: ${state.phrase.answer} | ${state.phrase.breakdown} | ${state.phrase.meaning} (${formatXpDelta(delta)})`
    );
  });

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

  const itemMeta = markItemProgress(state.context.id, isCorrect);
  const charMetas = markTextProgress(state.context.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.context.correct : xpTable.context.wrong);
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
    phraseBlock: true,
  });
  recordTrainBlockAttempt("context", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.contextFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Boa. ${state.context.breakdown} = ${state.context.answer}. (${formatXpDelta(delta)})`
        : `Resposta: ${state.context.answer} | ${state.context.breakdown} | ${state.context.meaning} (${formatXpDelta(delta)})`
    );
  });

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
  const item = pickAdaptive(
    deck,
    "cloze",
    (entry) => entry.id,
    (entry) => computeItemWeight(entry),
    { isRotationExempt: isRotationExemptItem }
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

  clearFeedbackMessage(elements.clozeFeedback);
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
  const itemMeta = markItemProgress(state.cloze.id, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.cloze.correct : xpTable.cloze.wrong);
  const entry = charIndex.get(state.cloze.correctChar);
  let charMeta = null;
  if (entry) {
    charMeta = markCharProgress(entry.id, isCorrect);
  }
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || Boolean(charMeta?.wasDue),
  });
  recordTrainBlockAttempt("cloze", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.clozeFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Certo. ${state.cloze.text} = ${state.cloze.meaning}. (${formatXpDelta(delta)})`
        : `Era ${state.cloze.text} | ${state.cloze.answer} | ${state.cloze.meaning}. (${formatXpDelta(delta)})`
    );
  });

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
  state.dictation = pickAdaptive(
    deck,
    "dictation",
    (item) => item.id,
    (item) => computeItemWeight(item),
    { isRotationExempt: isRotationExemptItem }
  );
  elements.dictationInput.value = "";
  clearFeedbackMessage(elements.dictationFeedback);
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

  const itemMeta = markItemProgress(state.dictation.id, isCorrect);
  const charMetas = markTextProgress(state.dictation.text, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.dictation.correct : xpTable.dictation.wrong);
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
    phraseBlock: true,
  });
  recordTrainBlockAttempt("dictation", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.dictationFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Boa. ${state.dictation.answer} | ${state.dictation.meaning}. (${formatXpDelta(delta)})`
        : `Resposta: ${state.dictation.text} | ${state.dictation.answer} | ${state.dictation.meaning} (${formatXpDelta(delta)})`
    );
  });

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
  const card = pickAdaptive(
    deck,
    "confusion",
    (item) => item.id,
    (item) => computeItemWeight(item),
    { isRotationExempt: isRotationExemptItem }
  );
  state.confusion = {
    ...card,
    options: shuffle([...card.options]),
    answered: false,
  };
  clearFeedbackMessage(elements.confusionFeedback);
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
  const itemMeta = markItemProgress(state.confusion.id, isCorrect);
  const charMetas = markCharsByList(state.confusion.charIds, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.confusion.correct : xpTable.confusion.wrong);
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
  });
  recordTrainBlockAttempt("confusion", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.confusionFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Certo. ${state.confusion.note} (${formatXpDelta(delta)})`
        : `Quase. ${state.confusion.note} (${formatXpDelta(delta)})`
    );
  });

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
  const word = pickAdaptive(
    deck,
    "builder",
    (item) => item.id,
    (item) => computeItemWeight(item),
    { isRotationExempt: isRotationExemptItem }
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

  clearFeedbackMessage(elements.builderFeedback);
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

  const itemMeta = markItemProgress(state.builder.id, isCorrect);
  const charMetas = markTextProgress(expected, isCorrect);
  const delta = applyXpDelta(isCorrect ? xpTable.builder.correct : xpTable.builder.wrong);
  recordActivityEvent({
    xpDelta: delta,
    success: isCorrect,
    wasDue: itemMeta.wasDue || charMetas.some((meta) => meta.wasDue),
  });
  recordTrainBlockAttempt("builder", isCorrect);
  queueMicrotask(() => {
    setFeedbackMessage(
      elements.builderFeedback,
      isCorrect ? "success" : "danger",
      isCorrect
        ? `Boa. ${expected} = ${state.builder.romajiLabel}. (${formatXpDelta(delta)})`
        : `Era ${expected} - ${state.builder.romajiLabel} - ${state.builder.meaning}.`
    );
  });

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
    charReview: {},
    itemReview: {},
    xp: 0,
    daily: createDailyProgressState(),
    distractionGate: createDistractionGateState(),
    completedStreakDays: 0,
    bestDailyStreak: 0,
    activityLog: [],
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
    contentRotation: createContentRotationState(),
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

  const shouldQueueForCloud = Boolean(state.currentUser && isCloudBackedUser(state.currentUser));
  if (!canUseCloudSync() || !state.currentUser || state.storageMode !== "cloud") {
    if (shouldQueueForCloud) {
      queuePendingSync(createSyncSnapshot());
      refreshSyncState();
    }
    return Promise.resolve();
  }

  const commit = async () => {
    const snapshot = createSyncSnapshot();
    setSyncStatus("saving");

    try {
      if (!canUseCloudSync()) {
        queuePendingSync(snapshot);
        state.storageMode = "local";
        refreshSyncState();
        return;
      }
      await runtime.bridge.saveProgress({
        userId: snapshot.userId,
        userName: snapshot.userName,
        progress: snapshot.progress,
        summary: snapshot.summary,
      });
      clearPendingSync(snapshot.userName);
      state.leaderboardLoadedAt = 0;
      state.storageMode = "cloud";
      setSyncStatus("synced");
      if (state.section === "arcade" && state.arcade.screen === "records") {
        void refreshSharedLeaderboard(true);
      }
    } catch (error) {
      console.error("Falha ao salvar o progresso online.", error);
      queuePendingSync(snapshot);
      state.storageMode = "local";
      setSyncStatus(navigator.onLine === false ? "local" : "queued");
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

function updateReviewRecord(reviewMap, id, success) {
  const now = Date.now();
  const current = getReviewRecord(reviewMap, id);
  const wasDue = !current.lastSeenAt || !current.dueAt || current.dueAt <= now;

  if (success) {
    const intervalHours = !current.lastSeenAt
      ? 6
      : Math.max(10, Math.round((current.intervalHours || 6) * current.ease));
    reviewMap[id] = {
      ...current,
      lastSeenAt: now,
      dueAt: now + intervalHours * 60 * 60 * 1000,
      intervalHours,
      ease: Math.min(3.2, current.ease + 0.08),
      streak: current.streak + 1,
      lastResult: "success",
    };
  } else {
    const intervalHours = current.lastSeenAt
      ? Math.max(2, Math.round((current.intervalHours || 6) * 0.4))
      : 2;
    reviewMap[id] = {
      ...current,
      lastSeenAt: now,
      dueAt: now + intervalHours * 60 * 60 * 1000,
      intervalHours,
      ease: Math.max(1.35, current.ease - 0.18),
      streak: 0,
      lapses: current.lapses + 1,
      lastResult: "miss",
    };
  }

  return {
    wasDue,
    record: reviewMap[id],
  };
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
  return updateReviewRecord(state.progress.charReview, id, success);
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
  return updateReviewRecord(state.progress.itemReview, id, success);
}

function markTextProgress(text, success) {
  return [...text].map((char) => {
    const entry = charIndex.get(char);
    if (entry) {
      return markCharProgress(entry.id, success);
    }
    return null;
  }).filter(Boolean);
}

function markCharsByList(charIds, success) {
  return charIds.map((id) => markCharProgress(id, success));
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
  const review = getReviewRecord(state.progress.charReview, entry.id);
  const bucket = getReviewBucket(review);

  let weight = 0.7;

  if (bucket === "new") {
    weight += 2.5;
  } else if (bucket === "learning") {
    weight += 3.1;
  } else if (bucket === "today") {
    weight += 4.2;
  } else if (bucket === "tomorrow") {
    weight += 1.35;
  } else {
    weight += 0.3;
  }

  if (total === 0) {
    weight += 1.2;
  } else {
    weight += Math.max(0, 0.84 - accuracy) * 4.8;
  }
  weight += stats.misses * 1.35;

  if (stats.hits >= 5 && accuracy >= 0.9 && bucket === "later") {
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
  const review = getReviewRecord(state.progress.itemReview, item.id);
  const bucket = getReviewBucket(review);
  const relatedEntries = item.charIds.map((id) => entryIndex.get(id)).filter(Boolean);
  const averageCharWeight =
    relatedEntries.reduce((sum, entry) => sum + computeCharWeight(entry), 0) /
    Math.max(1, relatedEntries.length);
  const touchesWeakEntry = relatedEntries.some((entry) => isWeakEntry(entry));

  let weight = 0.7 + averageCharWeight * 0.65;

  if (bucket === "new") {
    weight += 1.9;
  } else if (bucket === "learning") {
    weight += 2.7;
  } else if (bucket === "today") {
    weight += 3.8;
  } else if (bucket === "tomorrow") {
    weight += 1.15;
  } else {
    weight += 0.22;
  }

  if (total === 0) {
    weight += 0.9;
  } else {
    weight += Math.max(0, 0.86 - accuracy) * 4.4;
  }

  weight += stats.misses * 1.2;

  if (stats.hits >= 4 && accuracy >= 0.88 && bucket === "later") {
    weight *= 0.38;
  }

  if (state.focus === "weak") {
    weight *= touchesWeakEntry ? 2.15 : 0.45;
  }

  return Math.max(0.08, weight);
}

function pickAdaptive(items, mode, getId, getWeight, options = {}) {
  const { trackRotation = true, isRotationExempt = null } = options;
  if (!items.length) {
    return null;
  }

  let candidatePool = items;
  if (trackRotation && contentRotationModes.includes(mode)) {
    const seenIds = getRotationSeenIds(mode);
    const rotationPool = items.filter((item) => {
      const id = getId(item);
      return (typeof isRotationExempt === "function" && isRotationExempt(item)) || !seenIds.has(id);
    });

    if (rotationPool.length) {
      candidatePool = rotationPool;
    }
  }

  const recentIds = new Set(state.recent[mode]);
  const freshItems = candidatePool.filter((item) => !recentIds.has(getId(item)));
  const weightedPool =
    freshItems.length >= Math.min(4, candidatePool.length) ? freshItems : candidatePool;

  const weighted = weightedPool.map((item) => ({
    item,
    id: getId(item),
    weight: getWeight(item),
  }));

  const chosen = weightedSample(weighted);
  rememberRecent(mode, getId(chosen));
  if (trackRotation && markRotationSeen(mode, getId(chosen))) {
    saveProgress();
  }
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

  const voices = window.speechSynthesis.getVoices();
  const japaneseVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("ja"));
  window.speechSynthesis.cancel();

  for (let count = 0; count < Math.max(1, state.audioRepeat); count += 1) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = state.audioRate;
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}

function shuffle(list) {
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
}
