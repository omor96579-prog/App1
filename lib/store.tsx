import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY_FAVORITES = 'iconary:favorites';
const KEY_RECENTS = 'iconary:recents';
const KEY_COLUMNS = 'iconary:columns';

const MAX_RECENTS = 16;

interface StoreValue {
  ready: boolean;
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  recents: string[];
  pushRecent: (id: string) => void;
  clearRecents: () => void;
  columns: number;
  setColumns: (columns: number) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [columns, setColumnsState] = useState(4);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [favRaw, recRaw, colRaw] = await Promise.all([
          AsyncStorage.getItem(KEY_FAVORITES),
          AsyncStorage.getItem(KEY_RECENTS),
          AsyncStorage.getItem(KEY_COLUMNS),
        ]);
        if (!alive) return;
        if (favRaw) setFavorites(JSON.parse(favRaw));
        if (recRaw) setRecents(JSON.parse(recRaw));
        if (colRaw) {
          const parsed = parseInt(colRaw, 10);
          if (parsed >= 3 && parsed <= 5) setColumnsState(parsed);
        }
      } catch {
        // ignore corrupted storage and start fresh
      } finally {
        if (alive) setReady(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
      AsyncStorage.setItem(KEY_FAVORITES, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    AsyncStorage.setItem(KEY_FAVORITES, '[]').catch(() => {});
  }, []);

  const pushRecent = useCallback((id: string) => {
    setRecents((current) => {
      const next = [id, ...current.filter((item) => item !== id)].slice(0, MAX_RECENTS);
      AsyncStorage.setItem(KEY_RECENTS, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecents([]);
    AsyncStorage.setItem(KEY_RECENTS, '[]').catch(() => {});
  }, []);

  const setColumns = useCallback((next: number) => {
    const clamped = Math.min(5, Math.max(3, next));
    setColumnsState(clamped);
    AsyncStorage.setItem(KEY_COLUMNS, String(clamped)).catch(() => {});
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      favorites,
      isFavorite: (id: string) => favorites.includes(id),
      toggleFavorite,
      clearFavorites,
      recents,
      pushRecent,
      clearRecents,
      columns,
      setColumns,
    }),
    [ready, favorites, recents, columns, toggleFavorite, clearFavorites, pushRecent, clearRecents, setColumns]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
