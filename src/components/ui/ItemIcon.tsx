"use client";

import { RARITY_COLORS, Rarity } from "@/types/game";

interface ItemIconProps {
  name: string;
  imageUrl?: string;
  rarity: Rarity;
  size?: number;
}

export function ItemIcon({ name, imageUrl, rarity, size = 40 }: ItemIconProps) {
  const borderColor = RARITY_COLORS[rarity];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded flex items-center justify-center bg-zinc-800 overflow-hidden flex-shrink-0"
      style={{
        width: size,
        height: size,
        border: `2px solid ${borderColor}`,
      }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={name}
          width={size}
          height={size}
          className="object-cover"
          loading="lazy"
        />
      ) : (
        <span
          className="text-xs font-bold"
          style={{ color: borderColor, fontSize: size * 0.3 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
