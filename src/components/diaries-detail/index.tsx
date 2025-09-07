'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { Button } from '@/commons/components/button';
import { Input } from '@/commons/components/input';
import { Emotion, getEmotionLabel, getEmotionImage, getEmotionColor } from '@/commons/constants/enum';

// Mock 데이터 인터페이스
interface DiaryDetailData {
  id: string;
  title: string;
  emotion: Emotion;
  content: string;
  createdAt: string;
}

// 회고 데이터 인터페이스
interface RetrospectData {
  id: string;
  content: string;
  createdAt: string;
}

// Mock 데이터 - 다양한 감정 타입 활용
const mockDiaryDetails: DiaryDetailData[] = [
  {
    id: '1',
    title: '오늘은 정말 행복한 하루였어요!',
    emotion: Emotion.HAPPY,
    content: '친구들과 함께 맛있는 음식을 먹고, 영화도 보고, 정말 즐거운 시간을 보냈습니다. 이런 날이 더 많았으면 좋겠어요. 감사한 마음으로 하루를 마무리합니다.',
    createdAt: '2024.01.15'
  },
  {
    id: '2',
    title: '힘든 하루였지만 버텨냈어요',
    emotion: Emotion.SAD,
    content: '오늘은 정말 힘든 일이 많았습니다. 하지만 이런 날도 있는 거겠죠. 내일은 더 좋은 날이 되기를 바랍니다.',
    createdAt: '2024.01.14'
  },
  {
    id: '3',
    title: '정말 화가 나는 일이 있었어요',
    emotion: Emotion.ANGRY,
    content: '오늘 직장에서 정말 이해할 수 없는 일이 일어났습니다. 화가 나지만 차분히 해결해보려고 합니다.',
    createdAt: '2024.01.13'
  }
];

// 현재 표시할 Mock 데이터 (다양한 감정 테스트를 위해 변경 가능)
const mockDiaryDetail = mockDiaryDetails[0]; // HAPPY: 빨간색
// const mockDiaryDetail = mockDiaryDetails[1]; // SAD: 파란색  
// const mockDiaryDetail = mockDiaryDetails[2]; // ANGRY: 회색

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
  const [retrospectInput, setRetrospectInput] = useState('');
  const [retrospects, setRetrospects] = useState<RetrospectData[]>(mockRetrospects);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(mockDiaryDetail.content);
    // TODO: 복사 완료 알림 추가
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

  return (
    <div className={styles.container}>
      {/* Detail Title 영역 */}
      <div className={styles.detailTitle}>
        <div className={styles.titleSection}>
          <div className={styles.titleHeader}>
            <div className={styles.emotionInfo}>
              <Image
                src={`/images/emotion-${mockDiaryDetail.emotion.toLowerCase()}-s.png`}
                alt={getEmotionLabel(mockDiaryDetail.emotion)}
                width={24}
                height={24}
                className={styles.emotionIcon}
              />
              <span 
                className={styles.emotionText}
                style={{ color: getEmotionColor(mockDiaryDetail.emotion) }}
              >
                {getEmotionLabel(mockDiaryDetail.emotion)}
              </span>
            </div>
            <span className={styles.dateText}>{mockDiaryDetail.createdAt}</span>
          </div>
          <h1 className={styles.titleText}>{mockDiaryDetail.title}</h1>
        </div>
      </div>

      {/* Detail Content 영역 */}
      <div className={styles.detailContent}>
        <div className={styles.contentSection}>
          <p className={styles.contentText}>{mockDiaryDetail.content}</p>
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
