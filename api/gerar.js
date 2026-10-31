import { tratarGeracao } from "../lib/claude.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ erro: "Use POST." });
  }
  let briefing = req.body;
  if (typeof briefing === "string") {
    try { briefing = JSON.parse(briefing); } catch { briefing = null; }
  }
  const { status, corpo } = await tratarGeracao(briefing);
  res.status(status).json(corpo);
}
