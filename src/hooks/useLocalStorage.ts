"use client";

import { useSyncExternalStore, useCallback, useMemo } from "react";

/**
 * Per-key listeners so that setValue on one key only re-renders its subscribers.
 */
const listeners = new Map<string, Set<() => void>>();

function emitChange(key: string) {
  listeners.get(key)?.forEach((fn) => fn());
}

/**
 * SSR-safe LocalStorage hook using useSyncExternalStore.
 * No refs in render path — fully compatible with React Compiler rules.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const initialSerialized = useMemo(
    () => JSON.stringify(initialValue),
    [initialValue]
  );

  const subscribe = useCallback(
    (callback: () => void) => {
      if (!listeners.has(key)) listeners.set(key, new Set());
      listeners.get(key)!.add(callback);
      return () => {
        listeners.get(key)?.delete(callback);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key) ?? initialSerialized;
    } catch {
      return initialSerialized;
    }
  }, [key, initialSerialized]);

  const getServerSnapshot = useCallback(
    () => initialSerialized,
    [initialSerialized]
  );

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Parse only when raw string changes (useMemo compares by value for strings)
  const parsed = useMemo(() => JSON.parse(raw) as T, [raw]);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      try {
        const currentRaw = window.localStorage.getItem(key);
        const current: T =
          currentRaw !== null ? JSON.parse(currentRaw) : initialValue;
        const next = updater instanceof Function ? updater(current) : updater;
        window.localStorage.setItem(key, JSON.stringify(next));
        emitChange(key);
      } catch {
        // Storage full or unavailable
      }
    },
    [key, initialValue]
  );

  return [parsed, setValue] as const;
}
