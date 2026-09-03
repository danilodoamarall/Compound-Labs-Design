// Converte o CSV agregado da State of Prototyping Spring 2026 (UX Tools, CC BY 4.0)
// em content/data/state-of-prototyping-2026.json, com rótulos pt-BR/en e valores derivados.
// Uso: node scripts/csv-to-json.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const src = join(root, "content/data/source/state-of-prototyping-spring-2026.csv");
const out = join(root, "content/data/state-of-prototyping-2026.json");

function parseCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = [];
    let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { q = !q; continue; }
      if (ch === "," && !q) { cells.push(cur); cur = ""; continue; }
      cur += ch;
    }
    cells.push(cur);
    rows.push(cells);
  }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

const num = (v) => (v === "" || v == null ? null : Number(v));
const rows = parseCsv(readFileSync(src, "utf8"));
const by = (table) => rows.filter((r) => r.table === table);

// Rótulos: chave estável + en (como no instrumento) + pt-BR
const L = {
  roles: {
    "IC Designer": ["ic-designer", "IC Designer", "IC Designer"],
    "Lead / Principal": ["lead-principal", "Lead / Principal", "Lead / Principal"],
    "Manager / Director": ["manager-director", "Manager / Director", "Manager / Director"],
    "Design Engineer": ["design-engineer", "Design Engineer", "Design Engineer"],
    "Non-designer": ["non-designer", "Non-designer", "Não designer"],
    "Researcher": ["researcher", "Researcher", "Researcher"],
  },
  regions: {
    "North America": ["north-america", "North America", "América do Norte"],
    "Western Europe": ["western-europe", "Western Europe", "Europa Ocidental"],
    "South Asia": ["south-asia", "South Asia", "Sul da Ásia"],
    "Eastern Europe": ["eastern-europe", "Eastern Europe", "Europa Oriental"],
    "Northern Europe": ["northern-europe", "Northern Europe", "Europa do Norte"],
    "Southeast Asia": ["southeast-asia", "Southeast Asia", "Sudeste Asiático"],
    "Southern Europe": ["southern-europe", "Southern Europe", "Europa do Sul"],
    "South America": ["south-america", "South America", "América do Sul"],
    "Australia & New Zealand": ["anz", "Australia & New Zealand", "Austrália e Nova Zelândia"],
    "Western Asia (Middle East)": ["western-asia", "Western Asia (Middle East)", "Ásia Ocidental (Oriente Médio)"],
    "West Africa": ["west-africa", "West Africa", "África Ocidental"],
    "Northern Africa": ["northern-africa", "Northern Africa", "Norte da África"],
    "Central Asia": ["central-asia", "Central Asia", "Ásia Central"],
    "East Asia": ["east-asia", "East Asia", "Ásia Oriental"],
    "East Africa": ["east-africa", "East Africa", "África Oriental"],
    "Southern Africa": ["southern-africa", "Southern Africa", "África Austral"],
    "Central America & Caribbean": ["central-america", "Central America & Caribbean", "América Central e Caribe"],
    "Central Africa": ["central-africa", "Central Africa", "África Central"],
  },
  vibe: {
    "None (0%)": ["none", "None (0%)", "Nenhum (0%)"],
    "Occasionally": ["occasionally", "Occasionally", "Ocasionalmente"],
    "About half": ["about-half", "About half", "Cerca de metade"],
    "Most of it": ["most", "Most of it", "A maioria"],
    "Nearly all": ["nearly-all", "Nearly all", "Quase tudo"],
  },
  company: {
    "Startup (2–100)": ["startup", "Startup (2–100)", "Startup (2–100)"],
    "Independent / Freelance": ["independent", "Independent / Freelance", "Independente / Freelance"],
    "Enterprise (1,000+)": ["enterprise", "Enterprise (1,000+)", "Enterprise (1.000+)"],
    "Mid-size (101–999)": ["mid-size", "Mid-size (101–999)", "Média (101–999)"],
    "Agency / Consulting": ["agency", "Agency / Consulting", "Agência / Consultoria"],
    "Student / Between": ["student", "Student / Between", "Estudante / Entre empregos"],
  },
  built: {
    "Yes, once or twice": ["once-or-twice", "Yes, once or twice", "Sim, uma ou duas vezes"],
    "No, but I want to": ["want-to", "No, but I want to", "Não, mas quero"],
    "Yes, I do it regularly": ["regularly", "Yes, I do it regularly", "Sim, faço regularmente"],
    "No, don't plan to": ["no-plan", "No, don't plan to", "Não, e não pretendo"],
  },
  trust: {
    "Don't use AI output": ["dont-use", "Don't use AI output", "Não uso saída de IA"],
    "Exploration only": ["exploration", "Exploration only", "Só para exploração"],
    "First drafts, edit heavily": ["drafts", "First drafts, edit heavily", "Primeiro rascunho, edito muito"],
    "Review before shipping": ["review", "Review before shipping", "Reviso antes de enviar"],
    "Ships with minor tweaks": ["minor-tweaks", "Ships with minor tweaks", "Envia com pequenos ajustes"],
    "Full trust, no oversight": ["full-trust", "Full trust, no oversight", "Confiança total, sem revisão"],
  },
  blockers: {
    "Time to learn tools": ["time-to-learn", "Time to learn tools", "Tempo para aprender ferramentas"],
    "Too many tools": ["too-many-tools", "Too many tools", "Ferramentas demais para avaliar"],
    "AI output quality": ["ai-quality", "AI output quality", "Qualidade da saída da IA"],
    "Budget / procurement": ["budget", "Budget / procurement", "Orçamento / procurement"],
    "Security / compliance": ["security", "Security / compliance", "Segurança / compliance"],
    "Engineering constraints": ["engineering", "Engineering constraints", "Restrições de engenharia"],
  },
  workflow: {
    "Added AI tools": ["added-ai", "Added AI tools", "Adicionei ferramentas de IA"],
    "AI is now central": ["ai-central", "AI is now central", "A IA agora é central"],
    "Still in flux": ["in-flux", "Still in flux", "Ainda em transição"],
    "Mostly the same": ["same", "Mostly the same", "Praticamente igual"],
    "Consolidated tools": ["consolidated", "Consolidated tools", "Consolidei ferramentas"],
  },
  investing: {
    "AI-generated coding": ["ai-coding", "AI-generated coding", "Código gerado por IA"],
    "Agent workflows": ["agents", "Agent workflows", "Workflows com agentes"],
    "Design systems & tokens": ["design-systems", "Design systems & tokens", "Design systems e tokens"],
    "Canvas design tools": ["canvas", "Canvas design tools", "Ferramentas de canvas"],
    "Video, motion & 3D": ["video-motion-3d", "Video, motion & 3D", "Vídeo, motion e 3D"],
    "Simplifying my stack": ["simplify", "Simplifying my stack", "Simplificar meu stack"],
    "Image generation": ["image-gen", "Image generation", "Geração de imagem"],
    "No-code (not AI)": ["no-code", "No-code (not AI)", "No-code (sem IA)"],
    "Manual coding": ["manual-coding", "Manual coding", "Código manual"],
    "No major changes": ["no-changes", "No major changes", "Sem grandes mudanças"],
  },
};

const AI_TOOLS = new Set(["Claude", "ChatGPT", "Claude Code", "Figma Make", "Gemini"]);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function item(map, value, extra = {}) {
  const m = map[value];
  if (!m) throw new Error(`Rótulo sem tradução: ${value}`);
  return { key: m[0], en: m[1], pt: m[2], ...extra };
}

const roles = by("role_distribution").map((r) => item(L.roles, r.value, { n: num(r.n), pct: num(r.pct) }));
const regions = by("region_distribution").filter((r) => r.dimension === "region")
  .map((r) => item(L.regions, r.value, { n: num(r.n), pct: num(r.pct) }));
const outsideNA = by("region_distribution").find((r) => r.dimension === "outside_north_america");

const vibe = by("vibe_distribution").filter((r) => r.dimension === "tier")
  .map((r, i) => item(L.vibe, r.value, { order: i, n: num(r.n), pct: num(r.pct) }));
const vibe50 = by("vibe_distribution").find((r) => r.dimension === "pct_50plus");

const vibeByRole = by("vibe_by_role").map((r) =>
  item(L.roles, r.value, { n: num(r.n), pct: num(r.pct), directional: /small n/.test(r.note) }));

const satisfaction = by("satisfaction").filter((r) => r.dimension === "tier").map((r) => {
  const tier = vibe.find((v) => v.en === r.value);
  return { key: tier.key, en: tier.en, pt: tier.pt, order: tier.order, n: tier.n, mean: num(r.mean) };
});
const satisfactionOverall = num(by("satisfaction").find((r) => r.dimension === "overall_mean").mean);
const satisfactionDelta = num(by("satisfaction").find((r) => r.dimension === "delta").mean);

const outlook = Object.values(L.roles).map(([key, en, pt]) => {
  const pick = (t) => num(by(t).find((r) => r.value === en)?.pct);
  const roleRow = roles.find((r) => r.key === key);
  const mv = pick("outlook_more_valuable"), ls = pick("outlook_less_secure"), same = pick("outlook_about_same");
  return {
    key, en, pt, n: roleRow.n,
    moreValuable: mv, lessSecure: ls, aboutSame: same,
    net: Math.round((mv - ls) * 10) / 10,
    unaccounted: Math.round((100 - mv - ls - same) * 10) / 10,
    directional: key === "researcher",
  };
});

const tools = by("tools").map((r) => ({ key: slug(r.value), en: r.value, pt: r.value, n: num(r.n), pct: num(r.pct), ai: AI_TOOLS.has(r.value) }));
const company = by("company_context").map((r) => item(L.company, r.value, { pct: num(r.pct) }));
const builtTool = by("built_tool").map((r) => item(L.built, r.value, { pct: num(r.pct) }));

// Confiança em ordem crescente de confiança (ordinal)
const trustOrder = ["Don't use AI output", "Exploration only", "First drafts, edit heavily", "Review before shipping", "Ships with minor tweaks", "Full trust, no oversight"];
const trustRows = by("trust_level");
const trust = trustOrder.map((en, i) => item(L.trust, en, { order: i, pct: num(trustRows.find((r) => r.value === en).pct) }));

const blockers = by("blockers").map((r) => item(L.blockers, r.value, { pct: num(r.pct) }));
const workflowChange = by("workflow_change").map((r) => item(L.workflow, r.value, { pct: num(r.pct) }));
const aiCentralByCompany = by("workflow_change_by_company").map((r) => item(L.company, r.value, { n: num(r.n), pct: num(r.pct) }));
const investing = by("investing_next").map((r) => item(L.investing, r.value, { pct: num(r.pct) }));

const h = Object.fromEntries(by("headline").map((r) => [r.dimension, r.pct !== "" ? num(r.pct) : r.n !== "" ? num(r.n) : num(r.mean)]));

const r1 = (x) => Math.round(x * 10) / 10;
const pctOf = (keys, list) => r1(list.filter((x) => keys.includes(x.key)).reduce((a, x) => a + x.pct, 0));
const nOf = (keys, list) => list.filter((x) => keys.includes(x.key)).reduce((a, x) => a + x.n, 0);

const derived = {
  camps: [
    { key: "none", en: "Don't use", pt: "Não usa", tiers: ["none"], pct: pctOf(["none"], vibe), n: nOf(["none"], vibe) },
    { key: "complement", en: "Complements", pt: "Complementa", tiers: ["occasionally", "about-half"], pct: pctOf(["occasionally", "about-half"], vibe), n: nOf(["occasionally", "about-half"], vibe) },
    { key: "majority", en: "Majority of output", pt: "Maioria da produção", tiers: ["most", "nearly-all"], pct: pctOf(["most", "nearly-all"], vibe), n: nOf(["most", "nearly-all"], vibe) },
  ],
  trustGroups: {
    draftOrExploration: pctOf(["exploration", "drafts"], trust),
    shipWithReview: pctOf(["review", "minor-tweaks", "full-trust"], trust),
    shipWithReviewPass: pctOf(["review", "minor-tweaks"], trust),
    dontUse: pctOf(["dont-use"], trust),
  },
  builtAny: pctOf(["once-or-twice", "regularly"], builtTool),
  builtOrWant: pctOf(["once-or-twice", "regularly", "want-to"], builtTool),
  addedOrCentral: pctOf(["added-ai", "ai-central"], workflowChange),
  blockerSpreadTop3: r1(blockers[0].pct - blockers[2].pct),
  aiVsManualCodingRatio: r1(investing.find((i) => i.key === "ai-coding").pct / investing.find((i) => i.key === "manual-coding").pct),
  startupEnterpriseGap: r1(aiCentralByCompany.find((c) => c.key === "startup").pct - aiCentralByCompany.find((c) => c.key === "enterprise").pct),
  latinAmericaPct: pctOf(["south-america", "central-america"], regions),
  latinAmericaN: nOf(["south-america", "central-america"], regions),
  europePct: pctOf(["western-europe", "eastern-europe", "northern-europe", "southern-europe"], regions),
  aiToolsInTop10: tools.filter((t) => t.ai).length,
  claudeVsChatgptPts: r1(tools.find((t) => t.key === "claude").pct - tools.find((t) => t.key === "chatgpt").pct),
  deVsIcGapPts: r1(vibeByRole.find((v) => v.key === "design-engineer").pct - vibeByRole.find((v) => v.key === "ic-designer").pct),
  icShareOfHeavyVibeCoders: r1((vibeByRole.find((v) => v.key === "ic-designer").pct / 100 * roles.find((r) => r.key === "ic-designer").n) / vibe50.n * 100),
  satisfactionWeightedMean: Math.round(satisfaction.reduce((a, s) => a + s.mean * s.n, 0) / satisfaction.reduce((a, s) => a + s.n, 0) * 100) / 100,
};

const data = {
  meta: {
    title: "State of Prototyping Spring 2026",
    publisher: "UX Tools",
    url: "https://survey.uxtools.co/spring-2026",
    license: "CC BY 4.0",
    citation: "UX Tools. (2026). State of Prototyping Spring 2026. https://survey.uxtools.co",
    collected: { from: "2026-03-14", to: "2026-04-06" },
    n: h.total_responses,
    regions: 18,
    outsideNorthAmericaPct: num(outsideNA.pct),
    notes: {
      en: ["Self-selected sample (UX Tools newsletter, social channels, sponsor networks).", "Researcher (n=23) is directional only.", "Region breakdown uses n=1,476.", "Multi-select questions sum to more than 100%.", "Outlook percentages per role do not sum to 100%; remaining categories are not in the aggregate extract."],
      pt: ["Amostra auto-selecionada (newsletter da UX Tools, redes sociais e patrocinadores).", "Researcher (n=23) é apenas direcional.", "Distribuição regional usa n=1.476.", "Perguntas de múltipla escolha somam mais de 100%.", "Percentuais de sentimento por papel não somam 100%; categorias restantes não constam do extrato agregado."],
    },
  },
  headline: h,
  roles, regions, vibe, vibe50: { n: vibe50.n ? num(vibe50.n) : null, pct: num(vibe50.pct) }, vibeByRole,
  satisfaction, satisfactionOverall, satisfactionDelta,
  outlook, tools, company, builtTool, trust, blockers, workflowChange, aiCentralByCompany, investing,
  derived,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(data, null, 2) + "\n");
console.log(`ok: ${out}`);
console.log(JSON.stringify(derived, null, 2));
