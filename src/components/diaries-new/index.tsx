"use client";

import React, { useState } from 'react';
import styles from './styles.module.css';
import { Input } from '@/commons/components/input';
import { Button } from '@/commons/components/button';
import { Emotion, EMOTION_LABELS, getAllEmotions } from '@/commons/constants/enum';

const DiariesNew: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleEmotionChange = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleClose = () => {
    // 닫기 로직
    console.log('닫기 버튼 클릭');
  };

  const handleSubmit = () => {
    // 등록하기 로직
    console.log('등록하기 버튼 클릭', {
      emotion: selectedEmotion,
      title,
      content
    });
  };

  return (
    <div className={styles.wrapper}>
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
                checked={selectedEmotion === emotion}
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        >
          닫기
        </Button>
        <Button
          variant="primary"
          theme="light"
          size="medium"
          onClick={handleSubmit}
          style={{ width: '100px' }}
          disabled={!selectedEmotion || !title || !content}
        >
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default DiariesNew;
