import { TEMAS_PRONTOS, gerarOffline, gerarCalendario, verificarConformidade } from "./gerador.js";
import { PALETAS, TAMANHOS, desenharSlide, baixarCanvas } from "./arte.js";

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

const LIMITE_LEGENDA = 2200;
const LIMITE_HASHTAGS = 30;
const CHAVE_HISTORICO = "gerador-insta:historico";
const CHAVE_PERFIL = "gerador-insta:perfil";

const estado = {
  ia: false,
  atual: null, // { briefing, conteudo, origem, criadoEm }
  paleta: "farmacia",
  tamanho: "retrato",
  calendario: [],
};

// ---------------------------------------------------------------------------
// Inicialização
// ---------------------------------------------------------------------------
async function verificarModo() {
  const selo = $("#modo");
  try {
    const r = await fetch("api/status");
    const dados = await r.json();
    estado.ia = Boolean(dados.ia);
  } catch {
    estado.ia = false; // aberto como site estático: só modo offline
  }
  selo.textContent = estado.ia ? "🤖 Modo IA disponível" : "📦 Modo offline (modelos prontos)";
  $("#usarIA").checked = estado.ia;
  $("#linha-ia").hidden = !estado.ia;
}

function preencherTemas() {
  const datalist = $("#temas-prontos");
  const chips = $("#chips-temas");
  for (const tema of Object.values(TEMAS_PRONTOS)) {
    const opt = document.createElement("option");
    opt.value = tema.nome;
    datalist.append(opt);
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = tema.nome;
    chip.addEventListener("click", () => { $("#tema").value = tema.nome; $("#tema").focus(); });
    chips.append(chip);
  }
}

function restaurarPerfil() {
  const perfil = JSON.parse(localStorage.getItem(CHAVE_PERFIL) || "{}");
  const form = $("#form");
  for (const campo of ["marca", "handle", "cidade", "nicho", "tom"]) {
    if (perfil[campo]) form.elements[campo].value = perfil[campo];
  }
}

function salvarPerfil(b) {
  const { marca, handle, cidade, nicho, tom } = b;
  localStorage.setItem(CHAVE_PERFIL, JSON.stringify({ marca, handle, cidade, nicho, tom }));
}

// ---------------------------------------------------------------------------
// Abas
// ---------------------------------------------------------------------------
function trocarAba(nome) {
  $$(".aba").forEach((b) => b.classList.toggle("ativa", b.dataset.aba === nome));
  $$(".painel-aba").forEach((p) => p.classList.toggle("ativo", p.id === `aba-${nome}`));
  if (nome === "historico") renderizarHistorico();
}

// ---------------------------------------------------------------------------
// Geração
// ---------------------------------------------------------------------------
function lerBriefing() {
  const dados = Object.fromEntries(new FormData($("#form")).entries());
  dados.usarIA = $("#usarIA").checked;
  dados.numSlides = Number(dados.numSlides) || 7;
  if (dados.handle && !dados.handle.startsWith("@")) dados.handle = `@${dados.handle}`;
  return dados;
}

async function gerar(briefing) {
  const erro = $("#erro");
  const botao = $("#botao-gerar");
  erro.hidden = true;

  if (!briefing.tema?.trim()) {
    erro.textContent = "Informe o tema do conteúdo.";
    erro.hidden = false;
    return;
  }
  salvarPerfil(briefing);

  let conteudo;
  let origem = "offline";
  if (briefing.usarIA && estado.ia) {
    botao.disabled = true;
    botao.textContent = "Gerando com IA…";
    try {
      const r = await fetch("api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(briefing),
      });
      const dados = await r.json();
      if (!r.ok) throw new Error(dados.erro || "Falha ao gerar.");
      conteudo = dados.conteudo;
      origem = "ia";
    } catch (e) {
      erro.textContent = `${e.message} Usando o gerador offline.`;
      erro.hidden = false;
    } finally {
      botao.disabled = false;
      botao.textContent = "Gerar conteúdo";
    }
  }
  conteudo ??= gerarOffline(briefing);

  estado.atual = { briefing, conteudo, origem, criadoEm: new Date().toISOString() };
  adicionarHistorico(estado.atual);
  renderizarResultado();
}

// ---------------------------------------------------------------------------
// Resultado
// ---------------------------------------------------------------------------
function textoHashtags(lista) {
  return lista.map((t) => (t.startsWith("#") ? t : `#${t}`)).join(" ");
}

function lerHashtags(texto) {
  return texto.split(/[\s,]+/).filter(Boolean).map((t) => (t.startsWith("#") ? t : `#${t}`));
}

function renderizarResultado() {
  const { conteudo, origem } = estado.atual;
  const caixa = $("#resultado");
  caixa.classList.remove("vazio");
  caixa.replaceChildren($("#tpl-resultado").content.cloneNode(true));

  const campo = (nome) => $(`[data-campo="${nome}"]`, caixa);
  campo("titulo").textContent = conteudo.titulo;
  campo("origem").textContent = origem === "ia" ? "Gerado com IA" : "Modelo offline";

  // Legenda + hashtags
  const legenda = campo("legenda");
  const hashtags = campo("hashtags");
  legenda.value = conteudo.legenda;
  hashtags.value = textoHashtags(conteudo.hashtags);
  const atualizarContador = () => {
    conteudo.legenda = legenda.value;
    conteudo.hashtags = lerHashtags(hashtags.value);
    const total = legenda.value.length + 2 + hashtags.value.length;
    const n = conteudo.hashtags.length;
    campo("contador").innerHTML =
      `<span class="${total > LIMITE_LEGENDA ? "excesso" : ""}">${total}/${LIMITE_LEGENDA} caracteres</span> · ` +
      `<span class="${n > LIMITE_HASHTAGS ? "excesso" : ""}">${n}/${LIMITE_HASHTAGS} hashtags</span>`;
    renderizarConformidade(campo("conformidade"));
  };
  legenda.addEventListener("input", atualizarContador);
  hashtags.addEventListener("input", atualizarContador);

  // Sub-abas
  $$(".subaba", caixa).forEach((b) => b.addEventListener("click", () => {
    $$(".subaba", caixa).forEach((x) => x.classList.toggle("ativa", x === b));
    $$(".sub-painel", caixa).forEach((p) => p.classList.toggle("ativo", p.dataset.painel === b.dataset.sub));
    if (b.dataset.sub === "artes") renderizarArtes();
  }));

  // Ações
  $('[data-acao="copiar-legenda"]', caixa).addEventListener("click", (e) => copiar(legenda.value, e.target));
  $('[data-acao="copiar-tudo"]', caixa).addEventListener("click", (e) => copiar(`${legenda.value}\n.\n.\n.\n${hashtags.value}`, e.target));
  $('[data-acao="baixar-txt"]', caixa).addEventListener("click", baixarTxt);
  $('[data-acao="baixar-artes"]', caixa).addEventListener("click", baixarArtes);

  // Seletores de arte
  const selPaleta = campo("paleta");
  for (const [id, p] of Object.entries(PALETAS)) selPaleta.add(new Option(p.nome, id));
  selPaleta.value = estado.paleta;
  selPaleta.addEventListener("change", () => { estado.paleta = selPaleta.value; renderizarArtes(); });
  const selTamanho = campo("tamanho");
  for (const [id, t] of Object.entries(TAMANHOS)) selTamanho.add(new Option(t.nome, id));
  estado.tamanho = estado.atual.briefing.formato === "stories" || estado.atual.briefing.formato === "reels" ? "vertical" : estado.tamanho === "vertical" ? "retrato" : estado.tamanho;
  selTamanho.value = estado.tamanho;
  selTamanho.addEventListener("change", () => { estado.tamanho = selTamanho.value; renderizarArtes(); });

  renderizarRoteiro(campo("roteiro"));

  // Dicas
  campo("sugestaoVisual").textContent = conteudo.sugestaoVisual;
  campo("textoAlternativo").textContent = conteudo.textoAlternativo;
  campo("melhorHorario").textContent = conteudo.melhorHorario;
  const obs = campo("observacoes");
  for (const o of conteudo.observacoes) {
    const li = document.createElement("li");
    li.textContent = o;
    obs.append(li);
  }

  atualizarContador();
  caixa.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderizarConformidade(alvo) {
  const { conteudo } = estado.atual;
  const texto = [conteudo.legenda, ...conteudo.slides.flatMap((s) => [s.titulo, s.texto])].join("\n");
  const alertas = verificarConformidade(texto);
  alvo.replaceChildren();
  const box = document.createElement("div");
  box.className = `alerta-box${alertas.length ? "" : " ok"}`;
  if (!alertas.length) {
    box.textContent = "✅ Checagem ética: nenhum termo de risco encontrado. Ainda assim, revise o conteúdo antes de publicar.";
  } else {
    box.innerHTML = "<strong>⚠️ Checagem ética: revise estes trechos</strong>";
    const ul = document.createElement("ul");
    for (const a of alertas) {
      const li = document.createElement("li");
      li.innerHTML = `<em></em> — <span></span>`;
      li.querySelector("em").textContent = `"${a.trecho}"`;
      li.querySelector("span").textContent = a.alerta;
      ul.append(li);
    }
    box.append(ul);
  }
  alvo.append(box);
}

function renderizarRoteiro(alvo) {
  const { conteudo, briefing } = estado.atual;
  alvo.replaceChildren();
  const tabela = (cabecalho, linhas) => {
    const t = document.createElement("table");
    t.className = "roteiro";
    const tr = t.createTHead().insertRow();
    for (const c of cabecalho) { const th = document.createElement("th"); th.textContent = c; tr.append(th); }
    const corpo = t.createTBody();
    for (const l of linhas) {
      const r = corpo.insertRow();
      for (const c of l) r.insertCell().textContent = c;
    }
    return t;
  };

  if (conteudo.roteiroReels?.length) {
    const h = document.createElement("h3"); h.textContent = "🎬 Roteiro do Reels";
    alvo.append(h, tabela(["Tempo", "Cena", "Fala / texto na tela"], conteudo.roteiroReels.map((c) => [c.tempo, c.cena, c.fala])));
  }
  if (conteudo.stories?.length) {
    const h = document.createElement("h3"); h.textContent = "📱 Sequência de Stories";
    alvo.append(h, tabela(["#", "Tipo", "Texto"], conteudo.stories.map((s, i) => [String(i + 1), s.tipo, s.texto])));
  }
  if (conteudo.slides?.length && briefing.formato === "carrossel") {
    const h = document.createElement("h3"); h.textContent = "🖼️ Texto dos slides";
    alvo.append(h, tabela(["#", "Título", "Texto"], conteudo.slides.map((s, i) => [String(i + 1), s.titulo, s.texto])));
  }
  if (!alvo.childElementCount) {
    alvo.textContent = "Este formato não tem roteiro. Escolha Reels ou Stories para receber um roteiro.";
  }
}

function opcoesArte(indice) {
  const { briefing, conteudo } = estado.atual;
  return {
    paleta: estado.paleta,
    tamanho: estado.tamanho,
    indice,
    total: conteudo.slides.length,
    marca: briefing.marca,
    handle: briefing.handle,
  };
}

function renderizarArtes() {
  const alvo = $('[data-campo="artes"]');
  if (!alvo) return;
  const { conteudo } = estado.atual;
  alvo.replaceChildren();
  conteudo.slides.forEach((slide, i) => {
    const bloco = document.createElement("div");
    bloco.className = "arte";
    const canvas = document.createElement("canvas");
    const titulo = document.createElement("input");
    titulo.value = slide.titulo;
    titulo.setAttribute("aria-label", `Título do slide ${i + 1}`);
    const texto = document.createElement("textarea");
    texto.rows = 3;
    texto.value = slide.texto;
    texto.setAttribute("aria-label", `Texto do slide ${i + 1}`);
    const botao = document.createElement("button");
    botao.className = "botao";
    botao.textContent = `⬇️ Slide ${i + 1}`;
    const redesenhar = () => {
      slide.titulo = titulo.value;
      slide.texto = texto.value;
      desenharSlide(canvas, slide, opcoesArte(i));
    };
    titulo.addEventListener("input", redesenhar);
    texto.addEventListener("input", redesenhar);
    botao.addEventListener("click", () => baixarCanvas(canvas, nomeArquivo(`slide-${i + 1}.png`)));
    bloco.append(canvas, titulo, texto, botao);
    alvo.append(bloco);
    redesenhar();
  });
}

async function baixarArtes() {
  const canvas = document.createElement("canvas");
  const { conteudo } = estado.atual;
  for (const [i, slide] of conteudo.slides.entries()) {
    desenharSlide(canvas, slide, opcoesArte(i));
    baixarCanvas(canvas, nomeArquivo(`slide-${i + 1}.png`));
    await new Promise((r) => setTimeout(r, 300)); // evita bloqueio de vários downloads
  }
}

function nomeArquivo(sufixo) {
  const base = estado.atual.conteudo.titulo
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "conteudo";
  return `${base}-${sufixo}`;
}

function baixarTxt() {
  const { conteudo } = estado.atual;
  const partes = [
    `TÍTULO: ${conteudo.titulo}`,
    "",
    "LEGENDA:",
    conteudo.legenda,
    "",
    "HASHTAGS:",
    textoHashtags(conteudo.hashtags),
    "",
    "SLIDES:",
    ...conteudo.slides.map((s, i) => `${i + 1}. ${s.titulo} — ${s.texto.replace(/\n/g, " / ")}`),
  ];
  if (conteudo.roteiroReels?.length) partes.push("", "ROTEIRO REELS:", ...conteudo.roteiroReels.map((c) => `[${c.tempo}] ${c.cena} | ${c.fala}`));
  if (conteudo.stories?.length) partes.push("", "STORIES:", ...conteudo.stories.map((s, i) => `${i + 1}. (${s.tipo}) ${s.texto}`));
  partes.push("", `TEXTO ALTERNATIVO: ${conteudo.textoAlternativo}`, `MELHOR HORÁRIO: ${conteudo.melhorHorario}`);
  const blob = new Blob([partes.join("\n")], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nomeArquivo("conteudo.txt");
  link.click();
  URL.revokeObjectURL(link.href);
}

async function copiar(texto, botao) {
  try {
    await navigator.clipboard.writeText(texto);
    const original = botao.textContent;
    botao.textContent = "✅ Copiado!";
    setTimeout(() => { botao.textContent = original; }, 1500);
  } catch {
    alert("Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.");
  }
}

// ---------------------------------------------------------------------------
// Histórico
// ---------------------------------------------------------------------------
function lerHistorico() {
  try { return JSON.parse(localStorage.getItem(CHAVE_HISTORICO) || "[]"); } catch { return []; }
}

function adicionarHistorico(item) {
  const lista = [item, ...lerHistorico()].slice(0, 50);
  localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(lista));
}

function renderizarHistorico() {
  const ul = $("#lista-historico");
  ul.replaceChildren();
  const lista = lerHistorico();
  if (!lista.length) {
    ul.innerHTML = "<li>Nenhum conteúdo gerado ainda.</li>";
    return;
  }
  for (const item of lista) {
    const li = document.createElement("li");
    const info = document.createElement("div");
    const data = new Date(item.criadoEm).toLocaleString("pt-BR");
    info.innerHTML = "<strong></strong><br><small></small>";
    info.querySelector("strong").textContent = item.conteudo.titulo;
    info.querySelector("small").textContent = `${item.briefing.formato} · ${item.briefing.objetivo} · ${data}`;
    const abrir = document.createElement("button");
    abrir.className = "botao";
    abrir.textContent = "Abrir";
    abrir.addEventListener("click", () => {
      estado.atual = structuredClone(item);
      trocarAba("gerar");
      renderizarResultado();
    });
    li.append(info, abrir);
    ul.append(li);
  }
}

// ---------------------------------------------------------------------------
// Calendário
// ---------------------------------------------------------------------------
const ROTULOS = {
  carrossel: "Carrossel", post: "Post", reels: "Reels", stories: "Stories",
  educar: "Educar", engajar: "Engajar", autoridade: "Autoridade", vender: "Divulgar serviço", bastidores: "Bastidores",
};

function montarCalendario(e) {
  e.preventDefault();
  const form = e.target;
  const [ano, mes, dia] = form.elements.inicio.value.split("-").map(Number);
  const temas = form.elements.temas.value.split("\n").map((t) => t.trim()).filter(Boolean);
  estado.calendario = gerarCalendario({
    dias: Number(form.elements.dias.value),
    inicio: new Date(ano, mes - 1, dia, 12),
    temas,
  });
  const alvo = $("#calendario");
  alvo.replaceChildren();
  for (const item of estado.calendario) {
    const b = document.createElement("button");
    b.className = "dia";
    const [a, m, d] = item.data.split("-");
    b.innerHTML = `<span class="data"></span><span class="tema"></span><span class="tag"></span><span class="data"></span>`;
    const spans = b.querySelectorAll("span");
    spans[0].textContent = `${item.diaSemana}, ${d}/${m}/${a}`;
    spans[1].textContent = item.tema;
    spans[2].textContent = `${ROTULOS[item.formato]} · ${ROTULOS[item.objetivo]}`;
    spans[3].textContent = item.horario;
    b.addEventListener("click", () => {
      const f = $("#form");
      f.elements.tema.value = item.tema;
      f.elements.formato.value = item.formato;
      f.elements.objetivo.value = item.objetivo;
      trocarAba("gerar");
      gerar(lerBriefing());
    });
    alvo.append(b);
  }
  $("#acoes-calendario").hidden = false;
}

function exportarCSV() {
  const linhas = [["Data", "Dia", "Tema", "Formato", "Objetivo", "Horário sugerido"]];
  for (const i of estado.calendario) linhas.push([i.data, i.diaSemana, i.tema, ROTULOS[i.formato], ROTULOS[i.objetivo], i.horario]);
  const csv = linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "calendario-editorial.csv";
  link.click();
  URL.revokeObjectURL(link.href);
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------
$$(".aba").forEach((b) => b.addEventListener("click", () => trocarAba(b.dataset.aba)));
$("#form").addEventListener("submit", (e) => { e.preventDefault(); gerar(lerBriefing()); });
$("#form-calendario").addEventListener("submit", montarCalendario);
$("#exportar-csv").addEventListener("click", exportarCSV);
$("#limpar-historico").addEventListener("click", () => {
  if (confirm("Apagar todo o histórico deste navegador?")) {
    localStorage.removeItem(CHAVE_HISTORICO);
    renderizarHistorico();
  }
});

const hoje = new Date();
$("#cal-inicio").value = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;

preencherTemas();
restaurarPerfil();
verificarModo();
// Redesenha as artes quando a fonte Poppins terminar de carregar.
document.fonts?.ready.then(() => { if (estado.atual) renderizarArtes(); });
