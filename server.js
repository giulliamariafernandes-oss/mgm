// Servidor do Gerador de Conteúdos para Instagram.
// - Serve a interface estática em /public
// - POST /api/gerar  → gera conteúdo com o Claude (quando houver credencial)
// - GET  /api/status → informa se o modo IA está disponível
//
// Sem credencial configurada, a interface usa o gerador offline (modelos prontos).

import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { MODELO, iaDisponivel, status, tratarGeracao } from "./lib/claude.js";

const PORTA = Number(process.env.PORT) || 3000;
const PASTA_PUBLICA = fileURLToPath(new URL("./public/", import.meta.url));

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

function responderJSON(res, status, corpo) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(corpo));
}

async function lerCorpo(req, limite = 100_000) {
  let dados = "";
  for await (const pedaco of req) {
    dados += pedaco;
    if (dados.length > limite) throw new Error("Requisição muito grande.");
  }
  return dados ? JSON.parse(dados) : {};
}

async function tratarApi(req, res, caminho) {
  if (caminho === "/api/status" && req.method === "GET") {
    return responderJSON(res, 200, status());
  }
  if (caminho === "/api/gerar" && req.method === "POST") {
    let briefing;
    try {
      briefing = await lerCorpo(req);
    } catch {
      return responderJSON(res, 400, { erro: "Requisição inválida." });
    }
    const { status: codigo, corpo } = await tratarGeracao(briefing);
    return responderJSON(res, codigo, corpo);
  }
  return responderJSON(res, 404, { erro: "Rota não encontrada." });
}

async function servirArquivo(res, caminho) {
  const relativo = caminho === "/" ? "index.html" : caminho.slice(1);
  const completo = normalize(join(PASTA_PUBLICA, relativo));
  if (!completo.startsWith(PASTA_PUBLICA)) {
    res.writeHead(403);
    return res.end("Acesso negado");
  }
  try {
    const conteudo = await readFile(completo);
    res.writeHead(200, { "Content-Type": TIPOS[extname(completo)] || "application/octet-stream" });
    res.end(conteudo);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Arquivo não encontrado");
  }
}

const servidor = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");
  if (pathname.startsWith("/api/")) return tratarApi(req, res, pathname);
  return servirArquivo(res, decodeURIComponent(pathname));
});

servidor.listen(PORTA, () => {
  console.log(`Gerador de Conteúdos rodando em http://localhost:${PORTA}`);
  console.log(iaDisponivel() ? `Modo IA ativo (${MODELO}).` : "Modo IA desativado — usando apenas modelos offline. Defina ANTHROPIC_API_KEY para ativar.");
});
