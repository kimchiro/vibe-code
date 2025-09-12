"use client";

import { useModal } from "@/commons/providers/modal/modal.provuder";
import DiariesNew from "@/components/diaries-new";

/**
 * 일기 관련 모달 링크 훅
 * 일기쓰기 모달을 열고 닫는 기능을 제공합니다.
 */
export const useLinkModal = () => {
  const { openModal, closeModal } = useModal();

  /**
   * 일기쓰기 모달을 엽니다.
   * @returns 모달 ID
   */
  const handleWriteModalOpen = (): string => {
    const modalId = openModal({
      content: <DiariesNew />,
      onClose: () => {
        // 모달이 닫힐 때 추가 로직이 필요한 경우 여기에 구현
        console.log("일기쓰기 모달이 닫혔습니다.");
      },
    });

    return modalId;
  };

  /**
   * 특정 모달을 닫습니다.
   * @param modalId 닫을 모달의 ID
   */
  const handleModalClose = (modalId: string): void => {
    closeModal(modalId);
  };

  return {
    handleWriteModalOpen,
    handleModalClose,
  };
};
