// Gerador offline: monta conteúdos a partir de modelos, sem depender de IA.
// Funciona no navegador e no Node (usado nos testes).

// ---------------------------------------------------------------------------
// Base de temas prontos (farmácia e saúde).
//
// Cada tema traz as fontes usadas. Revisão técnica: out/2026. Normas e
// diretrizes mudam: confira a versão vigente antes de publicar.
// ---------------------------------------------------------------------------
export const TEMAS_PRONTOS = {
  "descarte-medicamentos": {
    nome: "Descarte correto de medicamentos",
    palavras: ["descarte", "vencido", "lixo", "jogar fora"],
    titulo: "Remédio vencido não vai pro lixo!",
    gancho: "Você sabe o que fazer com aquele remédio vencido esquecido na gaveta? 💊🗑️",
    slides: [
      ["Remédio vencido não vai pro lixo!", "Descubra o jeito certo de descartar medicamentos em casa."],
      ["Por que isso importa?", "Medicamentos jogados no lixo comum, na pia ou no vaso podem contaminar o solo e a água."],
      ["Onde NÃO descartar", "❌ Lixo comum\n❌ Pia ou ralo\n❌ Vaso sanitário"],
      ["Onde descartar", "✅ Nos coletores de farmácias e drogarias. O sistema de logística reversa foi criado pelo Decreto nº 10.388/2020."],
      ["Como levar", "Leve o remédio na embalagem que fica em contato com ele: blister, frasco ou bisnaga. Não tire os comprimidos da cartela. A caixa de papel e a bula podem ir para a reciclagem."],
      ["E as agulhas?", "Seringas, agulhas e lancetas não entram nesses coletores. Guarde em recipiente rígido e fechado e pergunte na UBS onde entregar."],
      ["Dica de ouro", "Revise sua farmacinha de tempos em tempos e confira as datas de validade."],
    ],
    mito: { afirmacao: "Posso jogar remédio vencido no vaso sanitário.", resposta: "MITO! Ele contamina a água. Leve a um coletor em farmácia." },
    hashtags: ["#descartedemedicamentos", "#logisticareversa", "#meioambiente", "#usoracional"],
    fontes: [
      "Decreto nº 10.388/2020 — sistema de logística reversa de medicamentos domiciliares vencidos ou em desuso.",
      "Lei nº 12.305/2010 — Política Nacional de Resíduos Sólidos.",
    ],
  },
  "antibioticos": {
    nome: "Uso correto de antibióticos",
    palavras: ["antibiótico", "antibiotico", "resistência", "bactéria", "infecção"],
    titulo: "Antibiótico: use do jeito certo",
    gancho: "Antibiótico não serve para gripe nem resfriado. Sabia? 🦠",
    slides: [
      ["Antibiótico: use do jeito certo", "Cuidados que fazem toda a diferença."],
      ["Só para bactérias", "Antibiótico não trata vírus. Gripe, resfriado e a maioria das dores de garganta não melhoram com ele."],
      ["Siga a prescrição", "Use a dose, o horário e o tempo indicados. Não pare nem prolongue por conta própria: se quiser mudar, fale com quem prescreveu."],
      ["Respeite os horários", "Intervalos regulares mantêm o efeito do medicamento. Use alarmes no celular."],
      ["Não guarde sobras", "Sobrou? Leve a um ponto de coleta. Não use depois sem nova avaliação."],
      ["Não compartilhe", "O antibiótico certo depende da infecção e da pessoa. O que serviu para você pode não servir para outro."],
      ["Resistência bacteriana", "O uso desnecessário ou inadequado favorece bactérias resistentes, que deixam os tratamentos menos eficazes."],
      ["Ficou com dúvida?", "Converse com seu farmacêutico sobre horários, alimentação e efeitos esperados."],
    ],
    mito: { afirmacao: "Antibiótico cura gripe.", resposta: "MITO! Gripe é causada por vírus, e antibiótico só age contra bactérias." },
    hashtags: ["#antibioticos", "#resistenciaantimicrobiana", "#usoracionaldemedicamentos", "#saude"],
    fontes: [
      "OMS — Resistência antimicrobiana (fichas informativas).",
      "Anvisa — RDC nº 471/2021 (controle de antimicrobianos e retenção de receita).",
    ],
  },
  "armazenamento": {
    nome: "Como guardar medicamentos em casa",
    palavras: ["guardar", "armazenar", "armazenamento", "farmacinha", "geladeira", "insulina"],
    titulo: "Onde você guarda seus remédios?",
    gancho: "Banheiro e cozinha estão entre os piores lugares para guardar remédio. Sabe por quê? 🤔",
    slides: [
      ["Onde você guarda seus remédios?", "O lugar errado pode estragar o medicamento antes da validade."],
      ["Inimigos do remédio", "🌡️ Calor\n💧 Umidade\n☀️ Luz direta"],
      ["Evite", "Banheiro (vapor do banho), cozinha (calor do fogão) e carro."],
      ["Prefira", "Local fresco, seco, arejado e longe da luz, como um armário de quarto. Siga a temperatura indicada na embalagem."],
      ["Embalagem original", "Mantenha na caixa com a bula: ela protege e guarda lote e validade."],
      ["Insulina", "Fechada: na geladeira (2 °C a 8 °C), nunca no congelador nem na porta. Em uso: siga a bula, pois muitas podem ficar em temperatura ambiente por um período limitado."],
      ["Segurança", "Sempre fora do alcance de crianças e animais de estimação."],
    ],
    mito: { afirmacao: "O banheiro é um bom lugar para guardar remédios.", resposta: "MITO! O vapor do banho e o calor estragam o medicamento." },
    hashtags: ["#farmacinhacaseira", "#armazenamento", "#insulina", "#segurancadopaciente"],
    fontes: [
      "Bulas dos medicamentos (seção \"Onde, como e por quanto tempo posso guardar este medicamento?\").",
      "Sociedade Brasileira de Diabetes — Diretrizes (técnica de aplicação, conservação e transporte de insulina).",
    ],
  },
  "pressao-arterial": {
    nome: "Como medir a pressão corretamente",
    palavras: ["pressão", "pressao", "hipertensão", "hipertensao", "aferição"],
    titulo: "Você mede a pressão do jeito certo?",
    gancho: "Café, conversa e pernas cruzadas podem alterar a medida da sua pressão. ☕🩺",
    slides: [
      ["Você mede a pressão do jeito certo?", "Pequenos detalhes mudam o resultado."],
      ["Antes de medir", "Descanse de 3 a 5 minutos sentado, em ambiente calmo, e esvazie a bexiga."],
      ["Evite antes", "☕ Café, álcool, comida e cigarro: 30 minutos antes\n🏃 Exercício físico: 60 a 90 minutos antes"],
      ["Posição", "Costas apoiadas, pernas descruzadas, pés no chão e braço apoiado na altura do coração, com a palma para cima."],
      ["Durante a medida", "Não fale e use o manguito do tamanho certo para o seu braço, sobre a pele, sem roupa apertando."],
      ["Anote", "Registre data, hora e valores para levar à consulta."],
      ["Importante", "Não mude nem suspenda remédios por conta própria. Valores alterados devem ser avaliados pelo médico."],
    ],
    mito: { afirmacao: "Posso medir a pressão logo depois de tomar café.", resposta: "MITO! Espere pelo menos 30 minutos." },
    hashtags: ["#hipertensao", "#pressaoarterial", "#afericaodepressao", "#cuidadofarmaceutico"],
    fontes: [
      "Sociedade Brasileira de Cardiologia — Diretrizes Brasileiras de Hipertensão Arterial (seção de medida da pressão no consultório).",
    ],
  },
  "automedicacao": {
    nome: "Riscos da automedicação",
    palavras: ["automedicação", "automedicacao", "por conta própria", "sem receita"],
    titulo: "Automedicação: cuidado!",
    gancho: "\"É só um remedinho\"... até deixar de ser. Vamos falar de automedicação? 💬",
    slides: [
      ["Automedicação: cuidado!", "Por que tomar remédio por conta própria pode ser arriscado."],
      ["Mascara sintomas", "Aliviar a dor pode esconder um problema que precisa de diagnóstico."],
      ["Interações", "Um medicamento pode interferir no efeito de outro que você já usa."],
      ["Dose errada", "Mesmo remédios comuns têm dose máxima. O paracetamol em excesso, por exemplo, pode causar lesão grave no fígado."],
      ["Sem receita ≠ sem risco", "Medicamentos isentos de prescrição (MIPs) também têm contraindicações e merecem orientação."],
      ["O farmacêutico ajuda", "Ele avalia seus sintomas, os remédios que você já usa e indica quando procurar o médico."],
    ],
    mito: { afirmacao: "Remédio vendido sem receita não faz mal.", resposta: "MITO! Ele também tem dose máxima, contraindicações e interações." },
    hashtags: ["#automedicacao", "#usoracional", "#farmaceuticoorienta", "#saude"],
    fontes: [
      "Anvisa — RDC nº 98/2016 (critérios de enquadramento dos medicamentos isentos de prescrição).",
      "CFF — Resolução nº 586/2013 (prescrição farmacêutica).",
    ],
  },
  "protetor-solar": {
    nome: "Protetor solar no dia a dia",
    palavras: ["protetor", "filtro solar", "fps", "sol", "fotoproteção"],
    titulo: "Protetor solar: você usa certo?",
    gancho: "Passar protetor só na praia? A pele recebe radiação todos os dias. ☀️",
    slides: [
      ["Protetor solar: você usa certo?", "Guia rápido de fotoproteção."],
      ["Todos os dias", "Inclusive em dias nublados: boa parte da radiação ultravioleta atravessa as nuvens."],
      ["FPS", "Use FPS 30 ou mais, com proteção UVA. No Brasil, a proteção UVA deve ser de pelo menos 1/3 do FPS."],
      ["Quantidade", "Use cerca de 1 colher de chá para rosto e pescoço. Pouco produto protege bem menos do que o rótulo promete."],
      ["Reaplique", "A cada 2 horas de exposição e após suar, nadar ou se secar com toalha."],
      ["Não esqueça", "Orelhas, nuca, colo, dorso das mãos e pés."],
      ["Vai além do filtro", "Chapéu, óculos escuros, roupas e evitar o sol forte entre 10h e 16h completam a proteção."],
    ],
    mito: { afirmacao: "Em dia nublado não preciso de protetor solar.", resposta: "MITO! Boa parte da radiação ultravioleta atravessa as nuvens." },
    hashtags: ["#protetorsolar", "#fotoprotecao", "#cuidadoscomapele", "#dermocosmeticos"],
    fontes: [
      "Sociedade Brasileira de Dermatologia — Consenso Brasileiro de Fotoproteção.",
      "Anvisa — RDC nº 30/2012 (protetores solares).",
    ],
  },
  "interacoes-alimentos": {
    nome: "Interações entre medicamentos e alimentos",
    palavras: ["interação", "interacao", "alimento", "leite", "álcool", "alcool", "jejum"],
    titulo: "Remédio e comida combinam?",
    gancho: "Tomar remédio com leite, suco ou bebida alcoólica pode mudar o efeito dele. 🥛🍷",
    slides: [
      ["Remédio e comida combinam?", "Exemplos de interações que merecem atenção."],
      ["Levotiroxina", "Em geral, em jejum, de 30 a 60 minutos antes do café da manhã, sempre no mesmo horário."],
      ["Leite e cálcio", "Reduzem a absorção de alguns antibióticos, como tetraciclinas e ciprofloxacino. Respeite o intervalo da bula."],
      ["Varfarina", "Mantenha estável o consumo de folhas verdes escuras, ricas em vitamina K. Não corte nem exagere de repente."],
      ["Álcool", "Pode somar efeitos de sedativos e antialérgicos e causar reações com alguns medicamentos, como o metronidazol."],
      ["Toranja (grapefruit)", "Pode aumentar o nível de alguns medicamentos no sangue, como a sinvastatina."],
      ["Regra de ouro", "Pergunte ao farmacêutico como tomar cada medicamento."],
    ],
    mito: { afirmacao: "Tomar qualquer antibiótico com leite não muda nada.", resposta: "MITO! O cálcio reduz a absorção de alguns, como as tetraciclinas." },
    hashtags: ["#interacaomedicamentosa", "#nutricaoesaude", "#usoracional", "#farmaciaclinica"],
    fontes: [
      "Bulas dos medicamentos citados (levotiroxina, tetraciclinas, ciprofloxacino, varfarina, metronidazol, sinvastatina).",
    ],
  },
  "vacinacao-adulto": {
    nome: "Vacinação do adulto",
    palavras: ["vacina", "vacinação", "vacinacao", "imunização"],
    titulo: "Vacina não é só coisa de criança",
    gancho: "Sua caderneta de vacinação está em dia? Adulto também precisa se vacinar. 💉",
    slides: [
      ["Vacina não é só coisa de criança", "Confira se você está protegido."],
      ["Por que vacinar?", "Vacinas protegem você e quem convive com você, inclusive as pessoas mais vulneráveis."],
      ["No SUS, para adultos", "Hepatite B, dupla adulto (difteria e tétano, reforço a cada 10 anos), tríplice viral e febre amarela, conforme idade e histórico."],
      ["Campanhas", "Gripe (influenza) e covid-19 seguem os grupos e as regras de cada campanha do Ministério da Saúde."],
      ["Perdeu a caderneta?", "Procure a UBS: a equipe avalia o que precisa ser atualizado."],
      ["Vacinação em farmácias", "Farmácias licenciadas para o serviço podem vacinar, com farmacêutico capacitado."],
      ["Leve sua caderneta", "Ela é seu histórico de proteção. Guarde uma foto no celular!"],
    ],
    mito: { afirmacao: "Adulto não precisa mais tomar vacina.", resposta: "MITO! Há vacinas e reforços indicados para adultos, como a dupla adulto a cada 10 anos." },
    hashtags: ["#vacinacao", "#vacinaadulto", "#imunizacao", "#saudepublica"],
    fontes: [
      "Ministério da Saúde — Calendário Nacional de Vacinação (adulto), Programa Nacional de Imunizações.",
      "Anvisa — RDC nº 197/2017 (serviços de vacinação humana).",
      "Lei nº 13.021/2014 (farmácia como estabelecimento de saúde).",
    ],
  },
  "servicos-farmaceuticos": {
    nome: "Serviços farmacêuticos",
    palavras: ["serviço", "servico", "consulta farmacêutica", "consultório", "glicemia", "revisão"],
    titulo: "Sua farmácia vai além do balcão",
    gancho: "Você sabia que pode ter uma consulta com o farmacêutico? 👩‍⚕️",
    slides: [
      ["Sua farmácia vai além do balcão", "Conheça os serviços farmacêuticos."],
      ["Aferição de pressão", "Medida feita com técnica correta e registro para acompanhamento."],
      ["Glicemia capilar", "Ajuda no acompanhamento de quem tem diabetes, com orientação. Não serve, sozinha, para diagnóstico."],
      ["Revisão da farmacoterapia", "Avaliação de todos os remédios que você usa, buscando interações, duplicidades e problemas de uso."],
      ["Orientação personalizada", "Como e quando tomar, o que esperar e como organizar os horários."],
      ["Agende seu atendimento", "Fale com a gente pelo direct ou pelo WhatsApp."],
    ],
    mito: { afirmacao: "Farmacêutico só vende remédio.", resposta: "MITO! Ele também faz consulta, revisão dos medicamentos e acompanhamento." },
    hashtags: ["#servicosfarmaceuticos", "#consultafarmaceutica", "#cuidadofarmaceutico", "#farmaciaclinica"],
    fontes: [
      "Lei nº 13.021/2014.",
      "Anvisa — RDC nº 44/2009 (boas práticas e serviços farmacêuticos em farmácias e drogarias).",
      "CFF — Resolução nº 585/2013 (atribuições clínicas do farmacêutico).",
    ],
  },
};

// ---------------------------------------------------------------------------
// Bancos de frases
// ---------------------------------------------------------------------------
const GANCHOS = {
  educar: [
    "Você sabia disso sobre {tema}? 👇",
    "{tema}: o que ninguém te explicou direito. 💡",
    "Salve este post: tudo o que você precisa saber sobre {tema}. 📌",
  ],
  engajar: [
    "Verdade ou mito: o que você já ouviu sobre {tema}? 🤔",
    "Conta pra gente nos comentários: você já passou por isso com {tema}? 💬",
    "Marque alguém que precisa ler isto sobre {tema}! 👀",
  ],
  vender: [
    "Precisa de ajuda com {tema}? A gente pode te orientar. 🤝",
    "Cuidar de {tema} ficou mais fácil. Vem conhecer! ✨",
    "{tema} com atendimento de quem entende do assunto. 💚",
  ],
  autoridade: [
    "Como farmacêutica, esta é a dúvida que mais ouço sobre {tema}. 👩‍⚕️",
    "3 erros que vejo todos os dias sobre {tema} (e como evitar). ⚠️",
    "O que a ciência diz sobre {tema}? Vamos por partes. 🔬",
  ],
  bastidores: [
    "Um pouco da nossa rotina: hoje o assunto é {tema}. 🎬",
    "Por trás do balcão: como cuidamos de {tema} por aqui. 👀",
    "Você nunca viu este lado de {tema}. Vem ver! 📸",
  ],
};

const CTAS = {
  educar: "📌 Salve para consultar depois e compartilhe com quem precisa.",
  engajar: "💬 Comente sua resposta e marque um amigo!",
  vender: "📲 Chame no direct ou no WhatsApp para agendar seu atendimento.",
  autoridade: "👩‍⚕️ Siga o perfil para mais conteúdos confiáveis sobre saúde.",
  bastidores: "❤️ Curtiu conhecer nossa rotina? Conta pra gente nos comentários!",
};

const TONS = {
  acolhedor: { abre: "Aqui a gente fala de saúde com carinho e sem complicação. 💚", emoji: "💚" },
  tecnico: { abre: "Informação baseada em evidências, explicada de forma objetiva.", emoji: "🔬" },
  descontraido: { abre: "Bora descomplicar esse assunto? 😄", emoji: "😄" },
  inspirador: { abre: "Cuidar da saúde é um ato diário de amor-próprio. ✨", emoji: "✨" },
};

const HASHTAGS_NICHO = {
  farmacia: ["#farmacia", "#farmaceutica", "#farmaceutico", "#saude", "#medicamentos", "#cuidadofarmaceutico", "#dicasdesaude", "#bemestar"],
  saude: ["#saude", "#bemestar", "#qualidadedevida", "#prevencao", "#dicasdesaude", "#vidasaudavel"],
  estetica: ["#estetica", "#skincare", "#cuidadoscomapele", "#dermocosmeticos", "#autocuidado", "#beleza"],
  nutricao: ["#nutricao", "#alimentacaosaudavel", "#vidasaudavel", "#saude", "#bemestar", "#reeducacaoalimentar"],
  negocio: ["#empreendedorismo", "#negociolocal", "#comprelocal", "#atendimento", "#marketingdigital"],
  outro: ["#dicas", "#conteudo", "#instagram", "#aprendanoinsta"],
};

// Não existe um "melhor horário" universal: depende do seu público.
// Estes são pontos de partida; o ideal é conferir no Insights do perfil.
const NOTA_HORARIO = " (ponto de partida: confira em Insights → Seguidores os horários em que o seu público está on-line)";
const HORARIOS = {
  post: "Dias úteis, no almoço ou no início da noite" + NOTA_HORARIO,
  carrossel: "Dias úteis, no início da noite" + NOTA_HORARIO,
  reels: "Fim de tarde e início da noite" + NOTA_HORARIO,
  stories: "Distribua ao longo do dia, por exemplo de manhã, no almoço e à noite" + NOTA_HORARIO,
};

const AVISO_SAUDE = "⚠️ Conteúdo informativo. Não substitui a orientação de um profissional de saúde.";

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function semAcento(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function escolher(lista, semente) {
  return lista[Math.abs(semente) % lista.length];
}

function hashTexto(texto) {
  let h = 0;
  for (const c of texto) h = (h * 31 + c.codePointAt(0)) | 0;
  return h;
}

// Versão curta de uma fonte para caber na legenda.
function fonteCurta(fonte) {
  const [quem, oque] = fonte.replace(/\.$/, "").split(" — ");
  if (!oque || /\b(Lei|Decreto|RDC|Resolução)\b/.test(quem)) return quem.split(" (")[0];
  return `${quem} — ${oque.split(" (")[0]}`;
}

function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function paraHashtag(texto) {
  const limpo = semAcento(texto).replace(/[^a-z0-9 ]/g, "").split(/\s+/).filter(Boolean).join("");
  return limpo ? `#${limpo}` : "";
}

export function encontrarTemaPronto(tema) {
  const alvo = semAcento(tema);
  for (const [id, dados] of Object.entries(TEMAS_PRONTOS)) {
    if (id === tema || semAcento(dados.nome) === alvo) return dados;
    if (dados.palavras.some((p) => alvo.includes(semAcento(p)))) return dados;
  }
  return null;
}

function slidesGenericos(tema, numSlides, objetivo) {
  const t = capitalizar(tema);
  const base = [
    [t, objetivo === "vender" ? "Veja como podemos te ajudar." : "Arraste para o lado e aprenda. 👉"],
    [`O que é ${tema}?`, "Explique em uma ou duas frases simples, sem jargão."],
    ["Por que isso importa?", "Mostre o impacto no dia a dia de quem está lendo."],
    ["Erro comum", "Apresente um equívoco frequente e por que ele é um problema."],
    ["Como fazer certo", "Dê um passo a passo curto e prático."],
    ["Sinal de alerta", "Quando procurar o farmacêutico ou o médico."],
    ["Dica extra", "Um detalhe que a maioria das pessoas não conhece."],
    ["Mito ou verdade?", "Desfaça uma crença popular sobre o tema."],
    ["Resumo", "Os pontos principais em três tópicos."],
  ];
  const meio = base.slice(1, Math.max(2, numSlides - 1));
  return [base[0], ...meio];
}

// ---------------------------------------------------------------------------
// Gerador principal
// ---------------------------------------------------------------------------
export function gerarOffline(briefing) {
  const {
    tema = "",
    nicho = "farmacia",
    formato = "carrossel",
    objetivo = "educar",
    tom = "acolhedor",
    publico = "",
    marca = "",
    handle = "",
    cidade = "",
  } = briefing;
  const numSlides = Math.min(10, Math.max(3, Number(briefing.numSlides) || 7));
  const temaLimpo = tema.trim() || "cuidados com a saúde";
  const pronto = encontrarTemaPronto(temaLimpo);
  const semente = hashTexto(temaLimpo + objetivo + tom);
  const tomDados = TONS[tom] || TONS.acolhedor;
  const ehSaude = ["farmacia", "saude", "nutricao", "estetica"].includes(nicho);

  // Slides
  let pares = pronto ? pronto.slides.slice(0, numSlides - 1) : slidesGenericos(temaLimpo, numSlides, objetivo);
  const cta = CTAS[objetivo] || CTAS.educar;
  pares.push(["Gostou?", cta.replace(/^\S+\s/, "")]);
  if (formato !== "carrossel") pares = [pares[0]];
  const slides = pares.map(([titulo, texto]) => ({ titulo, texto }));

  // Gancho e título
  const gancho = pronto && objetivo === "educar"
    ? pronto.gancho
    : escolher(GANCHOS[objetivo] || GANCHOS.educar, semente).replace("{tema}", pronto ? pronto.nome.toLowerCase() : temaLimpo);
  const titulo = pronto ? pronto.titulo : capitalizar(temaLimpo);

  // Legenda
  const pontos = (pronto ? pronto.slides.slice(1, 5) : slidesGenericos(temaLimpo, 6, objetivo).slice(1, 5))
    .map(([t, x]) => `${tomDados.emoji} ${t}: ${x.replace(/\n/g, " ")}`);
  const partes = [
    capitalizar(gancho),
    tomDados.abre,
    publico ? `Este conteúdo é para você, ${publico.toLowerCase()}.` : null,
    pontos.join("\n\n"),
    formato === "carrossel" ? "👉 Arraste para o lado e confira todos os detalhes." : null,
    cidade && objetivo === "vender" ? `📍 Atendemos em ${cidade}.` : null,
    cta,
    pronto ? `📚 Fontes: ${pronto.fontes.map(fonteCurta).join("; ")}.` : null,
    ehSaude ? AVISO_SAUDE : null,
    marca ? `— ${marca}${handle ? ` (${handle})` : ""}` : null,
  ].filter(Boolean);
  const legenda = partes.join("\n\n");

  // Hashtags
  const tags = new Set([
    ...(pronto ? pronto.hashtags : []),
    paraHashtag(temaLimpo),
    ...(HASHTAGS_NICHO[nicho] || HASHTAGS_NICHO.outro),
    cidade ? paraHashtag(cidade) : null,
    cidade && nicho === "farmacia" ? paraHashtag(`farmacia ${cidade}`) : null,
  ].filter((t) => t && t.length > 2 && t.length < 40));
  const hashtags = [...tags].slice(0, 15);

  // Reels
  const roteiroReels = formato === "reels" ? montarReels(temaLimpo, pronto, cta) : [];

  // Stories
  const stories = formato === "stories" ? montarStories(temaLimpo, pronto, cta) : [];

  const observacoes = [
    "Revise o texto antes de publicar e adapte à sua realidade.",
    ehSaude ? "Evite promessas de cura ou resultado garantido e não indique medicamentos de prescrição ao público." : null,
    formato === "carrossel" ? "Use a capa com título grande e contraste alto: ela decide se a pessoa vai arrastar." : null,
    formato === "reels" ? "Coloque legenda na tela: muita gente assiste sem som." : null,
    "Responda os comentários e as mensagens: conversa com o público fortalece o perfil.",
    pronto ? null : "Tema sem base pronta: o texto é só uma estrutura. Escreva o conteúdo técnico com base em fontes oficiais e cite-as.",
  ].filter(Boolean);

  const fontes = pronto ? pronto.fontes : [];

  return {
    titulo,
    gancho,
    legenda,
    cta,
    hashtags,
    slides,
    roteiroReels,
    stories,
    sugestaoVisual: sugestaoVisual(formato, nicho),
    textoAlternativo: `Arte com o título "${titulo}" sobre ${pronto ? pronto.nome.toLowerCase() : temaLimpo}${marca ? `, de ${marca}` : ""}.`,
    melhorHorario: HORARIOS[formato] || HORARIOS.post,
    observacoes,
    fontes,
  };
}

function montarReels(tema, pronto, cta) {
  const dicas = pronto ? pronto.slides.slice(1, 4) : [["Dica 1", "Explique o primeiro ponto."], ["Dica 2", "Explique o segundo ponto."], ["Dica 3", "Explique o terceiro ponto."]];
  return [
    { tempo: "0–3 s", cena: "Close no rosto, olhando para a câmera. Texto grande na tela.", fala: pronto ? pronto.gancho.replace(/[^\p{L}\p{N}\s?!.,"'-]/gu, "").trim() : `Pare tudo: você precisa saber isto sobre ${tema}!` },
    { tempo: "3–8 s", cena: "Plano médio, no balcão ou no consultório.", fala: `Hoje eu vou te mostrar ${dicas.length} pontos importantes sobre ${pronto ? pronto.nome.toLowerCase() : tema}.` },
    ...dicas.map(([t, x], i) => ({
      tempo: `${8 + i * 8}–${16 + i * 8} s`,
      cena: `Mostre algo relacionado a "${t}" (produto genérico sem marca, gesto ou objeto). Texto na tela: "${t}".`,
      fala: x.replace(/\n/g, " ").replace(/[❌✅🌡️💧☀️☕🚬🏃]/gu, "").trim(),
    })),
    { tempo: `${8 + dicas.length * 8}–${14 + dicas.length * 8} s`, cena: "Volta ao close, sorrindo.", fala: "Ficou com dúvida? Fala com seu farmacêutico." },
    { tempo: "Final", cena: "Tela com @ do perfil e chamada.", fala: cta.replace(/^\S+\s/, "") },
  ];
}

function montarStories(tema, pronto, cta) {
  const nome = pronto ? pronto.nome.toLowerCase() : tema;
  const dica = pronto ? pronto.slides[1] : ["Dica rápida", `Um cuidado essencial sobre ${tema}.`];
  return [
    { tipo: "Abertura", texto: `Hoje o papo é sobre ${nome}! Fica até o final 👀` },
    { tipo: "Enquete", texto: `Você já teve dúvida sobre ${nome}? (Sim / Não)` },
    { tipo: "Conteúdo", texto: `${dica[0]}: ${dica[1].replace(/\n/g, " ")}` },
    { tipo: "Quiz", texto: pronto ? `Verdade ou mito: "${pronto.mito.afirmacao}" Responda na enquete!` : `Verdade ou mito sobre ${tema}? Responda!` },
    ...(pronto ? [{ tipo: "Resposta do quiz", texto: pronto.mito.resposta }] : []),
    { tipo: "Caixa de perguntas", texto: `Mande sua dúvida sobre ${nome} que eu respondo aqui! 💬` },
    { tipo: "Chamada", texto: cta },
  ];
}

function sugestaoVisual(formato, nicho) {
  const paleta = nicho === "farmacia" ? "tons de verde e branco, que remetem a saúde e confiança" : "as cores da sua identidade visual";
  const mapa = {
    post: `Arte única 1080×1350 px com título grande, ${paleta}, e foto real do ambiente ou da profissional.`,
    carrossel: `Carrossel 1080×1350 px, ${paleta}, capa com título grande e numeração nos slides para incentivar o arraste.`,
    reels: "Vídeo vertical 1080×1920, boa iluminação natural, legendas grandes e capa com o título do tema.",
    stories: "Telas 1080×1920 com fundo de cor sólida, figurinhas de enquete/quiz e foto ou vídeo curto da rotina.",
  };
  return mapa[formato] || mapa.post;
}

// ---------------------------------------------------------------------------
// Checagem ética/regulatória simples (sinaliza termos de risco)
// ---------------------------------------------------------------------------
const TERMOS_RISCO = [
  { re: /\bcura(?:r|m|do|da)?\b/i, alerta: "Evite prometer cura. Prefira \"ajuda a controlar\" ou \"contribui para\"." },
  { re: /\bmilagr(?:e|oso|osa)\b/i, alerta: "Termos como \"milagre\" são sensacionalistas e vedados em publicidade de saúde." },
  { re: /100\s?%/i, alerta: "Evite \"100%\": nenhum tratamento é totalmente garantido." },
  { re: /\bgarantid[oa]s?\b|\bgarante\b/i, alerta: "Não prometa resultado garantido." },
  { re: /sem (?:efeitos? colaterais|contraindica)/i, alerta: "Todo medicamento pode ter efeitos adversos ou contraindicações." },
  { re: /\bantes e depois\b/i, alerta: "Comparações antes/depois são desaconselhadas em conteúdos de saúde." },
  { re: /\bemagre[cç]a? \d+\s?kg\b|\bperca \d+\s?kg\b/i, alerta: "Não prometa perda de peso específica." },
  { re: /\bnatural,? (?:logo|então) não faz mal\b|\bpor ser natural\b/i, alerta: "\"Natural\" não significa isento de riscos." },
  { re: /\bpromo[cç][aã]o\b.*\b(?:antibi[oó]tico|tarja preta|controlado)\b/i, alerta: "Não faça promoção de medicamentos sob prescrição ou controlados." },
  { re: /\b(?:tome|use)\s+\d+\s?(?:mg|comprimidos?|gotas)\b/i, alerta: "Evite indicar doses ao público em geral: a posologia é individual." },
];

export function verificarConformidade(texto) {
  const alertas = [];
  for (const { re, alerta } of TERMOS_RISCO) {
    const achado = texto.match(re);
    if (achado) alertas.push({ trecho: achado[0], alerta });
  }
  return alertas;
}

// ---------------------------------------------------------------------------
// Calendário editorial
// ---------------------------------------------------------------------------
const ROTACAO = [
  { formato: "carrossel", objetivo: "educar" },
  { formato: "reels", objetivo: "engajar" },
  { formato: "stories", objetivo: "engajar" },
  { formato: "post", objetivo: "autoridade" },
  { formato: "carrossel", objetivo: "educar" },
  { formato: "reels", objetivo: "bastidores" },
  { formato: "post", objetivo: "vender" },
];

const DIAS_SEMANA = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function gerarCalendario({ dias = 7, inicio = new Date(), temas = [] } = {}) {
  const lista = temas.length ? temas : Object.values(TEMAS_PRONTOS).map((t) => t.nome);
  const plano = [];
  for (let i = 0; i < dias; i++) {
    const data = new Date(inicio);
    data.setDate(data.getDate() + i);
    const { formato, objetivo } = ROTACAO[i % ROTACAO.length];
    plano.push({
      data: data.toISOString().slice(0, 10),
      diaSemana: DIAS_SEMANA[data.getDay()],
      tema: lista[i % lista.length],
      formato,
      objetivo,
      horario: HORARIOS[formato],
    });
  }
  return plano;
}
