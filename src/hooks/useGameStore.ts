"use client";

import { createContext, useContext } from "react";
import { Loadout } from "@/types/game";

export interface GameStore {
  loadouts: Loadout[];
  setLoadouts: (l: Loadout[] | ((prev: Loadout[]) => Loadout[])) => void;
  activeLoadoutId: string | null;
  setActiveLoadoutId: (id: string | null) => void;

  /** Set of material IDs the user has checked off ("I have this") */
  checkedMaterials: string[];
  setCheckedMaterials: (s: string[] | ((prev: string[]) => string[])) => void;
}

export const GameStoreContext = createContext<GameStore | null>(null);

export function useGameStore(): GameStore {
  const ctx = useContext(GameStoreContext);
  if (!ctx) throw new Error("useGameStore must be used within GameStoreProvider");
  return ctx;
}
