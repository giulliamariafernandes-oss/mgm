import { test } from "node:test";
import assert from "node:assert/strict";
import { gerarOffline, verificarConformidade, gerarCalendario, encontrarTemaPronto, paraHashtag } from "../public/gerador.js";
import { SCHEMA_CONTEUDO, montarPedido } from "../public/prompt.js";

const briefingBase = { tema: "descarte de medicamentos", formato: "carrossel", objetivo: "educar", tom: "acolhedor", nicho: "farmacia", numSlides: 7 };

test("gera carrossel com o número de slides pedido", () => {
  for (const n of [3, 5, 7, 10]) {
    const c = gerarOffline({ ...briefingBase, numSlides: n });
    assert.ok(c.slides.length <= n && c.slides.length >= 3, `n=${n} gerou ${c.slides.length}`);
  }
  const generico = gerarOffline({ ...briefingBase, tema: "saúde do sono", numSlides: 7 });
  assert.equal(generico.slides.length, 7);
});

test("conteúdo offline tem todos os campos do esquema", () => {
  for (const formato of ["post", "carrossel", "reels", "stories"]) {
    const c = gerarOffline({ ...briefingBase, formato });
    for (const campo of SCHEMA_CONTEUDO.required) assert.ok(campo in c, `${formato}: falta ${campo}`);
    if (formato !== "carrossel") assert.equal(c.slides.length, 1);
  }
  assert.ok(gerarOffline({ ...briefingBase, formato: "reels" }).roteiroReels.length >= 5);
  assert.ok(gerarOffline({ ...briefingBase, formato: "stories" }).stories.length >= 4);
});

test("legenda respeita limites do Instagram e traz aviso de saúde", () => {
  const c = gerarOffline({ ...briefingBase, marca: "Farmácia Bem Viver", handle: "@bemviver", cidade: "Campinas" });
  assert.ok(c.legenda.length < 2200);
  assert.ok(c.hashtags.length <= 15 && c.hashtags.every((h) => /^#[a-z0-9]+$/.test(h)));
  assert.ok(c.hashtags.includes("#campinas"));
  assert.match(c.legenda, /não substitui/i);
});

test("os modelos prontos passam na checagem ética", () => {
  for (const objetivo of ["educar", "engajar", "vender", "autoridade", "bastidores"]) {
    for (const tema of ["descarte", "antibióticos", "pressão arterial", "protetor solar", "vacina", "interação com alimentos", "automedicação", "guardar remédios", "serviços farmacêuticos"]) {
      const c = gerarOffline({ ...briefingBase, tema, objetivo });
      const texto = [c.legenda, ...c.slides.flatMap((s) => [s.titulo, s.texto])].join("\n");
      assert.deepEqual(verificarConformidade(texto), [], `${tema}/${objetivo}`);
    }
  }
});

test("checagem ética sinaliza termos de risco", () => {
  const alertas = verificarConformidade("Esse chá é milagroso, cura a gripe e é 100% natural, sem efeitos colaterais. Tome 2 comprimidos.");
  assert.ok(alertas.length >= 4);
});

test("reconhece temas prontos e gera hashtags limpas", () => {
  assert.equal(encontrarTemaPronto("Como medir a pressão?").nome, "Como medir a pressão corretamente");
  assert.equal(encontrarTemaPronto("tema inexistente xyz"), null);
  assert.equal(paraHashtag("Saúde da Mulher!"), "#saudedamulher");
});

test("calendário alterna formatos e mantém datas sequenciais", () => {
  const plano = gerarCalendario({ dias: 14, inicio: new Date(2026, 10, 2, 12) });
  assert.equal(plano.length, 14);
  assert.equal(plano[0].data, "2026-11-02");
  assert.equal(plano[0].diaSemana, "Segunda");
  assert.equal(plano[13].data, "2026-11-15");
  assert.ok(new Set(plano.map((p) => p.formato)).size >= 3);
});

test("pedido para a IA inclui o briefing", () => {
  const p = montarPedido({ ...briefingBase, cidade: "Campinas", extra: "aferição grátis" });
  assert.match(p, /descarte de medicamentos/);
  assert.match(p, /Campinas/);
  assert.match(p, /Número de slides: 7/);
});

test("todo tema pronto tem fontes, mito e passa nos pontos revisados", async () => {
  const { TEMAS_PRONTOS } = await import("../public/gerador.js");
  for (const [id, t] of Object.entries(TEMAS_PRONTOS)) {
    assert.ok(t.fontes.length >= 1, `${id} sem fontes`);
    assert.ok(t.mito.afirmacao && t.mito.resposta, `${id} sem mito`);
  }
  const texto = (id) => TEMAS_PRONTOS[id].slides.flat().join(" ");
  // Exercício: 60 a 90 min antes da medida (Diretrizes Brasileiras de Hipertensão).
  assert.match(texto("pressao-arterial"), /60 a 90 minutos/);
  // Descarte: manter o comprimido na embalagem primária.
  assert.match(texto("descarte-medicamentos"), /Não tire os comprimidos da cartela/);
  // Antibiótico não trata vírus.
  assert.match(texto("antibioticos"), /não trata vírus/i);
});

test("legenda de tema pronto cita as fontes; tema livre avisa que falta base", () => {
  const pronto = gerarOffline({ ...briefingBase, tema: "protetor solar" });
  assert.match(pronto.legenda, /📚 Fontes: .*RDC nº 30\/2012/);
  assert.ok(pronto.fontes.length >= 1);
  const livre = gerarOffline({ ...briefingBase, tema: "saúde do sono" });
  assert.deepEqual(livre.fontes, []);
  assert.ok(livre.observacoes.some((o) => /fontes oficiais/.test(o)));
});
