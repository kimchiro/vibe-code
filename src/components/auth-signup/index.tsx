'use client';

import React from 'react';
import Link from 'next/link';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import styles from './styles.module.css';

export default function AuthSignup() {
  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>새로운 계정을 만들어보세요</p>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="이메일"
              type="email"
              placeholder="이메일을 입력해주세요"
              className={styles.inputWidth}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className={styles.inputWidth}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="비밀번호 재입력"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              className={styles.inputWidth}
            />
          </div>

          <div className={styles.inputGroup}>
            <Input
              variant="primary"
              size="medium"
              theme="light"
              label="이름"
              type="text"
              placeholder="이름을 입력해주세요"
              className={styles.inputWidth}
            />
          </div>

          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              size="medium"
              theme="light"
              type="submit"
              className={styles.buttonWidth}
            >
              회원가입
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
