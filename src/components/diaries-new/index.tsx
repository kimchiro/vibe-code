"use client";

import React from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { Emotion, EMOTION_LABELS, getAllEmotions } from '@/commons/constants/enum';
import { useDiaryModalClose } from './hooks/index.link.modal.close.hook';
import { useDiaryForm } from './hooks/index.form.hook';

const DiariesNew: React.FC = () => {
  // 폼 훅 사용
  const { form, onSubmit, isFormComplete } = useDiaryForm();
  const { handleClose } = useDiaryModalClose();

  const { register, watch, setValue, formState: { errors } } = form;
  
  // 현재 폼 값들 감시
  const watchedEmotion = watch('emotion');
  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  const handleEmotionChange = (emotion: Emotion) => {
    setValue('emotion', emotion);
  };

  return (
    <div className={styles.wrapper} data-testid="diary-new-modal">
      {/* Header 영역 */}
      <div className={styles.header}>
        <h1 className={styles.headerTitle}>일기쓰기</h1>
      </div>
      
      {/* Gap 1 */}
      <div className={styles.gap}></div>
      
      {/* Emotion Box 영역 */}
      <div className={styles.emotionBox}>
        <div className={styles.emotionQuestion}>오늘 기분은 어땠나요?</div>
        <div className={styles.emotionOptions}>
          {getAllEmotions().map((emotion) => (
            <label key={emotion} className={styles.emotionOption}>
              <input
                type="radio"
                name="emotion"
                value={emotion}
                checked={watchedEmotion === emotion}
                onChange={() => handleEmotionChange(emotion)}
                className={styles.emotionRadio}
              />
              <span className={styles.emotionLabel}>{EMOTION_LABELS[emotion]}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Gap 2 */}
      <div className={styles.gap}></div>
      
      {/* Input Title 영역 */}
      <div>제목</div>
      <div className={styles.inputTitle}>
        <Input
          variant="primary"
          theme="light"
          size="medium"
          placeholder="제목을 입력하세요"
          {...register('title')}
          style={{ width: '100%' }}
        />
      </div>
      
      {/* Gap 3 */}
      <div className={styles.gapSmall}></div>
      
      {/* Input Content 영역 */}
      <div>내용</div>
      <div className={styles.inputContent}>
        <textarea
          placeholder="내용을 입력하세요"
          {...register('content')}
          className={styles.contentTextarea}
        />
      </div>
      
      {/* Gap 4 */}
      <div className={styles.gap}></div>
      
      {/* Footer 영역 */}
      <div className={styles.footer}>
        <Button
          variant="secondary"
          theme="light"
          size="medium"
          onClick={handleClose}
          style={{ width: '80px' }}
          data-testid="diary-close-button"
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="medium"
          onClick={onSubmit}
          style={{ width: '100px' }}
          disabled={!isFormComplete}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default DiariesNew;
