"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  /** Compact mode = smaller for inline use */
  compact?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  compact,
  className = "",
}: Props) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));

  return (
    <div
      className={`inline-flex items-center bg-zinc-900 border border-zinc-700 rounded overflow-hidden ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className={`flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${
          compact ? "w-5 h-5" : "w-6 h-6"
        }`}
      >
        <Minus size={compact ? 10 : 12} />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(min);
            return;
          }
          onChange(clamp(parseInt(raw) || min));
        }}
        min={min}
        max={max}
        className={`bg-transparent text-center text-white outline-none border-x border-zinc-700 ${
          compact ? "w-8 text-xs py-0" : "w-10 text-sm py-0.5"
        }`}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className={`flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors ${
          compact ? "w-5 h-5" : "w-6 h-6"
        }`}
      >
        <Plus size={compact ? 10 : 12} />
      </button>
    </div>
  );
}
