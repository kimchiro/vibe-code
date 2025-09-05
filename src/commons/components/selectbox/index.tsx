import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

// 클래스명 조합 헬퍼 함수
const cn = (...args: Array<string | undefined | null | false | Record<string, boolean | undefined>>): string => {
  return args
    .filter(Boolean)
    .map((arg) => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object' && arg !== null) {
        return Object.entries(arg)
          .filter(([, condition]) => Boolean(condition))
          .map(([className]) => className)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
};

// SelectBox Option 타입 정의
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// SelectBox Props 타입 정의
export interface SelectBoxProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'medium' | 'large';
  theme?: 'light' | 'dark';
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  onChange?: (value: string, option: SelectOption) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// SelectBox 컴포넌트
export const SelectBox = React.forwardRef<HTMLDivElement, SelectBoxProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      theme = 'light',
      options = [],
      value,
      defaultValue,
      placeholder = '선택하세요',
      disabled = false,
      fullWidth = false,
      className,
      onChange,
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const selectRef = useRef<HTMLDivElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // 선택된 옵션 찾기
    const selectedOption = options.find(option => option.value === selectedValue);
    const displayText = selectedOption?.label || placeholder;

    // 옵션 개수에 따른 동적 높이 계산
    const getOptionHeight = () => {
      switch (size) {
        case 'small': return 36;
        case 'large': return 56;
        default: return 48; // medium
      }
    };

    const getDynamicOptionsHeight = () => {
      const optionHeight = getOptionHeight();
      const totalOptions = options.length;
      const borderWidth = 4; // 2px 상하 테두리 (2px * 2)
      return totalOptions * optionHeight + borderWidth; // 테두리 높이 포함하여 하위 옵션들 완전 포함
    };

    // 외부 클릭 감지
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          onBlur?.();
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onBlur]);

    // value prop 변경 감지
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    // SelectBox 클래스 생성
    const selectBoxClasses = cn(
      styles.selectBox,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      {
        [styles.open]: isOpen,
        [styles.disabled]: disabled,
        [styles.fullWidth]: fullWidth,
        [styles.hasValue]: !!selectedValue,
      } as Record<string, boolean>,
      className
    );

    // 드롭다운 옵션 클래스 생성
    const optionsClasses = cn(
      styles.options,
      styles[`variant-${variant}`],
      styles[`size-${size}`],
      styles[`theme-${theme}`],
      {
        [styles.open]: isOpen,
      }
    );

    // 동적 높이 스타일 - 내부 option 개수에 맞게 테두리 높이 포함하여 계산
    const dynamicOptionsStyle: React.CSSProperties = {
      height: isOpen ? `${getDynamicOptionsHeight()}px` : '0px',
      maxHeight: `${getDynamicOptionsHeight()}px`,
    };

    // 선택 핸들러
    const handleSelect = (option: SelectOption) => {
      if (option.disabled || disabled) return;

      setSelectedValue(option.value);
      setIsOpen(false);
      onChange?.(option.value, option);
      onBlur?.();
    };

    // 토글 핸들러
    const handleToggle = () => {
      if (disabled) return;

      if (!isOpen) {
        onFocus?.();
      }
      setIsOpen(!isOpen);
    };

    // 키보드 이벤트 핸들러
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleToggle();
          break;
        case 'Escape':
          setIsOpen(false);
          onBlur?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            onFocus?.();
          } else {
            // 다음 옵션으로 이동 로직 (optional)
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (isOpen) {
            // 이전 옵션으로 이동 로직 (optional)
          }
          break;
      }
    };

    return (
              <div
          ref={ref || selectRef}
          className={selectBoxClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="selectbox-options"
          aria-disabled={disabled}
        >
        <div className={styles.trigger}>
          <span className={styles.text}>{displayText}</span>
          <span className={styles.arrow}>
            <Image
              src="/icons/arrow_drop_down.svg"
              alt="드롭다운"
              width={24}
              height={24}
            />
          </span>
        </div>

        {isOpen && (
          <div
            ref={optionsRef}
            className={optionsClasses}
            role="listbox"
            id="selectbox-options"
            style={dynamicOptionsStyle}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  styles.option,
                  {
                    [styles.selected]: option.value === selectedValue,
                    [styles.optionDisabled]: !!option.disabled,
                  } as Record<string, boolean>
                )}
                onClick={() => handleSelect(option)}
                role="option"
                aria-selected={option.value === selectedValue}
                aria-disabled={option.disabled}
              >
                <span className={styles.optionText}>{option.label}</span>
                {option.value === selectedValue && (
                  <span className={styles.checkIcon}>
                    <Image
                      src="/icons/check_outline_light_xs.svg"
                      alt="선택됨"
                      width={16}
                      height={16}
                    />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SelectBox.displayName = 'SelectBox';

export default SelectBox;
