'use client';

import React from 'react';
import SelectBox from '@/commons/components/selectbox';
import type { SelectOption } from '@/commons/components/selectbox';
import { ImageFilter } from '@/commons/constants/enum';
import { useDogImages, useSplashScreens } from './hooks/index.binding.hook';
import { useFilter, getFilterStyles } from './hooks/index.filter.hook';
import styles from './styles.module.css';

export default function Pictures() {
  // 필터 훅
  const {
    selectedFilter,
    filterOptions,
    handleFilterChange,
  } = useFilter(ImageFilter.DEFAULT);
  
  // 강아지 이미지 데이터 및 무한스크롤 훅
  const {
    images,
    isInitialLoading,
    isLoadingMore,
    isInitialError,
    isLoadMoreError,
    error,
    setLoadMoreRef,
    refetch,
  } = useDogImages();
  
  // 스플래시 스크린 훅
  const { splashItems } = useSplashScreens(6);

  // SelectBox용 옵션 변환
  const selectBoxOptions: SelectOption[] = filterOptions.map(option => ({
    value: option.value,
    label: option.label,
  }));

  // 에러 재시도 핸들러
  const handleRetry = () => {
    refetch();
  };

  return (
    <div className={styles.container} data-testid="pictures-container">
      {/* Gap */}
      <div className={styles.gap}></div>
      
      {/* Filter 영역 */}
      <div className={styles.filter}>
        <SelectBox
          variant="primary"
          theme="light"
          size="medium"
          options={selectBoxOptions}
          value={selectedFilter}
          onChange={handleFilterChange}
          placeholder="레이아웃을 선택하세요"
          data-testid="filter-select"
        />
      </div>
      
      {/* Gap2 */}
      <div className={styles.gap2}></div>
      
      {/* Main 영역 */}
      <div className={styles.main}>
        {/* 초기 로딩 중일 때 스플래시 스크린 표시 */}
        {isInitialLoading && (
          <div className={styles.loadingSplash} data-testid="loading-splash">
            {splashItems.map((item) => (
              <div
                key={item.id}
                className={styles.splashItem}
                style={{
                  animationDelay: `${item.delay}ms`,
                  ...getFilterStyles(selectedFilter)
                }}
                data-testid="splash-screen-item"
              >
                <div className={styles.splashAnimation}></div>
              </div>
            ))}
          </div>
        )}

        {/* 초기 로딩 에러 상태 */}
        {isInitialError && (
          <div className={styles.errorMessage} data-testid="error-message">
            <div className={styles.errorTitle}>
              강아지 사진을 불러올 수 없습니다
            </div>
            <div className={styles.errorDescription}>
              {error?.message || '네트워크 연결을 확인하고 다시 시도해주세요.'}
            </div>
            <button
              className={styles.retryButton}
              onClick={handleRetry}
              disabled={isInitialLoading}
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 강아지 이미지 그리드 */}
        {!isInitialLoading && !isInitialError && (
          <div className={styles.photoGrid}>
            {images.map((image, index) => (
              <div 
                key={image.id} 
                className={styles.photoItem}
                style={getFilterStyles(selectedFilter)}
                ref={index === images.length - 2 ? setLoadMoreRef : null}
                data-testid="photo-item"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className={styles.photoImage}
                  data-testid="dog-image"
                  loading="lazy"
                />
              </div>
            ))}
            
            {/* 추가 로딩 인디케이터 */}
            {isLoadingMore && (
              <div className={styles.loadMoreIndicator}>
                <div className={styles.loadMoreSpinner}></div>
                <span className={styles.loadMoreText}>더 많은 강아지 사진을 불러오는 중...</span>
              </div>
            )}
            
            {/* 추가 로딩 에러 */}
            {isLoadMoreError && (
              <div className={styles.loadMoreError} data-testid="load-more-error">
                <div>추가 사진을 불러올 수 없습니다</div>
                <button
                  className={`${styles.retryButton} ${styles.retryButtonSpaced}`}
                  onClick={handleRetry}
                  disabled={isLoadingMore}
                >
                  다시 시도
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
