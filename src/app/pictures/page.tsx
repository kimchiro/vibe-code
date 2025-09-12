'use client';

import { useState } from 'react';
import styles from './styles.module.css';

export default function Pictures() {
  const [selectedFilter, setSelectedFilter] = useState('');

  return (
    <div className={styles.container} data-testid="pictures-container">
      <div className={styles.gap}></div>
      <div className={styles.header}>
        <h1 className={styles.title}>사진보관함</h1>
        <p className={styles.description}>추억이 담긴 사진들을 보관하고 관리하세요.</p>
      </div>
      <div className={styles.gap2}></div>
      <div className={styles.main}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📷</div>
          <h2 className={styles.emptyTitle}>아직 사진이 없습니다</h2>
          <p className={styles.emptyDescription}>
            첫 번째 사진을 업로드하여 추억을 저장해보세요.
          </p>
        </div>
      </div>
      <div className={styles.gap3}></div>
    </div>
  );
}
