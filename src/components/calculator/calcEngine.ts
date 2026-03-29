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
 * Returns sorted rare → common (highest rarity first).
 */
export function calcMaterials(loadout: Loadout): MaterialNeed[] {
  const cost: Record<MaterialId, number> = {};

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
  const augment = AUGMENTS_MAP[loadout.augmentId];
  if (augment) {
    for (const [matId, amount] of Object.entries(augment.craftCost)) {
      cost[matId] = (cost[matId] ?? 0) + amount;
    }
  }

  addCost(loadout.shieldId);
  addCost(loadout.weapon1Id);
  addCost(loadout.weapon2Id);
  for (const slot of loadout.backpack) addCost(slot.itemId, slot.quantity);
  for (const slot of loadout.quickUse) addCost(slot.itemId, slot.quantity);
  for (const slot of loadout.safePocket) addCost(slot.itemId, slot.quantity);

  // Build list sorted by rarity DESC (rare first)
  return Object.entries(cost)
    .map(([materialId, quantity]) => ({
      materialId,
      quantity,
      rarity: ITEMS_MAP[materialId]?.rarity ?? 0,
    }))
    .sort((a, b) => b.rarity - a.rarity || a.materialId.localeCompare(b.materialId));
}
