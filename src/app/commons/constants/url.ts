// URL Management System
// 프로젝트의 모든 URL 경로와 관련 설정을 중앙 관리

/**
 * 사용자 접근 권한 타입
 */
export type AccessLevel = 'public' | 'member-only';

/**
 * UI 컴포넌트 노출 설정 인터페이스
 */
export interface UIVisibility {
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
 * 페이지 설정 인터페이스
 */
export interface PageConfig {
  path: string;
  accessLevel: AccessLevel;
  uiVisibility: UIVisibility;
  isDynamic: boolean;
  dynamicParams?: string[];
}

/**
 * URL 경로 enum
 */
export enum UrlPath {
  // 인증 관련
  LOGIN = '/auth/login',
  SIGNUP = '/auth/signup',
  
  // 일기 관련
  DIARIES = '/diaries',
  DIARY_DETAIL = '/diaries/[id]',
  
  // 사진 관련
  PICTURES = '/pictures'
}

/**
 * 기본 UI 노출 설정 템플릿
 */
const UI_TEMPLATES = {
  // 인증 페이지용 - 모든 UI 숨김
  auth: {
    header: {
      visible: false,
      logo: false,
      darkModeToggle: false
    },
    banner: false,
    navigation: false,
    footer: false
  } as UIVisibility,
  
  // 일반 페이지용 - 기본 UI 표시 (다크모드 토글 제외)
  public: {
    header: {
      visible: true,
      logo: true,
      darkModeToggle: false
    },
    banner: true,
    navigation: true,
    footer: true
  } as UIVisibility,
  
  // 상세 페이지용 - 헤더와 푸터만 표시
  detail: {
    header: {
      visible: true,
      logo: true,
      darkModeToggle: false
    },
    banner: false,
    navigation: false,
    footer: true
  } as UIVisibility
} as const;

/**
 * 페이지별 설정 매핑
 */
export const PAGE_CONFIGS: Record<UrlPath, PageConfig> = {
  [UrlPath.LOGIN]: {
    path: UrlPath.LOGIN,
    accessLevel: 'public',
    uiVisibility: UI_TEMPLATES.auth,
    isDynamic: false
  },
  
  [UrlPath.SIGNUP]: {
    path: UrlPath.SIGNUP,
    accessLevel: 'public',
    uiVisibility: UI_TEMPLATES.auth,
    isDynamic: false
  },
  
  [UrlPath.DIARIES]: {
    path: UrlPath.DIARIES,
    accessLevel: 'public',
    uiVisibility: UI_TEMPLATES.public,
    isDynamic: false
  },
  
  [UrlPath.DIARY_DETAIL]: {
    path: UrlPath.DIARY_DETAIL,
    accessLevel: 'member-only',
    uiVisibility: UI_TEMPLATES.detail,
    isDynamic: true,
    dynamicParams: ['id']
  },
  
  [UrlPath.PICTURES]: {
    path: UrlPath.PICTURES,
    accessLevel: 'public',
    uiVisibility: UI_TEMPLATES.public,
    isDynamic: false
  }
} as const;

// ===== 유틸리티 함수들 =====

/**
 * URL 경로로 페이지 설정 가져오기
 * @param urlPath URL 경로 enum 값
 * @returns 해당 페이지의 설정
 */
export function getPageConfig(urlPath: UrlPath): PageConfig {
  return PAGE_CONFIGS[urlPath];
}

/**
 * 다이나믹 URL 생성하기
 * @param urlPath 다이나믹 URL 경로
 * @param params 파라미터 객체
 * @returns 생성된 URL 문자열
 */
export function generateDynamicUrl(
  urlPath: UrlPath,
  params: Record<string, string | number>
): string {
  const config = getPageConfig(urlPath);
  
  if (!config.isDynamic) {
    return config.path;
  }
  
  let generatedPath = config.path;
  
  // 다이나믹 파라미터 치환
  Object.entries(params).forEach(([key, value]) => {
    generatedPath = generatedPath.replace(`[${key}]`, String(value));
  });
  
  return generatedPath;
}

/**
 * 현재 경로가 특정 URL 패턴과 일치하는지 확인
 * @param currentPath 현재 경로
 * @param urlPath 확인할 URL 패턴
 * @returns 일치 여부
 */
export function matchesUrlPattern(currentPath: string, urlPath: UrlPath): boolean {
  const config = getPageConfig(urlPath);
  
  if (!config.isDynamic) {
    return currentPath === config.path;
  }
  
  // 다이나믹 경로 패턴 매칭
  const pattern = config.path.replace(/\[([^\]]+)\]/g, '([^/]+)');
  const regex = new RegExp(`^${pattern}$`);
  
  return regex.test(currentPath);
}

/**
 * 현재 경로에서 다이나믹 파라미터 추출
 * @param currentPath 현재 경로
 * @param urlPath 다이나믹 URL 패턴
 * @returns 추출된 파라미터 객체
 */
export function extractDynamicParams(
  currentPath: string,
  urlPath: UrlPath
): Record<string, string> | null {
  const config = getPageConfig(urlPath);
  
  if (!config.isDynamic || !config.dynamicParams) {
    return null;
  }
  
  const pattern = config.path.replace(/\[([^\]]+)\]/g, '([^/]+)');
  const regex = new RegExp(`^${pattern}$`);
  const match = currentPath.match(regex);
  
  if (!match) {
    return null;
  }
  
  const params: Record<string, string> = {};
  config.dynamicParams.forEach((paramName, index) => {
    params[paramName] = match[index + 1];
  });
  
  return params;
}

/**
 * 페이지 접근 권한 확인
 * @param urlPath URL 경로
 * @param isLoggedIn 로그인 상태
 * @returns 접근 가능 여부
 */
export function canAccessPage(urlPath: UrlPath, isLoggedIn: boolean): boolean {
  const config = getPageConfig(urlPath);
  
  if (config.accessLevel === 'public') {
    return true;
  }
  
  if (config.accessLevel === 'member-only') {
    return isLoggedIn;
  }
  
  return false;
}

/**
 * UI 컴포넌트 노출 여부 확인
 * @param urlPath URL 경로
 * @param component 확인할 UI 컴포넌트
 * @returns 노출 여부
 */
export function shouldShowUIComponent(
  urlPath: UrlPath,
  component: keyof UIVisibility
): boolean {
  const config = getPageConfig(urlPath);
  const visibility = config.uiVisibility[component];
  
  if (typeof visibility === 'boolean') {
    return visibility;
  }
  
  // header의 경우 객체이므로 visible 속성 확인
  if (component === 'header' && typeof visibility === 'object') {
    return visibility.visible;
  }
  
  return false;
}

/**
 * 헤더 내부 요소 노출 여부 확인
 * @param urlPath URL 경로
 * @param element 확인할 헤더 요소 ('logo' | 'darkModeToggle')
 * @returns 노출 여부
 */
export function shouldShowHeaderElement(
  urlPath: UrlPath,
  element: 'logo' | 'darkModeToggle'
): boolean {
  const config = getPageConfig(urlPath);
  const headerVisibility = config.uiVisibility.header;
  
  return headerVisibility.visible && headerVisibility[element];
}

/**
 * 모든 URL 경로 목록 가져오기
 * @returns 모든 URL 경로 배열
 */
export function getAllUrlPaths(): UrlPath[] {
  return Object.values(UrlPath);
}

/**
 * 공개 페이지 목록 가져오기
 * @returns 공개 접근 가능한 URL 경로 배열
 */
export function getPublicPages(): UrlPath[] {
  return getAllUrlPaths().filter(
    urlPath => getPageConfig(urlPath).accessLevel === 'public'
  );
}

/**
 * 회원 전용 페이지 목록 가져오기
 * @returns 회원 전용 URL 경로 배열
 */
export function getMemberOnlyPages(): UrlPath[] {
  return getAllUrlPaths().filter(
    urlPath => getPageConfig(urlPath).accessLevel === 'member-only'
  );
}

/**
 * 다이나믹 페이지 목록 가져오기
 * @returns 다이나믹 라우팅을 사용하는 URL 경로 배열
 */
export function getDynamicPages(): UrlPath[] {
  return getAllUrlPaths().filter(
    urlPath => getPageConfig(urlPath).isDynamic
  );
}

// ===== 타입 가드 함수들 =====

/**
 * 유효한 URL 경로인지 확인
 * @param path 확인할 경로
 * @returns UrlPath 타입인지 여부
 */
export function isValidUrlPath(path: string): path is UrlPath {
  return Object.values(UrlPath).includes(path as UrlPath);
}

/**
 * 유효한 접근 레벨인지 확인
 * @param level 확인할 접근 레벨
 * @returns AccessLevel 타입인지 여부
 */
export function isValidAccessLevel(level: string): level is AccessLevel {
  return level === 'public' || level === 'member-only';
}

// ===== 개발자 도구 =====

/**
 * URL 시스템 디버깅 정보 출력
 */
export function debugUrlSystem(): void {
  console.group('🔗 URL System Debug');
  
  console.log('📄 All Pages:', getAllUrlPaths());
  console.log('🌍 Public Pages:', getPublicPages());
  console.log('🔒 Member Only Pages:', getMemberOnlyPages());
  console.log('🔄 Dynamic Pages:', getDynamicPages());
  
  console.group('⚙️ Page Configurations');
  Object.entries(PAGE_CONFIGS).forEach(([path, config]) => {
    console.log(`${path}:`, config);
  });
  console.groupEnd();
  
  console.groupEnd();
}

// ===== 사용 예제 =====

/**
 * URL 시스템 사용 예제
 */
export const URL_EXAMPLES = {
  // 기본 사용법
  basic: {
    loginPath: UrlPath.LOGIN,
    diariesPath: UrlPath.DIARIES,
    config: getPageConfig(UrlPath.LOGIN)
  },
  
  // 다이나믹 URL 생성
  dynamic: {
    diaryDetailUrl: generateDynamicUrl(UrlPath.DIARY_DETAIL, { id: '123' }),
    params: extractDynamicParams('/diaries/456', UrlPath.DIARY_DETAIL)
  },
  
  // 권한 및 UI 확인
  permissions: {
    canAccess: canAccessPage(UrlPath.DIARY_DETAIL, true),
    showHeader: shouldShowUIComponent(UrlPath.DIARIES, 'header'),
    showLogo: shouldShowHeaderElement(UrlPath.DIARIES, 'logo')
  },
  
  // 패턴 매칭
  matching: {
    matches: matchesUrlPattern('/diaries/123', UrlPath.DIARY_DETAIL),
    doesNotMatch: matchesUrlPattern('/diaries', UrlPath.DIARY_DETAIL)
  }
} as const;

// 기본 export
const urlSystem = {
  UrlPath,
  PAGE_CONFIGS,
  UI_TEMPLATES,
  getPageConfig,
  generateDynamicUrl,
  matchesUrlPattern,
  extractDynamicParams,
  canAccessPage,
  shouldShowUIComponent,
  shouldShowHeaderElement,
  getAllUrlPaths,
  getPublicPages,
  getMemberOnlyPages,
  getDynamicPages,
  isValidUrlPath,
  isValidAccessLevel,
  debugUrlSystem
};

export default urlSystem;
