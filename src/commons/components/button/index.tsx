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

// 버튼 Props 타입 정의
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

// Button 컴포넌트
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      children,
      loading = false,
      disabled = false,
      fullWidth = false,
      icon,
      iconPosition = 'left',
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    // 버튼 클래스 생성
    const buttonClasses = cn(
      styles.button,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      {
        [styles.loading]: loading,
        [styles.disabled]: disabled || loading,
        [styles.fullWidth]: fullWidth,
        [styles.withIcon]: !!icon,
      },
      className
    );

    // 클릭 핸들러
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    // 아이콘과 텍스트 렌더링
    const renderContent = () => {
      if (loading) {
        return (
          <>
            <span className={styles.spinner} />
            <span className={styles.text}>{children}</span>
          </>
        );
      }

      if (icon) {
        return iconPosition === 'left' ? (
          <>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.text}>{children}</span>
          </>
        ) : (
          <>
            <span className={styles.text}>{children}</span>
            <span className={styles.icon}>{icon}</span>
          </>
        );
      }

      return <span className={styles.text}>{children}</span>;
    };

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        aria-disabled={disabled || loading}
        {...props}
      >
        {renderContent()}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
