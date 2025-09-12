import { useCallback } from 'react';
import { useModal } from '@/commons/providers/modal/modal.provuder';
import { Modal } from '@/commons/components/modal';

/**
 * 일기쓰기 모달의 닫기 기능을 관리하는 hook
 * 
 * 기능:
 * 1. 닫기 버튼 클릭 시 등록취소 확인 모달을 2중 모달로 표시
 * 2. 등록취소 모달에서 "계속 작성" 선택 시 등록취소 모달만 닫기
 * 3. 등록취소 모달에서 "등록 취소" 선택 시 모든 모달 닫기
 */
export const useDiaryModalClose = () => {
  const { openModal, closeModal, closeAllModals } = useModal();

  /**
   * 닫기 버튼 클릭 핸들러
   * 등록취소 확인 모달을 2중 모달로 표시
   */
  const handleClose = useCallback(() => {
    const confirmationModalId = openModal({
      content: (
        <Modal
          variant="info"
          actions="dual"
          theme="light"
          size="medium"
          title="등록을 취소하시겠습니까?"
          description="작성 중인 내용이 저장되지 않습니다."
          onCancel={() => {
            // 계속 작성: 등록취소 모달만 닫기
            closeModal(confirmationModalId);
          }}
          onConfirm={() => {
            // 등록 취소: 모든 모달 닫기
            closeAllModals();
          }}
          confirmText="등록 취소"
          cancelText="계속 작성"
          data-testid="cancel-confirmation-modal"
        />
      ),
    });
  }, [openModal, closeModal, closeAllModals]);

  return {
    handleClose,
  };
};
