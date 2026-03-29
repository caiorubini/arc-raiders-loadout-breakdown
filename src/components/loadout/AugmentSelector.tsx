"use client";

import React from "react";
import { Backpack, ShieldCheck, Zap, Weight, Shield, Sparkles, Eye, EyeOff } from "lucide-react";
import { AUGMENTS, AUGMENTS_MAP } from "@/data/augments";
import { ItemIcon } from "@/components/ui/ItemIcon";
import { Rarity } from "@/types/game";

interface Props {
  augmentId: string;
  onChange: (augmentId: string) => void;
  eyeActive: boolean;
  onEyeToggle: () => void;
}

export function AugmentSelector({ augmentId, onChange, eyeActive, onEyeToggle }: Props) {
  const augment = AUGMENTS_MAP[augmentId];

  return (
    <div className={`bg-zinc-800/60 rounded-lg p-3 border border-zinc-700 ${!eyeActive ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-zinc-400 uppercase tracking-wide">Augment</label>
        <button
          onClick={onEyeToggle}
          className={`transition-colors ${eyeActive ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-700 hover:text-zinc-500"}`}
          title={eyeActive ? "Included in material calc" : "Excluded from material calc"}
        >
          {eyeActive ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
      <div className="flex items-start gap-3">
        {augment?.imageUrl && (
          <ItemIcon name={augment.name} imageUrl={augment.imageUrl} rarity={Rarity.Uncommon} size={48} />
        )}
        <div className="flex-1">
          <select
            value={augmentId}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {AUGMENTS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {augment && <p className="mt-1.5 text-xs text-zinc-400">{augment.description}</p>}
        </div>
      </div>

      {augment && (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs">
            <div className="flex items-center gap-1 text-zinc-400">
              <Weight size={12} /> Weight: <span className="text-white">{augment.weightLimit}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Backpack size={12} /> Inventory: <span className="text-white">{augment.backpackSlots}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <Zap size={12} /> Quick Use: <span className="text-white">{augment.quickUseSlots}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck size={12} /> Safe Pocket: <span className="text-white">{augment.safePocketSlots}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-400 col-span-2">
              <Shield size={12} /> Shields: <span className="text-white capitalize">{augment.shieldCompatibility.join(", ")}</span>
            </div>
          </div>
          {augment.perks.length > 0 && (
            <div className="mt-3 border-t border-zinc-700/50 pt-2">
              <div className="flex items-center gap-1 text-xs text-amber-400 mb-1">
                <Sparkles size={12} /> Perks
              </div>
              <ul className="space-y-0.5">
                {augment.perks.map((perk, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
