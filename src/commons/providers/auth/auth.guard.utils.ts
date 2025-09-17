/**
 * Auth Guard 유틸리티 함수들
 * - 권한 검증을 위한 순수 함수들의 모음
 * - 독립적인 부품들의 조립을 위한 유틸리티 제공
 * - 테스트 환경과 실제 환경의 로직 분리
 */

/**
 * 전역 테스트 바이패스 변수 타입 정의
 */
declare global {
  interface Window {
    __TEST_BYPASS__?: boolean
  }
}

/**
 * 권한 검증 결과 인터페이스
 */
export interface GuardResult {
  isAuthorized: boolean
  message?: string
}

/**
 * 테스트 환경 여부 확인
 */
export const isTestEnvironment = (): boolean => {
  return process.env.NEXT_PUBLIC_TEST_ENV === 'test'
}

/**
 * 테스트 바이패스 여부 확인
 */
export const getTestBypassStatus = (): boolean => {
  return typeof window !== 'undefined' && window.__TEST_BYPASS__ === true
}

/**
 * 효과적인 로그인 상태 계산
 * - 실제 환경: 항상 "비로그인 유저" 기본, 실제 로그인 상태 확인
 * - 테스트 환경: 항상 "로그인 유저" 기본, 바이패스가 false인 경우에만 실제 로그인 상태 확인
 */
export const getEffectiveLoginStatus = (actualLoginStatus: boolean): boolean => {
  const testEnv = isTestEnvironment()
  const testBypass = getTestBypassStatus()

  if (testEnv) {
    // 테스트 환경: 기본값은 "로그인 유저"(true), 바이패스가 false인 경우에만 실제 상태 확인
    return testBypass === false ? actualLoginStatus : true
  }
  
  // 실제 환경: 항상 "비로그인 유저" 기본, 실제 로그인 상태 확인
  return actualLoginStatus
}

/**
 * 테스트용 바이패스 설정/해제
 */
export const setTestBypass = (bypass: boolean): void => {
  if (typeof window !== 'undefined' && isTestEnvironment()) {
    window.__TEST_BYPASS__ = bypass
  }
}

/**
 * 권한 검증 수행
 */
export const performAuthCheck = (isLoggedIn: boolean): GuardResult => {
  const effectiveLoginStatus = getEffectiveLoginStatus(isLoggedIn)

  if (!effectiveLoginStatus) {
    return {
      isAuthorized: false,
      message: '로그인이 필요합니다.'
    }
  }

  return {
    isAuthorized: true
  }
}

/**
 * 모달 키 생성 함수
 * - 모달 중복 표시 방지를 위한 고유 키 생성
 * 
 * @param type 모달 타입 (예: 'login', 'signup' 등)
 * @returns 생성된 모달 키
 */
export const createModalKey = (type: string): string => {
  return `${type}-required`
}

// ===== 유틸리티 함수들 기본 export =====

/**
 * Auth Guard 유틸리티 함수들의 기본 export 객체
 */
const authGuardUtils = {
  // 환경 관련
  isTestEnvironment,
  getTestBypassStatus,
  getEffectiveLoginStatus,
  setTestBypass,
  
  // 권한 검증 관련
  performAuthCheck,
  
  // 유틸리티
  createModalKey
}

export default authGuardUtils
