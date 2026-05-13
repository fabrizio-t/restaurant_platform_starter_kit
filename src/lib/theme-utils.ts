import type { BrandedTheme, Store } from '@/types';
import { LOCAL_THEME } from '@/lib/config';

interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface BrandedThemeInputs {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  headerColor?: string;
  fontFamily?: string;
}

export interface ThemeVariables {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  muted: string;
  'muted-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  accent: string;
  'accent-foreground': string;
  border: string;
  input: string;
  ring: string;
  brand: string;
  'brand-foreground': string;
  'brand-hover': string;
  'brand-muted': string;
  'brand-muted-foreground': string;
  header: string;
  'header-foreground': string;
  'header-muted': string;
  'font-body': string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function hexToHsl(hex: string): HSL {
  const { r: r255, g: g255, b: b255 } = hexToRgb(hex);
  const r = r255 / 255;
  const g = g255 / 255;
  const b = b255 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;

  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToVar(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function shiftLightness(hsl: HSL, amount: number): HSL {
  return { ...hsl, l: clamp(hsl.l + amount, 0, 100) };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (channel: number) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function isDark(hex: string): boolean {
  return relativeLuminance(hex) < 0.4;
}

function contrastForeground(backgroundHex: string): HSL {
  return isDark(backgroundHex) ? { h: 0, s: 0, l: 100 } : { h: 0, s: 0, l: 10 };
}

function toPaletteHex(hsl: HSL): string {
  return `hsl(${hslToVar(hsl)})`;
}

export function deriveThemeVariables(inputs: BrandedThemeInputs): ThemeVariables {
  const background = hexToHsl(inputs.backgroundColor);
  const foreground = hexToHsl(inputs.textColor);
  const brand = hexToHsl(inputs.primaryColor);
  const header = inputs.headerColor ? hexToHsl(inputs.headerColor) : shiftLightness(foreground, -6);
  const backgroundIsLight = !isDark(inputs.backgroundColor);

  const card = backgroundIsLight ? shiftLightness(background, 2) : shiftLightness(background, 4);
  const muted = backgroundIsLight ? shiftLightness(background, -4) : shiftLightness(background, 4);
  const secondary = backgroundIsLight ? shiftLightness(background, -8) : shiftLightness(background, 8);
  const border = backgroundIsLight ? shiftLightness(background, -10) : shiftLightness(background, 10);
  const input = backgroundIsLight ? shiftLightness(background, -16) : shiftLightness(background, 14);
  const mutedForeground = backgroundIsLight ? shiftLightness(foreground, 30) : shiftLightness(foreground, -30);
  const brandHover = backgroundIsLight ? shiftLightness(brand, -8) : shiftLightness(brand, 8);
  const brandMuted = backgroundIsLight
    ? { h: brand.h, s: Math.max(brand.s - 20, 10), l: 95 }
    : { h: brand.h, s: Math.max(brand.s - 30, 10), l: 15 };

  return {
    background: hslToVar(background),
    foreground: hslToVar(foreground),
    card: hslToVar(card),
    'card-foreground': hslToVar(foreground),
    muted: hslToVar(muted),
    'muted-foreground': hslToVar(mutedForeground),
    secondary: hslToVar(secondary),
    'secondary-foreground': hslToVar(foreground),
    accent: hslToVar(card),
    'accent-foreground': hslToVar(foreground),
    border: hslToVar(border),
    input: hslToVar(input),
    ring: hslToVar(brand),
    brand: hslToVar(brand),
    'brand-foreground': hslToVar(contrastForeground(inputs.primaryColor)),
    'brand-hover': hslToVar(brandHover),
    'brand-muted': hslToVar(brandMuted),
    'brand-muted-foreground': hslToVar(brand),
    header: hslToVar(header),
    'header-foreground': hslToVar(contrastForeground(inputs.headerColor || inputs.textColor)),
    'header-muted': hslToVar(isDark(inputs.headerColor || inputs.textColor) ? { h: 0, s: 0, l: 85 } : { h: 0, s: 0, l: 30 }),
    'font-body': inputs.fontFamily
      ? inputs.fontFamily.includes(',')
        ? inputs.fontFamily
        : `'${inputs.fontFamily}', Arial, Helvetica, sans-serif`
      : 'Arial, Helvetica, sans-serif',
  };
}

export function generateBrandedCSS(theme: BrandedTheme): string {
  if (!theme.primaryColor) return '';

  const vars = deriveThemeVariables({
    primaryColor: theme.primaryColor,
    backgroundColor: theme.backgroundColor || '#ffffff',
    textColor: theme.textColor || '#111827',
    headerColor: theme.headerColor,
    fontFamily: theme.fontFamily,
  }) as unknown as Record<string, string>;

  for (const [key, value] of Object.entries(theme.variableOverrides || {})) {
    if (value) vars[key] = value;
  }

  const lines = Object.entries(vars)
    .map(([key, value]) => {
      if (key === 'font-body') return `  --${key}: ${value};`;
      return `  --${key}: hsl(${value});`;
    })
    .join('\n');
  const primary = hexToHsl(theme.primaryColor);

  return `.branded {\n${lines}\n  --primary-50: ${toPaletteHex({ ...primary, s: Math.max(primary.s - 25, 10), l: 96 })};\n  --primary-100: ${toPaletteHex({ ...primary, s: Math.max(primary.s - 18, 10), l: 91 })};\n  --primary-200: ${toPaletteHex({ ...primary, s: Math.max(primary.s - 10, 10), l: 82 })};\n  --primary-300: ${toPaletteHex({ ...primary, l: 72 })};\n  --primary-400: ${toPaletteHex({ ...primary, l: 62 })};\n  --primary-500: ${toPaletteHex(primary)};\n  --primary-600: ${toPaletteHex(shiftLightness(primary, -6))};\n  --primary-700: ${toPaletteHex(shiftLightness(primary, -12))};\n  --primary-800: ${toPaletteHex(shiftLightness(primary, -18))};\n  --primary-900: ${toPaletteHex(shiftLightness(primary, -24))};\n}`;
}

export function applyStoreTheme(store?: Store | null): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const brandedStyle = document.getElementById('menuof-branded-theme');
  const apiBrandedTheme =
    store?.defaultTheme === 'branded' && store.brandedTheme?.primaryColor ? store.brandedTheme : null;

  root.classList.remove('light', 'dark', 'branded');

  if (apiBrandedTheme) {
    let style = document.getElementById('menuof-branded-theme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'menuof-branded-theme';
      document.head.appendChild(style);
    }
    style.textContent = generateBrandedCSS(apiBrandedTheme);
    root.classList.add('branded');
    return;
  }

  brandedStyle?.remove();
  root.classList.add(LOCAL_THEME);
}
