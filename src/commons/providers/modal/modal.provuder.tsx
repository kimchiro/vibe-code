'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

// 모달 타입 정의
interface Modal {
  id: string;
  content: ReactNode;
  onClose?: () => void;
}

// 모달 컨텍스트 타입 정의
interface ModalContextType {
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

// 모달 컨텍스트 생성
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// 모달 훅
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// 모달 포털 컴포넌트
interface ModalPortalProps {
  children: ReactNode;
  onBackdropClick?: () => void;
  zIndex: number;
}

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

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      onClick={onBackdropClick}
    >
      {/* 백드롭 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onBackdropClick}
      />
      
      {/* 모달 콘텐츠 */}
      <div
        className="relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
};

// 모달 프로바이더 컴포넌트
interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<Modal[]>([]);

  // 모달이 열려있을 때 body 스크롤 제어
  useEffect(() => {
    if (modals.length > 0) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modals.length]);

  // 모달 열기
  const openModal = (modal: Omit<Modal, 'id'>): string => {
    const id = `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newModal: Modal = { ...modal, id };
    
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

  const contextValue: ModalContextType = {
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
          zIndex={1000 + index * 10} // 중첩 모달을 위한 z-index 증가
          onBackdropClick={() => closeModal(modal.id)}
        >
          {modal.content}
        </ModalPortal>
      ))}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
