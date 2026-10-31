// Lógica do modo IA, compartilhada entre o servidor local (server.js)
// e as funções da Vercel (api/).

import Anthropic from "@anthropic-ai/sdk";
import { SCHEMA_CONTEUDO, montarPromptSistema, montarPedido } from "../public/prompt.js";

export const MODELO = process.env.CLAUDE_MODEL || "claude-opus-5-5";

export function iaDisponivel() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let cliente = null;
function obterCliente() {
  cliente ??= new Anthropic();
  return cliente;
}

export function status() {
  const ia = iaDisponivel();
  return { ia, modelo: ia ? MODELO : null };
}

async function gerarComClaude(briefing) {
  const resposta = await obterCliente().beta.messages.create({
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

// Recebe o briefing já lido e devolve { status, corpo } para a resposta HTTP.
export async function tratarGeracao(briefing) {
  if (!iaDisponivel()) {
    return { status: 503, corpo: { erro: "Modo IA indisponível: configure ANTHROPIC_API_KEY no servidor." } };
  }
  if (!briefing || typeof briefing.tema !== "string" || !briefing.tema.trim()) {
    return { status: 400, corpo: { erro: "Informe o tema do conteúdo." } };
  }
  try {
    const conteudo = await gerarComClaude(briefing);
    return { status: 200, corpo: { conteudo, origem: "ia" } };
  } catch (erro) {
    if (erro instanceof Anthropic.AuthenticationError) {
      return { status: 401, corpo: { erro: "Chave da API inválida. Verifique ANTHROPIC_API_KEY." } };
    }
    if (erro instanceof Anthropic.RateLimitError) {
      return { status: 429, corpo: { erro: "Limite de uso atingido. Aguarde alguns instantes e tente de novo." } };
    }
    if (erro instanceof Anthropic.APIConnectionError) {
      return { status: 502, corpo: { erro: "Não foi possível conectar à API. Verifique a internet do servidor." } };
    }
    if (erro instanceof Anthropic.APIError) {
      console.error("Erro da API:", erro.status, erro.message);
      return { status: 502, corpo: { erro: `Erro da API (${erro.status ?? "?"}). Tente novamente.` } };
    }
    console.error(erro);
    return { status: erro.status || 500, corpo: { erro: erro.message || "Erro interno." } };
  }
}
