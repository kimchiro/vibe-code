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

// Toggle Props 타입 정의
export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
}

// Toggle 컴포넌트
export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      checked = false,
      disabled = false,
      onChange,
      label,
      description,
      className,
      id,
      ...props
    },
    ref
  ) => {
    // 고유 ID 생성 (항상 컴포넌트 상단에서 호출)
    const generatedId = React.useId();
    const toggleId = id || `toggle-${generatedId}`;

    // 토글 스위치 클래스 생성
    const switchClasses = cn(
      styles.toggle,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      {
        [styles.checked]: checked,
        [styles.disabled]: disabled,
      },
      className
    );

    // 변경 핸들러
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      
      const newChecked = event.target.checked;
      onChange?.(newChecked);
    };

    // 키보드 핸들러 (스페이스바 토글)
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === ' ' && !disabled) {
        event.preventDefault();
        onChange?.(!checked);
      }
    };

    return (
      <div className={styles.container}>
        <div 
          className={switchClasses}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={handleKeyDown}
          onClick={() => !disabled && onChange?.(!checked)}
        >
          <input
            ref={ref}
            type="checkbox"
            id={toggleId}
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            className={styles.input}
            aria-hidden="true"
            tabIndex={-1}
            {...props}
          />
          <div className={styles.track}>
            <div className={styles.thumb} />
          </div>
        </div>
        
        {(label || description) && (
          <div className={styles.content}>
            {label && (
              <label 
                htmlFor={toggleId} 
                className={cn(styles.label, { [styles.disabled]: disabled })}
              >
                {label}
              </label>
            )}
            {description && (
              <p className={cn(styles.description, { [styles.disabled]: disabled })}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;
