// Color Token System
// 다크모드를 포함한 전체 프로젝트 color 토큰 정의

export type ColorMode = 'light' | 'dark';

// Base Color Palette
export const baseColors = {
  // Primary Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  
  // Secondary Colors
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  
  // Accent Colors
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
} as const;

// Theme-specific color mappings
export const colorTokens = {
  light: {
    // Background Colors
    background: {
      primary: baseColors.neutral[50],
      secondary: baseColors.neutral[100],
      tertiary: baseColors.neutral[200],
      inverse: baseColors.neutral[900],
    },
    
    // Surface Colors
    surface: {
      primary: '#ffffff',
      secondary: baseColors.neutral[50],
      tertiary: baseColors.neutral[100],
      elevated: '#ffffff',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Text Colors
    text: {
      primary: baseColors.neutral[900],
      secondary: baseColors.neutral[700],
      tertiary: baseColors.neutral[500],
      inverse: baseColors.neutral[50],
      disabled: baseColors.neutral[400],
    },
    
    // Border Colors
    border: {
      primary: baseColors.neutral[200],
      secondary: baseColors.neutral[300],
      focus: baseColors.primary[500],
      error: baseColors.error[500],
    },
    
    // Interactive Colors
    interactive: {
      primary: baseColors.primary[500],
      primaryHover: baseColors.primary[600],
      primaryActive: baseColors.primary[700],
      secondary: baseColors.secondary[500],
      secondaryHover: baseColors.secondary[600],
      secondaryActive: baseColors.secondary[700],
    },
    
    // Status Colors
    status: {
      success: baseColors.success[500],
      warning: baseColors.warning[500],
      error: baseColors.error[500],
      info: baseColors.primary[500],
    },
  },
  
  dark: {
    // Background Colors
    background: {
      primary: baseColors.neutral[950],
      secondary: baseColors.neutral[900],
      tertiary: baseColors.neutral[800],
      inverse: baseColors.neutral[50],
    },
    
    // Surface Colors
    surface: {
      primary: baseColors.neutral[900],
      secondary: baseColors.neutral[800],
      tertiary: baseColors.neutral[700],
      elevated: baseColors.neutral[800],
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
    
    // Text Colors
    text: {
      primary: baseColors.neutral[50],
      secondary: baseColors.neutral[300],
      tertiary: baseColors.neutral[500],
      inverse: baseColors.neutral[900],
      disabled: baseColors.neutral[600],
    },
    
    // Border Colors
    border: {
      primary: baseColors.neutral[700],
      secondary: baseColors.neutral[600],
      focus: baseColors.primary[400],
      error: baseColors.error[400],
    },
    
    // Interactive Colors
    interactive: {
      primary: baseColors.primary[400],
      primaryHover: baseColors.primary[300],
      primaryActive: baseColors.primary[200],
      secondary: baseColors.secondary[400],
      secondaryHover: baseColors.secondary[300],
      secondaryActive: baseColors.secondary[200],
    },
    
    // Status Colors
    status: {
      success: baseColors.success[400],
      warning: baseColors.warning[400],
      error: baseColors.error[400],
      info: baseColors.primary[400],
    },
  },
} as const;

// Color utility functions
export const getColorToken = (mode: ColorMode, category: keyof typeof colorTokens.light, token: string) => {
  return colorTokens[mode][category][token as keyof typeof colorTokens.light[typeof category]];
};

export const getAllColorTokens = (mode: ColorMode) => {
  return colorTokens[mode];
};

// CSS Custom Properties Generator
export const generateCSSCustomProperties = (mode: ColorMode) => {
  const tokens = colorTokens[mode];
  const properties: Record<string, string> = {};
  
  Object.entries(tokens).forEach(([category, categoryTokens]) => {
    Object.entries(categoryTokens).forEach(([token, value]) => {
      properties[`--color-${category}-${token}`] = value as string;
    });
  });
  
  return properties;
};

// Export default color tokens for easy access
export default colorTokens;
