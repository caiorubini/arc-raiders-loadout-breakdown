"use client";

import React, { useMemo, useState } from "react";
import {
  Shield,
  Swords,
  Zap,
  ShieldCheck,
  Backpack,
  Plus,
  X,
  Eye,
  EyeOff,
  HeartPulse,
  Bomb,
  Wrench,
  Star,
} from "lucide-react";
import { GAME_ITEMS, ITEMS_MAP } from "@/data/items";
import { NumberInput } from "@/components/ui/NumberInput";
import { AUGMENTS_MAP } from "@/data/augments";
import { Loadout, LoadoutSlot, GameItem } from "@/types/game";
import { ItemIcon } from "@/components/ui/ItemIcon";

interface Props {
  loadout: Loadout;
  onUpdate: (patch: Partial<Loadout>) => void;
}

function isExcluded(loadout: Loadout, key: string) {
  return (loadout.excludedFromCalc ?? []).includes(key);
}

function toggleExclude(loadout: Loadout, key: string): string[] {
  const current = loadout.excludedFromCalc ?? [];
  return current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
}

function EyeToggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 transition-colors ${active ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-700 hover:text-zinc-500"}`}
      title={active ? "Included in material calc — click to exclude" : "Excluded from material calc — click to include"}
    >
      {active ? <Eye size={14} /> : <EyeOff size={14} />}
    </button>
  );
}

// ── Item filter pools ──

const ALL_NON_GEAR_ITEMS = GAME_ITEMS; // Backpack accepts everything (including weapons, shields, augments)

const QUICK_USE_ITEMS = GAME_ITEMS.filter((i) =>
  ["consumable", "throwable"].includes(i.category)
);

const HEALING_ITEMS = GAME_ITEMS.filter(
  (i) => (i.subtype ?? "").includes("Regen")
);

const GRENADE_ITEMS = GAME_ITEMS.filter(
  (i) => (i.subtype ?? "").includes("Grenade")
);

const UTILITY_ITEMS = GAME_ITEMS.filter((i) => {
  const s = i.subtype ?? "";
  return s.includes("Utility") || s.includes("Gadget") || s.includes("Trap");
});

const TRINKET_ITEMS = GAME_ITEMS.filter((i) => (i.subtype ?? "").includes("Trinket"));

const SAFE_POCKET_ITEMS = GAME_ITEMS;

// ── Components ──

/** Column 1: Shield + Weapons */
export function CoreGearSlots({ loadout, onUpdate }: Props) {
  const augment = AUGMENTS_MAP[loadout.augmentId];

  const compatibleShields = useMemo(
    () =>
      GAME_ITEMS.filter(
        (i) => i.category === "armor" && i.shieldTier && augment?.shieldCompatibility.includes(i.shieldTier)
      ),
    [augment]
  );

  const weapons = useMemo(() => GAME_ITEMS.filter((i) => i.category === "weapon"), []);

  return (
    <div className="space-y-3">
      <EquipSlot
        label="Shield"
        icon={<Shield size={14} />}
        selectedId={loadout.shieldId}
        items={compatibleShields}
        onSelect={(id) => onUpdate({ shieldId: id })}
        eyeActive={!isExcluded(loadout, "shield")}
        onEyeToggle={() => onUpdate({ excludedFromCalc: toggleExclude(loadout, "shield") })}
        hasItem={!!loadout.shieldId}
      />
      <EquipSlot
        label="Primary Weapon"
        icon={<Swords size={14} />}
        selectedId={loadout.weapon1Id}
        items={weapons}
        excludeIds={loadout.weapon2Id ? [loadout.weapon2Id] : []}
        onSelect={(id) => onUpdate({ weapon1Id: id })}
        showAmmo
        eyeActive={!isExcluded(loadout, "weapon1")}
        onEyeToggle={() => onUpdate({ excludedFromCalc: toggleExclude(loadout, "weapon1") })}
        hasItem={!!loadout.weapon1Id}
      />
      <EquipSlot
        label="Secondary Weapon"
        icon={<Swords size={14} />}
        selectedId={loadout.weapon2Id}
        items={weapons}
        excludeIds={loadout.weapon1Id ? [loadout.weapon1Id] : []}
        onSelect={(id) => onUpdate({ weapon2Id: id })}
        showAmmo
        eyeActive={!isExcluded(loadout, "weapon2")}
        onEyeToggle={() => onUpdate({ excludedFromCalc: toggleExclude(loadout, "weapon2") })}
        hasItem={!!loadout.weapon2Id}
      />
    </div>
  );
}

/** Column 2: Quick Use → Healing → Grenade → Utility → Trinket → Backpack → Safe Pocket */
export function InventorySlots({ loadout, onUpdate }: Props) {
  const augment = AUGMENTS_MAP[loadout.augmentId];
  if (!augment) return null;

  return (
    <div className="space-y-3">
      {augment.quickUseSlots > 0 && (
        <SlotArray
          label="Quick Use"
          icon={<Zap size={14} />}
          maxSlots={augment.quickUseSlots}
          slots={loadout.quickUse}
          items={QUICK_USE_ITEMS}
          onChange={(slots) => onUpdate({ quickUse: slots })}
          excludeKeyPrefix="qu"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
      {(augment.healingSlots ?? 0) > 0 && (
        <SlotArray
          label="Healing"
          icon={<HeartPulse size={14} />}
          maxSlots={augment.healingSlots ?? 0}
          slots={loadout.healing ?? []}
          items={HEALING_ITEMS}
          onChange={(slots) => onUpdate({ healing: slots })}
          excludeKeyPrefix="hl"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
      {(augment.grenadeSlots ?? 0) > 0 && (
        <SlotArray
          label="Grenade"
          icon={<Bomb size={14} />}
          maxSlots={augment.grenadeSlots ?? 0}
          slots={loadout.grenade ?? []}
          items={GRENADE_ITEMS}
          onChange={(slots) => onUpdate({ grenade: slots })}
          excludeKeyPrefix="gr"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
      {(augment.utilitySlots ?? 0) > 0 && (
        <SlotArray
          label="Utility"
          icon={<Wrench size={14} />}
          maxSlots={augment.utilitySlots ?? 0}
          slots={loadout.utility ?? []}
          items={UTILITY_ITEMS}
          onChange={(slots) => onUpdate({ utility: slots })}
          excludeKeyPrefix="ut"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
      {(augment.trinketSlots ?? 0) > 0 && (
        <SlotArray
          label="Trinket"
          icon={<Star size={14} />}
          maxSlots={augment.trinketSlots ?? 0}
          slots={loadout.trinket ?? []}
          items={TRINKET_ITEMS}
          onChange={(slots) => onUpdate({ trinket: slots })}
          excludeKeyPrefix="tr"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
      <SlotArray
        label="Backpack"
        icon={<Backpack size={14} />}
        maxSlots={augment.backpackSlots ?? 0}
        slots={loadout.backpack}
        items={ALL_NON_GEAR_ITEMS}
        onChange={(slots) => onUpdate({ backpack: slots })}
        excludeKeyPrefix="bp"
        loadout={loadout}
        onUpdate={onUpdate}
      />
      {augment.safePocketSlots > 0 && (
        <SlotArray
          label="Safe Pocket"
          icon={<ShieldCheck size={14} />}
          maxSlots={augment.safePocketSlots}
          slots={loadout.safePocket}
          items={SAFE_POCKET_ITEMS}
          onChange={(slots) => onUpdate({ safePocket: slots })}
          excludeKeyPrefix="sp"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

/** Single dropdown slot (shield, weapon) */
function EquipSlot({
  label,
  icon,
  selectedId,
  items,
  excludeIds = [],
  onSelect,
  showAmmo,
  eyeActive,
  onEyeToggle,
  hasItem,
}: {
  label: string;
  icon: React.ReactNode;
  selectedId: string | null;
  items: GameItem[];
  excludeIds?: string[];
  onSelect: (id: string | null) => void;
  showAmmo?: boolean;
  eyeActive: boolean;
  onEyeToggle: () => void;
  hasItem: boolean;
}) {
  const selected = selectedId ? ITEMS_MAP[selectedId] : null;

  // Single alphabetical list, no category groups
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  );

  return (
    <div className={`bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-700/50 ${!eyeActive && hasItem ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium flex-1">{label}</span>
        {hasItem && <EyeToggle active={eyeActive} onClick={onEyeToggle} />}
      </div>
      <div className="flex items-center gap-2.5">
        {selected && <ItemIcon name={selected.name} imageUrl={selected.imageUrl} rarity={selected.rarity} size={40} />}
        <select
          value={selectedId ?? ""}
          onChange={(e) => onSelect(e.target.value || null)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-500 min-w-0"
        >
          <option value="">— None —</option>
          {sortedItems
            .filter((i) => !excludeIds.includes(i.id))
            .map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
        </select>
        {selectedId && (
          <button onClick={() => onSelect(null)} className="text-zinc-600 hover:text-red-400 flex-shrink-0">
            <X size={14} />
          </button>
        )}
      </div>
      {showAmmo && selected?.ammoType && (
        <div className="mt-1 text-[11px] text-zinc-500">
          Uses: {ITEMS_MAP[selected.ammoType]?.name ?? selected.ammoType}
        </div>
      )}
    </div>
  );
}

/** Dynamic slot array — search-first add button, used for ALL inventory sections */
function SlotArray({
  label,
  icon,
  maxSlots,
  slots,
  items,
  onChange,
  excludeKeyPrefix,
  loadout,
  onUpdate,
}: {
  label: string;
  icon: React.ReactNode;
  maxSlots: number;
  slots: LoadoutSlot[];
  items: GameItem[];
  onChange: (slots: LoadoutSlot[]) => void;
  excludeKeyPrefix: string;
  loadout: Loadout;
  onUpdate: (patch: Partial<Loadout>) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const usedIds = slots.map((s) => s.itemId);
  const totalSlotsUsed = slots.reduce((sum, s) => sum + s.quantity, 0);
  const remaining = maxSlots - totalSlotsUsed;
  const isFull = remaining <= 0;

  const addSlot = (itemId: string) => {
    if (isFull) return;
    onChange([...slots, { itemId, quantity: 1 }]);
    setShowPicker(false);
  };

  const updateQty = (itemId: string, qty: number) => {
    const currentSlot = slots.find((s) => s.itemId === itemId);
    if (!currentSlot) return;
    const otherUsed = totalSlotsUsed - currentSlot.quantity;
    const maxForThis = maxSlots - otherUsed;
    const clamped = Math.max(1, Math.min(qty, maxForThis));
    onChange(slots.map((s) => (s.itemId === itemId ? { ...s, quantity: clamped } : s)));
  };

  const removeSlot = (itemId: string) => {
    onChange(slots.filter((s) => s.itemId !== itemId));
  };

  return (
    <div className="bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">{icon}</span>
          <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium">{label}</span>
        </div>
        <span className={`text-xs font-mono ${isFull ? "text-red-400" : "text-zinc-500"}`}>
          {totalSlotsUsed}/{maxSlots}
        </span>
      </div>

      <div className="space-y-1">
        {slots.map((slot, i) => {
          const item = ITEMS_MAP[slot.itemId];
          if (!item) return null;
          const totalUnits = slot.quantity * item.stackSize;
          const otherUsed = totalSlotsUsed - slot.quantity;
          const maxForThis = maxSlots - otherUsed;
          const exKey = `${excludeKeyPrefix}_${i}`;
          const eyeActive = !isExcluded(loadout, exKey);
          return (
            <div key={slot.itemId} className={`flex items-center gap-2 bg-zinc-900/60 rounded px-2 py-1 ${!eyeActive ? "opacity-50" : ""}`}>
              <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={28} />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white truncate block">{item.name}</span>
                {item.stackSize > 1 && (
                  <span className="text-[10px] text-zinc-500">{totalUnits} units ({item.stackSize}/stack)</span>
                )}
              </div>
              <NumberInput value={slot.quantity} onChange={(v) => updateQty(slot.itemId, v)} min={1} max={maxForThis} compact />
              <EyeToggle active={eyeActive} onClick={() => onUpdate({ excludedFromCalc: toggleExclude(loadout, exKey) })} />
              <button onClick={() => removeSlot(slot.itemId)} className="text-zinc-600 hover:text-red-400">
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {!isFull && (
        <>
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="mt-1.5 w-full flex items-center justify-center gap-1 px-2 py-1 border border-dashed border-zinc-600 rounded text-zinc-500 hover:text-zinc-300 hover:border-zinc-500 text-xs"
          >
            <Plus size={12} /> Add
          </button>
          {showPicker && <SlotPicker items={items} usedIds={usedIds} onSelect={addSlot} />}
        </>
      )}
    </div>
  );
}

function SlotPicker({
  items,
  usedIds,
  onSelect,
}: {
  items: GameItem[];
  usedIds: string[];
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () =>
      items
        .filter((i) => !usedIds.includes(i.id) && i.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [items, usedIds, search]
  );

  return (
    <div className="mt-1 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
        className="w-full px-3 py-1.5 bg-transparent border-b border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
      />
      <div className="max-h-48 overflow-y-auto">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-zinc-800 text-left"
          >
            <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={20} />
            <span className="flex-1 text-[11px] text-white truncate">{item.name}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="px-3 py-2 text-[11px] text-zinc-600 text-center">No items found.</div>
        )}
      </div>
    </div>
  );
}
