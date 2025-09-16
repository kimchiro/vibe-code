import { useState, useCallback, useMemo } from 'react';
import { 
  ImageFilter, 
  getImageFilterLabel,
  getImageFilterSize,
  getAllImageFilters,
  isValidImageFilter
} from '@/commons/constants/enum';

// 필터 타입 정의 (ENUM 사용)
export type FilterType = ImageFilter;

// 필터별 이미지 크기 정의
export interface ImageSize {
  width: number;
  height: number;
}

// 필터 옵션 정의
export interface FilterOption {
  value: FilterType;
  label: string;
}

// ENUM을 활용한 필터 옵션 생성
export const FILTER_OPTIONS: FilterOption[] = getAllImageFilters().map(filter => ({
  value: filter,
  label: getImageFilterLabel(filter),
}));

// 필터 훅의 반환 타입
export interface UseFilterReturn {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  currentImageSize: ImageSize;
  filterOptions: FilterOption[];
  handleFilterChange: (value: string) => void;
}

/**
 * 강아지 사진 필터 기능을 관리하는 훅
 * 
 * @param initialFilter 초기 필터 값 (기본값: ImageFilter.DEFAULT)
 * @returns 필터 상태와 관련 함수들
 */
export function useFilter(initialFilter: FilterType = ImageFilter.DEFAULT): UseFilterReturn {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter);

  // 현재 선택된 필터에 따른 이미지 크기
  const currentImageSize = useMemo(() => {
    return getImageFilterSize(selectedFilter);
  }, [selectedFilter]);

  // 필터 변경 핸들러
  const handleFilterChange = useCallback((value: string) => {
    if (isValidImageFilter(value)) {
      setSelectedFilter(value as FilterType);
    }
  }, []);

  return {
    selectedFilter,
    setSelectedFilter,
    currentImageSize,
    filterOptions: FILTER_OPTIONS,
    handleFilterChange,
  };
}

/**
 * 필터별 CSS 스타일을 생성하는 유틸리티 함수
 * 
 * @param filter 필터 타입
 * @returns CSS 스타일 객체
 */
export function getFilterStyles(filter: FilterType): React.CSSProperties {
  const size = getImageFilterSize(filter);
  return {
    width: `${size.width}px`,
    height: `${size.height}px`,
  };
}

/**
 * 필터별 CSS 클래스명을 생성하는 유틸리티 함수
 * 
 * @param filter 필터 타입
 * @returns CSS 클래스명
 */
export function getFilterClassName(filter: FilterType): string {
  return `filter-${filter}`;
}
