// ── Rarities (ordered lowest → highest for recycling priority) ──
export enum Rarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4,
}

export const RARITY_LABELS: Record<Rarity, string> = {
  [Rarity.Common]: "Common",
  [Rarity.Uncommon]: "Uncommon",
  [Rarity.Rare]: "Rare",
  [Rarity.Epic]: "Epic",
  [Rarity.Legendary]: "Legendary",
};

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.Common]: "#9ca3af",
  [Rarity.Uncommon]: "#22c55e",
  [Rarity.Rare]: "#3b82f6",
  [Rarity.Epic]: "#a855f7",
  [Rarity.Legendary]: "#f59e0b",
};

// ── Item Categories ──
export type ItemCategory =
  | "weapon"
  | "armor"
  | "consumable"
  | "material"
  | "ammo"
  | "throwable"
  | "tool"
  | "mod";

export type ShieldTier = "light" | "medium" | "heavy";

export type MaterialId = string;

// ── Game Item Definition ──
export interface GameItem {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: Rarity;
  imageUrl?: string;
  stackSize: number;
  weight: number;
  recycleYield: Record<MaterialId, number>;
  craftCost: Record<MaterialId, number>;
  craftYield: number;
  slotSize: number;
  /** For weapons: which ammo item ID this weapon uses */
  ammoType?: string;
  /** For shields: light / medium / heavy */
  shieldTier?: ShieldTier;
}

// ── Augment Definition ──
export interface Augment {
  id: string;
  name: string;
  imageUrl?: string;
  description: string;
  perks: string[];
  weightLimit: number;
  backpackSlots: number;
  safePocketSlots: number;
  quickUseSlots: number;
  shieldCompatibility: ShieldTier[];
  craftCost: Record<MaterialId, number>;
}

// ── Loadout ──
export interface LoadoutSlot {
  itemId: string;
  quantity: number;
}

export interface Loadout {
  id: string;
  name: string;
  augmentId: string;
  shieldId: string | null;
  weapon1Id: string | null;
  weapon2Id: string | null;
  backpack: LoadoutSlot[];
  quickUse: LoadoutSlot[];
  safePocket: LoadoutSlot[];
}

