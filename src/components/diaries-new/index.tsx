import React from 'react';
import styles from './styles.module.css';

const DiariesNew: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      {/* Header 영역 */}
      <div className={styles.header}></div>
      
      {/* Gap 1 */}
      <div className={styles.gap}></div>
      
      {/* Emotion Box 영역 */}
      <div className={styles.emotionBox}></div>
      
      {/* Gap 2 */}
      <div className={styles.gap}></div>
      
      {/* Input Title 영역 */}
      <div className={styles.inputTitle}></div>
      
      {/* Gap 3 */}
      <div className={styles.gapSmall}></div>
      
      {/* Input Content 영역 */}
      <div className={styles.inputContent}></div>
      
      {/* Gap 4 */}
      <div className={styles.gap}></div>
      
      {/* Footer 영역 */}
      <div className={styles.footer}></div>
    </div>
  );
};

export default DiariesNew;
