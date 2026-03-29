"use client";

import { Rarity, RARITY_LABELS, RARITY_COLORS } from "@/types/game";

export function RarityBadge({ rarity }: { rarity: Rarity }) {
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide"
      style={{
        color: RARITY_COLORS[rarity],
        backgroundColor: `${RARITY_COLORS[rarity]}20`,
      }}
    >
      {RARITY_LABELS[rarity]}
    </span>
  );
}
