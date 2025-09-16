import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

// API 응답 타입 정의
interface DogApiResponse {
  message: string[];
  status: string;
}

// 강아지 이미지 데이터 타입
export interface DogImage {
  id: string;
  src: string;
  alt: string;
}

  // 강아지 API 호출 함수
const fetchDogImages = async (): Promise<DogApiResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2초 타임아웃

    const response = await fetch('/api/dog/breeds/image/random/6', {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error('API 응답 상태가 성공이 아닙니다');
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('네트워크 요청 시간이 초과되었습니다');
    }
    console.error('강아지 API 호출 오류:', error);
    throw error;
  }
};

// 강아지 사진 조회 및 무한스크롤 훅
export const useDogImages = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['dogImages'],
    queryFn: fetchDogImages,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 무한스크롤을 위해 항상 다음 페이지가 있다고 가정
      return allPages.length;
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    retry: (failureCount, error) => {
      // 타임아웃 에러의 경우 재시도하지 않음
      if (error instanceof Error && error.message.includes('시간이 초과')) {
        console.log('타임아웃 에러 - 재시도하지 않음:', error);
        return false;
      }
      // 네트워크 에러나 서버 에러의 경우 1회만 재시도
      if (failureCount < 1) {
        console.log(`API 재시도 ${failureCount + 1}/1:`, error);
        return true;
      }
      return false;
    },
    retryDelay: 500, // 500ms 후 재시도
  });

  // 모든 페이지의 이미지를 하나의 배열로 합치기
  const allImages: DogImage[] = data?.pages.flatMap((page, pageIndex) =>
    page.message.map((src, index) => ({
      id: `${pageIndex}-${index}`,
      src,
      alt: `강아지 사진 ${pageIndex * 6 + index + 1}`,
    }))
  ) || [];

  // 무한스크롤을 위한 Intersection Observer 설정
  const setLoadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingNextPage) return;
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    if (node) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            console.log('무한스크롤 트리거됨 - 추가 이미지 로드 시작');
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '200px', // 더 넓은 마진으로 설정
        }
      );
      
      observerRef.current.observe(node);
      loadMoreRef.current = node;
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 컴포넌트 언마운트 시 observer 정리
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // 로딩 상태 (초기 로딩)
  const isInitialLoading = isLoading && allImages.length === 0;
  
  // 추가 로딩 상태 (무한스크롤)
  const isLoadingMore = isFetchingNextPage;
  
  // 전체 로딩 상태
  const isAnyLoading = isFetching;
  
  // 초기 로딩 에러 (이미지가 없고 에러가 발생한 경우)
  const isInitialError = isError && allImages.length === 0;
  
  // 추가 로딩 에러 (이미지가 있지만 추가 로딩에서 에러가 발생한 경우)
  const isLoadMoreError = isError && allImages.length > 0;

  return {
    // 데이터
    images: allImages,
    
    // 로딩 상태
    isInitialLoading,
    isLoadingMore,
    isAnyLoading,
    
    // 에러 상태
    isError,
    isInitialError,
    isLoadMoreError,
    error: error as Error | null,
    
    // 무한스크롤 관련
    hasNextPage,
    fetchNextPage,
    setLoadMoreRef,
    
    // 기타
    refetch: () => {
      // React Query의 refetch 사용
      return refetch();
    },
  };
};

// 스플래시 스크린용 훅
export const useSplashScreens = (count: number = 6) => {
  const splashItems = Array.from({ length: count }, (_, index) => ({
    id: `splash-${index}`,
    delay: index * 100, // 각 스플래시마다 100ms씩 지연
  }));

  return {
    splashItems,
  };
};
