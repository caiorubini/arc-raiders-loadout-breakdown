"use client";

import React, { useMemo, useState } from "react";
import { Shield, Swords, Zap, ShieldCheck, Backpack, Plus, X } from "lucide-react";
import { GAME_ITEMS, ITEMS_MAP } from "@/data/items";
import { NumberInput } from "@/components/ui/NumberInput";
import { AUGMENTS_MAP } from "@/data/augments";
import { Loadout, LoadoutSlot, GameItem } from "@/types/game";
import { ItemIcon } from "@/components/ui/ItemIcon";
import { RarityBadge } from "@/components/ui/RarityBadge";

interface Props {
  loadout: Loadout;
  onUpdate: (patch: Partial<Loadout>) => void;
}

/** Column 1: Shield + Weapons */
export function CoreGearSlots({ loadout, onUpdate }: Props) {
  const augment = AUGMENTS_MAP[loadout.augmentId];

  const compatibleShields = useMemo(
    () =>
      GAME_ITEMS.filter(
        (i) =>
          i.category === "armor" &&
          i.shieldTier &&
          augment?.shieldCompatibility.includes(i.shieldTier)
      ),
    [augment]
  );

  const weapons = useMemo(
    () => GAME_ITEMS.filter((i) => i.category === "weapon"),
    []
  );

  return (
    <div className="space-y-3">
      <EquipSlot
        label="Shield"
        icon={<Shield size={14} />}
        selectedId={loadout.shieldId}
        items={compatibleShields}
        onSelect={(id) => onUpdate({ shieldId: id })}
      />
      <EquipSlot
        label="Primary Weapon"
        icon={<Swords size={14} />}
        selectedId={loadout.weapon1Id}
        items={weapons}
        excludeIds={loadout.weapon2Id ? [loadout.weapon2Id] : []}
        onSelect={(id) => onUpdate({ weapon1Id: id })}
        showAmmo
      />
      <EquipSlot
        label="Secondary Weapon"
        icon={<Swords size={14} />}
        selectedId={loadout.weapon2Id}
        items={weapons}
        excludeIds={loadout.weapon1Id ? [loadout.weapon1Id] : []}
        onSelect={(id) => onUpdate({ weapon2Id: id })}
        showAmmo
      />
    </div>
  );
}

/** Column 2: Backpack + Quick Use + Safe Pocket */
export function InventorySlots({ loadout, onUpdate }: Props) {
  const augment = AUGMENTS_MAP[loadout.augmentId];

  const backpackItems = useMemo(
    () => GAME_ITEMS.filter((i) => !["weapon", "armor"].includes(i.category)),
    []
  );

  const quickUseItems = useMemo(
    () => GAME_ITEMS.filter((i) => ["consumable", "throwable"].includes(i.category)),
    []
  );

  const safePocketItems = useMemo(
    () => GAME_ITEMS.filter((i) => !["weapon", "armor"].includes(i.category)),
    []
  );

  return (
    <div className="space-y-3">
      <SlotArray
        label="Backpack"
        icon={<Backpack size={14} />}
        maxSlots={augment?.backpackSlots ?? 0}
        slots={loadout.backpack}
        items={backpackItems}
        onChange={(slots) => onUpdate({ backpack: slots })}
      />
      {(augment?.quickUseSlots ?? 0) > 0 && (
        <SlotArray
          label="Quick Use"
          icon={<Zap size={14} />}
          maxSlots={augment?.quickUseSlots ?? 0}
          slots={loadout.quickUse}
          items={quickUseItems}
          onChange={(slots) => onUpdate({ quickUse: slots })}
        />
      )}
      {(augment?.safePocketSlots ?? 0) > 0 && (
        <SlotArray
          label="Safe Pocket"
          icon={<ShieldCheck size={14} />}
          maxSlots={augment?.safePocketSlots ?? 0}
          slots={loadout.safePocket}
          items={safePocketItems}
          onChange={(slots) => onUpdate({ safePocket: slots })}
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
}: {
  label: string;
  icon: React.ReactNode;
  selectedId: string | null;
  items: GameItem[];
  excludeIds?: string[];
  onSelect: (id: string | null) => void;
  showAmmo?: boolean;
}) {
  const selected = selectedId ? ITEMS_MAP[selectedId] : null;

  return (
    <div className="bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-700/50">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {selected && (
          <ItemIcon name={selected.name} imageUrl={selected.imageUrl} rarity={selected.rarity} size={28} />
        )}
        <select
          value={selectedId ?? ""}
          onChange={(e) => onSelect(e.target.value || null)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-500"
        >
          <option value="">— None —</option>
          {items
            .filter((i) => !excludeIds.includes(i.id))
            .map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({i.weight}w)
              </option>
            ))}
        </select>
        {selectedId && (
          <button
            onClick={() => onSelect(null)}
            className="text-zinc-600 hover:text-red-400"
          >
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

/** Array of slots (quick use, safe pocket) */
function SlotArray({
  label,
  icon,
  maxSlots,
  slots,
  items,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  maxSlots: number;
  slots: LoadoutSlot[];
  items: GameItem[];
  onChange: (slots: LoadoutSlot[]) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const usedIds = slots.map((s) => s.itemId);
  // Each slot.quantity = number of stacks (inventory slots occupied by this item)
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
          <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium">
            {label}
          </span>
        </div>
        <span className={`text-xs font-mono ${isFull ? "text-red-400" : "text-zinc-500"}`}>
          {totalSlotsUsed}/{maxSlots}
        </span>
      </div>

      <div className="space-y-1">
        {slots.map((slot) => {
          const item = ITEMS_MAP[slot.itemId];
          if (!item) return null;
          const totalUnits = slot.quantity * item.stackSize;
          const otherUsed = totalSlotsUsed - slot.quantity;
          const maxForThis = maxSlots - otherUsed;
          return (
            <div key={slot.itemId} className="flex items-center gap-2 bg-zinc-900/60 rounded px-2 py-1">
              <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={24} />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-white truncate block">{item.name}</span>
                {item.stackSize > 1 && (
                  <span className="text-[10px] text-zinc-500">
                    {totalUnits} units ({item.stackSize}/stack)
                  </span>
                )}
              </div>
              <NumberInput
                value={slot.quantity}
                onChange={(v) => updateQty(slot.itemId, v)}
                min={1}
                max={maxForThis}
                compact
              />
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
          {showPicker && (
            <SlotPicker items={items} usedIds={usedIds} onSelect={addSlot} />
          )}
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
  onSelect: (itemId: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      items
        .filter(
          (i) =>
            !usedIds.includes(i.id) &&
            i.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => a.rarity - b.rarity || a.name.localeCompare(b.name)),
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
      <div className="max-h-32 overflow-y-auto">
        {filtered.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className="w-full flex items-center gap-2 px-3 py-1 hover:bg-zinc-800 text-left"
          >
            <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={20} />
            <span className="flex-1 text-[11px] text-white truncate">{item.name}</span>
            <RarityBadge rarity={item.rarity} />
          </button>
        ))}
      </div>
    </div>
  );
}
