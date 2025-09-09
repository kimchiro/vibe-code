'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { 
  UrlPath, 
  shouldShowUIComponent, 
  shouldShowHeaderElement,
  matchesUrlPattern,
  isValidUrlPath,
  getPageConfig
} from '../../constants/url';

/**
 * UI 영역 노출 상태 인터페이스
 */
export interface AreaVisibility {
  header: {
    visible: boolean;
    logo: boolean;
    darkModeToggle: boolean;
  };
  banner: boolean;
  navigation: boolean;
  footer: boolean;
}

/**
 * 현재 경로에 따른 UI 영역 노출 제어 hook
 * url.ts의 페이지 설정에 따라 각 영역의 노출 여부를 결정
 */
export function useArea(): AreaVisibility {
  const pathname = usePathname();

  const areaVisibility = useMemo(() => {
    // 현재 경로에 해당하는 UrlPath 찾기
    const currentUrlPath = findMatchingUrlPath(pathname);
    
    if (!currentUrlPath) {
      // 매칭되는 경로가 없으면 기본 설정 (모든 영역 표시)
      return {
        header: {
          visible: true,
          logo: true,
          darkModeToggle: false
        },
        banner: true,
        navigation: true,
        footer: true
      };
    }

    // url.ts의 설정에 따라 UI 영역 노출 여부 결정
    return {
      header: {
        visible: shouldShowUIComponent(currentUrlPath, 'header'),
        logo: shouldShowHeaderElement(currentUrlPath, 'logo'),
        darkModeToggle: shouldShowHeaderElement(currentUrlPath, 'darkModeToggle')
      },
      banner: shouldShowUIComponent(currentUrlPath, 'banner'),
      navigation: shouldShowUIComponent(currentUrlPath, 'navigation'),
      footer: shouldShowUIComponent(currentUrlPath, 'footer')
    };
  }, [pathname]);

  return areaVisibility;
}

/**
 * 현재 경로와 매칭되는 UrlPath 찾기
 * @param pathname 현재 경로
 * @returns 매칭되는 UrlPath 또는 null
 */
function findMatchingUrlPath(pathname: string): UrlPath | null {
  // 정확히 일치하는 경로 먼저 확인
  if (isValidUrlPath(pathname)) {
    return pathname as UrlPath;
  }

  // 다이나믹 경로 패턴 매칭
  const allUrlPaths = Object.values(UrlPath);
  
  for (const urlPath of allUrlPaths) {
    if (matchesUrlPattern(pathname, urlPath)) {
      return urlPath;
    }
  }

  return null;
}

/**
 * 특정 UI 컴포넌트의 노출 여부만 확인하는 헬퍼 hook
 * @param component 확인할 UI 컴포넌트
 * @returns 해당 컴포넌트의 노출 여부
 */
export function useAreaComponent(component: keyof AreaVisibility): boolean {
  const areaVisibility = useArea();
  const componentVisibility = areaVisibility[component];
  
  if (typeof componentVisibility === 'boolean') {
    return componentVisibility;
  }
  
  // header의 경우 visible 속성 반환
  if (component === 'header' && typeof componentVisibility === 'object') {
    return componentVisibility.visible;
  }
  
  return false;
}

/**
 * 헤더 내부 요소의 노출 여부를 확인하는 헬퍼 hook
 * @param element 확인할 헤더 요소
 * @returns 해당 요소의 노출 여부
 */
export function useHeaderElement(element: 'logo' | 'darkModeToggle'): boolean {
  const areaVisibility = useArea();
  return areaVisibility.header.visible && areaVisibility.header[element];
}

/**
 * 현재 페이지의 설정 정보를 가져오는 hook
 * @returns 현재 페이지의 설정 또는 null
 */
export function useCurrentPageConfig() {
  const pathname = usePathname();
  
  const pageConfig = useMemo(() => {
    const currentUrlPath = findMatchingUrlPath(pathname);
    
    if (!currentUrlPath) {
      return null;
    }
    
    return getPageConfig(currentUrlPath);
  }, [pathname]);
  
  return pageConfig;
}

/**
 * 디버깅용 hook - 현재 경로와 UI 설정 정보 반환
 */
export function useAreaDebug() {
  const pathname = usePathname();
  const areaVisibility = useArea();
  const pageConfig = useCurrentPageConfig();
  const matchingUrlPath = findMatchingUrlPath(pathname);
  
  return {
    pathname,
    matchingUrlPath,
    pageConfig,
    areaVisibility
  };
}
