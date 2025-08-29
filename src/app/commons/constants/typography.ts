// Typography Token System
// 한글/영문 분기, 모바일/데스크톱 분기 지원

// 더 엄격한 타입 정의
export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type FontSizeRem = `${number}rem`;
export type LineHeightRem = `${number}rem`;
export type LetterSpacingEm = `${number}em` | '0em';

// 기존 호환성을 위한 타입
export type FontSize = FontSizeRem | string;
export type LineHeight = LineHeightRem | string;
export type LetterSpacing = LetterSpacingEm | string;

// Typography 스케일 기본값
export const TYPOGRAPHY_SCALE = {
  base: 16, // 1rem = 16px
  ratio: 1.25, // Major Third scale
  lineHeightRatio: 1.5
} as const;

// 접근성을 위한 최소/최대 크기
export const ACCESSIBILITY_CONSTRAINTS = {
  minFontSize: '0.75rem', // 12px
  maxFontSize: '4rem',    // 64px
  minLineHeight: 1.2,
  maxLineHeight: 2.0
} as const;

export interface TypographyToken {
  fontSize: FontSize;
  lineHeight: LineHeight;
  fontWeight: FontWeight;
  letterSpacing?: LetterSpacing;
}

export interface ResponsiveTypographyToken {
  mobile: TypographyToken;
  desktop: TypographyToken;
}

export interface LanguageTypographyTokens {
  korean: ResponsiveTypographyToken;
  english: ResponsiveTypographyToken;
}

// Font Family Tokens
export const fontFamilies = {
  korean: {
    primary: '"Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    secondary: '"Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  english: {
    primary: '"Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", sans-serif',
    secondary: '"Roboto", "Helvetica Neue", "Arial", sans-serif',
    mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
} as const;

// Base Typography Scale
const typographyScale = {
  // Display Styles
  display1: {
    korean: {
      mobile: { fontSize: '2rem', lineHeight: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
      desktop: { fontSize: '3rem', lineHeight: '3.5rem', fontWeight: 700, letterSpacing: '-0.02em' }
    },
    english: {
      mobile: { fontSize: '2rem', lineHeight: '2.25rem', fontWeight: 700, letterSpacing: '-0.025em' },
      desktop: { fontSize: '3rem', lineHeight: '3.25rem', fontWeight: 700, letterSpacing: '-0.025em' }
    }
  },
  display2: {
    korean: {
      mobile: { fontSize: '1.75rem', lineHeight: '2.25rem', fontWeight: 700, letterSpacing: '-0.015em' },
      desktop: { fontSize: '2.5rem', lineHeight: '3rem', fontWeight: 700, letterSpacing: '-0.015em' }
    },
    english: {
      mobile: { fontSize: '1.75rem', lineHeight: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
      desktop: { fontSize: '2.5rem', lineHeight: '2.75rem', fontWeight: 700, letterSpacing: '-0.02em' }
    }
  },
  display3: {
    korean: {
      mobile: { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 600, letterSpacing: '-0.01em' },
      desktop: { fontSize: '2rem', lineHeight: '2.5rem', fontWeight: 600, letterSpacing: '-0.01em' }
    },
    english: {
      mobile: { fontSize: '1.5rem', lineHeight: '1.75rem', fontWeight: 600, letterSpacing: '-0.015em' },
      desktop: { fontSize: '2rem', lineHeight: '2.25rem', fontWeight: 600, letterSpacing: '-0.015em' }
    }
  },

  // Heading Styles
  heading1: {
    korean: {
      mobile: { fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: 600, letterSpacing: '-0.005em' },
      desktop: { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: 600, letterSpacing: '-0.005em' }
    },
    english: {
      mobile: { fontSize: '1.25rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
      desktop: { fontSize: '1.5rem', lineHeight: '1.75rem', fontWeight: 600, letterSpacing: '-0.01em' }
    }
  },
  heading2: {
    korean: {
      mobile: { fontSize: '1.125rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '0em' },
      desktop: { fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: 600, letterSpacing: '0em' }
    },
    english: {
      mobile: { fontSize: '1.125rem', lineHeight: '1.375rem', fontWeight: 600, letterSpacing: '-0.005em' },
      desktop: { fontSize: '1.25rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '-0.005em' }
    }
  },
  heading3: {
    korean: {
      mobile: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '0em' },
      desktop: { fontSize: '1.125rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '0em' }
    },
    english: {
      mobile: { fontSize: '1rem', lineHeight: '1.25rem', fontWeight: 600, letterSpacing: '0em' },
      desktop: { fontSize: '1.125rem', lineHeight: '1.375rem', fontWeight: 600, letterSpacing: '0em' }
    }
  },
  heading4: {
    korean: {
      mobile: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 600, letterSpacing: '0.005em' },
      desktop: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 600, letterSpacing: '0em' }
    },
    english: {
      mobile: { fontSize: '0.875rem', lineHeight: '1.125rem', fontWeight: 600, letterSpacing: '0em' },
      desktop: { fontSize: '1rem', lineHeight: '1.25rem', fontWeight: 600, letterSpacing: '0em' }
    }
  },

  // Body Styles
  body1: {
    korean: {
      mobile: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400, letterSpacing: '0em' },
      desktop: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400, letterSpacing: '0em' }
    },
    english: {
      mobile: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400, letterSpacing: '0em' },
      desktop: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400, letterSpacing: '0em' }
    }
  },
  body2: {
    korean: {
      mobile: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400, letterSpacing: '0.005em' },
      desktop: { fontSize: '0.875rem', lineHeight: '1.375rem', fontWeight: 400, letterSpacing: '0.005em' }
    },
    english: {
      mobile: { fontSize: '0.875rem', lineHeight: '1.25rem', fontWeight: 400, letterSpacing: '0em' },
      desktop: { fontSize: '0.875rem', lineHeight: '1.375rem', fontWeight: 400, letterSpacing: '0em' }
    }
  },
  body3: {
    korean: {
      mobile: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.01em' },
      desktop: { fontSize: '0.75rem', lineHeight: '1.125rem', fontWeight: 400, letterSpacing: '0.01em' }
    },
    english: {
      mobile: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.005em' },
      desktop: { fontSize: '0.75rem', lineHeight: '1.125rem', fontWeight: 400, letterSpacing: '0.005em' }
    }
  },

  // Label Styles
  label1: {
    korean: {
      mobile: { fontSize: '1rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0em' },
      desktop: { fontSize: '1rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0em' }
    },
    english: {
      mobile: { fontSize: '1rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0em' },
      desktop: { fontSize: '1rem', lineHeight: '1.25rem', fontWeight: 500, letterSpacing: '0em' }
    }
  },
  label2: {
    korean: {
      mobile: { fontSize: '0.875rem', lineHeight: '1.125rem', fontWeight: 500, letterSpacing: '0.005em' },
      desktop: { fontSize: '0.875rem', lineHeight: '1.125rem', fontWeight: 500, letterSpacing: '0.005em' }
    },
    english: {
      mobile: { fontSize: '0.875rem', lineHeight: '1.125rem', fontWeight: 500, letterSpacing: '0em' },
      desktop: { fontSize: '0.875rem', lineHeight: '1.125rem', fontWeight: 500, letterSpacing: '0em' }
    }
  },
  label3: {
    korean: {
      mobile: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: '0.01em' },
      desktop: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: '0.01em' }
    },
    english: {
      mobile: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: '0.005em' },
      desktop: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 500, letterSpacing: '0.005em' }
    }
  },

  // Caption Styles
  caption1: {
    korean: {
      mobile: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.01em' },
      desktop: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.01em' }
    },
    english: {
      mobile: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.005em' },
      desktop: { fontSize: '0.75rem', lineHeight: '1rem', fontWeight: 400, letterSpacing: '0.005em' }
    }
  },
  caption2: {
    korean: {
      mobile: { fontSize: '0.625rem', lineHeight: '0.875rem', fontWeight: 400, letterSpacing: '0.015em' },
      desktop: { fontSize: '0.625rem', lineHeight: '0.875rem', fontWeight: 400, letterSpacing: '0.015em' }
    },
    english: {
      mobile: { fontSize: '0.625rem', lineHeight: '0.875rem', fontWeight: 400, letterSpacing: '0.01em' },
      desktop: { fontSize: '0.625rem', lineHeight: '0.875rem', fontWeight: 400, letterSpacing: '0.01em' }
    }
  }
} as const;

// Export typography tokens
export const typography = typographyScale;

// Utility functions for getting typography tokens
export function getTypographyToken(
  style: keyof typeof typography,
  language: 'korean' | 'english' = 'korean',
  device: 'mobile' | 'desktop' = 'desktop'
): TypographyToken {
  return typography[style][language][device];
}

export function getFontFamily(
  language: 'korean' | 'english' = 'korean',
  variant: 'primary' | 'secondary' | 'mono' = 'primary'
): string {
  return fontFamilies[language][variant];
}

// 새로운 유틸리티 함수들
export function calculateFontSize(step: number, base = TYPOGRAPHY_SCALE.base): string {
  const size = base * Math.pow(TYPOGRAPHY_SCALE.ratio, step);
  return `${size / 16}rem`;
}

export function calculateLineHeight(fontSize: string, ratio = TYPOGRAPHY_SCALE.lineHeightRatio): string {
  const sizeValue = parseFloat(fontSize.replace('rem', ''));
  return `${sizeValue * ratio}rem`;
}

export function validateTypographyToken(token: TypographyToken): boolean {
  const fontSize = parseFloat(token.fontSize.replace('rem', ''));
  const minSize = parseFloat(ACCESSIBILITY_CONSTRAINTS.minFontSize.replace('rem', ''));
  const maxSize = parseFloat(ACCESSIBILITY_CONSTRAINTS.maxFontSize.replace('rem', ''));
  
  return fontSize >= minSize && fontSize <= maxSize;
}

export function getContrastRatio(fontSize: string): 'AA' | 'AAA' | 'fail' {
  const size = parseFloat(fontSize.replace('rem', '')) * 16; // px로 변환
  
  if (size >= 18) return 'AAA'; // Large text
  if (size >= 14) return 'AA';  // Normal text
  return 'fail'; // Too small
}

// 반응형 typography 헬퍼
export function createResponsiveToken(
  mobileSize: string,
  desktopSize: string,
  weight: FontWeight = 400,
  letterSpacing: LetterSpacing = '0em'
): ResponsiveTypographyToken {
  return {
    mobile: {
      fontSize: mobileSize,
      lineHeight: calculateLineHeight(mobileSize),
      fontWeight: weight,
      letterSpacing
    },
    desktop: {
      fontSize: desktopSize,
      lineHeight: calculateLineHeight(desktopSize),
      fontWeight: weight,
      letterSpacing
    }
  };
}

// CSS Custom Properties Generator
export function generateTypographyCSSVars(): Record<string, string> {
  const cssVars: Record<string, string> = {};
  
  // Font families
  Object.entries(fontFamilies).forEach(([lang, families]) => {
    Object.entries(families).forEach(([variant, family]) => {
      cssVars[`--font-family-${lang}-${variant}`] = family;
    });
  });
  
  // Typography tokens
  Object.entries(typography).forEach(([style, tokens]) => {
    Object.entries(tokens).forEach(([lang, responsive]) => {
      Object.entries(responsive).forEach(([device, token]) => {
        const typedToken = token as TypographyToken;
        const prefix = `--typography-${style}-${lang}-${device}`;
        cssVars[`${prefix}-font-size`] = typedToken.fontSize;
        cssVars[`${prefix}-line-height`] = typedToken.lineHeight;
        cssVars[`${prefix}-font-weight`] = typedToken.fontWeight.toString();
        if (typedToken.letterSpacing) {
          cssVars[`${prefix}-letter-spacing`] = typedToken.letterSpacing;
        }
      });
    });
  });
  
  return cssVars;
}

// Tailwind CSS class generator
export function generateTailwindTypographyClasses(): Record<string, Record<string, string | Record<string, string>>> {
  const classes: Record<string, Record<string, string | Record<string, string>>> = {};
  
  Object.entries(typography).forEach(([style, tokens]) => {
    Object.entries(tokens).forEach(([lang, responsive]) => {
      // Mobile-first approach
      const mobileToken = responsive.mobile;
      const desktopToken = responsive.desktop;
      
      const className = `.text-${style}-${lang}`;
      classes[className] = {
        fontSize: mobileToken.fontSize,
        lineHeight: mobileToken.lineHeight,
        fontWeight: mobileToken.fontWeight.toString(),
        letterSpacing: mobileToken.letterSpacing || '0',
        fontFamily: `var(--font-family-${lang}-primary)`,
        '@screen md': {
          fontSize: desktopToken.fontSize,
          lineHeight: desktopToken.lineHeight,
          fontWeight: desktopToken.fontWeight.toString(),
          letterSpacing: desktopToken.letterSpacing || '0',
        }
      };
    });
  });
  
  return classes;
}

// 사용 예제와 문서화
export const TYPOGRAPHY_EXAMPLES = {
  // 기본 사용법
  basic: {
    korean: getTypographyToken('heading1', 'korean', 'desktop'),
    english: getTypographyToken('heading1', 'english', 'desktop')
  },
  
  // 동적 생성 예제
  dynamic: {
    title: createResponsiveToken('1.5rem', '2rem', 600, '-0.01em'),
    subtitle: createResponsiveToken('1.125rem', '1.25rem', 500, '0em')
  },
  
  // 접근성 검증 예제
  accessibility: {
    valid: validateTypographyToken({ fontSize: '1rem', lineHeight: '1.5rem', fontWeight: 400 }),
    contrast: getContrastRatio('1rem')
  }
} as const;

// 개발자를 위한 디버깅 도구
export function debugTypography() {
  console.group('🎨 Typography System Debug');
  
  console.log('📏 Scale Configuration:', TYPOGRAPHY_SCALE);
  console.log('♿ Accessibility Constraints:', ACCESSIBILITY_CONSTRAINTS);
  
  console.group('📱 Typography Tokens');
  Object.entries(typography).forEach(([style, tokens]) => {
    console.log(`${style}:`, tokens);
  });
  console.groupEnd();
  
  console.group('🔤 Font Families');
  Object.entries(fontFamilies).forEach(([lang, families]) => {
    console.log(`${lang}:`, families);
  });
  console.groupEnd();
  
  console.groupEnd();
}

// 타입 가드 함수들
export function isValidFontWeight(weight: number): weight is FontWeight {
  return [100, 200, 300, 400, 500, 600, 700, 800, 900].includes(weight);
}

export function isValidLanguage(lang: string): lang is 'korean' | 'english' {
  return ['korean', 'english'].includes(lang);
}

export function isValidDevice(device: string): device is 'mobile' | 'desktop' {
  return ['mobile', 'desktop'].includes(device);
}

export default typography;
