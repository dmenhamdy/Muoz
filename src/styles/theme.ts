import { ThemeName } from '../types/music';

export interface ThemeConfig {
  id: ThemeName;
  name: string;
  emoji: string;
  primary: string;
  primaryLight: string;
  surface: string;
  surfaceContainer: string;
  background: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  pink: {
    id: 'pink',
    name: 'Strawberry Milk',
    emoji: '🍓',
    primary: '#ff6584',
    primaryLight: '#ffa3b5',
    surface: '#22181c',
    surfaceContainer: '#2f2026',
    background: '#181114',
    cardBg: '#281b21',
    border: '#452c36',
    textPrimary: '#fcedf2',
    textSecondary: '#ccaab7',
    accent: '#ff85a1',
  },
  purple: {
    id: 'purple',
    name: 'Lavender Dream',
    emoji: '💜',
    primary: '#b388ff',
    primaryLight: '#d1b3ff',
    surface: '#1f1828',
    surfaceContainer: '#2b2138',
    background: '#140f1a',
    cardBg: '#251c30',
    border: '#3f2f54',
    textPrimary: '#f5edfc',
    textSecondary: '#bfaacb',
    accent: '#ce93d8',
  },
  mint: {
    id: 'mint',
    name: 'Matcha Mint',
    emoji: '🍵',
    primary: '#48cae4',
    primaryLight: '#90e0ef',
    surface: '#142226',
    surfaceContainer: '#1c2e34',
    background: '#0d1619',
    cardBg: '#18272c',
    border: '#29434b',
    textPrimary: '#eaf7fb',
    textSecondary: '#a5c4cc',
    accent: '#52b788',
  },
  peach: {
    id: 'peach',
    name: 'Sweet Peach',
    emoji: '🍑',
    primary: '#ff8a65',
    primaryLight: '#ffab91',
    surface: '#241a17',
    surfaceContainer: '#33231f',
    background: '#17100e',
    cardBg: '#2c1e1a',
    border: '#4c322b',
    textPrimary: '#fdf1ed',
    textSecondary: '#cbb1a9',
    accent: '#ffb703',
  },
  amoled: {
    id: 'amoled',
    name: 'AMOLED Black',
    emoji: '🖤',
    primary: '#ff70a6',
    primaryLight: '#ff9ebb',
    surface: '#0f0f0f',
    surfaceContainer: '#181818',
    background: '#000000',
    cardBg: '#141414',
    border: '#262626',
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
    accent: '#ff70a6',
  },
  blue: {
    id: 'blue',
    name: 'Ocean Cyan',
    emoji: '🌊',
    primary: '#4ea8de',
    primaryLight: '#72efdd',
    surface: '#131e2b',
    surfaceContainer: '#1a283a',
    background: '#0b131c',
    cardBg: '#162333',
    border: '#253952',
    textPrimary: '#e3f2fd',
    textSecondary: '#a4b8cb',
    accent: '#56cfe1',
  },
};
