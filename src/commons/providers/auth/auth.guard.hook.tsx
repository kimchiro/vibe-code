'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth.provider'
import { useModal } from '../modal/modal.provuder'
import { LoginModal, createLoginModalHandlers } from './auth.guard.modal'
import { 
  GuardResult, 
  isTestEnvironment, 
  getTestBypassStatus, 
  getEffectiveLoginStatus, 
  setTestBypass as utilSetTestBypass,
  performAuthCheck,
  createModalKey
} from './auth.guard.utils'

/**
 * Auth Guard Hook 반환 타입 인터페이스
 */
interface UseAuthGuardReturn {
  // 권한 검증 함수들
  requireAuth: () => GuardResult
  checkAuth: () => GuardResult
  guardedAction: <T extends unknown[], R>(
    action: (...args: T) => R,
    onUnauthorized?: () => void
  ) => (...args: T) => R | undefined
  guardedAsyncAction: <T extends unknown[], R>(
    action: (...args: T) => Promise<R>,
    onUnauthorized?: () => void
  ) => (...args: T) => Promise<R | undefined>
  
  // 상태 정보
  isLoggedIn: boolean
  isTestEnvironment: boolean
  isTestBypass: boolean
  
  // 테스트 유틸리티
  setTestBypass: (bypass: boolean) => void
  resetModalHistory: () => void
  
  // 모달 상태
  shownModals: string[]
}

/**
 * 권한 검증 GUARD 훅
 * - 회원 전용 기능 접근 시 권한 검증 수행
 * - 독립적인 부품들을 조립한 형태로 구현
 * - 테스트 환경과 실제 환경의 로직 분리
 * 
 * 주요 기능:
 * 1. 액션 실행 전 권한 검증
 * 2. 인가 실패 시 로그인 모달 노출
 * 3. 테스트 환경에서 바이패스 지원
 * 4. 모달 중복 표시 방지
 * 
 * @returns 권한 검증 관련 함수들과 상태 정보
 */
export function useAuthGuard(): UseAuthGuardReturn {
  const { isLoggedIn } = useAuth()
  const { openModal, closeAllModals } = useModal()
  const router = useRouter()
  const [shownModals, setShownModals] = useState<Set<string>>(new Set())

  // 독립적인 부품들에서 상태 정보 가져오기
  const testEnvironment = isTestEnvironment()
  const testBypass = getTestBypassStatus()
  const effectiveLoginStatus = getEffectiveLoginStatus(isLoggedIn)

  /**
   * 로그인 확인 모달 표시 (독립적인 부품들을 조립)
   */
  const showLoginModal = useCallback(() => {
    const modalKey = createModalKey('login')
    
    // 이미 표시된 모달인지 확인
    if (shownModals.has(modalKey)) {
      return
    }

    // 모달 표시 기록
    setShownModals(prev => new Set(prev).add(modalKey))

    // 독립적인 부품에서 핸들러 생성
    const handlers = createLoginModalHandlers(closeAllModals, router)

    const modalId = openModal({
      content: <LoginModal {...handlers} />,
      onClose: () => {
        // 모달이 닫힐 때 기록에서 제거
        setShownModals(prev => {
          const newSet = new Set(prev)
          newSet.delete(modalKey)
          return newSet
        })
      }
    })

    return modalId
  }, [openModal, closeAllModals, router, shownModals])

  /**
   * 회원 전용 기능 권한 검증 (독립적인 부품 활용)
   */
  const requireAuth = useCallback((): GuardResult => {
    const result = performAuthCheck(isLoggedIn)

    if (!result.isAuthorized) {
      // 로그인하지 않은 경우 모달 표시
      showLoginModal()
    }

    return result
  }, [isLoggedIn, showLoginModal])

  /**
   * 회원 전용 액션 실행 가드
   * @param action 실행할 액션 함수
   * @param onUnauthorized 권한 없을 때 실행할 콜백 (선택사항)
   */
  const guardedAction = useCallback(<T extends unknown[], R>(
    action: (...args: T) => R,
    onUnauthorized?: () => void
  ) => {
    return (...args: T): R | undefined => {
      const result = requireAuth()
      
      if (!result.isAuthorized) {
        onUnauthorized?.()
        return undefined
      }

      return action(...args)
    }
  }, [requireAuth])

  /**
   * 비동기 회원 전용 액션 실행 가드
   * @param action 실행할 비동기 액션 함수
   * @param onUnauthorized 권한 없을 때 실행할 콜백 (선택사항)
   */
  const guardedAsyncAction = useCallback(<T extends unknown[], R>(
    action: (...args: T) => Promise<R>,
    onUnauthorized?: () => void
  ) => {
    return async (...args: T): Promise<R | undefined> => {
      const result = requireAuth()
      
      if (!result.isAuthorized) {
        onUnauthorized?.()
        return undefined
      }

      return await action(...args)
    }
  }, [requireAuth])

  /**
   * 권한 검증만 수행 (액션 실행 없음)
   */
  const checkAuth = useCallback((): GuardResult => {
    return requireAuth()
  }, [requireAuth])

  /**
   * 테스트용 바이패스 설정/해제 (독립적인 부품 활용)
   */
  const setTestBypass = useCallback((bypass: boolean) => {
    utilSetTestBypass(bypass)
  }, [])

  /**
   * 표시된 모달 기록 초기화 (테스트용)
   */
  const resetModalHistory = useCallback(() => {
    setShownModals(new Set())
  }, [])

  return {
    // 권한 검증 함수들
    requireAuth,
    checkAuth,
    guardedAction,
    guardedAsyncAction,
    
    // 상태 정보 (독립적인 부품들에서 조립)
    isLoggedIn: effectiveLoginStatus,
    isTestEnvironment: testEnvironment,
    isTestBypass: testBypass,
    
    // 테스트 유틸리티
    setTestBypass,
    resetModalHistory,
    
    // 모달 상태
    shownModals: Array.from(shownModals)
  }
}

// displayName 설정 (개발 도구에서 디버깅 용이성을 위함)
useAuthGuard.displayName = 'useAuthGuard'

export default useAuthGuard
