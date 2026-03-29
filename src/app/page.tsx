"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, X, Share2 } from "lucide-react";
import { GameStoreProvider } from "@/components/GameStoreProvider";
import { useGameStore } from "@/hooks/useGameStore";
import { AugmentSelector } from "@/components/loadout/AugmentSelector";
import { CoreGearSlots, InventorySlots } from "@/components/loadout/EquipmentSlots";
import { MaterialChecklist } from "@/components/calculator/MaterialCalculator";
import { encodeLoadout, decodeLoadout } from "@/components/calculator/calcEngine";
import { AUGMENTS } from "@/data/augments";
import { Loadout } from "@/types/game";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function Dashboard() {
  const { loadouts, setLoadouts, activeLoadoutId, setActiveLoadoutId } = useGameStore();
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [copied, setCopied] = useState(false);

  const active = loadouts.find((l) => l.id === activeLoadoutId) ?? null;

  // Import shared loadout from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("loadout");
    if (shared) {
      const data = decodeLoadout(shared);
      if (data) {
        const imported: Loadout = {
          id: generateId(),
          name: data.name ?? "Shared Loadout",
          augmentId: data.augmentId ?? AUGMENTS[0].id,
          shieldId: data.shieldId ?? null,
          weapon1Id: data.weapon1Id ?? null,
          weapon2Id: data.weapon2Id ?? null,
          backpack: data.backpack ?? [],
          quickUse: data.quickUse ?? [],
          safePocket: data.safePocket ?? [],
          excludedFromCalc: data.excludedFromCalc ?? [],
        };
        setLoadouts((prev) => [...prev, imported]);
        setActiveLoadoutId(imported.id);
        // Clean URL
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const deleteActive = () => {
    if (!active) return;
    setLoadouts((prev) => prev.filter((l) => l.id !== active.id));
    setActiveLoadoutId(null);
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

  const toggleAugmentExclude = () => {
    if (!active) return;
    const current = active.excludedFromCalc ?? [];
    updateLoadout({
      excludedFromCalc: current.includes("augment")
        ? current.filter((k) => k !== "augment")
        : [...current, "augment"],
    });
  };

  const shareLoadout = async () => {
    if (!active) return;
    const encoded = encodeLoadout(active);
    const url = `${window.location.origin}${window.location.pathname}?loadout=${encoded}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-2.5 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm flex-shrink-0 gap-3">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs">AR</div>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">ARC Raiders</h1>
            <p className="text-[10px] text-zinc-500">Loadout Builder</p>
          </div>
        </div>

        {/* Loadout tabs + active controls */}
        <div className="flex items-center gap-1 overflow-x-auto flex-1 justify-end">
          {loadouts.map((l) => (
            <button
              key={l.id}
              onClick={() => setActiveLoadoutId(l.id)}
              className={`px-3 py-1.5 text-sm rounded flex-shrink-0 ${
                activeLoadoutId === l.id
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <span className="truncate max-w-[200px] inline-block align-middle">{l.name}</span>
            </button>
          ))}

          {/* Active loadout controls */}
          {active && (
            <>
              {editing ? (
                <div className="flex items-center gap-1 bg-zinc-800 rounded px-2 py-1 flex-shrink-0">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { updateLoadout({ name: nameInput || active.name }); setEditing(false); }
                      if (e.key === "Escape") setEditing(false);
                    }}
                    autoFocus
                    className="w-48 bg-transparent text-sm text-white outline-none"
                    maxLength={60}
                  />
                  <button onClick={() => { updateLoadout({ name: nameInput || active.name }); setEditing(false); }} className="text-emerald-400 hover:text-emerald-300">
                    <Check size={12} />
                  </button>
                  <button onClick={() => setEditing(false)} className="text-zinc-500 hover:text-zinc-300">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={() => { setNameInput(active.name); setEditing(true); }} className="text-zinc-500 hover:text-zinc-300 flex-shrink-0" title="Rename">
                    <Pencil size={12} />
                  </button>
                  <button onClick={shareLoadout} className="text-zinc-500 hover:text-blue-400 flex-shrink-0" title="Copy share link">
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Share2 size={12} />}
                  </button>
                  <button onClick={deleteActive} className="text-zinc-500 hover:text-red-400 flex-shrink-0" title="Delete loadout">
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </>
          )}

          <button onClick={createLoadout} className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded flex-shrink-0">
            <Plus size={14} /> New
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
                onChange={(augmentId) => updateLoadout({ augmentId, backpack: [], quickUse: [], safePocket: [] })}
                eyeActive={!(active.excludedFromCalc ?? []).includes("augment")}
                onEyeToggle={toggleAugmentExclude}
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
