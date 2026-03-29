import { Loadout, MaterialId } from "@/types/game";
import { ITEMS_MAP } from "@/data/items";
import { AUGMENTS_MAP } from "@/data/augments";

export interface MaterialNeed {
  materialId: string;
  quantity: number;
  rarity: number;
}

/**
 * Calculates the unified material list for an entire loadout.
 * Respects excludedFromCalc — items with the eye toggled off are skipped.
 * Returns sorted rare → common (highest rarity first).
 */
export function calcMaterials(loadout: Loadout): MaterialNeed[] {
  const cost: Record<MaterialId, number> = {};
  const excluded = new Set(loadout.excludedFromCalc ?? []);

  const addCost = (itemId: string | null, stacks = 1) => {
    if (!itemId) return;
    const item = ITEMS_MAP[itemId];
    if (!item || Object.keys(item.craftCost).length === 0) return;
    const totalUnits = stacks * item.stackSize;
    const batches = Math.ceil(totalUnits / (item.craftYield || 1));
    for (const [matId, amount] of Object.entries(item.craftCost)) {
      cost[matId] = (cost[matId] ?? 0) + amount * batches;
    }
  };

  // Augment
  if (!excluded.has("augment")) {
    const augment = AUGMENTS_MAP[loadout.augmentId];
    if (augment) {
      for (const [matId, amount] of Object.entries(augment.craftCost)) {
        cost[matId] = (cost[matId] ?? 0) + amount;
      }
    }
  }

  if (!excluded.has("shield")) addCost(loadout.shieldId);
  if (!excluded.has("weapon1")) addCost(loadout.weapon1Id);
  if (!excluded.has("weapon2")) addCost(loadout.weapon2Id);
  for (let i = 0; i < loadout.backpack.length; i++) {
    if (!excluded.has(`bp_${i}`)) addCost(loadout.backpack[i].itemId, loadout.backpack[i].quantity);
  }
  for (let i = 0; i < loadout.quickUse.length; i++) {
    if (!excluded.has(`qu_${i}`)) addCost(loadout.quickUse[i].itemId, loadout.quickUse[i].quantity);
  }
  for (let i = 0; i < loadout.safePocket.length; i++) {
    if (!excluded.has(`sp_${i}`)) addCost(loadout.safePocket[i].itemId, loadout.safePocket[i].quantity);
  }

  return Object.entries(cost)
    .map(([materialId, quantity]) => ({
      materialId,
      quantity,
      rarity: ITEMS_MAP[materialId]?.rarity ?? 0,
    }))
    .sort((a, b) => b.rarity - a.rarity || a.materialId.localeCompare(b.materialId));
}

/** Encode a loadout into a URL-safe string */
export function encodeLoadout(loadout: Loadout): string {
  const data = {
    n: loadout.name,
    a: loadout.augmentId,
    s: loadout.shieldId,
    w1: loadout.weapon1Id,
    w2: loadout.weapon2Id,
    bp: loadout.backpack,
    qu: loadout.quickUse,
    sp: loadout.safePocket,
    ex: loadout.excludedFromCalc,
  };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

/** Decode a loadout from URL string */
export function decodeLoadout(encoded: string): Partial<Loadout> | null {
  try {
    const data = JSON.parse(decodeURIComponent(atob(encoded)));
    return {
      name: data.n ?? "Shared Loadout",
      augmentId: data.a,
      shieldId: data.s ?? null,
      weapon1Id: data.w1 ?? null,
      weapon2Id: data.w2 ?? null,
      backpack: data.bp ?? [],
      quickUse: data.qu ?? [],
      safePocket: data.sp ?? [],
      excludedFromCalc: data.ex ?? [],
    };
  } catch {
    return null;
  }
}
