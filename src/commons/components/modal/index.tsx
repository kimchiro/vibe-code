import React from 'react';
import { Button } from '../button';
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

// Modal Props 타입 정의
export interface ModalProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'info' | 'danger';
  actions?: 'single' | 'dual';
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  title: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
}

// Modal 컴포넌트
export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      variant = 'info',
      actions = 'single',
      theme = 'light',
      size = 'medium',
      title,
      description,
      onConfirm,
      onCancel,
      confirmText,
      cancelText,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // 기본 텍스트 설정 (Figma 디자인 기준)
    const defaultConfirmText = variant === 'info' ? '확인' : '등록 취소';
    const defaultCancelText = variant === 'info' ? '취소' : '계속 작성';

    const finalConfirmText = confirmText || defaultConfirmText;
    const finalCancelText = cancelText || defaultCancelText;

    // 모달 클래스 생성
    const modalClasses = cn(
      styles.modal,
      styles[`variant-${variant}`],
      styles[`actions-${actions}`],
      styles[`theme-${theme}`],
      styles[`size-${size}`],
      {
        [styles.disabled]: disabled,
      },
      className
    );

    // 제목 클래스 생성
    const titleClasses = cn(
      styles.title,
      styles[`theme-${theme}`]
    );

    // 설명 클래스 생성
    const descriptionClasses = cn(
      styles.description,
      styles[`theme-${theme}`]
    );

    // 버튼 영역 클래스 생성
    const buttonsClasses = cn(
      styles.buttons,
      styles[`actions-${actions}`]
    );

    return (
      <div 
        ref={ref} 
        className={modalClasses} 
        role="dialog"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
        aria-modal="true"
        {...props}
      >
        {/* 콘텐츠 영역 */}
        <div className={styles.content}>
          <h2 
            id="modal-title"
            className={titleClasses}
          >
            {title}
          </h2>
          {description && (
            <p 
              id="modal-description"
              className={descriptionClasses}
            >
              {description}
            </p>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className={buttonsClasses}>
          {actions === 'dual' && (
            <Button
              variant="secondary"
              size="medium"
              theme="light"
              disabled={disabled}
              onClick={onCancel}
              className={cn(styles.cancelButton, actions === 'dual' && styles.dualActionButton)}
              aria-label={`${finalCancelText} 버튼`}
            >
              {finalCancelText}
            </Button>
          )}
          <Button
            variant="primary"
            size="medium"
            theme="light"
            disabled={disabled}
            onClick={onConfirm}
            className={cn(styles.confirmButton, actions === 'dual' ? styles.dualActionButton : styles.singleActionButton)}
            aria-label={`${finalConfirmText} 버튼`}
            data-testid="modal-confirm-button"
          >
            {finalConfirmText}
          </Button>
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';

export default Modal;
