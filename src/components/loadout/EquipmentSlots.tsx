"use client";

import React, { useMemo, useState } from "react";
import { Shield, Swords, Zap, ShieldCheck, Backpack, Plus, X, Eye, EyeOff } from "lucide-react";
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

/** Eye toggle button */
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

/** Column 2: Backpack + Quick Use + Safe Pocket */
export function InventorySlots({ loadout, onUpdate }: Props) {
  const augment = AUGMENTS_MAP[loadout.augmentId];

  const allItems = useMemo(
    () => GAME_ITEMS.filter((i) => !["weapon", "armor"].includes(i.category)),
    []
  );

  const quickUseItems = useMemo(
    () => GAME_ITEMS.filter((i) => ["consumable", "throwable"].includes(i.category)),
    []
  );

  return (
    <div className="space-y-3">
      <SlotArray
        label="Backpack"
        icon={<Backpack size={14} />}
        maxSlots={augment?.backpackSlots ?? 0}
        slots={loadout.backpack}
        items={allItems}
        onChange={(slots) => onUpdate({ backpack: slots })}
        excludeKeyPrefix="bp"
        loadout={loadout}
        onUpdate={onUpdate}
      />
      {(augment?.quickUseSlots ?? 0) > 0 && (
        <FixedSlotArray
          label="Quick Use"
          icon={<Zap size={14} />}
          totalSlots={augment!.quickUseSlots}
          slots={loadout.quickUse}
          items={quickUseItems}
          onChange={(slots) => onUpdate({ quickUse: slots })}
          excludeKeyPrefix="qu"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
      {(augment?.safePocketSlots ?? 0) > 0 && (
        <FixedSlotArray
          label="Safe Pocket"
          icon={<ShieldCheck size={14} />}
          totalSlots={augment!.safePocketSlots}
          slots={loadout.safePocket}
          items={allItems}
          onChange={(slots) => onUpdate({ safePocket: slots })}
          excludeKeyPrefix="sp"
          loadout={loadout}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

/** Single dropdown slot (shield, weapon) — bigger icon */
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

  return (
    <div className={`bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-700/50 ${!eyeActive && hasItem ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium flex-1">{label}</span>
        {hasItem && <EyeToggle active={eyeActive} onClick={onEyeToggle} />}
      </div>
      <div className="flex items-center gap-2.5">
        {selected && (
          <ItemIcon name={selected.name} imageUrl={selected.imageUrl} rarity={selected.rarity} size={40} />
        )}
        <select
          value={selectedId ?? ""}
          onChange={(e) => onSelect(e.target.value || null)}
          className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-zinc-500 min-w-0"
        >
          <option value="">— None —</option>
          {items
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

/** Fixed slot array — pre-fills all slots as dropdowns (Quick Use, Safe Pocket) */
function FixedSlotArray({
  label,
  icon,
  totalSlots,
  slots,
  items,
  onChange,
  excludeKeyPrefix,
  loadout,
  onUpdate,
}: {
  label: string;
  icon: React.ReactNode;
  totalSlots: number;
  slots: LoadoutSlot[];
  items: GameItem[];
  onChange: (slots: LoadoutSlot[]) => void;
  excludeKeyPrefix: string;
  loadout: Loadout;
  onUpdate: (patch: Partial<Loadout>) => void;
}) {
  // Pad slots to totalSlots length
  const usedIds = slots.map((s) => s.itemId);

  const setSlotItem = (index: number, itemId: string | null) => {
    if (!itemId) {
      // Remove slot at index
      onChange(slots.filter((_, i) => i !== index));
    } else if (index < slots.length) {
      // Replace existing
      onChange(slots.map((s, i) => (i === index ? { itemId, quantity: 1 } : s)));
    } else {
      // Append new
      onChange([...slots, { itemId, quantity: 1 }]);
    }
  };

  return (
    <div className="bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">{icon}</span>
          <span className="text-xs text-zinc-400 uppercase tracking-wide font-medium">{label}</span>
        </div>
        <span className="text-xs font-mono text-zinc-500">{slots.length}/{totalSlots}</span>
      </div>
      <div className="space-y-1">
        {Array.from({ length: totalSlots }).map((_, i) => {
          const slot = slots[i];
          const item = slot ? ITEMS_MAP[slot.itemId] : null;
          const exKey = `${excludeKeyPrefix}_${i}`;
          const eyeActive = !isExcluded(loadout, exKey);

          return (
            <div key={i} className={`flex items-center gap-2 bg-zinc-900/60 rounded px-2 py-1 ${!eyeActive && item ? "opacity-50" : ""}`}>
              {item ? (
                <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={28} />
              ) : (
                <div className="w-7 h-7 rounded border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-600 text-[10px] flex-shrink-0">
                  {i + 1}
                </div>
              )}
              <select
                value={slot?.itemId ?? ""}
                onChange={(e) => setSlotItem(i, e.target.value || null)}
                className="flex-1 bg-transparent border border-zinc-700 rounded px-1.5 py-1 text-xs text-white focus:outline-none focus:border-zinc-500 min-w-0"
              >
                <option value="">— Empty —</option>
                {items
                  .filter((it) => it.id === slot?.itemId || !usedIds.includes(it.id))
                  .map((it) => (
                    <option key={it.id} value={it.id}>{it.name}</option>
                  ))}
              </select>
              {item && <EyeToggle active={eyeActive} onClick={() => onUpdate({ excludedFromCalc: toggleExclude(loadout, exKey) })} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Dynamic slot array (Backpack) — add/remove freely */
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

function SlotPicker({ items, usedIds, onSelect }: { items: GameItem[]; usedIds: string[]; onSelect: (id: string) => void }) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(
    () => items.filter((i) => !usedIds.includes(i.id) && i.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.rarity - b.rarity || a.name.localeCompare(b.name)),
    [items, usedIds, search]
  );

  return (
    <div className="mt-1 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden">
      <input
        type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
        className="w-full px-3 py-1.5 bg-transparent border-b border-zinc-700 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
      />
      <div className="max-h-32 overflow-y-auto">
        {filtered.map((item) => (
          <button key={item.id} onClick={() => onSelect(item.id)} className="w-full flex items-center gap-2 px-3 py-1 hover:bg-zinc-800 text-left">
            <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={20} />
            <span className="flex-1 text-[11px] text-white truncate">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
