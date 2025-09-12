'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { Emotion, getEmotionLabel, getEmotionImage, getEmotionColor } from '@/commons/constants/enum';
import { useDiaryBinding } from './hooks/index.binding.hook';

// 회고 데이터 인터페이스
interface RetrospectData {
  id: string;
  content: string;
  createdAt: string;
}

// Mock 회고 데이터
const mockRetrospects: RetrospectData[] = [
  {
    id: '1',
    content: '오늘 하루를 돌아보니 정말 의미있는 시간이었습니다. 친구들과 함께한 시간이 가장 소중했어요.',
    createdAt: '[2024.01.15]'
  },
  {
    id: '2', 
    content: '앞으로는 더 긍정적인 마음가짐으로 살아가려고 합니다.',
    createdAt: '[2024.01.15]'
  }
];

const DiariesDetail: React.FC = () => {
  // 실제 데이터 바인딩 훅 사용
  const { diary, isLoading, error } = useDiaryBinding();
  
  const [retrospectInput, setRetrospectInput] = useState('');
  const [retrospects, setRetrospects] = useState<RetrospectData[]>(mockRetrospects);

  const handleCopyContent = () => {
    if (diary?.content) {
      navigator.clipboard.writeText(diary.content);
      // TODO: 복사 완료 알림 추가
    }
  };

  const handleEdit = () => {
    // TODO: 수정 기능 구현
    console.log('수정 버튼 클릭');
  };

  const handleDelete = () => {
    // TODO: 삭제 기능 구현
    console.log('삭제 버튼 클릭');
  };

  const handleRetrospectSubmit = () => {
    if (retrospectInput.trim()) {
      const newRetrospect: RetrospectData = {
        id: Date.now().toString(),
        content: retrospectInput.trim(),
        createdAt: `[${new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\. /g, '.').replace(/\.$/, '')}]`
      };
      setRetrospects([newRetrospect, ...retrospects]);
      setRetrospectInput('');
    }
  };

  const handleRetrospectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRetrospectInput(e.target.value);
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div>로딩 중...</div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div>오류: {error}</div>
      </div>
    );
  }

  // 일기 데이터가 없을 때
  if (!diary) {
    return (
      <div className={styles.container} data-testid="diaries-detail-container">
        <div>일기를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="diaries-detail-container">
      {/* Detail Title 영역 */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <div className={styles.titleHeader}>
            <div className={styles.emotionInfo}>
              <Image
                src={`/images/emotion-${diary.emotion.toLowerCase()}-s.png`}
                alt={getEmotionLabel(diary.emotion)}
                width={24}
                height={24}
                className={styles.emotionIcon}
                data-testid="emotion-icon"
              />
              <span 
                className={styles.emotionText}
                style={{ color: getEmotionColor(diary.emotion) }}
                data-testid="emotion-text"
              >
                {getEmotionLabel(diary.emotion)}
              </span>
            </div>
            <span className={styles.dateText} data-testid="diary-date">{diary.createdAt}</span>
          </div>
          <h1 className={styles.titleText} data-testid="diary-title">{diary.title}</h1>
        </div>
      </div>

      {/* Detail Content 영역 */}
      <div className={styles.detailContent}>
        <div className={styles.contentSection}>
          <p className={styles.contentText} data-testid="diary-content">{diary.content}</p>
          <button 
            className={styles.copyButton}
            onClick={handleCopyContent}
            aria-label="내용 복사"
          >
            <Image
              src="/icons/copy_outline_light_xs.svg"
              alt="복사"
              width={16}
              height={16}
            />
          </button>
        </div>
      </div>

      {/* Detail Footer 영역 */}
      <div className={styles.detailFooter}>
        <div className={styles.footerButtons}>
          <Button
            variant="secondary"
            size="small"
            theme="light"
            onClick={handleEdit}
            className={styles.editButton}
          >
            수정
          </Button>
          <Button
            variant="primary"
            size="small"
            theme="light"
            onClick={handleDelete}
            className={styles.deleteButton}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* Retrospect Input 영역 */}
      <div className={styles.retrospectInput}>
        <Input
          variant="primary"
          size="medium"
          theme="light"
          placeholder="회고를 남겨보세요."
          value={retrospectInput}
          onChange={handleRetrospectInputChange}
          className={styles.retrospectInputField}
        />
        <Button
          variant="primary"
          size="medium"
          theme="light"
          onClick={handleRetrospectSubmit}
          className={styles.retrospectInputButton}
        >
          입력
        </Button>
      </div>

      {/* Retrospect List 영역 */}
      <div className={styles.retrospectList}>
        {retrospects.length > 0 ? (
          retrospects.map((retrospect) => (
            <div key={retrospect.id} className={styles.retrospectItem}>
              <div className={styles.retrospectContent}>
                <p className={styles.retrospectText}>{retrospect.content}</p>
                <p className={styles.retrospectDate}>{retrospect.createdAt}</p>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.retrospectItem}>
            <div className={styles.retrospectContent}>
              <p className={styles.retrospectText}>아직 회고가 없습니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiariesDetail;
