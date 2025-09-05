'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

// Variant 타입 정의
export type SearchbarVariant = 'primary' | 'secondary' | 'tertiary';
export type SearchbarSize = 'small' | 'medium' | 'large';
export type SearchbarTheme = 'light' | 'dark';

// Props 인터페이스 정의
export interface SearchbarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: SearchbarVariant;
  size?: SearchbarSize;
  theme?: SearchbarTheme;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
  isLoading?: boolean;
  error?: boolean;
  helperText?: string;
  containerClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
}

// 기본값
const defaultProps: Required<Pick<SearchbarProps, 'variant' | 'size' | 'theme'>> = {
  variant: 'primary',
  size: 'medium',
  theme: 'light',
};

// 검색바 컴포넌트
export const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      variant = defaultProps.variant,
      size = defaultProps.size,
      theme = defaultProps.theme,
      leftIcon,
      rightIcon,
      onClear,
      showClearButton = false,
      isLoading = false,
      error = false,
      helperText,
      containerClassName,
      inputClassName,
      iconClassName,
      placeholder = '검색어를 입력해 주세요.',
      disabled,
      value,
      onChange,
      onFocus,
      onBlur,
      ...rest
    },
    ref
  ) => {
    // 기본 검색 아이콘 (public/icons 활용)
    const defaultSearchIcon = (
      <Image
        src="/icons/search_outline_light_m.svg"
        alt="검색"
        width={24}
        height={24}
        className={styles.searchIcon}
      />
    );

    // 클리어 버튼 (public/icons 사용)
    const clearIcon = (
      <button
        type="button"
        onClick={onClear}
        className={styles.clearButton}
        disabled={disabled}
        aria-label="검색어 지우기"
      >
        <Image
          src="/icons/close_outline_light_s.svg"
          alt="지우기"
          width={16}
          height={16}
        />
      </button>
    );

    // 로딩 아이콘 (간단한 텍스트)
    const loadingIcon = (
      <div className={styles.loadingIcon}>
        <span className={styles.spinner}>•••</span>
      </div>
    );

    // 컨테이너 클래스 조합
    const containerClassList = [
      styles.searchbarContainer,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
    ];
    
    if (disabled) containerClassList.push(styles.disabled);
    if (error) containerClassList.push(styles.error);
    if (isLoading) containerClassList.push(styles.loading);
    if (containerClassName) containerClassList.push(containerClassName);
    
    const containerClasses = containerClassList.join(' ');

    // Input 클래스 조합
    const inputClassList = [styles.searchbarInput];
    
    if (leftIcon || !leftIcon) inputClassList.push(styles.hasLeftIcon); // 기본적으로 검색 아이콘 있음
    if (rightIcon || showClearButton || isLoading) inputClassList.push(styles.hasRightIcon);
    if (inputClassName) inputClassList.push(inputClassName);
    
    const inputClasses = inputClassList.join(' ');

    // 아이콘 클래스 조합
    const iconClassList = [styles.icon];
    if (iconClassName) iconClassList.push(iconClassName);
    const iconClasses = iconClassList.join(' ');

    // 헬퍼 텍스트 클래스 조합
    const helperTextClassList = [styles.helperText];
    if (error) helperTextClassList.push(styles.errorText);
    const helperTextClasses = helperTextClassList.join(' ');

    return (
      <div className={containerClasses}>
        <div className={styles.inputWrapper}>
          {/* 왼쪽 아이콘 */}
          <div className={`${iconClasses} ${styles.leftIcon}`}>
            {leftIcon || defaultSearchIcon}
          </div>

          {/* Input 필드 */}
          <input
            ref={ref}
            type="text"
            className={inputClasses}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            {...rest}
          />

          {/* 오른쪽 아이콘들 */}
          {(rightIcon || showClearButton || isLoading) && (
            <div className={`${iconClasses} ${styles.rightIcon}`}>
              {isLoading && loadingIcon}
              {!isLoading && showClearButton && value && clearIcon}
              {!isLoading && !showClearButton && rightIcon}
            </div>
          )}
        </div>

        {/* 헬퍼 텍스트 */}
        {helperText && (
          <div className={helperTextClasses}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Searchbar.displayName = 'Searchbar';

export default Searchbar;
