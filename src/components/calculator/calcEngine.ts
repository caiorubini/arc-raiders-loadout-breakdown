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

  const arrayKey = (
    arr: typeof loadout.backpack | undefined,
    prefix: string
  ) => {
    for (let i = 0; i < (arr ?? []).length; i++) {
      if (!excluded.has(`${prefix}_${i}`)) addCost(arr![i].itemId, arr![i].quantity);
    }
  };

  arrayKey(loadout.backpack, "bp");
  arrayKey(loadout.quickUse, "qu");
  arrayKey(loadout.safePocket, "sp");
  arrayKey(loadout.healing, "hl");
  arrayKey(loadout.grenade, "gr");
  arrayKey(loadout.utility, "ut");
  arrayKey(loadout.trinket, "tr");

  return Object.entries(cost)
    .map(([materialId, quantity]) => ({
      materialId,
      quantity,
      rarity: ITEMS_MAP[materialId]?.rarity ?? 0,
    }))
    .sort((a, b) => b.rarity - a.rarity || a.materialId.localeCompare(b.materialId));
}

/**
 * URL-safe base64: no +/= chars that break WhatsApp URL detection.
 */
function toUrlSafe(b64: string): string {
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromUrlSafe(s: string): string {
  let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4) b64 += "=";
  return b64;
}

/** Encode a loadout into a compact, WhatsApp-friendly URL string */
export function encodeLoadout(loadout: Loadout): string {
  const data: Record<string, unknown> = { a: loadout.augmentId };
  if (loadout.name) data.n = loadout.name;
  if (loadout.shieldId) data.s = loadout.shieldId;
  if (loadout.weapon1Id) data.w1 = loadout.weapon1Id;
  if (loadout.weapon2Id) data.w2 = loadout.weapon2Id;
  const enc = (slots?: { itemId: string; quantity: number }[]) =>
    (slots ?? []).map((s) => [s.itemId, s.quantity]);
  if (loadout.backpack.length) data.bp = enc(loadout.backpack);
  if (loadout.quickUse.length) data.qu = enc(loadout.quickUse);
  if (loadout.safePocket.length) data.sp = enc(loadout.safePocket);
  if (loadout.healing?.length) data.hl = enc(loadout.healing);
  if (loadout.grenade?.length) data.gr = enc(loadout.grenade);
  if (loadout.utility?.length) data.ut = enc(loadout.utility);
  if (loadout.trinket?.length) data.tr = enc(loadout.trinket);
  return toUrlSafe(btoa(JSON.stringify(data)));
}

/** Decode a loadout from URL string */
export function decodeLoadout(encoded: string): Partial<Loadout> | null {
  try {
    const data = JSON.parse(atob(fromUrlSafe(encoded)));
    const toSlots = (arr: [string, number][] | undefined) =>
      (arr ?? []).map(([itemId, quantity]) => ({ itemId, quantity }));
    return {
      name: data.n ?? "Shared Loadout",
      augmentId: data.a,
      shieldId: data.s ?? null,
      weapon1Id: data.w1 ?? null,
      weapon2Id: data.w2 ?? null,
      backpack: toSlots(data.bp),
      quickUse: toSlots(data.qu),
      safePocket: toSlots(data.sp),
      healing: toSlots(data.hl),
      grenade: toSlots(data.gr),
      utility: toSlots(data.ut),
      trinket: toSlots(data.tr),
    };
  } catch {
    return null;
  }
}
