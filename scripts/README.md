# Data Layer

All game data is centralized in three places:

1. **`scripts/sync-wiki.mjs`** — scrapes [arcraiders.wiki](https://arcraiders.wiki) and writes `scripts/wiki-data.json`.
2. **`scripts/generate-data.mjs`** — reads `wiki-data.json` and generates the TypeScript files in `src/data/`.
3. **Generated TS files** (do **not** edit by hand):
   - `src/data/items.ts` — every item, weapon, shield, mod, ammo, material.
   - `src/data/augments.ts` — every augment with all its slot fields.
   - `src/data/traders.ts` — Tian Wen, Celeste, Shani, Apollo, Lance inventories + reverse indexes.

## One-shot update

```bash
npm run sync
```

Equivalent to: `node scripts/sync-wiki.mjs && node scripts/generate-data.mjs`.

After every game patch, run this once. The TS files regenerate, the build picks up the new data, and the deploy goes out.

## What gets captured

### Items (`wiki-data.json` → `items[]`)

Per item, from the wiki Infobox + Crafting + Recycling templates:

- `id` (normalized name), `name`, `rarity`, `image`, `weight`, `stack_size`
- `infobox_type`: `weapon` | `shield` | `augment` | `mod` | `item`
- `item_type` (subtype, e.g. `Quick Use-Regen`, `Trinket`, `Ammunition-Heavy`)
- `craft_cost`, `craft_yield`, `craft_station`
- `recycle_yield`
- `ammo_type` (weapons), `shield_compat` (augments)
- Augment slot fields: `slot_backpack`, `slot_quickuse`, `slot_safepocket`, `slot_healing`, `slot_grenade`, `slot_utility`, `slot_trinket`, `weight_limit`
- `_raw` — full set of infobox params for debugging / future use.

### Traders (`wiki-data.json` → `traders`)

For each of the 5 named traders, the `{{ItemGrid}}` template is parsed into:

- `itemId`, `displayName`, `price`, `rarity`, `currency` (coins / cred), `isLimited`, `dailyLimit`, `batchQuantity`.

`generate-data.mjs` then derives:

- `TRADER_LISTINGS` — full per-trader inventory.
- `ITEM_TRADERS` — direct sale lookup keyed by item ID.
- `INDIRECT_TRADER_SOURCES` — for materials NOT directly sold, find traders selling items that recycle into the material.
- `isTraderBuyable(materialId)` — true if any direct or indirect trader source exists.

## Adding new categories

If the wiki adds a new category that has loot-relevant items, append it to the `CATEGORIES` array near the top of `sync-wiki.mjs:main()`:

```js
const CATEGORIES = [
  "Weapons", "Shields", "Augments", "Grenades",
  // ... add new category names exactly as they appear on the wiki
];
```

## Image URLs

Image URLs use a content-hash path (e.g. `/w/images/8/89/Metal_Parts.png`) that the API does **not** expose directly. We keep a manual map (`IMAGE_MAP`) in `generate-data.mjs` for the most-seen items and leave others empty (the `ItemIcon` component falls back to a colored letter tile).

To resolve a missing image, find it on the wiki, copy the full URL, and add it to `IMAGE_MAP` keyed by the filename returned by the scraper.
