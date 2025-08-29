'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PropsWithChildren, useState } from 'react';

/**
 * React Query Provider
 * - @tanstack/react-query를 사용한 클라이언트 캐시 설정
 * - QueryClient 인스턴스 생성 및 제공
 * - 개발 환경에서 React Query Devtools 제공
 */
export default function ReactQueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분 동안 캐시 유지
            staleTime: 1000 * 60 * 5,
            // 백그라운드에서 자동 리페치 비활성화
            refetchOnWindowFocus: false,
            // 네트워크 재연결 시 자동 리페치 활성화
            refetchOnReconnect: true,
            // 컴포넌트 마운트 시 자동 리페치 비활성화
            refetchOnMount: false,
            // 에러 발생 시 재시도 횟수
            retry: 1,
          },
          mutations: {
            // 뮤테이션 에러 발생 시 재시도 비활성화
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
