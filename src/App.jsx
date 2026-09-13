import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// CONFIGURAÇÃO
// ══════════════════════════════════════════════════════════════

// Cole aqui a URL do seu Google Apps Script (ver INSTRUCOES.md)
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwG3M1g48MIsbIU3IcshJlzv8_sHXYMH4PqQYXirr5SZY92nLjpVBSOaOlNbAKl-8Ll-A/exec";

// Chave compartilhada com o Apps Script. Barra envios automatizados.
// ⚠️ Precisa ser idêntica ao CONFIG.chaveEsperada do google-apps-script.gs
const CHAVE_QUIZ = "kg-2026-a7f3d91e";

// Instagram do escritório
const INSTAGRAM_URL = "https://www.instagram.com/arq.katiaguerreiro";

// ── Imagens das perguntas ──
// Arquivos em public/images/ no padrão: p{pergunta}-{estilo}.{ext}
// Ex.: p1-moderno.png
// O código tenta .png, depois .jpeg, depois .jpg — nessa ordem.
const IMG_EXTS = ["png", "jpeg", "jpg"];

const SLUG_PERFIL = {
  M: "moderno",
  C: "classico",
  I: "industrial",
  N: "natural",
  E: "ecletico",
  B: "brasileiro",
};

function imagePath(idPergunta, perfil, indiceExt) {
  const ext = IMG_EXTS[indiceExt || 0];
  return "/images/p" + idPergunta + "-" + SLUG_PERFIL[perfil] + "." + ext;
}

// ══════════════════════════════════════════════════════════════
// IDENTIDADE VISUAL — Katia Guerreiro Arquitetura
// ══════════════════════════════════════════════════════════════

const FONT = "'Red Hat Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Red+Hat+Display:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap";

const C = {
  bg: "#FCFCFC",        // branco off-white — cor principal
  card: "#FFFFFF",
  heading: "#53101D",   // vermelho terroso
  body: "#2F4148",      // azul profundo suavizado, para leitura
  muted: "#7C888C",
  accent: "#9A5B2B",    // caramelo queimado
  deep: "#103442",      // azul profundo
  olive: "#606237",     // verde oliva
  border: "#E3E1DE",
  hover: "#F6F3F0",
  error: "#A8544A",
};

// ══════════════════════════════════════════════════════════════
// PERFIS
// ══════════════════════════════════════════════════════════════

const PROFILES = {
  M: {
    name: "Moderno Essencial",
    subtitle: "Quando forma, função e calma encontram equilíbrio",
    color: "#103442",
  },
  C: {
    name: "Clássico Atemporal",
    subtitle: "A elegância que o tempo não apaga",
    color: "#53101D",
  },
  I: {
    name: "Industrial Urbano",
    subtitle: "A beleza crua do que é real",
    color: "#7A7D7E",
  },
  N: {
    name: "Contemporâneo Natural",
    subtitle: "A leveza de uma casa conectada ao presente e à natureza",
    color: "#606237",
  },
  E: {
    name: "Eclético Autoral",
    subtitle: "A casa que conta quem você é",
    color: "#9A5B2B",
  },
  B: {
    name: "Moderno Brasileiro",
    subtitle: "A modernidade com um jeito brasileiro de viver",
    color: "#6B4423",
  },
};

const ORDEM_PERFIS = ["M", "C", "I", "N", "E", "B"];

// ══════════════════════════════════════════════════════════════
// TEXTOS-ÂNCORA
// ══════════════════════════════════════════════════════════════

const ANCHOR_TEXTS = {
  M: [
    "Você se identifica com espaços em que cada elemento tem uma razão para existir. Seu olhar é atraído por linhas claras, proporções bem resolvidas, geometria e funcionalidade. Em vez de excesso de ornamentos, você prefere uma arquitetura que organize a vida e deixe o espaço respirar. O resultado não precisa ser frio: a sensação de conforto nasce justamente da ordem, da clareza e da escolha precisa do que permanece.",
    "Esse perfil nasce da tradição moderna e pode ganhar uma camada minimalista. Você valoriza móveis de desenho limpo, marcenaria precisa, superfícies contínuas e soluções inteligentes que escondem o que não precisa aparecer. Madeira, pedra, vidro e metal entram de forma controlada, acompanhados por uma paleta neutra e poucos contrastes. O foco está menos na decoração e mais na composição: volumes, luz, circulação e uso.",
    "Na prática, o Moderno Essencial traduz a ideia de \u201Cmenos, mas melhor\u201D: ambientes funcionais, visualmente organizados e sem elementos gratuitos. Ele pode se aproximar do minimalismo, da Bauhaus e do mid-century mais depurado, sempre preservando a lógica moderna de unir forma e função. Referências como Mies van der Rohe, John Pawson e, no Brasil, Marcio Kogan ajudam a traduzir esse universo de precisão e simplicidade intencional.",
  ],
  C: [
    "Você se identifica com uma elegância que atravessa o tempo. Seu olhar é atraído por proporção, simetria, detalhes arquitetônicos e materiais que envelhecem bem. Boiseries, molduras, mármores, madeiras trabalhadas, metais delicados e mobiliário de presença fazem sentido para você porque carregam tradição, cuidado e permanência — não porque pertencem a uma moda passageira.",
    "O Clássico Atemporal pode aparecer de maneiras diferentes. Em uma versão mais sofisticada, assume referências parisienses, neoclássicas e europeias; em uma leitura mais leve, aproxima-se do romântico e do provençal, com madeira clara, tecidos naturais, tons suaves e um ar mais acolhedor. Em todas elas existe um mesmo fio condutor: equilíbrio, qualidade de execução e respeito à história.",
    "Para você, sofisticação não significa excesso. Ela está na proporção correta, no material verdadeiro, na peça bem escolhida e na sensação de que o ambiente poderia continuar bonito daqui a muitos anos. Interiores parisienses, casas provençais reinterpretadas e projetos brasileiros que atualizam a tradição sem apagar sua memória dialogam diretamente com esse perfil.",
  ],
  I: [
    "Você tem algo que nem todo mundo possui: a capacidade de enxergar beleza no imperfeito, no bruto, no que foi deixado à mostra. Enquanto outros escondem a estrutura por trás de acabamentos, você quer vê-la — o tijolo aparente que conta a idade do prédio, o concreto que mostra as marcas da fôrma, o cano de cobre que vira elemento decorativo. Para você, a honestidade dos materiais é uma forma de estética.",
    "Seu espaço ideal tem amplitude e respiração: pé-direito alto, janelas generosas (de preferência com esquadrias de ferro), e aquela sensação de loft que dissolve as divisórias entre ambientes. A paleta é sóbria e urbana — preto, cinza-chumbo, cobre envelhecido e o calor pontual da madeira rústica que equilibra a frieza do metal. Você gosta de luminárias com personalidade: pendentes metálicos, filamentos expostos, trilhos aparentes que transformam a iluminação em escultura.",
    "O estilo industrial urbano carrega uma atitude: é despojado sem ser desleixado, ousado sem ser agressivo. Você provavelmente se sente mais vivo em cidades que pulsam — bairros que misturam galpões reformados com cafés de terceira onda, galerias de arte com oficinas mecânicas. Essa energia é o que você quer trazer para dentro de casa. Referências que traduzem esse universo incluem os lofts de Tribeca em Nova York, o trabalho do escritório SuperLimão em São Paulo e a estética crua e cheia de caráter dos espaços assinados por Axel Vervoordt.",
  ],
  N: [
    "Você se identifica com uma linguagem atual, leve e acolhedora, em que a arquitetura contemporânea se aproxima da natureza. Luz abundante, madeira, pedra, linho, fibras e acabamentos com textura criam ambientes que parecem respirar. Você gosta de espaços sofisticados sem rigidez, onde linhas limpas convivem com formas mais suaves e orgânicas.",
    "Seu espaço ideal valoriza a experiência sensorial: uma parede de cal, a trama de um tecido natural, a irregularidade de uma cerâmica artesanal, a madeira ao toque e uma iluminação quente que acolhe em vez de chamar atenção para si. A paleta nasce da paisagem — off-white, areia, verde-sálvia, terracota suave e tons lavados — e a composição tende a ser mais fluida do que rígida.",
    "Esse perfil se aproxima do contemporâneo orgânico, do coastal contemporâneo, do praiano sofisticado e de um boho muito editado — nunca caricato. O que une essas referências é a busca por conforto, naturalidade e uma estética atual, serena e tátil. A casa funciona como um refúgio contemporâneo: menos formal, mais sensorial e profundamente conectado à forma de viver de hoje.",
  ],
  E: [
    "Você se interessa por casas que parecem ter sido construídas ao longo do tempo. Em vez de seguir uma única linguagem, você combina épocas, culturas, arte, design e memória afetiva. Uma peça antiga pode conviver com fotografia contemporânea; um móvel herdado pode dividir espaço com uma poltrona de design; um objeto de viagem pode ser tão importante quanto uma obra de arte. O fio condutor não é uma regra estética: é a história de quem mora ali.",
    "Muitos ambientes ecléticos autorais partem de uma base clássica ou tradicional, justamente porque essa estrutura recebe bem peças de diferentes épocas. Mas o perfil não se limita ao clássico: pode incorporar modernismo, vintage, arte contemporânea, artesanato, objetos de viagem e elementos inesperados. Cor, textura e contraste aparecem com liberdade, desde que exista intenção e curadoria.",
    "O que diferencia o Eclético Autoral de uma simples mistura é a coerência. Cada peça pode pertencer a uma época diferente, mas todas fazem sentido dentro da mesma narrativa. É um estilo especialmente ligado à memória, à arte e à personalidade: a casa deixa de parecer montada de uma vez e passa a revelar camadas. Mais do que uma vitrine, ela se torna uma biografia visual.",
  ],
  B: [
    "Você se identifica com uma arquitetura moderna que ganhou uma expressão muito particular no Brasil: aberta, generosa, conectada ao clima, ao jardim e à convivência. Ambientes integrados, grandes vãos, varandas, pátios e transições suaves entre interior e exterior fazem parte desse modo de habitar. A casa não se fecha para a paisagem — ela se organiza a partir dela.",
    "Esse perfil valoriza materiais brasileiros e soluções que respondem ao clima: madeira, pedra, palha, cerâmica, cobogós, brises e elementos vazados. O mobiliário também tem papel importante, com forte diálogo com o design brasileiro de meados do século XX. A brasilidade aparece menos como tema decorativo e mais na relação entre matéria, luz, sombra, ventilação e maneira de viver.",
    "As referências passam pelo modernismo brasileiro e pelo design das décadas de 1950 a 1970, chegando às interpretações contemporâneas dessa tradição. Lina Bo Bardi, Zanine Caldas, Sergio Rodrigues e Joaquim Tenreiro ajudam a formar esse repertório. O resultado é uma casa moderna, calorosa e profundamente brasileira — sofisticada sem perder espontaneidade.",
  ],
};

// ══════════════════════════════════════════════════════════════
// PARÁGRAFOS DE INFLUÊNCIA
// ══════════════════════════════════════════════════════════════

const INFLUENCE_TEXTS = {
  M: "Existe também uma inclinação clara pela lógica moderna: formas simples, soluções funcionais e uma vontade de eliminar o que não tem função ou intenção. Essa influência atua como um filtro de clareza sobre o seu estilo principal. Na prática, aparece em marcenaria bem resolvida, linhas mais geométricas, superfícies limpas e escolhas que priorizam organização e uso. Mesmo quando o ambiente tem outras referências, essa camada moderna evita excessos e mantém a composição visualmente precisa.",
  C: "Além do seu perfil principal, existe uma camada de tradição e permanência. Você tende a se aproximar de proporções clássicas, detalhes arquitetônicos, materiais nobres e peças que parecem ter história. Essa influência pode surgir de forma mais sofisticada, com boiseries, mármore e mobiliário de presença, ou mais leve e provençal, com tons claros, madeira e tecidos naturais. Em ambos os casos, ela acrescenta elegância e uma sensação de continuidade ao ambiente.",
  I: "Por baixo do seu estilo principal, pulsa uma energia urbana que pede expressão. Você é atraído pela honestidade dos materiais em estado bruto — o concreto que não se esconde, o metal que envelhece com dignidade, a estrutura que vira ornamento. Essa influência industrial aparece como um contraponto de atitude no seu espaço: pode ser uma luminária de filamento exposto que quebra a suavidade de um ambiente, uma estante em estrutura metálica preta que adiciona geometria, ou a escolha de manter um elemento estrutural à mostra onde outros o esconderiam. Essa camada traz ao seu perfil principal uma dose de ousadia e autenticidade crua que impede o espaço de parecer previsível ou decorado demais.",
  N: "Seu estilo principal ganha uma camada mais leve e sensorial quando aparece a influência Contemporânea Natural. Você tende a buscar madeira, pedra, fibras, tecidos naturais, formas suaves e uma presença maior de luz e paisagem. Essa influência aproxima o ambiente do contemporâneo orgânico, do coastal e de um boho sofisticado e editado. O resultado é uma casa menos rígida, mais tátil e acolhedora, sem abrir mão de uma linguagem atual.",
  E: "Junto ao seu perfil principal, existe uma força criativa que se recusa a seguir uma única receita. Você sente a necessidade de imprimir personalidade, de incluir peças que tenham história ou que surpreendam, de quebrar a homogeneidade com um elemento inesperado que só você teria escolhido. Essa influência eclética aparece como tempero: pode ser uma obra de arte que desafia o tom geral do ambiente, uma cadeira de design autoral que não \u201Ccombina\u201D com a mesa mas funciona perfeitamente, ou um objeto de viagem que se torna peça central da conversa quando alguém visita sua casa. Essa camada de autoria impede que seu espaço pareça saído de um catálogo — e garante que qualquer pessoa que entre saiba imediatamente que ali mora alguém com opiniões.",
  B: "Existe ainda uma influência moderna brasileira que torna o seu estilo principal mais aberto, caloroso e conectado ao clima. Ela aparece na integração com varandas e jardins, nos grandes vãos, nas linhas retas, nos cobogós, nos panos de vidro, no cimento queimado, nas cerâmicas terracotas, na madeira e no artesanato, além da presença de peças do design brasileiro. Mais do que a estética, é a forma de organizar a casa para a luz, a ventilação e a convivência — uma brasilidade construída pela arquitetura moderna.",
};

// ══════════════════════════════════════════════════════════════
// PERGUNTAS
// ══════════════════════════════════════════════════════════════

const QUESTIONS = [
  {
    id: 1, weight: 3, block: 1, blockName: "Primeira Impressão",
    text: "Qual destes ambientes faz você querer entrar e ficar?",
    note: "Escolha o que mais te atrai instintivamente.",
    hasImages: true,
    options: [
      { profile: "M", text: "Living de linhas geométricas, mobiliário baixo, marcenaria precisa e poucos objetos decorativos" },
      { profile: "C", text: "Estar com boiserie, proporções clássicas, lustre delicado e mobiliário elegante — podendo ter uma leitura francesa ou provençal" },
      { profile: "I", text: "Loft com tijolo aparente, luminária metálica, sofá de couro surrado" },
      { profile: "N", text: "Ambiente contemporâneo com madeira clara, pedra natural, linho, formas orgânicas e luz suave" },
      { profile: "E", text: "Tapete persa com arte contemporânea, móveis de épocas diferentes" },
      { profile: "B", text: "Casa moderna brasileira integrada ao jardim, com madeira, pedra, cobogó e mobiliário de design nacional" },
    ],
  },
  {
    id: 2, weight: 2, block: 1, blockName: "Primeira Impressão",
    text: "Se sua casa fosse um destino, qual destes lugares você escolheria?",
    note: "Pense no lugar onde você se sentiria em casa.",
    hasImages: true,
    options: [
      { profile: "M", text: "Uma casa modernista de linhas puras em Palm Springs" },
      { profile: "C", text: "Uma casa histórica francesa, entre Paris e a Provença" },
      { profile: "I", text: "Um loft em Brooklyn" },
      { profile: "N", text: "Uma casa na costa portuguesa" },
      { profile: "E", text: "Um riad em Marrakech" },
      { profile: "B", text: "Uma casa modernista no Rio de Janeiro integrada à paisagem" },
    ],
  },
  {
    id: 3, weight: 2, block: 2, blockName: "Estilo de Vida",
    text: "Como você prefere receber pessoas em casa?",
    note: "Pense na última vez que recebeu alguém e gostou.",
    options: [
      { profile: "C", text: "Um jantar íntimo com mesa posta e velas" },
      { profile: "B", text: "Um almoço longo entre varanda, cozinha e jardim, com os ambientes totalmente conectados" },
      { profile: "I", text: "Drinks com boa música e iluminação baixa" },
      { profile: "N", text: "Um encontro tranquilo em um ambiente claro, confortável e cercado de materiais naturais" },
      { profile: "E", text: "Cada vez é diferente — depende do meu humor" },
      { profile: "M", text: "Prefiro encontros pequenos e sem muita produção" },
    ],
  },
  {
    id: 4, weight: 2, block: 2, blockName: "Estilo de Vida",
    text: "O que mais te incomoda num ambiente?",
    note: "Às vezes sabemos melhor o que não gostamos.",
    options: [
      { profile: "M", text: "Excesso de objetos e informação visual" },
      { profile: "E", text: "Falta de personalidade, tudo genérico" },
      { profile: "N", text: "Ambientes artificiais, frios e sem textura ou conexão com a natureza" },
      { profile: "C", text: "Falta de sofisticação, acabamentos pobres" },
      { profile: "I", text: "Ambientes fechados e sem amplitude" },
      { profile: "B", text: "Casas fechadas para o exterior, sem ventilação, paisagem ou identidade brasileira" },
    ],
  },
  {
    id: 5, weight: 2, block: 3, blockName: "Preferências Estéticas",
    text: "Qual paleta de cores te atrai mais?",
    note: "Não pense demais — vá pela sua primeira reação.",
    hasImages: true,
    options: [
      { profile: "M", text: "Branco quente, cinza, bege e pequenos contrastes em preto ou madeira" },
      { profile: "C", text: "Azul-marinho, dourado e bordô" },
      { profile: "I", text: "Preto, cinza-chumbo e cobre" },
      { profile: "N", text: "Off-white, areia, verde-sálvia e terracota suave" },
      { profile: "E", text: "Mix vibrante — mostarda, terracota, azul e rosa" },
      { profile: "B", text: "Tons de terra, madeira natural, verde-folha e pontos de cor inspirados na paisagem brasileira" },
    ],
  },
  {
    id: 6, weight: 2, block: 3, blockName: "Preferências Estéticas",
    text: "Qual material te transmite mais conforto?",
    note: "Imagine o toque, a textura, a sensação.",
    hasImages: true,
    options: [
      { profile: "M", text: "Madeira lisa, pedra uniforme, vidro e metal em acabamentos precisos" },
      { profile: "C", text: "Mármore e veludo" },
      { profile: "I", text: "Concreto e aço" },
      { profile: "N", text: "Madeira e linho" },
      { profile: "E", text: "Não tenho um favorito — gosto de misturar" },
      { profile: "B", text: "Madeiras brasileiras, pedra, palha e cerâmica artesanal" },
    ],
  },
  {
    id: 7, weight: 2, block: 3, blockName: "Preferências Estéticas",
    text: "Que tipo de iluminação você imagina para seu espaço ideal?",
    note: "A luz muda completamente um ambiente.",
    hasImages: true,
    options: [
      { profile: "M", text: "Iluminação arquitetônica discreta, integrada ao espaço e sem excessos decorativos" },
      { profile: "C", text: "Lustres e arandelas que são peças de decoração por si só" },
      { profile: "I", text: "Pendentes metálicos e trilhos aparentes" },
      { profile: "N", text: "Luz natural suave, filtrada por cortinas leves, complementada por iluminação quente e indireta" },
      { profile: "E", text: "Luminárias de design, cada uma diferente da outra" },
      { profile: "B", text: "Luz natural abundante, com grandes aberturas, brises, cobogós e relação direta com o exterior" },
    ],
  },
  {
    id: 8, weight: 3, block: 4, blockName: "O Espaço dos Sonhos",
    text: "Qual elemento você considera indispensável na sua casa?",
    note: "Se só pudesse ter um, qual seria?",
    options: [
      { profile: "M", text: "Um sistema de organização onde tudo tem seu lugar" },
      { profile: "C", text: "Uma peça de mobiliário ou arte que seja ponto focal" },
      { profile: "I", text: "Pé-direito alto e espaços amplos integrados" },
      { profile: "N", text: "Materiais naturais, boa luz e uma vista ou conexão constante com o verde" },
      { profile: "E", text: "Uma parede ou estante que conte minha história" },
      { profile: "B", text: "Uma varanda, pátio ou jardim plenamente integrado aos ambientes internos" },
    ],
  },
  {
    id: 9, weight: 2, block: 4, blockName: "O Espaço dos Sonhos",
    text: "Se pudesse redesenhar um cômodo agora, qual seria?",
    note: "O cômodo que você mais gostaria de transformar.",
    options: [
      { profile: "M", text: "O closet ou área de organização pessoal" },
      { profile: "C", text: "A sala de estar ou jantar formal" },
      { profile: "I", text: "A cozinha como espaço social e funcional" },
      { profile: "N", text: "O quarto como refúgio de descanso" },
      { profile: "E", text: "O home office ou ateliê criativo" },
      { profile: "B", text: "A área gourmet ou espaço de convivência" },
    ],
  },
  {
    id: 10, weight: 2, block: 4, blockName: "O Espaço dos Sonhos",
    text: "Qual destes detalhes te encanta mais?",
    note: "O detalhe que faria você parar e admirar.",
    hasImages: true,
    options: [
      { profile: "M", text: "Uma porta de correr embutida que desaparece na parede" },
      { profile: "C", text: "Um rodapé alto com moldura trabalhada" },
      { profile: "I", text: "Uma escada metálica com degraus flutuantes" },
      { profile: "N", text: "Uma parede de cal, pedra natural ou elemento de forma orgânica e textura tátil" },
      { profile: "E", text: "Azulejos artesanais pintados à mão" },
      { profile: "B", text: "Um cobogó com luz natural passando" },
    ],
  },
  {
    id: 11, weight: 2, block: 5, blockName: "Sua Essência",
    text: "Qual frase mais combina com você?",
    note: "A que ressoa mais fundo.",
    options: [
      { profile: "M", text: "\u201CForma e função devem caminhar juntas.\u201D" },
      { profile: "C", text: "\u201CElegância nunca sai de moda.\u201D" },
      { profile: "I", text: "\u201CAs regras existem para serem quebradas.\u201D" },
      { profile: "N", text: "\u201CLeveza, textura e natureza fazem uma casa acolher.\u201D" },
      { profile: "E", text: "\u201CMinha casa conta quem eu sou.\u201D" },
      { profile: "B", text: "\u201CA melhor casa é aquela que vive junto com a paisagem.\u201D" },
    ],
  },
  {
    id: 12, weight: 3, block: 5, blockName: "Sua Essência",
    text: "Em uma palavra, como você quer se sentir ao entrar na sua casa?",
    note: "A sensação mais importante de todas.",
    options: [
      { profile: "M", text: "Serena(o)" },
      { profile: "C", text: "Sofisticada(o)" },
      { profile: "I", text: "Livre" },
      { profile: "N", text: "Conectada(o)" },
      { profile: "E", text: "Inspirada(o)" },
      { profile: "B", text: "Acolhida(o)" },
    ],
  },
];

const PLANO_OPTIONS = [
  "Sim, muito em breve",
  "Sim, nos próximos 6 meses",
  "Sim, no próximo ano",
  "Estou apenas me inspirando",
];

const PROJETO_OPTIONS = [
  "Interior para novo apartamento",
  "Interior para nova casa",
  "Reforma de apartamento",
  "Reforma de casa",
  "Construção de casa",
];

// ══════════════════════════════════════════════════════════════
// LÓGICA DE PONTUAÇÃO
// ══════════════════════════════════════════════════════════════

function calculateResult(answers) {
  const scores = { M: 0, C: 0, I: 0, N: 0, E: 0, B: 0 };
  const highWeight = { M: 0, C: 0, I: 0, N: 0, E: 0, B: 0 };

  answers.forEach((profile, idx) => {
    const q = QUESTIONS[idx];
    scores[profile] += q.weight;
    if (q.weight === 3) highWeight[profile] += 3;
  });

  const q12 = answers[11];

  const sorted = Object.entries(scores).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    if (highWeight[b[0]] !== highWeight[a[0]]) return highWeight[b[0]] - highWeight[a[0]];
    if (a[0] === q12) return -1;
    if (b[0] === q12) return 1;
    return 0;
  });

  const primary = sorted[0][0];
  const secondary = sorted[1][0];
  const isHybrid = sorted[0][1] - sorted[1][1] <= 2;

  return {
    primary, secondary, isHybrid, scores,
    primaryScore: sorted[0][1],
    secondaryScore: sorted[1][1],
  };
}

function getConnectionPhrase(primary, secondary, isHybrid) {
  const p = PROFILES[primary].name;
  const s = PROFILES[secondary].name;
  if (isHybrid) {
    return "Você transita com naturalidade entre o " + p + " e o " + s +
      " — dois universos que se complementam e revelam a riqueza do seu olhar.";
  }
  return "Seu estilo é " + p + ", com uma influência " + s +
    " que adiciona uma camada única à sua forma de habitar.";
}

// ══════════════════════════════════════════════════════════════
// VALIDAÇÕES
// ══════════════════════════════════════════════════════════════

// DDDs válidos no Brasil (99 é intencionalmente excluído)
const DDDS_VALIDOS = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98,
];

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

function isNameValid(nome) {
  const t = nome.trim();
  return t.length >= 3 && t.includes(" ");
}

function isEmailValid(email) {
  const t = email.trim();
  if (!t) return false;
  if (t.includes("..")) return false;
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(t);
}

function formatPhone(value) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return "(" + d;
  if (d.length <= 7) return "(" + d.slice(0, 2) + ") " + d.slice(2);
  return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
}

function isPhoneValid(phone) {
  const d = onlyDigits(phone);
  if (d.length !== 11) return false;
  const ddd = parseInt(d.slice(0, 2), 10);
  if (!DDDS_VALIDOS.includes(ddd)) return false;
  const numero = d.slice(2);
  if (numero[0] !== "9") return false;
  if (/^(\d)\1{8}$/.test(numero)) return false;
  return true;
}

function getPhoneError(phone) {
  const d = onlyDigits(phone);
  if (d.length === 0) return "";
  if (d.length < 11) return "Informe o DDD e os 9 dígitos do celular.";
  const ddd = parseInt(d.slice(0, 2), 10);
  if (!DDDS_VALIDOS.includes(ddd)) return "DDD inválido.";
  const numero = d.slice(2);
  if (numero[0] !== "9") return "O celular deve começar com 9 após o DDD.";
  if (/^(\d)\1{8}$/.test(numero)) return "Número inválido.";
  return "";
}

function isCityValid(cidade) {
  return cidade.trim().length >= 3;
}

// ══════════════════════════════════════════════════════════════
// ÍCONES DOS PERFIS
// ══════════════════════════════════════════════════════════════

function ProfileIcon({ code, size = 80 }) {
  const color = PROFILES[code].color;

  const icons = {
    // Moderno Essencial — linhas horizontais, geometria e ordem
    M: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="28" width="52" height="2" fill={color} />
        <rect x="14" y="39" width="34" height="2" fill={color} opacity="0.6" />
        <rect x="14" y="50" width="44" height="2" fill={color} opacity="0.35" />
      </svg>
    ),
    // Clássico Atemporal — círculos concêntricos, simetria e proporção
    C: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="24" stroke={color} strokeWidth="1.5" />
        <circle cx="40" cy="40" r="15" stroke={color} strokeWidth="1" opacity="0.6" />
        <circle cx="40" cy="40" r="5" fill={color} opacity="0.4" />
      </svg>
    ),
    // Industrial Urbano — estrutura metálica aparente
    I: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="58" x2="34" y2="22" stroke={color} strokeWidth="2" />
        <line x1="34" y1="22" x2="48" y2="58" stroke={color} strokeWidth="2" />
        <line x1="45" y1="58" x2="59" y2="27" stroke={color} strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    // Contemporâneo Natural — folha e forma orgânica
    N: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 54 C40 54 25 40 25 30 C25 20 35 15 40 25 C45 15 55 20 55 30 C55 40 40 54 40 54Z" stroke={color} strokeWidth="1.5" />
        <line x1="40" y1="54" x2="40" y2="66" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    // Eclético Autoral — composição de peças de origens distintas
    E: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="16" width="19" height="19" fill={color} opacity="0.3" rx="2" />
        <rect x="43" y="22" width="15" height="15" fill={color} opacity="0.5" rx="2" transform="rotate(15 50 29)" />
        <circle cx="32" cy="54" r="10" stroke={color} strokeWidth="1.5" />
        <rect x="49" y="45" width="17" height="17" fill={color} opacity="0.2" rx="2" />
      </svg>
    ),
    // Moderno Brasileiro — cobogó, luz e sombra
    B: (
      <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="17" y="17" width="21" height="21" stroke={color} strokeWidth="1.5" />
        <circle cx="27.5" cy="27.5" r="6" fill={color} opacity="0.28" />
        <rect x="42" y="17" width="21" height="21" stroke={color} strokeWidth="1.5" opacity="0.55" />
        <circle cx="52.5" cy="27.5" r="6" fill={color} opacity="0.16" />
        <rect x="17" y="42" width="21" height="21" stroke={color} strokeWidth="1.5" opacity="0.55" />
        <circle cx="27.5" cy="52.5" r="6" fill={color} opacity="0.16" />
        <rect x="42" y="42" width="21" height="21" stroke={color} strokeWidth="1.5" />
        <circle cx="52.5" cy="52.5" r="6" fill={color} opacity="0.28" />
      </svg>
    ),
  };

  return icons[code] || null;
}

// ══════════════════════════════════════════════════════════════
// TELA 1 — BOAS-VINDAS
// ══════════════════════════════════════════════════════════════

function WelcomeScreen({ onStart }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "center", padding: "40px 24px",
      background: C.bg, opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
    }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <p style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 500, letterSpacing: "0.24em",
          textTransform: "uppercase", color: C.muted, marginBottom: 32,
        }}>Katia Guerreiro Arquitetura</p>

        <h1 style={{
          fontFamily: FONT, fontSize: 42, fontWeight: 400,
          lineHeight: 1.15, color: C.heading, margin: "0 0 18px 0",
          letterSpacing: "-0.015em",
        }}>Descubra Seu Estilo</h1>

        <div style={{ width: 56, height: 1, background: C.accent, margin: "0 auto 26px" }} />

        <p style={{
          fontFamily: FONT, fontSize: 17, fontWeight: 300, lineHeight: 1.7,
          color: C.body, marginBottom: 46,
        }}>
          Doze perguntas para revelar o estilo arquitetônico que traduz quem você é.
          Não existe resposta certa — apenas a sua.
        </p>

        <button onClick={onStart} style={{
          fontFamily: FONT, fontSize: 14, fontWeight: 500, letterSpacing: "0.14em",
          textTransform: "uppercase", padding: "17px 48px",
          background: C.heading, color: C.bg, border: "none",
          cursor: "pointer", transition: "opacity 0.3s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.86"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >Começar</button>

        <p style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 300,
          color: C.muted, marginTop: 24,
        }}>Tempo estimado: 3 minutos</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TELA 2 — PERGUNTAS
// ══════════════════════════════════════════════════════════════

function QuestionScreen({ question, index, total, onAnswer, onBack }) {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    setSelected(null);
    setExiting(false);
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, [index]);

  const handleSelect = (profile) => {
    if (selected) return;
    setSelected(profile);
    setExiting(true);
    setTimeout(() => onAnswer(profile), 450);
  };

  const progress = (index / total) * 100;
  const isVisible = visible && !exiting;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: C.bg,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.45s ease",
    }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, background: C.border }}>
        <div style={{
          height: 3, background: C.accent,
          width: progress + "%", transition: "width 0.5s ease",
        }} />
      </div>

      <div style={{
        padding: "24px 24px 0", display: "flex",
        justifyContent: "space-between", alignItems: "center",
      }}>
        {index > 0 ? (
          <button onClick={onBack} style={{
            fontFamily: FONT, fontSize: 14, fontWeight: 400, color: C.muted,
            background: "none", border: "none", cursor: "pointer", padding: "8px 0",
          }}>&larr; Voltar</button>
        ) : <div />}
        <span style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 500, letterSpacing: "0.14em",
          color: C.muted, textTransform: "uppercase",
        }}>{index + 1} / {total}</span>
      </div>

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "40px 24px",
        maxWidth: 660, width: "100%", margin: "0 auto",
      }}>
        <p style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.2em",
          textTransform: "uppercase", color: C.accent, marginBottom: 14,
        }}>{question.blockName}</p>

        <h2 style={{
          fontFamily: FONT, fontSize: 27, fontWeight: 400,
          lineHeight: 1.3, color: C.heading, margin: "0 0 10px 0",
          letterSpacing: "-0.01em",
        }}>{question.text}</h2>

        <p style={{
          fontFamily: FONT, fontSize: 15, fontWeight: 300,
          color: C.muted, marginBottom: 28,
        }}>{question.note}</p>

        {question.hasImages ? (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12,
          }}>
            {question.options.map((opt) => {
              const isSelected = selected === opt.profile;
              const isFaded = selected !== null && !isSelected;
              return (
                <button
                  key={question.id + "-" + opt.profile}
                  onClick={() => handleSelect(opt.profile)}
                  aria-label={opt.text}
                  title={opt.text}
                  style={{
                    padding: 0,
                    border: "2px solid " + (isSelected ? C.heading : "transparent"),
                    background: C.border, cursor: "pointer",
                    position: "relative", overflow: "hidden",
                    lineHeight: 0, aspectRatio: "4 / 3",
                    opacity: isFaded ? 0.35 : 1,
                    transition: "opacity 0.25s ease, border-color 0.2s ease",
                    WebkitTapHighlightColor: "transparent",
                  }}
                  onMouseEnter={e => {
                    if (!selected) e.currentTarget.style.borderColor = C.accent;
                  }}
                  onMouseLeave={e => {
                    if (!selected) e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  <img
                    src={imagePath(question.id, opt.profile, 0)}
                    alt=""
                    loading={question.id === 1 ? "eager" : "lazy"}
                    onError={e => {
                      const img = e.currentTarget;
                      const tentativa = Number(img.dataset.tentativa || 0) + 1;
                      if (tentativa < IMG_EXTS.length) {
                        img.dataset.tentativa = String(tentativa);
                        img.src = imagePath(question.id, opt.profile, tentativa);
                      }
                    }}
                    style={{
                      width: "100%", height: "100%",
                      objectFit: "cover", display: "block",
                    }}
                  />
                  {isSelected && (
                    <span style={{
                      position: "absolute", inset: 0,
                      background: "rgba(83,16,29,0.38)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                        stroke="#FCFCFC" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="4 12.5 9.5 18 20 6.5" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {question.options.map((opt) => {
              const isSelected = selected === opt.profile;
              const isFaded = selected !== null && !isSelected;
              return (
                <button
                  key={question.id + "-" + opt.profile}
                  onClick={() => handleSelect(opt.profile)}
                  style={{
                    fontFamily: FONT, fontSize: 15.5, fontWeight: 400, lineHeight: 1.55,
                    textAlign: "left", padding: "16px 20px",
                    background: isSelected ? C.heading : C.card,
                    color: isSelected ? C.bg : C.body,
                    border: "1px solid " + (isSelected ? C.heading : C.border),
                    cursor: "pointer", transition: "all 0.25s ease",
                    opacity: isFaded ? 0.4 : 1,
                  }}
                  onMouseEnter={e => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = C.accent;
                      e.currentTarget.style.background = C.hover;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!selected) {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.background = C.card;
                    }
                  }}
                >{opt.text}</button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TELA 3 — CAPTURA DE DADOS E QUALIFICAÇÃO
// ══════════════════════════════════════════════════════════════

function LeadCaptureScreen({ onSubmit, sending }) {
  const [visible, setVisible] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [plano, setPlano] = useState("");
  const [projeto, setProjeto] = useState("");
  const [cidade, setCidade] = useState("");
  const [consent, setConsent] = useState(true);

  const [touched, setTouched] = useState({
    nome: false, email: false, telefone: false, cidade: false,
  });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const nomeOk = isNameValid(nome);
  const emailOk = isEmailValid(email);
  const telefoneOk = isPhoneValid(telefone);
  const cidadeOk = isCityValid(cidade);
  const planoOk = plano !== "";
  const projetoOk = projeto !== "";

  const formValid = nomeOk && emailOk && telefoneOk && cidadeOk && planoOk && projetoOk;

  const handleSubmit = () => {
    if (!formValid || sending) return;
    onSubmit({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone,
      cidade: cidade.trim(),
      plano,
      projeto,
      consent,
    });
  };

  const inputStyle = (ok, isTouched) => ({
    fontFamily: FONT, fontSize: 16, fontWeight: 400, width: "100%",
    padding: "13px 16px",
    border: "1px solid " + (isTouched && !ok ? C.error : C.border),
    background: C.card, color: C.body, outline: "none",
    transition: "border-color 0.2s ease",
  });

  const labelStyle = {
    fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
    textTransform: "uppercase", color: C.muted,
    display: "block", marginBottom: 9,
  };

  const errorStyle = {
    fontFamily: FONT, fontSize: 13, fontWeight: 400, color: C.error, marginTop: 6,
  };

  const chipStyle = (active) => ({
    fontFamily: FONT, fontSize: 15, fontWeight: 400, lineHeight: 1.45,
    textAlign: "left", padding: "12px 16px", width: "100%",
    background: active ? C.heading : C.card,
    color: active ? C.bg : C.body,
    border: "1px solid " + (active ? C.heading : C.border),
    cursor: "pointer", transition: "all 0.2s ease",
  });

  return (
    <div style={{
      minHeight: "100vh", padding: "48px 24px 64px", background: C.bg,
      opacity: visible ? 1 : 0, transition: "opacity 0.7s ease",
    }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 10, background: C.border }}>
        <div style={{ height: 3, background: C.accent, width: "100%" }} />
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em",
            textTransform: "uppercase", color: C.accent, marginBottom: 15,
          }}>Última etapa</p>

          <h1 style={{
            fontFamily: FONT, fontSize: 32, fontWeight: 400,
            lineHeight: 1.2, color: C.heading, margin: "0 0 14px 0",
            letterSpacing: "-0.015em",
          }}>Seu resultado está pronto</h1>

          <div style={{ width: 48, height: 1, background: C.accent, margin: "0 auto 20px" }} />

          <p style={{
            fontFamily: FONT, fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: C.body,
          }}>
            Preencha os campos abaixo para ver o seu perfil completo e receber
            referências visuais selecionadas para o seu estilo.
          </p>
        </div>

        {/* ── CONTATO ── */}
        <div style={{ marginBottom: 26 }}>
          <label style={labelStyle}>Nome completo</label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, nome: true }))}
            placeholder="Como podemos te chamar?"
            style={inputStyle(nomeOk, touched.nome)}
          />
          {touched.nome && !nomeOk && nome.length > 0 && (
            <p style={errorStyle}>Informe nome e sobrenome.</p>
          )}
        </div>

        <div style={{ marginBottom: 26 }}>
          <label style={labelStyle}>E-mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, email: true }))}
            placeholder="seunome@email.com"
            style={inputStyle(emailOk, touched.email)}
          />
          {touched.email && !emailOk && email.length > 0 && (
            <p style={errorStyle}>Informe um e-mail válido.</p>
          )}
        </div>

        <div style={{ marginBottom: 26 }}>
          <label style={labelStyle}>WhatsApp</label>
          <input
            type="tel"
            value={telefone}
            onChange={e => setTelefone(formatPhone(e.target.value))}
            onBlur={() => setTouched(t => ({ ...t, telefone: true }))}
            placeholder="(11) 99999-9999"
            maxLength={15}
            style={inputStyle(telefoneOk, touched.telefone)}
          />
          {touched.telefone && !telefoneOk && telefone.length > 0 && (
            <p style={errorStyle}>{getPhoneError(telefone)}</p>
          )}
        </div>

        {/* ── QUALIFICAÇÃO ── */}
        <div style={{
          borderTop: "1px solid " + C.border, paddingTop: 30, marginBottom: 28,
        }}>
          <label style={{ ...labelStyle, marginBottom: 14 }}>
            Você tem planos de reformar ou construir?
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PLANO_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setPlano(opt)}
                style={chipStyle(plano === opt)}
                onMouseEnter={e => { if (plano !== opt) e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { if (plano !== opt) e.currentTarget.style.borderColor = C.border; }}
              >{opt}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ ...labelStyle, marginBottom: 14 }}>
            Que tipo de projeto te interessa?
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {PROJETO_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setProjeto(opt)}
                style={chipStyle(projeto === opt)}
                onMouseEnter={e => { if (projeto !== opt) e.currentTarget.style.borderColor = C.accent; }}
                onMouseLeave={e => { if (projeto !== opt) e.currentTarget.style.borderColor = C.border; }}
              >{opt}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 34 }}>
          <label style={labelStyle}>Cidade / Estado</label>
          <input
            type="text"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, cidade: true }))}
            placeholder="Ex.: São Paulo / SP"
            style={inputStyle(cidadeOk, touched.cidade)}
          />
          {touched.cidade && !cidadeOk && cidade.length > 0 && (
            <p style={errorStyle}>Informe sua cidade e estado.</p>
          )}
        </div>

        {/* ── BOTÃO ── */}
        <button
          onClick={handleSubmit}
          disabled={!formValid || sending}
          style={{
            fontFamily: FONT, fontSize: 14, fontWeight: 500, letterSpacing: "0.14em",
            textTransform: "uppercase", width: "100%", padding: "17px 24px",
            background: formValid && !sending ? C.heading : C.border,
            color: formValid && !sending ? C.bg : C.muted,
            border: "none",
            cursor: formValid && !sending ? "pointer" : "not-allowed",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => { if (formValid && !sending) e.currentTarget.style.opacity = "0.86"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >{sending ? "Enviando..." : "Descobrir meu estilo"}</button>

        {/* ── CONSENTIMENTO ── */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 18 }}>
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
            style={{
              marginTop: 3, width: 16, height: 16,
              accentColor: C.heading, cursor: "pointer", flexShrink: 0,
            }}
          />
          <label htmlFor="consent" style={{
            fontFamily: FONT, fontSize: 13.5, fontWeight: 300, lineHeight: 1.65,
            color: C.muted, cursor: "pointer",
          }}>
            Autorizo o escritório Katia Guerreiro Arquitetura a entrar em contato comigo
            por e-mail ou WhatsApp para compartilhar referências e possibilidades de
            projeto alinhadas ao meu perfil.
          </label>
        </div>

        {!formValid && (
          <p style={{
            fontFamily: FONT, fontSize: 13, fontWeight: 300, color: C.muted,
            textAlign: "center", marginTop: 20,
          }}>Preencha todos os campos para continuar.</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// COMPARTILHAR O QUIZ
// ══════════════════════════════════════════════════════════════

function CompartilharQuiz() {
  const [copiado, setCopiado] = useState(false);

  const link = typeof window !== "undefined"
    ? window.location.origin + window.location.pathname
    : "";

  const textoConvite = "Descobri meu estilo arquitetônico neste quiz do escritório Katia Guerreiro. Faça o seu:";

  const copiarLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link);
      } else {
        const campo = document.createElement("textarea");
        campo.value = link;
        campo.style.position = "fixed";
        campo.style.opacity = "0";
        document.body.appendChild(campo);
        campo.select();
        document.execCommand("copy");
        document.body.removeChild(campo);
      }
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2600);
    } catch (err) {
      console.error("Não foi possível copiar o link:", err);
    }
  };

  const compartilharNativo = async () => {
    try {
      await navigator.share({
        title: "Descubra Seu Estilo | KG Arquitetura",
        text: textoConvite,
        url: link,
      });
    } catch (err) {
      // A pessoa fechou o menu de compartilhamento
    }
  };

  const temShareNativo = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div style={{
      marginTop: 24, padding: "28px 28px 30px 28px",
      border: "1px solid " + C.border, textAlign: "center",
    }}>
      <p style={{
        fontFamily: FONT, fontSize: 18, fontWeight: 400, lineHeight: 1.4,
        color: C.heading, marginBottom: 10,
      }}>Conhece alguém que ia gostar disso?</p>

      <p style={{
        fontFamily: FONT, fontSize: 14.5, fontWeight: 300, color: C.muted,
        lineHeight: 1.7, marginBottom: 22,
      }}>
        Envie o quiz para alguém descobrir o próprio estilo.
      </p>

      <div style={{
        display: "flex", gap: 8, alignItems: "stretch",
        maxWidth: 420, margin: "0 auto",
      }}>
        <div style={{
          flex: 1, minWidth: 0, display: "flex", alignItems: "center",
          padding: "0 14px", background: C.card,
          border: "1px solid " + C.border,
          fontFamily: FONT, fontSize: 13.5, fontWeight: 400, color: C.muted,
          overflow: "hidden", whiteSpace: "nowrap",
          textOverflow: "ellipsis", minHeight: 48,
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{link}</span>
        </div>

        <button
          onClick={copiarLink}
          aria-label="Copiar link do quiz"
          style={{
            flexShrink: 0, minWidth: 108, minHeight: 48,
            fontFamily: FONT, fontSize: 12.5, fontWeight: 500, letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: copiado ? C.accent : C.heading,
            color: C.bg, border: "none", cursor: "pointer",
            transition: "background 0.3s ease",
          }}
        >{copiado ? "Copiado" : "Copiar"}</button>
      </div>

      {temShareNativo && (
        <button
          onClick={compartilharNativo}
          style={{
            marginTop: 12, width: "100%", maxWidth: 420, minHeight: 48,
            fontFamily: FONT, fontSize: 13, fontWeight: 500, letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: "transparent", color: C.heading,
            border: "1px solid " + C.heading, cursor: "pointer",
            transition: "opacity 0.3s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.7"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >Compartilhar</button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TELA 4 — RESULTADO
// ══════════════════════════════════════════════════════════════

function ResultScreen({ result, lead }) {
  const [visible, setVisible] = useState(false);
  const [showInfluence, setShowInfluence] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 200);
    const t2 = setTimeout(() => setShowInfluence(true), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const primary = PROFILES[result.primary];
  const secondary = PROFILES[result.secondary];
  const anchors = ANCHOR_TEXTS[result.primary];
  const influence = INFLUENCE_TEXTS[result.secondary];
  const connection = getConnectionPhrase(result.primary, result.secondary, result.isHybrid);

  const firstName = lead && lead.nome ? lead.nome.split(" ")[0] : "";
  const consentiu = lead ? lead.consent === true : true;

  return (
    <div style={{
      minHeight: "100vh", padding: "60px 24px 80px", background: C.bg,
      opacity: visible ? 1 : 0, transition: "opacity 1s ease",
    }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>

        <p style={{
          fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em",
          textTransform: "uppercase", color: C.muted,
          textAlign: "center", marginBottom: 28,
        }}>{firstName ? firstName + ", seu resultado" : "Seu resultado"}</p>

        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <ProfileIcon code={result.primary} size={88} />
        </div>

        <h1 style={{
          fontFamily: FONT, fontSize: 34, fontWeight: 400,
          lineHeight: 1.2, color: C.heading,
          textAlign: "center", margin: "0 0 10px 0",
          letterSpacing: "-0.015em",
        }}>{primary.name}</h1>

        <p style={{
          fontFamily: FONT, fontSize: 16.5, fontWeight: 400, lineHeight: 1.45,
          color: primary.color, textAlign: "center", marginBottom: 30,
        }}>{primary.subtitle}</p>

        <div style={{ width: 56, height: 1, background: C.accent, margin: "0 auto 30px" }} />

        <p style={{
          fontFamily: FONT, fontSize: 17, fontWeight: 300, lineHeight: 1.7,
          color: C.heading, textAlign: "center", marginBottom: 38,
        }}>{connection}</p>

        {anchors.map((text, i) => (
          <p key={i} style={{
            fontFamily: FONT, fontSize: 16, fontWeight: 300, lineHeight: 1.8,
            color: C.body, marginBottom: 20, textAlign: "justify",
          }}>{text}</p>
        ))}

        <div style={{
          opacity: showInfluence ? 1 : 0,
          transform: showInfluence ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s ease",
        }}>
          <div style={{
            margin: "40px 0 24px", padding: "24px 0 0",
            borderTop: "1px solid " + C.border,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ProfileIcon code={result.secondary} size={40} />
              <div>
                <p style={{
                  fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: C.muted, margin: 0,
                }}>Sua influência secundária</p>
                <p style={{
                  fontFamily: FONT, fontSize: 20, fontWeight: 500,
                  color: secondary.color, margin: 0,
                }}>{secondary.name}</p>
              </div>
            </div>
          </div>

          <p style={{
            fontFamily: FONT, fontSize: 16, fontWeight: 300, lineHeight: 1.8,
            color: C.body, textAlign: "justify",
          }}>{influence}</p>
        </div>

        {/* Mapa de estilos */}
        <div style={{
          marginTop: 48, padding: "32px 0",
          borderTop: "1px solid " + C.border,
        }}>
          <p style={{
            fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em",
            textTransform: "uppercase", color: C.muted, marginBottom: 20,
          }}>Seu mapa de estilos</p>

          {Object.entries(result.scores)
            .sort((a, b) => b[1] - a[1])
            .map(([code, score]) => (
              <div key={code} style={{ marginBottom: 13 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 5,
                }}>
                  <span style={{
                    fontFamily: FONT, fontSize: 14,
                    fontWeight: code === result.primary ? 600 : 400,
                    color: code === result.primary ? C.heading : C.muted,
                  }}>{PROFILES[code].name}</span>
                  <span style={{
                    fontFamily: FONT, fontSize: 12.5, fontWeight: 400, color: C.muted,
                  }}>{score} pts</span>
                </div>
                <div style={{
                  height: 4, background: C.border, overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: (score / 27) * 100 + "%",
                    background: PROFILES[code].color,
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
        </div>

        {/* Fechamento — varia conforme o consentimento */}
        <div style={{
          marginTop: 40, padding: "32px 28px",
          border: "1px solid " + C.border, textAlign: "center",
        }}>
          {consentiu ? (
            <>
              <p style={{
                fontFamily: FONT, fontSize: 20, fontWeight: 400, lineHeight: 1.4,
                color: C.heading, marginBottom: 14,
              }}>Vamos transformar esse estilo em realidade?</p>
              <p style={{
                fontFamily: FONT, fontSize: 15.5, fontWeight: 300, color: C.body,
                lineHeight: 1.75, marginBottom: 14,
              }}>
                Nossa equipe entrará em contato para entender o seu momento
                e transformar esse estilo em realidade.
              </p>
              <p style={{
                fontFamily: FONT, fontSize: 15.5, fontWeight: 300, color: C.muted,
                lineHeight: 1.75, marginBottom: 26,
              }}>
                Enquanto isso, inspire-se no nosso Instagram!
              </p>
            </>
          ) : (
            <>
              <p style={{
                fontFamily: FONT, fontSize: 20, fontWeight: 400, lineHeight: 1.4,
                color: C.heading, marginBottom: 14,
              }}>Ficamos por aqui — e à disposição!</p>
              <p style={{
                fontFamily: FONT, fontSize: 15.5, fontWeight: 300, color: C.body,
                lineHeight: 1.75, marginBottom: 14,
              }}>
                Sua preferência está registrada e se um dia quiser conversar,
                a porta continua aberta.
              </p>
              <p style={{
                fontFamily: FONT, fontSize: 15.5, fontWeight: 300, color: C.muted,
                lineHeight: 1.75, marginBottom: 26,
              }}>
                Enquanto isso, inspire-se no nosso Instagram!
              </p>
            </>
          )}

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: FONT, fontSize: 13.5, fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10, width: "100%", minHeight: 52, padding: "0 20px",
              background: C.heading, color: C.bg,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.86"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0 }} aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            Ver Instagram
          </a>
        </div>

        <CompartilharQuiz />

        <p style={{
          fontFamily: FONT, fontSize: 12, fontWeight: 500, color: C.muted,
          textAlign: "center", marginTop: 40, letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}>Katia Guerreiro Arquitetura</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [lead, setLead] = useState(null);
  const [sending, setSending] = useState(false);

  // Carrega a Red Hat Display do Google Fonts
  useEffect(() => {
    const id = "kg-webfont";
    if (document.getElementById(id)) return;

    const pre1 = document.createElement("link");
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";
    document.head.appendChild(pre1);

    const pre2 = document.createElement("link");
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "anonymous";
    document.head.appendChild(pre2);

    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [screen, currentQ]);

  const handleAnswer = (profile) => {
    const newAnswers = [...answers, profile];
    setAnswers(newAnswers);

    if (newAnswers.length === QUESTIONS.length) {
      setResult(calculateResult(newAnswers));
      setScreen("lead");
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setAnswers(answers.slice(0, -1));
      setCurrentQ(currentQ - 1);
    }
  };

  const sendToSheets = async (leadData, resultData) => {
    if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL.indexOf("COLE_AQUI") === 0) {
      console.warn("URL do Google Sheets ainda não configurada. Dados não enviados.");
      return;
    }

    const payload = {
      chave: CHAVE_QUIZ,
      dataHora: new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      nome: leadData.nome,
      email: leadData.email,
      telefone: leadData.telefone,
      cidade: leadData.cidade,
      plano: leadData.plano,
      projeto: leadData.projeto,
      consentimento: leadData.consent ? "Sim" : "Não",
      perfilPrincipal: PROFILES[resultData.primary].name,
      pontuacaoPrincipal: resultData.primaryScore,
      influenciaSecundaria: PROFILES[resultData.secondary].name,
      pontuacaoSecundaria: resultData.secondaryScore,
      perfilHibrido: resultData.isHybrid ? "Sim" : "Não",
      scoreM: resultData.scores.M,
      scoreC: resultData.scores.C,
      scoreI: resultData.scores.I,
      scoreN: resultData.scores.N,
      scoreE: resultData.scores.E,
      scoreB: resultData.scores.B,
      respostas: answers.join(", "),
    };

    try {
      await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Erro ao enviar para o Google Sheets:", err);
    }
  };

  const handleLeadSubmit = async (leadData) => {
    setSending(true);
    setLead(leadData);
    await sendToSheets(leadData, result);
    setSending(false);
    setScreen("result");
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { min-height: 100vh; background: #FCFCFC; }
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        button, input { font-family: inherit; }
        input:focus { border-color: #9A5B2B !important; }
        input::placeholder { color: #7C888C; opacity: 0.6; }
        ::selection { background: #9A5B2B; color: #FCFCFC; }
      `}</style>

      {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("quiz")} />}
      {screen === "quiz" && (
        <QuestionScreen
          question={QUESTIONS[currentQ]}
          index={currentQ}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
          onBack={handleBack}
        />
      )}
      {screen === "lead" && (
        <LeadCaptureScreen onSubmit={handleLeadSubmit} sending={sending} />
      )}
      {screen === "result" && result && (
        <ResultScreen result={result} lead={lead} />
      )}
    </div>
  );
}
