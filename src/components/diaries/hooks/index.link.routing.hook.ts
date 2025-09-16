'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { UrlPath, generateDynamicUrl } from '@/commons/constants/url';

/**
 * 일기 목록 페이지의 링크 라우팅 훅
 * 일기 카드 클릭 시 상세 페이지로 이동하는 기능을 제공
 */
export function useLinkRouting() {
  const router = useRouter();

  /**
   * 일기 상세 페이지로 이동하는 핸들러
   * @param diaryId 일기 ID
   */
  const handleDiaryDetailClick = useCallback((diaryId: number) => {
    const detailUrl = generateDynamicUrl(UrlPath.DIARY_DETAIL, { id: diaryId });
    router.push(detailUrl);
  }, [router]);

  return {
    handleDiaryDetailClick
  };
}
