'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UrlPath } from '@/commons/constants/url'

/**
 * 사용자 정보 타입 정의
 */
interface User {
  id: string
  email: string
  name: string
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Auth Context 타입 정의
 */
interface AuthContextType {
  // 상태
  isLoggedIn: boolean
  user: User | null
  isLoading: boolean
  
  // 기능
  login: (accessToken: string, userData: User) => void
  logout: () => void
  checkAuthStatus: () => void
  getUserInfo: () => User | null
}

/**
 * AuthProvider Props 타입
 */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Local Storage 키 상수
 */
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user'
} as const

/**
 * Auth Context 생성
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * AuthProvider 컴포넌트
 * - 인증 상태 관리 및 로그인/로그아웃 기능 제공
 * - 로컬스토리지 기반 토큰 관리
 * - 실시간 인증 상태 감지
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  
  const router = useRouter()
  const pathname = usePathname()

  /**
   * 로컬스토리지에서 데이터 가져오기 (클라이언트 사이드에서만)
   */
  const getStorageData = () => {
    if (typeof window === 'undefined') return { token: null, userData: null }
    
    try {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const userData = localStorage.getItem(STORAGE_KEYS.USER)
      
      return {
        token,
        userData: userData ? JSON.parse(userData) : null
      }
    } catch (error) {
      console.error('로컬스토리지 데이터 읽기 오류:', error)
      return { token: null, userData: null }
    }
  }

  /**
   * 로그인 상태 검증 함수
   */
  const checkAuthStatus = useCallback(() => {
    const { token, userData } = getStorageData()
    
    if (token) {
      setIsLoggedIn(true)
      setUser(userData)
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }
    
    setIsLoading(false)
  }, [])

  /**
   * 로그인 함수
   */
  const login = (accessToken: string, userData: User) => {
    if (typeof window === 'undefined') return
    
    try {
      // 로컬스토리지에 저장
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
      
      // 상태 업데이트
      setIsLoggedIn(true)
      setUser(userData)
      
      console.log('로그인 성공:', userData)
    } catch (error) {
      console.error('로그인 처리 오류:', error)
    }
  }

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    if (typeof window === 'undefined') return
    
    try {
      // 로컬스토리지에서 제거
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      
      // 상태 초기화
      setIsLoggedIn(false)
      setUser(null)
      
      // 로그인 페이지로 이동
      router.push(UrlPath.LOGIN)
      
      console.log('로그아웃 완료')
    } catch (error) {
      console.error('로그아웃 처리 오류:', error)
    }
  }

  /**
   * 로그인 유저 정보 조회 함수
   */
  const getUserInfo = (): User | null => {
    const { userData } = getStorageData()
    return userData
  }

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  // 페이지 이동 시마다 인증 상태 재확인
  useEffect(() => {
    if (!isLoading) {
      checkAuthStatus()
    }
  }, [pathname, isLoading, checkAuthStatus])

  // 로그인 상태 실시간 감지 (storage 이벤트 리스너)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ACCESS_TOKEN || e.key === STORAGE_KEYS.USER) {
        checkAuthStatus()
      }
    }

    // 다른 탭에서의 로그인/로그아웃 감지
    window.addEventListener('storage', handleStorageChange)

    // 같은 탭에서의 변경사항 감지를 위한 커스텀 이벤트
    const handleCustomStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('auth-storage-change', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-storage-change', handleCustomStorageChange)
    }
  }, [checkAuthStatus])

  const contextValue: AuthContextType = {
    // 상태
    isLoggedIn,
    user,
    isLoading,
    
    // 기능
    login,
    logout,
    checkAuthStatus,
    getUserInfo
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Auth Hook
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.')
  }
  
  return context
}

/**
 * 로컬스토리지 변경 알림 헬퍼 함수 (다른 컴포넌트에서 사용)
 */
export const notifyAuthStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth-storage-change'))
  }
}

export default AuthProvider