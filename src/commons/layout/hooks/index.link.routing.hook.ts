'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { UrlPath, generateDynamicUrl } from '../../constants/url';

/**
 * 링크 라우팅 훅
 * 네비게이션 메뉴 클릭 시 라우팅 및 액티브 상태 관리
 */
export function useLinkRouting() {
  const router = useRouter();
  const pathname = usePathname();

  /**
   * 페이지 이동 함수
   * @param path 이동할 경로 (UrlPath enum 값)
   */
  const navigateTo = useCallback((path: UrlPath) => {
    router.push(path);
  }, [router]);

  /**
   * 현재 경로가 특정 경로와 일치하는지 확인
   * @param path 확인할 경로
   * @returns 일치 여부
   */
  const isCurrentPath = useCallback((path: UrlPath) => {
    return pathname === path;
  }, [pathname]);

  /**
   * 일기보관함 클릭 핸들러
   */
  const handleDiariesClick = useCallback(() => {
    navigateTo(UrlPath.DIARIES);
  }, [navigateTo]);

  /**
   * 사진보관함 클릭 핸들러
   */
  const handlePicturesClick = useCallback(() => {
    navigateTo(UrlPath.PICTURES);
  }, [navigateTo]);

  /**
   * 로고 클릭 핸들러 (일기목록페이지로 이동)
   */
  const handleLogoClick = useCallback(() => {
    navigateTo(UrlPath.DIARIES);
  }, [navigateTo]);

  /**
   * 일기 상세 페이지로 이동 핸들러
   * @param diaryId 일기 ID
   */
  const handleDiaryDetailClick = useCallback((diaryId: string | number) => {
    const detailUrl = generateDynamicUrl(UrlPath.DIARY_DETAIL, { id: String(diaryId) });
    router.push(detailUrl);
  }, [router]);

  /**
   * 일기보관함이 현재 활성화된 탭인지 확인
   */
  const isDiariesActive = isCurrentPath(UrlPath.DIARIES);

  /**
   * 사진보관함이 현재 활성화된 탭인지 확인
   */
  const isPicturesActive = isCurrentPath(UrlPath.PICTURES);

  return {
    // 네비게이션 핸들러
    handleDiariesClick,
    handlePicturesClick,
    handleLogoClick,
    handleDiaryDetailClick,
    
    // 액티브 상태
    isDiariesActive,
    isPicturesActive,
    
    // 유틸리티
    navigateTo,
    isCurrentPath,
    currentPath: pathname
  };
}
