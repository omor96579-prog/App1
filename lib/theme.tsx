import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface Palette {
  dark: boolean;
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  accent: string;
  onAccent: string;
  danger: string;
}

const LIGHT: Palette = {
  dark: false,
  bg: '#F3F5F9',
  surface: '#FFFFFF',
  surfaceAlt: '#ECEFF5',
  text: '#0E1524',
  textMuted: '#59627A',
  textFaint: '#8C95A8',
  border: '#E1E5EE',
  accent: '#5B4CE0',
  onAccent: '#FFFFFF',
  danger: '#E5484D',
};

const DARK: Palette = {
  dark: true,
  bg: '#0A0D14',
  surface: '#121724',
  surfaceAlt: '#1A2132',
  text: '#E9ECF4',
  textMuted: '#98A2B8',
  textFaint: '#6C7689',
  border: '#232C3D',
  accent: '#8B84FF',
  onAccent: '#0A0D14',
  danger: '#FF6369',
};

interface ThemeValue {
  mode: ThemeMode;
  isDark: boolean;
  palette: Palette;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

const STORAGE_KEY = 'iconary:theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!alive) return;
        if (value === 'light' || value === 'dark' || value === 'system') setModeState(value);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  };

  const isDark = mode === 'system' ? scheme === 'dark' : mode === 'dark';

  const value = useMemo<ThemeValue>(
    () => ({ mode, isDark, palette: isDark ? DARK : LIGHT, setMode }),
    [mode, isDark]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

/** '#5B4CE0' + 0.12 -> 'rgba(91, 76, 224, 0.12)' */
export function hexA(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const MONO_FONT = 'Menlo';
