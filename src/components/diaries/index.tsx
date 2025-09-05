'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import SelectBox from '@/commons/components/selectbox';
import Searchbar from '@/commons/components/searchbar';
import Button from '@/commons/components/button';
import { Emotion, getEmotionLabel, getEmotionImage, EMOTION_COLORS } from '@/commons/constants/enum';

// 일기 데이터 타입 정의
interface DiaryData {
  id: number;
  date: string;
  content: string;
  emotion: Emotion;
  image: string;
}

export default function Diaries() {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock 데이터 생성 (피그마 디자인 기반, emotion enum 활용)
  const mockDiaries: DiaryData[] = [
    {
      id: 1,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다. 한줄까지만 노출되고 나머지는 말줄임 처리됩니다.',
      emotion: Emotion.HAPPY,
      image: '/images/emotion-happy-m.png'
    },
    {
      id: 2,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.SAD,
      image: '/images/emotion-sad-m.png'
    },
    {
      id: 3,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.ANGRY,
      image: '/images/emotion-angry-m.png'
    },
    {
      id: 4,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.SURPRISE,
      image: '/images/emotion-surprise-m.png'
    },
    {
      id: 5,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.ETC,
      image: '/images/emotion-etc-m.png'
    },
    {
      id: 6,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.HAPPY,
      image: '/images/emotion-happy-m.png'
    },
    {
      id: 7,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.SAD,
      image: '/images/emotion-sad-m.png'
    },
    {
      id: 8,
      date: '2024. 03. 12',
      content: '타이틀 영역 입니다.',
      emotion: Emotion.ANGRY,
      image: '/images/emotion-angry-m.png'
    }
  ];

  // 필터 옵션 정의
  const filterOptions = [
    { value: 'all', label: '전체' },
    { value: 'recent', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'title', label: '제목순' },
  ];

  // 필터 변경 핸들러
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // 검색어 클리어 핸들러
  const handleSearchClear = () => {
    setSearchQuery('');
  };

  // 일기쓰기 버튼 클릭 핸들러
  const handleWriteClick = () => {
    // TODO: 일기 작성 페이지로 이동
    console.log('일기쓰기 클릭');
  };

  // 일기 삭제 핸들러
  const handleDeleteDiary = (diaryId: number) => {
    // TODO: 일기 삭제 로직 구현
    console.log('일기 삭제:', diaryId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap}></div>
      <div className={styles.search}>
        <div className={styles.searchLeft}>
          <SelectBox
            variant="secondary"
            size="medium"
            theme="light"
            options={filterOptions}
            value={selectedFilter}
            placeholder="필터 선택"
            onChange={handleFilterChange}
            className={styles.filterSelect}
          />
          <Searchbar
            variant="primary"
            size="medium"
            theme="light"
            placeholder="일기를 검색해보세요"
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            showClearButton={!!searchQuery}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.searchRight}>
          <Button
            variant="primary"
            size="medium"
            theme="light"
            onClick={handleWriteClick}
            className={styles.writeButton}
          >
            일기쓰기
          </Button>
        </div>
      </div>
      <div className={styles.gap2}></div>
      <div className={styles.main}>
        <div className={styles.diaryGrid}>
          {mockDiaries.map((diary) => (
            <div key={diary.id} className={styles.diaryCard}>
              <button 
                className={styles.deleteButton}
                onClick={() => handleDeleteDiary(diary.id)}
                aria-label="일기 삭제"
              >
                <img src="/icons/close_outline_light_m.svg" alt="삭제" />
              </button>
              <div className={styles.cardImage}>
                <img src={diary.image} alt={getEmotionLabel(diary.emotion)} />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div 
                    className={styles.cardEmotion}
                    style={{ color: EMOTION_COLORS[diary.emotion] }}
                  >
                    {getEmotionLabel(diary.emotion)}
                  </div>
                  <div className={styles.cardDate}>{diary.date}</div>
                </div>
                <div className={styles.cardText}>{diary.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.gap3}></div>
      <div className={styles.pagination}>pagination</div>
      <div className={styles.gap4}></div>
    </div>
  );
}
 