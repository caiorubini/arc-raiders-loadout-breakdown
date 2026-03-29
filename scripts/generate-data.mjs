#!/usr/bin/env node
/**
 * Generates src/data/items.ts and src/data/augments.ts from wiki-data.json.
 *
 * Usage:
 *   node scripts/sync-wiki.mjs    # fetch from wiki
 *   node scripts/generate-data.mjs # generate TS files
 *
 * Or just:  npm run sync
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA = JSON.parse(readFileSync(join(__dirname, "wiki-data.json"), "utf-8"));

// ── Image URL helper ──
const W = "https://arcraiders.wiki/w/images";
// We can't resolve the hash-based image URLs from the API easily,
// so we keep a manual map for known images and leave others empty.
// Run `node scripts/sync-wiki.mjs` to get filenames, then find URLs on the wiki.

const IMAGE_MAP = {
  "Metal Parts.png": `${W}/8/89/Metal_Parts.png`,
  "Chemicals.png": `${W}/9/92/Chemicals.png`,
  "Fabric.png": `${W}/2/2b/Fabric.png`,
  "Plastic Parts.png": `${W}/c/c9/Plastic_Parts.png`,
  "Rubber Parts.png": `${W}/9/93/Rubber_Parts.png`,
  "Electrical Components.png": `${W}/0/06/Electrical_Components.png`,
  "Mechanical Components.png": `${W}/9/94/Mechanical_Components.png`,
  "ARC Alloy.png": `${W}/a/a6/ARC_Alloy.png`,
  "Kettle-Level1.png": `${W}/c/c1/Kettle-Level1.png`,
  "Stitcher-Level1.png": `${W}/3/3a/Stitcher-Level1.png`,
  "Rattler-Level1.png": `${W}/b/be/Rattler-Level1.png`,
  "Ferro-Level1.png": `${W}/b/b0/Ferro-Level1.png`,
  "Il Toro-Level1.png": `${W}/5/50/Il_Toro-Level1.png`,
  "Anvil-Level1.png": `${W}/0/00/Anvil-Level1.png`,
  "Osprey-Level1.png": `${W}/a/ae/Osprey-Level1.png`,
  "Torrente-Level1.png": `${W}/1/1e/Torrente-Level1.png`,
  "Bobcat-Level1.png": `${W}/3/36/Bobcat-Level1.png`,
  "Hullcracker-Level1.png": `${W}/b/ba/Hullcracker-Level1.png`,
  "Light Shield.png": `${W}/4/40/Light_Shield.png`,
  "Medium Shield.png": `${W}/4/41/Medium_Shield.png`,
  "Heavy Shield.png": `${W}/f/f9/Heavy_Shield.png`,
  "Bandage.png": `${W}/0/0c/Bandage.png`,
  "Herbal Bandage.png": `${W}/c/c5/Herbal_Bandage.png`,
  "Adrenaline Shot.png": `${W}/1/1b/Adrenaline_Shot.png`,
  "Defibrillator.png": `${W}/5/5f/Defibrillator.png`,
  "Shrapnel Grenade.png": `${W}/5/5f/Shrapnel_Grenade.png`,
  "Snap Blast Grenade.png": `${W}/7/77/Snap_Blast_Grenade.png`,
  "Smoke Grenade.png": `${W}/d/d5/Smoke_Grenade.png`,
  "Blaze Grenade.png": `${W}/2/24/Blaze_Grenade.png`,
  "Gas Grenade.png": `${W}/f/fe/Gas_Grenade.png`,
  "Heavy Fuze Grenade.png": `${W}/e/ea/Heavy_Fuze_Grenade.png`,
  "Light Impact Grenade.png": `${W}/4/4c/Light_Impact_Grenade.png`,
  "Seeker Grenade.png": `${W}/3/35/Seeker_Grenade.png`,
  "Light Ammo.png": `${W}/2/22/Light_Ammo.png`,
  "Medium Ammo.png": `${W}/d/d3/Medium_Ammo.png`,
  "Heavy Ammo.png": `${W}/6/6f/Heavy_Ammo.png`,
  "Shotgun Ammo.png": `${W}/6/61/Shotgun_Ammo.png`,
  "Energy Clip.png": `${W}/0/08/Energy_Clip.png`,
  "Silencer I.png": `${W}/f/f7/Silencer_I.png`,
  "Compensator I.png": `${W}/5/5f/Compensator_I.png`,
  "Extended Light Mag I.png": `${W}/2/23/Extended_Light_Mag_I.png`,
  "Vertical Grip I.png": `${W}/4/4d/Vertical_Grip_I.png`,
  "Stable Stock I.png": `${W}/8/8d/Stable_Stock_I.png`,
  "Free Loadout Augment.png": `${W}/c/cf/Free_Loadout_Augment.png`,
  "Combat Mk. 1.png": `${W}/1/14/Combat_Mk._1.png`,
  "Combat Mk. 2.png": `${W}/5/54/Combat_Mk._2.png`,
  "Combat Mk. 3 (Aggressive).png": `${W}/a/a4/Combat_Mk._3_%28Aggressive%29.png`,
  "Combat Mk. 3 (Flanking).png": `${W}/7/73/Combat_Mk._3_%28Flanking%29.png`,
  "Looting Mk. 1.png": `${W}/2/27/Looting_Mk._1.png`,
  "Looting Mk. 2.png": `${W}/7/7c/Looting_Mk._2.png`,
  "Looting Mk. 3 (Cautious).png": `${W}/6/68/Looting_Mk._3_%28Cautious%29.png`,
  "Looting Mk. 3 (Safekeeper).png": `${W}/c/c6/Looting_Mk._3_%28Safekeeper%29.png`,
  "Looting Mk. 3 (Survivor).png": `${W}/7/74/Looting_Mk._3_%28Survivor%29.png`,
  "Tactical Mk. 1.png": `${W}/1/18/Tactical_Mk._1.png`,
  "Tactical Mk. 2.png": `${W}/6/6c/Tactical_Mk._2.png`,
  "Tactical Mk. 3 (Defensive).png": `${W}/a/a9/Tactical_Mk._3_%28Defensive%29.png`,
  "Tactical Mk. 3 (Healing).png": `${W}/1/12/Tactical_Mk._3_%28Healing%29.png`,
  "Tactical Mk. 3 (Revival).png": `${W}/e/e0/Tactical_Mk._3_%28Revival%29.png`,
};

function imageUrl(filename) {
  return IMAGE_MAP[filename] || "";
}

function toId(name) {
  return name.toLowerCase().replace(/[.'()]/g, "").replace(/\s+/g, "_");
}

function objStr(obj) {
  if (!obj || !Object.keys(obj).length) return "{}";
  const entries = Object.entries(obj).map(([k, v]) => `${k}: ${v}`);
  return `{ ${entries.join(", ")} }`;
}

// Map ammo name -> item ID
const AMMO_MAP = {
  "Light Ammo": "light_ammo",
  "Medium Ammo": "medium_ammo",
  "Heavy Ammo": "heavy_ammo",
  "Shotgun Ammo": "shotgun_ammo",
  "Launcher Ammo": "launcher_ammo",
  "Energy Clip": "energy_clip",
};

// Shield tier from name
function shieldTier(name) {
  if (name.includes("Light")) return '"light" as ShieldTier';
  if (name.includes("Medium")) return '"medium" as ShieldTier';
  if (name.includes("Heavy")) return '"heavy" as ShieldTier';
  return "undefined";
}

// Category from wiki data
function itemCategory(d) {
  if (d.infobox_type === "weapon") return "weapon";
  if (d.infobox_type === "shield") return "armor";
  if (d.infobox_type === "mod") return "mod";
  const t = (d.item_type || "").toLowerCase();
  if (t.includes("ammunition") || t.includes("ammo")) return "ammo";
  if (t.includes("grenade") || t.includes("throwable")) return "throwable";
  if (t.includes("material") || t.includes("topside") || t.includes("refined") || t.includes("basic")) return "material";
  if (t.includes("consumable") || t.includes("healing") || t.includes("quick")) return "consumable";
  // Fallback: check name patterns
  if (d.name.includes("Ammo") || d.name === "Energy Clip") return "ammo";
  if (d.name.includes("Grenade") || d.name.includes("Mine")) return "throwable";
  // Default to consumable for Quick Use items, material for materials
  if (d._raw?.type?.includes("Material")) return "material";
  return "consumable";
}

// ── Generate items.ts ──
function generateItems() {
  const items = DATA.items.filter((d) => d.infobox_type !== "augment");

  let out = `import { GameItem, Rarity, ShieldTier } from "@/types/game";

/**
 * AUTO-GENERATED from wiki-data.json by scripts/generate-data.mjs
 * Last synced: ${DATA.fetched_at}
 * Do not edit manually — run: npm run sync
 */
export const GAME_ITEMS: GameItem[] = [\n`;

  for (const d of items) {
    const cat = itemCategory(d);
    const ammo = AMMO_MAP[d.ammo_type] || "";
    const st = d.infobox_type === "shield" ? shieldTier(d.name) : "";

    out += `  {
    id: "${toId(d.name)}",
    name: "${d.name.replace(/"/g, '\\"')}",
    category: "${cat}",
    rarity: ${d.rarity} as Rarity,
    imageUrl: "${imageUrl(d.image)}",
    stackSize: ${d.stack_size},
    weight: ${d.weight},
    recycleYield: ${objStr(d.recycle_yield)},
    craftCost: ${objStr(d.craft_cost)},
    craftYield: ${d.craft_yield},
    slotSize: 1,${ammo ? `\n    ammoType: "${ammo}",` : ""}${st ? `\n    shieldTier: ${st},` : ""}
  },\n`;
  }

  out += `];

/** Quick lookup map */
export const ITEMS_MAP: Record<string, GameItem> = Object.fromEntries(
  GAME_ITEMS.map((item) => [item.id, item])
);

/** All base material IDs (items with no recycle yield and category "material") */
export const BASE_MATERIAL_IDS = GAME_ITEMS
  .filter((i) => i.category === "material" && Object.keys(i.recycleYield).length === 0)
  .map((i) => i.id);

/**
 * Reverse index: for each material, which items yield it when recycled.
 * Sorted by rarity ASC (lowest rarity first).
 */
export const RECYCLE_SOURCES: Record<string, { item: GameItem; yieldPerUnit: number }[]> = {};
for (const item of GAME_ITEMS) {
  for (const [matId, amount] of Object.entries(item.recycleYield)) {
    if (!RECYCLE_SOURCES[matId]) RECYCLE_SOURCES[matId] = [];
    RECYCLE_SOURCES[matId].push({ item, yieldPerUnit: amount });
  }
}
for (const sources of Object.values(RECYCLE_SOURCES)) {
  sources.sort((a, b) => a.item.rarity - b.item.rarity);
}
`;

  writeFileSync(join(ROOT, "src/data/items.ts"), out);
  console.log(`Generated items.ts with ${items.length} items`);
}

// ── Generate augments.ts ──
function generateAugments() {
  const augs = DATA.items.filter((d) => d.infobox_type === "augment");

  // Shield compat: 1=Light, 2=up to Medium, 3=up to Heavy
  function shieldCompat(level) {
    if (level >= 3) return "[L, M, H]";
    if (level >= 2) return "[L, M]";
    return "[L]";
  }

  let out = `import { Augment, ShieldTier } from "@/types/game";

/**
 * AUTO-GENERATED from wiki-data.json by scripts/generate-data.mjs
 * Last synced: ${DATA.fetched_at}
 * Do not edit manually — run: npm run sync
 */
const L: ShieldTier = "light";
const M: ShieldTier = "medium";
const H: ShieldTier = "heavy";

export const AUGMENTS: Augment[] = [\n`;

  for (const d of augs) {
    const perks = [];
    if (d.integrated_tool) perks.push(d.integrated_tool);
    const desc = (d._raw?.quote || d._raw?.warning || "").replace(/"/g, '\\"');

    out += `  {
    id: "${toId(d.name)}",
    name: "${d.name.replace(/"/g, '\\"')}",
    imageUrl: "${imageUrl(d.image)}",
    description: "${desc}",
    perks: [${perks.map((p) => `"${p}"`).join(", ")}],
    weightLimit: ${d.weight_limit},
    backpackSlots: ${d.slot_backpack},
    quickUseSlots: ${d.slot_quickuse},
    safePocketSlots: ${d.slot_safepocket},
    shieldCompatibility: ${shieldCompat(d.shield_compat)},
    craftCost: ${objStr(d.craft_cost)},
  },\n`;
  }

  out += `];

export const AUGMENTS_MAP: Record<string, Augment> = Object.fromEntries(
  AUGMENTS.map((a) => [a.id, a])
);
`;

  writeFileSync(join(ROOT, "src/data/augments.ts"), out);
  console.log(`Generated augments.ts with ${augs.length} augments`);
}

// ── Run ──
generateItems();
generateAugments();
console.log("\nDone! Run `npm run build` to verify.");
