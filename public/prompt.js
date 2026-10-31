// Esquema e prompts compartilhados entre o servidor (modo IA) e a interface.

export const SCHEMA_CONTEUDO = {
  type: "object",
  additionalProperties: false,
  required: [
    "titulo", "gancho", "legenda", "cta", "hashtags", "slides",
    "roteiroReels", "stories", "sugestaoVisual", "textoAlternativo",
    "melhorHorario", "observacoes",
  ],
  properties: {
    titulo: { type: "string", description: "Título curto para a arte principal (até 8 palavras)." },
    gancho: { type: "string", description: "Primeira frase da legenda, que prende a atenção." },
    legenda: { type: "string", description: "Legenda completa, com quebras de linha e emojis moderados." },
    cta: { type: "string", description: "Chamada para ação final." },
    hashtags: { type: "array", items: { type: "string" }, description: "De 8 a 15 hashtags, sem espaços, começando com #." },
    slides: {
      type: "array",
      description: "Slides do carrossel (ou um único item para post simples).",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["titulo", "texto"],
        properties: { titulo: { type: "string" }, texto: { type: "string" } },
      },
    },
    roteiroReels: {
      type: "array",
      description: "Cenas do Reels. Vazio se o formato não for Reels.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["tempo", "cena", "fala"],
        properties: { tempo: { type: "string" }, cena: { type: "string" }, fala: { type: "string" } },
      },
    },
    stories: {
      type: "array",
      description: "Sequência de Stories. Vazio se o formato não for Stories.",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["tipo", "texto"],
        properties: { tipo: { type: "string" }, texto: { type: "string" } },
      },
    },
    sugestaoVisual: { type: "string" },
    textoAlternativo: { type: "string", description: "Texto alternativo (acessibilidade) para a imagem." },
    melhorHorario: { type: "string" },
    observacoes: { type: "array", items: { type: "string" }, description: "Alertas éticos/regulatórios e dicas de publicação." },
  },
};

export function montarPromptSistema() {
  return `Você é estrategista de conteúdo para Instagram especializada em farmácia e saúde no Brasil, escrevendo para farmacêuticas, farmácias e profissionais de saúde.

Escreva sempre em português do Brasil, com linguagem clara para o público leigo, sem perder a precisão técnica.

Regras de conteúdo em saúde (obrigatórias):
- Informação educativa, baseada em evidências e consensos atuais. Não invente dados, estudos ou estatísticas; se não tiver certeza de um número, não o use.
- Nunca prometa cura, resultado garantido ou ausência de efeitos adversos. Evite "milagroso", "100% eficaz", "sem contraindicações".
- Não faça propaganda de medicamentos de venda sob prescrição ao público leigo, nem indique medicamento, dose ou troca de tratamento para casos individuais. Oriente a procurar o farmacêutico ou o médico.
- Siga o espírito da RDC 96/2008 da Anvisa (propaganda de medicamentos) e do Código de Ética Farmacêutica: sem sensacionalismo, sem antes/depois, sem uso de medo como apelo principal.
- Inclua, quando fizer sentido, um lembrete curto do tipo "Este conteúdo é informativo e não substitui a orientação de um profissional de saúde."
- Em "observacoes", aponte qualquer cuidado ético/regulatório relevante para aquele tema e dicas práticas de publicação.

Boas práticas de Instagram:
- A primeira linha (gancho) precisa prender em até 125 caracteres.
- Parágrafos curtos, listas com emojis com moderação, CTA claro (salvar, compartilhar, comentar, agendar atendimento).
- Hashtags: misture amplas, de nicho e locais quando houver cidade.
- Slides de carrossel: 1 ideia por slide, título curto e texto de no máximo 30 palavras; o primeiro slide é a capa e o último é a chamada para ação.`;
}

export function montarPedido(b) {
  const linhas = [
    `Tema: ${b.tema}`,
    `Nicho: ${b.nicho || "farmácia"}`,
    `Formato: ${b.formato || "carrossel"}`,
    `Objetivo: ${b.objetivo || "educar"}`,
    `Tom de voz: ${b.tom || "acolhedor"}`,
    b.publico ? `Público-alvo: ${b.publico}` : null,
    b.marca ? `Nome da marca/profissional: ${b.marca}` : null,
    b.handle ? `Perfil: ${b.handle}` : null,
    b.cidade ? `Cidade: ${b.cidade}` : null,
    b.formato === "carrossel" ? `Número de slides: ${b.numSlides || 7}` : null,
    b.extra ? `Observações da autora: ${b.extra}` : null,
  ].filter(Boolean);

  return `Crie um conteúdo para Instagram com este briefing:\n\n${linhas.join("\n")}\n\nPreencha todos os campos do esquema. Para formato "post", use 1 slide; para "reels", preencha roteiroReels (5 a 8 cenas, 30 a 60 s no total) e use 1 slide de capa; para "stories", preencha stories (4 a 7 telas, com enquete, caixa de perguntas ou quiz) e use 1 slide de capa.`;
}
