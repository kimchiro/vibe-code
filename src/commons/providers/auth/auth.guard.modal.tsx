'use client'

import React from 'react'
import { Modal } from '@/commons/components/modal'
import { UrlPath } from '@/commons/constants/url'

/**
 * 로그인 모달 컴포넌트 Props 인터페이스
 */
interface LoginModalProps {
  onConfirm: () => void
  onCancel: () => void
}

/**
 * 로그인 모달 핸들러 생성 함수의 파라미터 타입
 */
interface RouterLike {
  push: (path: string) => void
}

/**
 * 로그인 확인 모달 컴포넌트
 * - 회원 전용 기능 접근 시 표시되는 모달
 * - 독립적인 부품으로 분리되어 재사용 가능
 * - Modal 공통 컴포넌트를 활용하여 일관성 유지
 */
export const LoginModal: React.FC<LoginModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <Modal
      variant="info"
      actions="dual"
      title="로그인이 필요합니다"
      description="회원 전용 기능입니다. 로그인하시겠습니까?"
      confirmText="로그인하러가기"
      cancelText="취소"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}

/**
 * 로그인 모달 액션 핸들러 생성 함수
 * - 모달의 확인/취소 버튼 클릭 시 실행될 핸들러들을 생성
 * - 의존성 주입을 통해 독립적인 부품으로 구성
 * 
 * @param closeAllModals 모든 모달을 닫는 함수
 * @param router Next.js 라우터 객체
 * @returns 모달 핸들러 객체
 */
export const createLoginModalHandlers = (
  closeAllModals: () => void,
  router: RouterLike
) => {
  return {
    onConfirm: () => {
      // 1. 열려있는 모든 모달을 닫기
      closeAllModals()
      // 2. 로그인 페이지로 이동
      router.push(UrlPath.LOGIN)
    },
    onCancel: () => {
      // 1. 열려있는 모든 모달을 닫기
      closeAllModals()
    }
  }
}

// displayName 설정
LoginModal.displayName = 'LoginModal'

export default LoginModal
