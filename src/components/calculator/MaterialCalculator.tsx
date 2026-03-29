"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Check, Package, Hammer, Recycle, ChevronRight, Undo2, Layers } from "lucide-react";
import { useGameStore } from "@/hooks/useGameStore";
import { ITEMS_MAP, RECYCLE_SOURCES } from "@/data/items";
import { calcMaterials } from "./calcEngine";
import { ItemIcon } from "@/components/ui/ItemIcon";
import { Loadout } from "@/types/game";

interface DisplayMaterial {
  materialId: string;
  quantity: number;
  rarity: number;
  brokenDown: boolean;
}

export function MaterialChecklist({ loadout }: { loadout: Loadout }) {
  const { checkedMaterials, setCheckedMaterials } = useGameStore();
  const checkedSet = useMemo(() => new Set(checkedMaterials), [checkedMaterials]);

  const baseMaterials = useMemo(() => calcMaterials(loadout), [loadout]);

  // Track which materials have been broken down
  const [breakdowns, setBreakdowns] = useState<Set<string>>(new Set());

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

  // Compute display list: apply breakdowns
  const { active, broken } = useMemo(() => {
    const extra: Record<string, number> = {};
    const brokenList: DisplayMaterial[] = [];

    for (const mat of baseMaterials) {
      if (breakdowns.has(mat.materialId)) {
        const item = ITEMS_MAP[mat.materialId];
        if (item && Object.keys(item.craftCost).length > 0) {
          // Expand: qty * craftCost per unit
          for (const [compId, perUnit] of Object.entries(item.craftCost)) {
            extra[compId] = (extra[compId] ?? 0) + perUnit * mat.quantity;
          }
          brokenList.push({ ...mat, brokenDown: true });
        }
      }
    }

    // Build active list: non-broken + extras merged
    const merged: Record<string, { quantity: number; rarity: number }> = {};
    for (const mat of baseMaterials) {
      if (!breakdowns.has(mat.materialId)) {
        merged[mat.materialId] = {
          quantity: (merged[mat.materialId]?.quantity ?? 0) + mat.quantity,
          rarity: mat.rarity,
        };
      }
    }
    for (const [id, qty] of Object.entries(extra)) {
      const r = ITEMS_MAP[id]?.rarity ?? 0;
      merged[id] = {
        quantity: (merged[id]?.quantity ?? 0) + qty,
        rarity: r,
      };
    }

    const activeList: DisplayMaterial[] = Object.entries(merged)
      .map(([materialId, { quantity, rarity }]) => ({
        materialId,
        quantity,
        rarity,
        brokenDown: false,
      }))
      .sort((a, b) => b.rarity - a.rarity || a.materialId.localeCompare(b.materialId));

    return { active: activeList, broken: brokenList };
  }, [baseMaterials, breakdowns]);

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
        <span className="text-xs text-zinc-500">{done}/{active.length}</span>
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

      {/* Broken down items */}
      {broken.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-800">
          <div className="text-[10px] text-zinc-600 uppercase tracking-wide mb-2 flex items-center gap-1">
            <Layers size={10} />
            Broken down
          </div>
          {broken.map((mat) => {
            const item = ITEMS_MAP[mat.materialId];
            return (
              <div
                key={mat.materialId}
                className="flex items-center gap-2 px-3 py-1.5 text-zinc-600"
              >
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

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
          checked ? "bg-zinc-800/20" : "bg-zinc-800/40"
        }`}
      >
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
            checked
              ? "bg-emerald-600 text-white"
              : "border border-zinc-600 hover:border-zinc-400"
          }`}
        >
          {checked && <Check size={12} strokeWidth={3} />}
        </button>

        {/* Icon */}
        {item && <ItemIcon name={item.name} imageUrl={item.imageUrl} rarity={item.rarity} size={22} />}

        {/* Name */}
        <span className={`flex-1 text-sm truncate ${checked ? "text-zinc-500 line-through" : "text-white"}`}>
          {item?.name ?? mat.materialId}
        </span>

        {/* Quantity */}
        <span className={`text-sm font-mono flex-shrink-0 ${checked ? "text-zinc-600" : "text-zinc-300"}`}>
          x{mat.quantity}
        </span>

        {/* Breakdown button */}
        {hasCraft && !checked && (
          <button
            onClick={onBreakdown}
            className="text-zinc-600 hover:text-blue-400 flex-shrink-0"
            title="Break down into components"
          >
            <Layers size={14} />
          </button>
        )}

        {/* Expand chevron */}
        {hasAlternatives && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-zinc-600 hover:text-zinc-300 flex-shrink-0 transition-transform"
          >
            <ChevronRight
              size={14}
              className={`transition-transform ${expanded ? "rotate-90" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Expanded alternatives */}
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
