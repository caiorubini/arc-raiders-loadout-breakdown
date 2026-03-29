#!/usr/bin/env node
/**
 * ARC Raiders Wiki Sync
 *
 * Scrapes arcraiders.wiki and outputs structured JSON for all items,
 * weapons, augments, shields, ammo, mods, grenades, and materials.
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
    if (m) {
      const id = m[2].trim().toLowerCase().replace(/[.'()]/g, "").replace(/\s+/g, "_");
      result[id] = parseInt(m[1]);
    }
  }
  return result;
}

function parseRarity(str) {
  const map = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  return map[(str || "").toLowerCase()] ?? 0;
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
        id: (p.name || title).toLowerCase().replace(/[.'()]/g, "").replace(/\s+/g, "_"),
        name: p.name || title,
        rarity: parseRarity(p.rarity),
        image: (p.image || "").replace(/^File:/i, "").trim(),
        weight: parseFloat(p.weight) || 0,
        stack_size: parseInt(p.stacksize) || parseInt(p.stack_size) || 1,

        // Type detection
        infobox_type: wikitext.match(/\{\{Infobox\s+(\w+)/i)?.[1]?.toLowerCase() ?? "",
        item_type: p.type || "",
        ammo_type: p.ammo || "",

        // Augment fields
        slot_backpack: parseInt(p.slot_backpack) || 0,
        slot_quickuse: parseInt(p.slot_quickuse) || 0,
        slot_safepocket: parseInt(p.slot_safepocket) || 0,
        weight_limit: parseFloat(p.wlimit) || 0,
        shield_compat: parseInt(p.shield_compatibility) || 0,
        integrated_tool: p.integrated_tool || "",

        // Shield fields
        charge: p.charge || "",

        // Craft & recycle
        craft_cost: crafting.cost,
        craft_yield: crafting.qty,
        craft_station: crafting.station,
        recycle_yield: recycling,

        // Weapon stats
        damage: p.damage || "",
        fire_rate: p.fire_rate || p.firerate || "",
        magazine: p.magsize || "",
        firing_mode: p.firingmode || "",

        // Raw for debugging
        _raw: p,
      });
      console.log(" OK");
    } catch (e) {
      console.log(` fail: ${e.message}`);
    }
    await sleep(DELAY);
  }

  const fs = await import("fs");
  const path = await import("path");
  const outPath = path.join(import.meta.dirname, "wiki-data.json");
  fs.writeFileSync(outPath, JSON.stringify({ fetched_at: new Date().toISOString(), count: results.length, items: results }, null, 2));

  console.log(`\nDone! ${results.length} items → ${outPath}`);

  // Summary
  const types = {};
  for (const r of results) {
    const t = r.infobox_type || "unknown";
    types[t] = (types[t] || 0) + 1;
  }
  console.log("\nBy type:", types);
}

main().catch((e) => { console.error(e); process.exit(1); });
