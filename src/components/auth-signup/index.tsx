'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { Modal } from '@/commons/components/modal';
import { useModal } from '@/commons/providers/modal/modal.provuder';
import { useSignupForm } from './hooks/index.form.hook';
import styles from './styles.module.css';

export default function AuthSignup() {
  const { openModal, closeAllModals } = useModal();
  const {
    register,
    handleSubmit,
    errors,
    isSubmitEnabled,
    isLoading,
    isSuccess,
    isError,
    error,
    handleSuccessConfirm,
    handleErrorConfirm,
  } = useSignupForm();

  // 성공/실패 모달 처리
  useEffect(() => {
    if (isSuccess) {
      openModal({
        content: (
          <Modal
            variant="info"
            actions="single"
            title="가입완료"
            description="회원가입이 성공적으로 완료되었습니다."
            onConfirm={() => {
              handleSuccessConfirm();
              closeAllModals();
            }}
            data-testid="success-modal"
          />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      const errorMessage = error?.message || '회원가입에 실패했습니다.';
      openModal({
        content: (
          <Modal
            variant="danger"
            actions="single"
            title="가입실패"
            description={errorMessage}
            onConfirm={() => {
              handleErrorConfirm();
              closeAllModals();
            }}
            data-testid="error-modal"
          />
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, error?.message]);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>새로운 계정을 만들어보세요</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} data-testid="signup-form">
          <div className={styles.inputGroup}>
            <Input
              {...register('email')}
              variant="primary"
              size="medium"
              theme="light"
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              className={styles.inputWidth}
              error={!!errors.email}
              data-testid="email-input"
            />
            {errors.email && (
              <div data-testid="email-error" className={styles.errorMessage}>
                {errors.email.message}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <Input
              {...register('password')}
              variant="primary"
              size="medium"
              theme="light"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className={styles.inputWidth}
              error={!!errors.password}
              data-testid="password-input"
            />
            {errors.password && (
              <div data-testid="password-error" className={styles.errorMessage}>
                {errors.password.message}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <Input
              {...register('passwordConfirm')}
              variant="primary"
              size="medium"
              theme="light"
              label="비밀번호 재입력"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              className={styles.inputWidth}
              error={!!errors.passwordConfirm}
              data-testid="password-confirm-input"
            />
            {errors.passwordConfirm && (
              <div data-testid="password-confirm-error" className={styles.errorMessage}>
                {errors.passwordConfirm.message}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <Input
              {...register('name')}
              variant="primary"
              size="medium"
              theme="light"
              label="이름"
              type="text"
              placeholder="이름을 입력해주세요"
              className={styles.inputWidth}
              error={!!errors.name}
              data-testid="name-input"
            />
            {errors.name && (
              <div data-testid="name-error" className={styles.errorMessage}>
                {errors.name.message}
              </div>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="medium"
              theme="light"
              type="submit"
              className={styles.buttonWidth}
              disabled={!isSubmitEnabled || isLoading}
              data-testid="signup-submit-button"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </div>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/signin" className={styles.link}>
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
