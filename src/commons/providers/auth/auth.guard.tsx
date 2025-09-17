'use client';

import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './auth.provider';
import { useModal } from '../modal/modal.provuder';
import { Modal } from '@/commons/components/modal';
import { UrlPath, canAccessPage, matchesUrlPattern } from '@/commons/constants/url';

/**
 * AuthGuard Props 타입 정의
 */
interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard 컴포넌트
 * - 페이지별 권한 검증 및 인가 처리
 * - 비로그인 사용자에 대한 모달 처리
 * - 테스트 환경과 실제 환경 분리
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [hasShownModal, setHasShownModal] = useState<boolean>(false);
  
  const { isLoggedIn, isLoading } = useAuth();
  const { openModal, closeAllModals } = useModal();
  const pathname = usePathname();
  const router = useRouter();

  /**
   * 테스트 환경 여부 확인
   */
  const isTestEnvironment = process.env.NEXT_PUBLIC_TEST_ENV === 'test';

  /**
   * 현재 경로의 URL 패턴 찾기
   */
  const getCurrentUrlPath = useCallback((): UrlPath | null => {
    // 정확히 일치하는 경로 먼저 확인
    const exactMatch = Object.values(UrlPath).find(urlPath => pathname === urlPath);
    if (exactMatch) return exactMatch;

    // 다이나믹 경로 패턴 매칭
    const dynamicMatch = Object.values(UrlPath).find(urlPath => 
      matchesUrlPattern(pathname || '', urlPath)
    );
    return dynamicMatch || null;
  }, [pathname]);

  /**
   * 로그인 모달 표시 (한 번만 보여지도록 제어)
   */
  const showLoginModal = useCallback(() => {
    if (hasShownModal) return;

    setHasShownModal(true);
    
    openModal({
      content: (
        <Modal
          variant="info"
          actions="single"
          title="로그인해주세요"
          description="이 페이지에 접근하려면 로그인이 필요합니다."
          onConfirm={() => {
            // 1. '확인' 클릭
            // 2. 열려있는 모든 모달을 닫기
            closeAllModals();
            // 3. 로그인페이지로 이동 => /auth/login
            router.push(UrlPath.LOGIN);
          }}
          confirmText="확인"
        />
      ),
      onClose: () => {
        // 모달이 닫힌 후에는 같은 상황에서 다시 나타나지 않도록 상태 유지
        // 페이지 이동 시에만 초기화됨
      }
    });
  }, [hasShownModal, openModal, closeAllModals, router]);

  /**
   * 권한 검증 처리
   */
  useEffect(() => {
    // AuthProvider 초기화 완료까지 대기
    if (isLoading) {
      setIsAuthorized(false);
      return;
    }

    const currentUrlPath = getCurrentUrlPath();
    
    // URL 패턴을 찾을 수 없는 경우 (404 등) 접근 허용
    if (!currentUrlPath) {
      setIsAuthorized(true);
      return;
    }

    // 테스트 환경에서는 항상 로그인된 것으로 처리 (모든 페이지 접속 가능)
    if (isTestEnvironment) {
      setIsAuthorized(true);
      return;
    }

    // 실제 환경에서 권한 검증 (비로그인 유저 기본, 로그인 여부에 따라 접속 제어)
    const hasAccess = canAccessPage(currentUrlPath, isLoggedIn);
    
    if (hasAccess) {
      setIsAuthorized(true);
      setHasShownModal(false); // 접근 가능한 페이지로 이동 시 모달 상태 초기화
    } else {
      setIsAuthorized(false);
      showLoginModal();
    }
  }, [isLoading, isLoggedIn, pathname, isTestEnvironment, getCurrentUrlPath, showLoginModal]);

  // 페이지 변경 시 모달 상태 초기화
  useEffect(() => {
    setHasShownModal(false);
  }, [pathname]);

  // AuthProvider 초기화 중이거나 권한 검증 실패 시 빈 화면 표시
  if (isLoading || !isAuthorized) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        backgroundColor: 'var(--background-color, #ffffff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 로딩 중이거나 권한 없음 - 빈 화면 */}
      </div>
    );
  }

  // 권한 검증 통과 시 children 렌더링
  return <>{children}</>;
}

export default AuthGuard;
