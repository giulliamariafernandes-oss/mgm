// Renderiza slides/artes do Instagram em <canvas> e permite baixar como PNG.

export const PALETAS = {
  farmacia: { nome: "Verde farmácia", fundo: "#0f766e", fundo2: "#14b8a6", texto: "#ffffff", destaque: "#fde68a" },
  clinico: { nome: "Azul clínico", fundo: "#1e3a8a", fundo2: "#3b82f6", texto: "#ffffff", destaque: "#a5f3fc" },
  lavanda: { nome: "Lavanda", fundo: "#6d28d9", fundo2: "#c084fc", texto: "#ffffff", destaque: "#fef08a" },
  coral: { nome: "Coral", fundo: "#e11d48", fundo2: "#fb923c", texto: "#ffffff", destaque: "#fff7ed" },
  claro: { nome: "Claro minimalista", fundo: "#f8fafc", fundo2: "#e2e8f0", texto: "#0f172a", destaque: "#0f766e" },
  noturno: { nome: "Noturno", fundo: "#0f172a", fundo2: "#334155", texto: "#f8fafc", destaque: "#34d399" },
};

export const TAMANHOS = {
  retrato: { nome: "Feed retrato 4:5 (1080×1350)", w: 1080, h: 1350 },
  quadrado: { nome: "Feed quadrado 1:1 (1080×1080)", w: 1080, h: 1080 },
  vertical: { nome: "Stories/Reels 9:16 (1080×1920)", w: 1080, h: 1920 },
};

function quebrarLinhas(ctx, texto, larguraMax) {
  const linhas = [];
  for (const paragrafo of String(texto).split("\n")) {
    const palavras = paragrafo.split(/\s+/).filter(Boolean);
    if (!palavras.length) { linhas.push(""); continue; }
    let atual = palavras[0];
    for (const p of palavras.slice(1)) {
      const teste = `${atual} ${p}`;
      if (ctx.measureText(teste).width > larguraMax) { linhas.push(atual); atual = p; }
      else atual = teste;
    }
    linhas.push(atual);
  }
  return linhas;
}

// Reduz a fonte até o bloco de texto caber na altura disponível.
function ajustarTexto(ctx, texto, { larguraMax, alturaMax, tamanhoInicial, tamanhoMin, peso, entrelinha }) {
  let tamanho = tamanhoInicial;
  let linhas;
  do {
    ctx.font = `${peso} ${tamanho}px "Poppins", "Segoe UI", system-ui, sans-serif`;
    linhas = quebrarLinhas(ctx, texto, larguraMax);
    if (linhas.length * tamanho * entrelinha <= alturaMax) break;
    tamanho -= 4;
  } while (tamanho > tamanhoMin);
  return { linhas, tamanho };
}

export function desenharSlide(canvas, slide, opcoes) {
  const { paleta = "farmacia", tamanho = "retrato", indice = 0, total = 1, marca = "", handle = "" } = opcoes;
  const cores = PALETAS[paleta] || PALETAS.farmacia;
  const { w, h } = TAMANHOS[tamanho] || TAMANHOS.retrato;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  const capa = indice === 0;
  const margem = 96;

  // Fundo em degradê
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, cores.fundo);
  grad.addColorStop(1, capa ? cores.fundo2 : cores.fundo);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Formas decorativas
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = cores.texto;
  ctx.beginPath();
  ctx.arc(w - 60, 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(80, h - 60, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Cruz de farmácia discreta no canto
  ctx.fillStyle = cores.destaque;
  const cx = margem + 22, cy = margem + 22, b = 14, l = 44;
  ctx.fillRect(cx - l / 2, cy - b / 2, l, b);
  ctx.fillRect(cx - b / 2, cy - l / 2, b, l);

  // Numeração
  if (total > 1) {
    ctx.font = `600 34px "Poppins", system-ui, sans-serif`;
    ctx.fillStyle = cores.texto;
    ctx.textAlign = "right";
    ctx.fillText(`${indice + 1}/${total}`, w - margem, margem + 34);
    ctx.textAlign = "left";
  }

  const larguraTexto = w - margem * 2;
  const topo = margem + 120;
  const rodape = 150;
  const areaUtil = h - topo - rodape;

  // Título
  const titulo = ajustarTexto(ctx, slide.titulo || "", {
    larguraMax: larguraTexto,
    alturaMax: areaUtil * (capa ? 0.6 : 0.35),
    tamanhoInicial: capa ? 112 : 78,
    tamanhoMin: 40,
    peso: 800,
    entrelinha: 1.15,
  });

  // Texto
  ctx.font = "400 10px sans-serif";
  const corpo = ajustarTexto(ctx, slide.texto || "", {
    larguraMax: larguraTexto,
    alturaMax: areaUtil * (capa ? 0.3 : 0.55),
    tamanhoInicial: capa ? 48 : 50,
    tamanhoMin: 26,
    peso: 400,
    entrelinha: 1.4,
  });

  const alturaTitulo = titulo.linhas.length * titulo.tamanho * 1.15;
  const alturaCorpo = corpo.linhas.length * corpo.tamanho * 1.4;
  const espaco = 48;
  let y = capa ? topo + (areaUtil - alturaTitulo - alturaCorpo - espaco) / 2 : topo + 40;

  ctx.fillStyle = cores.texto;
  ctx.textBaseline = "top";
  ctx.font = `800 ${titulo.tamanho}px "Poppins", "Segoe UI", system-ui, sans-serif`;
  for (const linha of titulo.linhas) {
    ctx.fillText(linha, margem, y);
    y += titulo.tamanho * 1.15;
  }

  // Barrinha de destaque
  y += espaco / 2 - 6;
  ctx.fillStyle = cores.destaque;
  ctx.fillRect(margem, y, 120, 10);
  y += espaco / 2 + 10;

  ctx.fillStyle = cores.texto;
  ctx.font = `400 ${corpo.tamanho}px "Poppins", "Segoe UI", system-ui, sans-serif`;
  for (const linha of corpo.linhas) {
    ctx.fillText(linha, margem, y);
    y += corpo.tamanho * 1.4;
  }

  // Rodapé com marca e @
  ctx.globalAlpha = 0.9;
  ctx.font = `600 32px "Poppins", system-ui, sans-serif`;
  ctx.fillStyle = cores.texto;
  ctx.textBaseline = "alphabetic";
  const assinatura = [marca, handle].filter(Boolean).join("  •  ");
  if (assinatura) ctx.fillText(assinatura, margem, h - 80);
  if (total > 1 && indice < total - 1) {
    ctx.textAlign = "right";
    ctx.fillText("arraste →", w - margem, h - 80);
    ctx.textAlign = "left";
  }
  ctx.globalAlpha = 1;
}

export function baixarCanvas(canvas, nomeArquivo) {
  const link = document.createElement("a");
  link.download = nomeArquivo;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
