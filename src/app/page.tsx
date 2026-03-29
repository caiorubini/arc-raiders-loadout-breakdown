"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { GameStoreProvider } from "@/components/GameStoreProvider";
import { useGameStore } from "@/hooks/useGameStore";
import { AugmentSelector } from "@/components/loadout/AugmentSelector";
import { CoreGearSlots, InventorySlots } from "@/components/loadout/EquipmentSlots";
import { MaterialChecklist } from "@/components/calculator/MaterialCalculator";
import { AUGMENTS } from "@/data/augments";
import { Loadout } from "@/types/game";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function Dashboard() {
  const { loadouts, setLoadouts, activeLoadoutId, setActiveLoadoutId } =
    useGameStore();
  const [editingName, setEditingName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");

  const active = loadouts.find((l) => l.id === activeLoadoutId) ?? null;

  const createLoadout = () => {
    const newLoadout: Loadout = {
      id: generateId(),
      name: `Loadout ${loadouts.length + 1}`,
      augmentId: AUGMENTS[0].id,
      shieldId: null,
      weapon1Id: null,
      weapon2Id: null,
      backpack: [],
      quickUse: [],
      safePocket: [],
    };
    setLoadouts((prev) => [...prev, newLoadout]);
    setActiveLoadoutId(newLoadout.id);
  };

  const deleteLoadout = (id: string) => {
    setLoadouts((prev) => prev.filter((l) => l.id !== id));
    if (activeLoadoutId === id) setActiveLoadoutId(null);
  };

  const updateLoadout = useCallback(
    (patch: Partial<Loadout>) => {
      if (!activeLoadoutId) return;
      setLoadouts((prev) =>
        prev.map((l) => (l.id === activeLoadoutId ? { ...l, ...patch } : l))
      );
    },
    [activeLoadoutId, setLoadouts]
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            AR
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">ARC Raiders</h1>
            <p className="text-[10px] text-zinc-500">Loadout Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {loadouts.map((l) => (
            <div key={l.id} className="flex items-center">
              {editingName === l.id ? (
                <div className="flex items-center gap-1 bg-zinc-800 rounded px-2 py-1">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setLoadouts((prev) =>
                          prev.map((lo) =>
                            lo.id === l.id ? { ...lo, name: nameInput || lo.name } : lo
                          )
                        );
                        setEditingName(null);
                      }
                      if (e.key === "Escape") setEditingName(null);
                    }}
                    autoFocus
                    className="w-24 bg-transparent text-sm text-white outline-none"
                  />
                  <button
                    onClick={() => {
                      setLoadouts((prev) =>
                        prev.map((lo) =>
                          lo.id === l.id ? { ...lo, name: nameInput || lo.name } : lo
                        )
                      );
                      setEditingName(null);
                    }}
                    className="text-emerald-400 hover:text-emerald-300"
                  >
                    <Check size={12} />
                  </button>
                  <button onClick={() => setEditingName(null)} className="text-zinc-500 hover:text-zinc-300">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveLoadoutId(l.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setActiveLoadoutId(l.id);
                  }}
                  className={`px-3 py-1.5 text-sm rounded cursor-pointer select-none flex items-center gap-1.5 ${
                    activeLoadoutId === l.id
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="truncate max-w-[100px]">{l.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNameInput(l.name);
                      setEditingName(l.id);
                    }}
                    className="opacity-60 hover:opacity-100"
                  >
                    <Pencil size={10} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLoadout(l.id);
                    }}
                    className="opacity-60 hover:opacity-100 text-red-400"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={createLoadout}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded"
          >
            <Plus size={14} />
            New
          </button>
        </div>
      </header>

      {/* 3-column layout */}
      <main className="flex-1 overflow-hidden">
        {active ? (
          <div className="h-full grid grid-cols-3 divide-x divide-zinc-800">
            {/* Col 1: Augment + Shield + Weapons */}
            <div className="overflow-y-auto p-4 space-y-3">
              <AugmentSelector
                augmentId={active.augmentId}
                onChange={(augmentId) =>
                  updateLoadout({ augmentId, backpack: [], quickUse: [], safePocket: [] })
                }
              />
              <CoreGearSlots loadout={active} onUpdate={updateLoadout} />
            </div>

            {/* Col 2: Backpack + Quick Use + Safe Pocket */}
            <div className="overflow-y-auto p-4">
              <InventorySlots loadout={active} onUpdate={updateLoadout} />
            </div>

            {/* Col 3: Material Checklist */}
            <div className="overflow-y-auto p-4">
              <MaterialChecklist loadout={active} />
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            Create a loadout to get started.
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <GameStoreProvider>
      <Dashboard />
    </GameStoreProvider>
  );
}
