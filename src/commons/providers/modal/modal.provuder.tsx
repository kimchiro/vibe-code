'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
export interface ModalProps {
  id: string;
  content: ReactNode;
  onClose?: () => void;
}

// Modal Context Props 타입 정의
export interface ModalContextProps {
  modals: ModalProps[];
  openModal: (modal: Omit<ModalProps, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

// Modal Portal Props 타입 정의
export interface ModalPortalProps {
  children: ReactNode;
  onBackdropClick?: () => void;
  zIndex: number;
}

// Modal Provider Props 타입 정의
export interface ModalProviderProps {
  children: ReactNode;
}

// 모달 컨텍스트 생성
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

// 모달 훅
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// 모달 포털 컴포넌트

const ModalPortal: React.FC<ModalPortalProps> = ({ 
  children, 
  onBackdropClick,
  zIndex 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const modalRoot = document.getElementById('modal-root') || document.body;

  // 중첩 레벨에 따른 백드롭 스타일 결정
  const isStacked = zIndex > 1000;
  const backdropClass = isStacked ? 
    `${styles.backdrop} ${styles.stackedBackdrop}` : 
    styles.backdrop;

  return createPortal(
    <>
      {/* 백드롭 - 중첩 모달을 위한 각각의 백드롭 */}
      <div 
        className={backdropClass}
        style={{ zIndex }}
        onClick={onBackdropClick}
      />
      
      {/* 모달 콘텐츠 - 백드롭보다 높은 z-index */}
      <div
        className={styles.modalContainer}
        style={{ zIndex: zIndex + 1 }}
      >
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </>,
    modalRoot
  );
};

// 모달 프로바이더 컴포넌트

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalProps[]>([]);

  // 모달이 열려있을 때 body 스크롤 제어 (1개라도 열려있으면 스크롤 제거)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    
    if (modals.length > 0) {
      // 모달이 1개라도 열려있으면 body 스크롤 제거
      document.body.style.overflow = 'hidden';
      document.body.classList.add(styles.noScroll);
    } else {
      // 모든 모달이 닫히면 원래 스크롤 상태로 복원
      document.body.style.overflow = originalOverflow || 'unset';
      document.body.classList.remove(styles.noScroll);
    }

    return () => {
      // 컴포넌트 언마운트 시 원래 상태로 복원
      document.body.style.overflow = originalOverflow || 'unset';
      document.body.classList.remove(styles.noScroll);
    };
  }, [modals.length]);

  // 모달 열기
  const openModal = (modal: Omit<ModalProps, 'id'>): string => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newModal: ModalProps = { ...modal, id };
    
    setModals(prev => [...prev, newModal]);
    return id;
  };

  // 모달 닫기
  const closeModal = (id: string) => {
    setModals(prev => {
      const modalToClose = prev.find(modal => modal.id === id);
      if (modalToClose?.onClose) {
        modalToClose.onClose();
      }
      return prev.filter(modal => modal.id !== id);
    });
  };

  // 모든 모달 닫기
  const closeAllModals = () => {
    modals.forEach(modal => {
      if (modal.onClose) {
        modal.onClose();
      }
    });
    setModals([]);
  };

  // ESC 키로 최상위 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modals.length > 0) {
        const lastModal = modals[modals.length - 1];
        closeModal(lastModal.id);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [modals]);

  const contextValue: ModalContextProps = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      
      {/* 모달 렌더링 - 중첩 모달을 위해 각각 다른 z-index */}
      {modals.map((modal, index) => (
        <ModalPortal
          key={modal.id}
          zIndex={1000 + index * 100} // 중첩 모달을 위한 z-index 증가 (백드롭: 1000, 1100, 1200... / 콘텐츠: 1001, 1101, 1201...)
          onBackdropClick={() => closeModal(modal.id)}
        >
          {modal.content}
        </ModalPortal>
      ))}
    </ModalContext.Provider>
  );
};

// displayName 설정
ModalProvider.displayName = 'ModalProvider';
ModalPortal.displayName = 'ModalPortal';

export default ModalProvider;
