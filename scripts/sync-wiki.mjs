#!/usr/bin/env node
/**
 * ARC Raiders Wiki Sync
 *
 * Scrapes arcraiders.wiki and outputs structured JSON for all items,
 * weapons, augments, shields, ammo, mods, grenades, materials, AND traders.
 *
 * Usage:  node scripts/sync-wiki.mjs
 * Output: scripts/wiki-data.json
 */

const API = "https://arcraiders.wiki/w/api.php";
const DELAY = 150;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function getCategoryPages(cat) {
  const pages = [];
  let cont = "";
  do {
    const url =
      `${API}?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(cat)}` +
      `&cmlimit=100&cmtype=page&format=json${cont ? `&cmcontinue=${cont}` : ""}`;
    const data = await fetchJson(url);
    for (const m of data?.query?.categorymembers ?? []) pages.push(m.title);
    cont = data?.continue?.cmcontinue ?? "";
  } while (cont);
  return pages;
}

async function getWikitext(title) {
  const url = `${API}?action=parse&page=${encodeURIComponent(title)}&prop=wikitext&format=json`;
  const data = await fetchJson(url);
  return data?.parse?.wikitext?.["*"] ?? "";
}

/** Normalize an item name to a stable ID. */
function toId(name) {
  return name.toLowerCase().replace(/[.'()]/g, "").replace(/\s+/g, "_");
}

/** Parse {{Infobox ...|key=val|...}} */
function parseInfobox(wikitext) {
  const match = wikitext.match(/\{\{Infobox\s+\w+[\s\S]*?\n([\s\S]*?)\n\}\}/i);
  if (!match) return {};
  const params = {};
  for (const line of match[1].split("\n")) {
    const m = line.match(/^\s*\|\s*([\w\s]+?)\s*=\s*([\s\S]*?)\s*$/);
    if (m) params[m[1].trim().toLowerCase().replace(/\s+/g, "_")] = m[2].trim();
  }
  return params;
}

/** Parse {{Crafting|ingredients=...|qty=...}} */
function parseCrafting(wikitext) {
  const match = wikitext.match(/\{\{Crafting[\s\S]*?\}\}/i);
  if (!match) return { cost: {}, qty: 1, station: "" };
  const block = match[0];
  const ingMatch = block.match(/ingredients\s*=\s*([\s\S]*?)(?:\||}})/);
  const qtyMatch = block.match(/qty\s*=\s*(\d+)/);
  const staMatch = block.match(/station\s*=\s*([\s\S]*?)(?:\||}})/);
  return {
    cost: parseMaterials(ingMatch?.[1] ?? ""),
    qty: parseInt(qtyMatch?.[1]) || 1,
    station: (staMatch?.[1] ?? "").trim(),
  };
}

/** Parse {{Recycling table|recycling1=...}} */
function parseRecycling(wikitext) {
  const match = wikitext.match(/\{\{Recycling table[\s\S]*?\}\}/i);
  if (!match) return {};
  const recMatch = match[0].match(/recycling1\s*=\s*([\s\S]*?)(?:\||}})/);
  return parseMaterials(recMatch?.[1] ?? "");
}

/** Parse "6 Metal Parts + 8 Rubber Parts" → {metal_parts:6, rubber_parts:8} */
function parseMaterials(str) {
  if (!str) return {};
  const result = {};
  const parts = str.split("+").map((s) => s.trim());
  for (const part of parts) {
    const m = part.match(/^(\d+)\s*(?:\[\[)?([A-Za-z][A-Za-z\s.'()]+?)(?:\]\])?$/);
    if (m) result[toId(m[2])] = parseInt(m[1]);
  }
  return result;
}

function parseRarity(str) {
  const map = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  return map[(str || "").toLowerCase()] ?? 0;
}

/** Parse a {{Price|N}} template or fallback to plain number */
function parsePrice(str) {
  if (!str) return 0;
  const m = str.match(/\{\{Price\s*\|\s*([\d,]+)/);
  if (m) return parseInt(m[1].replace(/,/g, ""), 10) || 0;
  const n = str.replace(/[^\d]/g, "");
  return n ? parseInt(n, 10) : 0;
}

/**
 * Find the body of a {{TemplateName ...}} call, balancing braces.
 * Returns the body string (between the opening {{ and matching }}) or null.
 */
function extractTemplate(wikitext, name) {
  const openRe = new RegExp(`\\{\\{${name}\\b`, "i");
  const startMatch = wikitext.match(openRe);
  if (!startMatch) return null;
  const start = startMatch.index + startMatch[0].length;
  let depth = 1;
  let i = start;
  while (i < wikitext.length && depth > 0) {
    if (wikitext[i] === "{" && wikitext[i + 1] === "{") {
      depth++;
      i += 2;
    } else if (wikitext[i] === "}" && wikitext[i + 1] === "}") {
      depth--;
      i += 2;
      if (depth === 0) return wikitext.slice(start, i - 2);
    } else {
      i++;
    }
  }
  return null;
}

/**
 * Split a template body into its top-level | params, respecting nested {{...}} and [[...]].
 */
function splitTemplateParams(body) {
  const parts = [];
  let buf = "";
  let braceDepth = 0;
  let bracketDepth = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    const c2 = body[i + 1];
    if (c === "{" && c2 === "{") {
      braceDepth++;
      buf += "{{";
      i++;
      continue;
    }
    if (c === "}" && c2 === "}") {
      braceDepth--;
      buf += "}}";
      i++;
      continue;
    }
    if (c === "[" && c2 === "[") {
      bracketDepth++;
      buf += "[[";
      i++;
      continue;
    }
    if (c === "]" && c2 === "]") {
      bracketDepth--;
      buf += "]]";
      i++;
      continue;
    }
    if (c === "|" && braceDepth === 0 && bracketDepth === 0) {
      parts.push(buf);
      buf = "";
      continue;
    }
    buf += c;
  }
  if (buf) parts.push(buf);
  return parts;
}

/**
 * Parse a trader page wikitext into a list of inventory entries.
 * Trader pages use {{ItemGrid|name1=...|price1=...|category-icon1=...|isLimited1=true}}
 */
function parseTraderInventory(wikitext) {
  const body = extractTemplate(wikitext, "ItemGrid");
  if (!body) return [];

  const fields = {};
  for (const part of splitTemplateParams(body)) {
    const m = part.match(/^\s*([a-zA-Z][a-zA-Z-]*)(\d+)\s*=([\s\S]*)$/);
    if (!m) continue;
    const [, key, idx, valueRaw] = m;
    if (!fields[idx]) fields[idx] = {};
    fields[idx][key] = valueRaw.trim();
  }

  const entries = [];
  for (const idx of Object.keys(fields).sort((a, b) => parseInt(a) - parseInt(b))) {
    const f = fields[idx];
    if (!f.name) continue;
    const isLimited = (f.isLimited || "").toLowerCase() === "true";
    let dailyLimit = null;
    let batchQuantity = null;
    const cat = f["category-icon"] || "";
    if (isLimited) {
      const lm = cat.match(/(\d+)\s*\/\s*(\d+)/);
      if (lm) dailyLimit = parseInt(lm[1], 10);
    }
    const xm = cat.match(/×\s*(\d+)/);
    if (xm) batchQuantity = parseInt(xm[1], 10);

    entries.push({
      itemId: toId(f.name),
      itemName: f.name,
      displayName: f.disp || f.name,
      price: parsePrice(f.price || ""),
      rarity: parseRarity(f.rarity),
      isLimited,
      dailyLimit,
      batchQuantity,
    });
  }
  return entries;
}

const TRADER_PAGES = [
  { id: "tian_wen", page: "Tian_Wen", currency: "coins" },
  { id: "celeste", page: "Celeste", currency: "coins" },
  { id: "shani", page: "Shani", currency: "cred" },
  { id: "apollo", page: "Apollo", currency: "coins" },
  { id: "lance", page: "Lance", currency: "coins" },
];

async function scrapeTraders() {
  const traders = {};
  for (const t of TRADER_PAGES) {
    process.stdout.write(`Trader "${t.id}"...`);
    try {
      const wikitext = await getWikitext(t.page);
      const entries = parseTraderInventory(wikitext).map((e) => ({
        ...e,
        currency: t.currency,
      }));
      traders[t.id] = entries;
      console.log(` ${entries.length} entries`);
    } catch (e) {
      console.log(` failed: ${e.message}`);
      traders[t.id] = [];
    }
    await sleep(DELAY);
  }
  return traders;
}

async function main() {
  console.log("ARC Raiders Wiki Sync\n");

  const CATEGORIES = [
    "Weapons",
    "Shields",
    "Augments",
    "Grenades",
    "Quick Use",
    "Items",
    "Basic Material",
    "Refined Material",
    "Topside Material",
    "Mods",
    "Ammunition",
    "Key",
    "Quest Item",
    "Trinket",
    "Gadgets",
    "Traps",
    "Utilities",
    "Currency",
    "Recyclable",
    "Materials",
  ];

  const allPages = new Set();
  for (const cat of CATEGORIES) {
    process.stdout.write(`Category "${cat}"...`);
    try {
      const pages = await getCategoryPages(cat);
      pages.forEach((p) => allPages.add(p));
      console.log(` ${pages.length} pages`);
    } catch (e) {
      console.log(` failed: ${e.message}`);
    }
    await sleep(DELAY);
  }

  console.log(`\n${allPages.size} unique pages to fetch\n`);

  const results = [];
  let i = 0;
  for (const title of allPages) {
    i++;
    process.stdout.write(`[${i}/${allPages.size}] ${title}...`);
    try {
      const wikitext = await getWikitext(title);
      const p = parseInfobox(wikitext);

      if (!Object.keys(p).length) {
        console.log(" skip (no infobox)");
        await sleep(DELAY);
        continue;
      }

      const crafting = parseCrafting(wikitext);
      const recycling = parseRecycling(wikitext);

      results.push({
        wiki_title: title,
        id: toId(p.name || title),
        name: p.name || title,
        rarity: parseRarity(p.rarity),
        image: (p.image || "").replace(/^File:/i, "").trim(),
        weight: parseFloat(p.weight) || 0,
        stack_size: parseInt(p.stacksize) || parseInt(p.stack_size) || 1,

        infobox_type: wikitext.match(/\{\{Infobox\s+(\w+)/i)?.[1]?.toLowerCase() ?? "",
        item_type: p.type || "",
        ammo_type: p.ammo || "",

        // Augment slot fields (extended)
        slot_backpack: parseInt(p.slot_backpack) || 0,
        slot_quickuse: parseInt(p.slot_quickuse) || 0,
        slot_safepocket: parseInt(p.slot_safepocket) || 0,
        slot_healing: parseInt(p.slot_healing) || 0,
        slot_grenade: parseInt(p.slot_grenade) || 0,
        slot_utility: parseInt(p.slot_utility) || 0,
        slot_trinket: parseInt(p.slot_trinket) || 0,
        weight_limit: parseFloat(p.wlimit) || 0,
        shield_compat: parseInt(p.shield_compatibility) || 0,
        integrated_tool: p.integrated_tool || "",

        charge: p.charge || "",

        craft_cost: crafting.cost,
        craft_yield: crafting.qty,
        craft_station: crafting.station,
        recycle_yield: recycling,

        damage: p.damage || "",
        fire_rate: p.fire_rate || p.firerate || "",
        magazine: p.magsize || "",
        firing_mode: p.firingmode || "",

        _raw: p,
      });
      console.log(" OK");
    } catch (e) {
      console.log(` fail: ${e.message}`);
    }
    await sleep(DELAY);
  }

  console.log(`\n--- Scraping traders ---`);
  const traders = await scrapeTraders();

  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(import.meta.dirname, "wiki-data.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      { fetched_at: new Date().toISOString(), count: results.length, items: results, traders },
      null,
      2
    )
  );

  console.log(`\nDone! ${results.length} items + ${Object.keys(traders).length} traders → ${outPath}`);

  const types = {};
  for (const r of results) {
    const t = r.infobox_type || "unknown";
    types[t] = (types[t] || 0) + 1;
  }
  console.log("\nBy type:", types);
  console.log("Trader entry counts:", Object.fromEntries(Object.entries(traders).map(([k, v]) => [k, v.length])));

  // Sanity checks
  const found = (id) => results.some((r) => r.id === id);
  console.log(`\nDolabra present: ${found("dolabra")}`);
  console.log(`Canto present: ${found("canto")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
