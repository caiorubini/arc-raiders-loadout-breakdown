"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Check,
  Package,
  Hammer,
  Recycle,
  ChevronRight,
  Undo2,
  Layers,
  ArrowUpDown,
  Coins,
  Filter,
} from "lucide-react";
import { useGameStore } from "@/hooks/useGameStore";
import { ITEMS_MAP, RECYCLE_SOURCES } from "@/data/items";
import {
  ITEM_TRADERS,
  INDIRECT_TRADER_SOURCES,
  TRADER_NAMES,
  isTraderBuyable,
} from "@/data/traders";
import { calcMaterials } from "./calcEngine";
import { ItemIcon } from "@/components/ui/ItemIcon";
import { Loadout } from "@/types/game";

interface DisplayMaterial {
  materialId: string;
  quantity: number;
  rarity: number;
  brokenDown: boolean;
}

type SortMode = "rarity" | "quantity" | "trader";

const SORT_LABELS: Record<SortMode, string> = {
  quantity: "Qty",
  rarity: "Rarity",
  trader: "Trader",
};

const NEXT_SORT: Record<SortMode, SortMode> = {
  quantity: "rarity",
  rarity: "trader",
  trader: "quantity",
};

export function MaterialChecklist({ loadout }: { loadout: Loadout }) {
  const { checkedMaterials, setCheckedMaterials } = useGameStore();
  const checkedSet = useMemo(() => new Set(checkedMaterials), [checkedMaterials]);

  const baseMaterials = useMemo(() => calcMaterials(loadout), [loadout]);

  const [breakdowns, setBreakdowns] = useState<Set<string>>(new Set());
  const [sortMode, setSortMode] = useState<SortMode>("quantity");
  const [hideLootOnly, setHideLootOnly] = useState(false);

  const breakdownMat = useCallback((matId: string) => {
    setBreakdowns((prev) => new Set(prev).add(matId));
  }, []);

  const undoBreakdown = useCallback((matId: string) => {
    setBreakdowns((prev) => {
      const next = new Set(prev);
      next.delete(matId);
      return next;
    });
  }, []);

  const { active, broken } = useMemo(() => {
    let pool: Record<string, { quantity: number; rarity: number }> = {};
    for (const mat of baseMaterials) {
      pool[mat.materialId] = {
        quantity: (pool[mat.materialId]?.quantity ?? 0) + mat.quantity,
        rarity: mat.rarity,
      };
    }

    const brokenList: DisplayMaterial[] = [];

    let changed = true;
    while (changed) {
      changed = false;
      const nextPool: Record<string, { quantity: number; rarity: number }> = {};
      for (const [matId, { quantity, rarity }] of Object.entries(pool)) {
        if (breakdowns.has(matId)) {
          const item = ITEMS_MAP[matId];
          if (item && Object.keys(item.craftCost).length > 0) {
            for (const [compId, perUnit] of Object.entries(item.craftCost)) {
              const r = ITEMS_MAP[compId]?.rarity ?? 0;
              nextPool[compId] = {
                quantity: (nextPool[compId]?.quantity ?? 0) + perUnit * quantity,
                rarity: r,
              };
            }
            if (!brokenList.some((b) => b.materialId === matId)) {
              brokenList.push({ materialId: matId, quantity, rarity, brokenDown: true });
            } else {
              const existing = brokenList.find((b) => b.materialId === matId)!;
              existing.quantity = quantity;
            }
            changed = true;
            continue;
          }
        }
        nextPool[matId] = {
          quantity: (nextPool[matId]?.quantity ?? 0) + quantity,
          rarity: rarity,
        };
      }
      pool = nextPool;
    }

    const traderRank = (id: string) => (isTraderBuyable(id) ? 0 : 1);

    const sorter = (a: DisplayMaterial, b: DisplayMaterial) => {
      if (sortMode === "trader") {
        const t = traderRank(a.materialId) - traderRank(b.materialId);
        if (t !== 0) return t;
        return b.quantity - a.quantity || b.rarity - a.rarity;
      }
      if (sortMode === "quantity") {
        return b.quantity - a.quantity || b.rarity - a.rarity;
      }
      return b.rarity - a.rarity || a.materialId.localeCompare(b.materialId);
    };

    let activeList: DisplayMaterial[] = Object.entries(pool)
      .map(([materialId, { quantity, rarity }]) => ({
        materialId,
        quantity,
        rarity,
        brokenDown: false,
      }))
      .sort(sorter);

    if (hideLootOnly) {
      activeList = activeList.filter((m) => isTraderBuyable(m.materialId));
    }

    return { active: activeList, broken: brokenList };
  }, [baseMaterials, breakdowns, sortMode, hideLootOnly]);

  const toggle = (matId: string) => {
    setCheckedMaterials((prev) =>
      prev.includes(matId) ? prev.filter((id) => id !== matId) : [...prev, matId]
    );
  };

  if (baseMaterials.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-zinc-500 text-sm py-16 gap-2">
        <Package size={28} className="text-zinc-600" />
        Equip items to see materials.
      </div>
    );
  }

  const done = active.filter((m) => checkedSet.has(m.materialId)).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wide">Materials</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSortMode((s) => NEXT_SORT[s])}
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 uppercase tracking-wide"
            title={`Sort: ${SORT_LABELS[sortMode]} — click to cycle`}
          >
            <ArrowUpDown size={10} />
            {SORT_LABELS[sortMode]}
          </button>
          <button
            onClick={() => setHideLootOnly((v) => !v)}
            className={`flex items-center gap-1 text-[10px] uppercase tracking-wide ${
              hideLootOnly ? "text-emerald-400 hover:text-emerald-300" : "text-zinc-500 hover:text-zinc-300"
            }`}
            title={hideLootOnly ? "Showing trader-buyable only" : "Hide loot-only items"}
          >
            <Filter size={10} />
            Trader-only
          </button>
          <span className="text-xs text-zinc-500">{done}/{active.length}</span>
        </div>
      </div>

      <div className="space-y-1">
        {active.map((mat) => (
          <MaterialRow
            key={mat.materialId}
            mat={mat}
            checked={checkedSet.has(mat.materialId)}
            onToggle={() => toggle(mat.materialId)}
            onBreakdown={() => breakdownMat(mat.materialId)}
          />
        ))}
      </div>

      {broken.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-600 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Layers size={10} />
            Broken down
          </div>
          {broken.map((mat) => {
            const item = ITEMS_MAP[mat.materialId];
            return (
              <div key={mat.materialId} className="flex items-center gap-2 px-3 py-1.5 text-zinc-600">
                {item && <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={20} />}
                <span className="flex-1 text-xs line-through truncate">{item?.name ?? mat.materialId}</span>
                <span className="text-xs font-mono">x{mat.quantity}</span>
                <button
                  onClick={() => undoBreakdown(mat.materialId)}
                  className="text-zinc-600 hover:text-zinc-300 ml-1"
                  title="Undo breakdown"
                >
                  <Undo2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Returns a short inline annotation like "(Tian Wen: 3/day)" or "(Lance: 3x Noisemaker/day)" — null if loot-only. */
function traderHint(matId: string): string | null {
  const direct = ITEM_TRADERS[matId];
  if (direct?.length) {
    const best = direct[0];
    const trader = TRADER_NAMES[best.trader];
    if (best.entry.dailyLimit) return `${trader}: ${best.entry.dailyLimit}/day`;
    if (best.entry.batchQuantity) return `${trader}: ×${best.entry.batchQuantity}`;
    return trader;
  }
  const indirect = INDIRECT_TRADER_SOURCES[matId];
  if (indirect?.length) {
    const best = indirect[0];
    const trader = TRADER_NAMES[best.trader];
    const limit = best.entry.dailyLimit ? ` ${best.entry.dailyLimit}/day` : "";
    return `${trader}: ${best.sourceItem.name}${limit}`;
  }
  return null;
}

function MaterialRow({
  mat,
  checked,
  onToggle,
  onBreakdown,
}: {
  mat: DisplayMaterial;
  checked: boolean;
  onToggle: () => void;
  onBreakdown: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const item = ITEMS_MAP[mat.materialId];
  const sources = RECYCLE_SOURCES[mat.materialId] ?? [];
  const hasCraft = item && Object.keys(item.craftCost).length > 0;
  const hasAlternatives = hasCraft || sources.length > 0;
  const hint = traderHint(mat.materialId);

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
          checked ? "bg-zinc-800/20" : "bg-zinc-800/40"
        }`}
      >
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
            checked ? "bg-emerald-600 text-white" : "border border-zinc-600 hover:border-zinc-400"
          }`}
        >
          {checked && <Check size={12} strokeWidth={3} />}
        </button>

        {item && <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={22} />}

        <div className={`flex-1 min-w-0 ${checked ? "opacity-50" : ""}`}>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-sm truncate ${checked ? "text-zinc-500 line-through" : "text-white"}`}>
              {item?.name ?? mat.materialId}
            </span>
            {hint && (
              <span className="text-[10px] text-amber-400/80 truncate flex-shrink min-w-0 inline-flex items-center gap-0.5">
                <Coins size={9} />
                {hint}
              </span>
            )}
          </div>
        </div>

        {hasCraft && !checked && (
          <button
            onClick={onBreakdown}
            className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-blue-400 flex-shrink-0 uppercase tracking-wide"
            title="Break down into crafting components"
          >
            <Layers size={11} />
            Breakdown
          </button>
        )}

        <span className={`text-sm font-mono flex-shrink-0 ${checked ? "text-zinc-600" : "text-zinc-300"}`}>
          x{mat.quantity}
        </span>

        {hasAlternatives && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-zinc-600 hover:text-zinc-300 flex-shrink-0 transition-transform"
          >
            <ChevronRight size={14} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
          </button>
        )}
      </div>

      {expanded && (
        <div className="ml-8 mr-2 mb-1 px-3 py-2 bg-zinc-900/60 rounded-b border-x border-b border-zinc-800/50 space-y-2">
          {hasCraft && (
            <div>
              <div className="flex items-center gap-1 text-[11px] text-blue-400 mb-1">
                <Hammer size={10} />
                Craft recipe (per unit)
              </div>
              <div className="space-y-0.5 pl-1">
                {Object.entries(item.craftCost).map(([matId, qty]) => {
                  const m = ITEMS_MAP[matId];
                  return (
                    <div key={matId} className="flex items-center gap-2 text-[11px]">
                      {m && <ItemIcon name={m.name} imageUrl={m.imageUrl} rarity={m.rarity} size={16} />}
                      <span className="text-zinc-300">{m?.name ?? matId}</span>
                      <span className="text-blue-300 font-mono ml-auto">x{qty}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {sources.length > 0 && (
            <div>
              <div className="flex items-center gap-1 text-[11px] text-amber-400 mb-1">
                <Recycle size={10} />
                Get by recycling
              </div>
              <div className="space-y-0.5 pl-1">
                {sources.map(({ item: src, yieldPerUnit }) => (
                  <div key={src.id} className="flex items-center gap-2 text-[11px]">
                    <ItemIcon name={src.name} imageUrl={src.imageUrl} rarity={src.rarity} size={16} />
                    <span className="text-zinc-300 truncate">{src.name}</span>
                    <span className="text-amber-300 font-mono ml-auto flex-shrink-0">{yieldPerUnit}/ea</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
