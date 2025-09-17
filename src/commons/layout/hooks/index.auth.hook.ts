'use client';

import { useAuth } from '@/commons/providers/auth/auth.provider';
import { useRouter } from 'next/navigation';
import { UrlPath } from '@/commons/constants/url';

/**
 * Layout Auth Hook
 * 레이아웃에서 사용할 인증 관련 기능을 제공하는 커스텀 훅
 */
export function useLayoutAuth() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();

  /**
   * 로그인 페이지로 이동하는 함수
   */
  const handleLoginClick = () => {
    router.push(UrlPath.LOGIN);
  };

  /**
   * 로그아웃 처리 함수
   */
  const handleLogoutClick = () => {
    logout();
  };

  /**
   * 사용자 이름 반환 함수
   * 사용자가 로그인되어 있으면 이름 또는 이메일을 반환
   */
  const getUserDisplayName = (): string => {
    if (!user) return '';
    return user.name || user.email || '';
  };

  return {
    // 상태
    isLoggedIn,
    user,
    userDisplayName: getUserDisplayName(),
    
    // 액션
    handleLoginClick,
    handleLogoutClick,
  };
}
