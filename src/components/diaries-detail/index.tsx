import React from 'react';
import styles from './styles.module.css';

const DiariesDetail: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Detail Title 영역 */}
      <div className={styles.detailTitle}>
        <div className={styles.titleContent}>Detail Title</div>
      </div>

      {/* Detail Content 영역 */}
      <div className={styles.detailContent}>
        <div className={styles.contentText}>Detail Content</div>
      </div>

      {/* Detail Footer 영역 */}
      <div className={styles.detailFooter}>
        <div className={styles.footerContent}>Detail Footer</div>
      </div>

      {/* Retrospect Input 영역 */}
      <div className={styles.retrospectInput}>
        <div className={styles.inputContent}>Retrospect Input</div>
      </div>

      {/* Retrospect List 영역 */}
      <div className={styles.retrospectList}>
        <div className={styles.listContent}>Retrospect List</div>
      </div>
    </div>
  );
};

export default DiariesDetail;
