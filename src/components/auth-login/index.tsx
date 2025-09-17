'use client';

import React from 'react';
import Link from 'next/link';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { useAuthLoginForm } from './hooks/index.form.hook';
import styles from './styles.module.css';

// 로그인 컴포넌트
export const AuthLogin = () => {
  const {
    register,
    handleSubmit,
    errors,
    isFormFilled,
    isLoading,
  } = useAuthLoginForm();

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>계정에 로그인하여 서비스를 이용해보세요</p>
        </div>

        {/* 로그인 폼 */}
        <form 
          className={styles.form} 
          onSubmit={handleSubmit}
          data-testid="auth-login-form"
        >
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
              data-testid="email-input"
              errorText={errors.email?.message}
            />
            {errors.email && (
              <span data-testid="email-error" className={styles.errorMessage}>
                {errors.email.message}
              </span>
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
              data-testid="password-input"
              errorText={errors.password?.message}
            />
            {errors.password && (
              <span data-testid="password-error" className={styles.errorMessage}>
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.buttonGroup}>
            <Button
              type="submit"
              variant="primary"
              size="medium"
              theme="light"
              className={styles.buttonWidth}
              disabled={!isFormFilled || isLoading}
              data-testid="login-button"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </div>
        </form>

        {/* 회원가입 링크 */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            아직 계정이 없으신가요?{' '}
            <Link href="/auth/signup" className={styles.link}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
