"use client";

import React, { useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { GameStore, GameStoreContext } from "@/hooks/useGameStore";
import { Loadout } from "@/types/game";

export function GameStoreProvider({ children }: { children: React.ReactNode }) {
  const [loadouts, setLoadouts] = useLocalStorage<Loadout[]>("arc-loadouts", []);
  const [activeLoadoutId, setActiveLoadoutId] = useLocalStorage<string | null>(
    "arc-active-loadout",
    null
  );
  const [checkedMaterials, setCheckedMaterials] = useLocalStorage<string[]>(
    "arc-checked-materials",
    []
  );

  const store: GameStore = useMemo(
    () => ({
      loadouts,
      setLoadouts,
      activeLoadoutId,
      setActiveLoadoutId,
      checkedMaterials,
      setCheckedMaterials,
    }),
    [loadouts, setLoadouts, activeLoadoutId, setActiveLoadoutId, checkedMaterials, setCheckedMaterials]
  );

  return (
    <GameStoreContext.Provider value={store}>{children}</GameStoreContext.Provider>
  );
}
