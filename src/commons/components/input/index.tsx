import React from 'react';
import styles from './styles.module.css';

// 클래스명 조합 헬퍼 함수
const cn = (...classes: (string | Record<string, boolean> | undefined | null | false)[]): string => {
  return classes
    .filter(Boolean)
    .map((cls) => {
      if (typeof cls === 'string') return cls;
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, condition]) => condition)
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
};

// Input Props 타입 정의
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  error?: boolean;
  success?: boolean;
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

// Input 컴포넌트
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      error = false,
      success = false,
      fullWidth = false,
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      onLeftIconClick,
      onRightIconClick,
      className,
      disabled,
      placeholder = '회고를 남겨보세요.',
      ...props
    },
    ref
  ) => {
    // 컨테이너 클래스 생성
    const containerClasses = cn(
      styles.container,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled
    );

    // 인풋 래퍼 클래스 생성
    const wrapperClasses = cn(
      styles.inputWrapper,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      error && styles.error,
      success && styles.success,
      disabled && styles.disabled,
      !!leftIcon && styles.withLeftIcon,
      !!rightIcon && styles.withRightIcon,
      className
    );

    // 인풋 클래스 생성
    const inputClasses = cn(
      styles.input,
      styles[`size-${size}`],
      styles[`theme-${theme}`]
    );

    return (
      <div className={containerClasses}>
        {label && (
          <label className={styles.label}>
            {label}
          </label>
        )}
        
        <div className={wrapperClasses}>
          {leftIcon && (
            <button
              type="button"
              className={styles.leftIcon}
              onClick={onLeftIconClick}
              disabled={disabled}
              tabIndex={onLeftIconClick ? 0 : -1}
            >
              {leftIcon}
            </button>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled}
            placeholder={placeholder}
            aria-invalid={error}
            aria-describedby={
              (error && errorText) || helperText
                ? `${props.id || 'input'}-helper`
                : undefined
            }
            {...props}
          />
          
          {rightIcon && (
            <button
              type="button"
              className={styles.rightIcon}
              onClick={onRightIconClick}
              disabled={disabled}
              tabIndex={onRightIconClick ? 0 : -1}
            >
              {rightIcon}
            </button>
          )}
        </div>
        
        {(helperText || (error && errorText)) && (
          <div
            id={`${props.id || 'input'}-helper`}
            className={cn(styles.helperText, {
              [styles.errorText]: error,
            })}
          >
            {error && errorText ? errorText : helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
