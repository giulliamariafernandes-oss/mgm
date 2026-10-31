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
import Anthropic from "@anthropic-ai/sdk";
import { SCHEMA_CONTEUDO, montarPromptSistema, montarPedido } from "./public/prompt.js";

const PORTA = Number(process.env.PORT) || 3000;
const MODELO = process.env.CLAUDE_MODEL || "claude-opus-5-5";
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

const iaDisponivel = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const cliente = iaDisponivel ? new Anthropic() : null;

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

async function gerarComClaude(briefing) {
  const resposta = await cliente.beta.messages.create({
    model: MODELO,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: SCHEMA_CONTEUDO },
    },
    system: montarPromptSistema(),
    messages: [{ role: "user", content: montarPedido(briefing) }],
  });

  if (resposta.stop_reason === "refusal") {
    const motivo = resposta.stop_details?.explanation || "o pedido foi recusado pelo modelo.";
    throw Object.assign(new Error(`Não foi possível gerar este conteúdo: ${motivo}`), { status: 422 });
  }
  if (resposta.stop_reason === "max_tokens") {
    throw Object.assign(new Error("A resposta ficou longa demais. Reduza o número de slides e tente de novo."), { status: 422 });
  }

  const texto = resposta.content
    .filter((bloco) => bloco.type === "text")
    .map((bloco) => bloco.text)
    .join("");
  return JSON.parse(texto);
}

async function tratarApi(req, res, caminho) {
  if (caminho === "/api/status" && req.method === "GET") {
    return responderJSON(res, 200, { ia: iaDisponivel, modelo: iaDisponivel ? MODELO : null });
  }

  if (caminho === "/api/gerar" && req.method === "POST") {
    if (!iaDisponivel) {
      return responderJSON(res, 503, { erro: "Modo IA indisponível: configure ANTHROPIC_API_KEY no servidor." });
    }
    try {
      const briefing = await lerCorpo(req);
      if (!briefing.tema || typeof briefing.tema !== "string") {
        return responderJSON(res, 400, { erro: "Informe o tema do conteúdo." });
      }
      const conteudo = await gerarComClaude(briefing);
      return responderJSON(res, 200, { conteudo, origem: "ia" });
    } catch (erro) {
      if (erro instanceof Anthropic.AuthenticationError) {
        return responderJSON(res, 401, { erro: "Chave da API inválida. Verifique ANTHROPIC_API_KEY." });
      }
      if (erro instanceof Anthropic.RateLimitError) {
        return responderJSON(res, 429, { erro: "Limite de uso atingido. Aguarde alguns instantes e tente de novo." });
      }
      if (erro instanceof Anthropic.APIConnectionError) {
        return responderJSON(res, 502, { erro: "Não foi possível conectar à API. Verifique a internet do servidor." });
      }
      if (erro instanceof Anthropic.APIError) {
        console.error("Erro da API:", erro.status, erro.message);
        return responderJSON(res, 502, { erro: `Erro da API (${erro.status ?? "?"}). Tente novamente.` });
      }
      console.error(erro);
      return responderJSON(res, erro.status || 500, { erro: erro.message || "Erro interno." });
    }
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
  console.log(iaDisponivel ? `Modo IA ativo (${MODELO}).` : "Modo IA desativado — usando apenas modelos offline. Defina ANTHROPIC_API_KEY para ativar.");
});
