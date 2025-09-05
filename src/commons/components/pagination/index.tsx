'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  currentPage: number;
  /** 총 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 호출되는 콜백 */
  onPageChange: (page: number) => void;
  /** 보여줄 페이지 버튼 수 (기본값: 5) */
  visiblePages?: number;
  /** 컴포넌트 변형 */
  variant?: 'primary' | 'secondary' | 'tertiary';
  /** 컴포넌트 크기 */
  size?: 'small' | 'medium' | 'large';
  /** 테마 */
  theme?: 'light' | 'dark';
  /** 이전/다음 버튼 비활성화 여부 */
  disabled?: boolean;
  /** 클래스명 */
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 5,
  variant = 'primary',
  size = 'medium',
  theme = 'light',
  disabled = false,
  className = '',
}) => {
  // 페이지 범위 계산
  const pageRange = useMemo(() => {
    const start = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    const end = Math.min(totalPages, start + visiblePages - 1);
    const adjustedStart = Math.max(1, end - visiblePages + 1);
    
    return Array.from(
      { length: end - adjustedStart + 1 },
      (_, i) => adjustedStart + i
    );
  }, [currentPage, totalPages, visiblePages]);

  // 이전 페이지로 이동
  const goToPrevious = () => {
    if (!disabled && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // 다음 페이지로 이동
  const goToNext = () => {
    if (!disabled && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // 특정 페이지로 이동
  const goToPage = (page: number) => {
    if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // 이전 버튼 비활성화 여부
  const isPrevDisabled = disabled || currentPage <= 1;
  
  // 다음 버튼 비활성화 여부
  const isNextDisabled = disabled || currentPage >= totalPages;

  const containerClasses = [
    styles.pagination,
    styles[`pagination--${variant}`],
    styles[`pagination--${size}`],
    styles[`pagination--${theme}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} role="navigation" aria-label="페이지네이션">
      {/* 이전 버튼 */}
      <button
        type="button"
        className={`${styles.navButton} ${isPrevDisabled ? styles.disabled : ''}`}
        onClick={goToPrevious}
        disabled={isPrevDisabled}
        aria-label="이전 페이지"
      >
        <Image
          src="/icons/leftenable_outline_light_m.svg"
          alt="이전"
          width={24}
          height={24}
        />
      </button>

      {/* 페이지 번호들 */}
      <div className={styles.pageNumbers}>
        {pageRange.map((page) => (
          <button
            key={page}
            type="button"
            className={`${styles.pageButton} ${
              page === currentPage ? styles.active : ''
            }`}
            onClick={() => goToPage(page)}
            disabled={disabled}
            aria-label={`페이지 ${page}${page === currentPage ? ' (현재)' : ''}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 다음 버튼 */}
      <button
        type="button"
        className={`${styles.navButton} ${isNextDisabled ? styles.disabled : ''}`}
        onClick={goToNext}
        disabled={isNextDisabled}
        aria-label="다음 페이지"
      >
        <Image
          src="/icons/rightenable_outline_light_m.svg"
          alt="다음"
          width={24}
          height={24}
        />
      </button>
    </div>
  );
};

export default Pagination;
