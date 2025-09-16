'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import { SelectBox } from '@/commons/components/selectbox';
import { Searchbar } from '@/commons/components/searchbar';
import { Button } from '@/commons/components/button';
import { Pagination } from '@/commons/components/pagination';
import { Emotion, getEmotionLabel, getEmotionImage, EMOTION_COLORS } from '@/commons/constants/enum';
import { useLinkRouting } from './hooks/index.link.routing.hook';
import { useLinkModal } from './hooks/index.link.modal.hook';
import { useDataBinding } from './hooks/index.binding.hook';

/**
 * 일기 데이터 타입 정의 (기존 구조 유지를 위한 변환용)
 */
export interface DiaryDisplayData {
  id: number;
  date: string;
  content: string;
  emotion: Emotion;
  image: string;
}

export default function Diaries() {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 한 페이지당 9개 아이템 (4x2 그리드)

  // 링크 라우팅 훅 사용
  const { handleDiaryDetailClick } = useLinkRouting();

  // 모달 링크 훅 사용
  const { handleWriteModalOpen } = useLinkModal();

  // 데이터 바인딩 훅 사용
  const { diaries: rawDiaries } = useDataBinding();
  // TODO: isLoading, error 상태 처리 구현 예정
  // const { diaries: rawDiaries, isLoading, error } = useDataBinding();

  // 날짜에서 YYYY-MM-DD 형식만 추출하는 함수
  const extractDateOnly = (dateString: string): string => {
    // YYYY-MM-DD 형식의 날짜만 추출하는 정규표현식
    const dateMatch = dateString.match(/\d{4}-\d{2}-\d{2}/);
    return dateMatch ? dateMatch[0] : dateString;
  };

  // 실제 데이터를 디스플레이 형식으로 변환
  const diaries: DiaryDisplayData[] = rawDiaries.map((diary) => ({
    id: diary.id,
    date: extractDateOnly(diary.createdAt), // createdAt에서 날짜만 추출
    content: diary.title, // title을 content로 매핑 (기존 구조 유지)
    emotion: diary.emotion,
    image: getEmotionImage(diary.emotion, "m"), // enum 기반 이미지 경로 생성
  }));

  // 필터 옵션 정의
  const filterOptions = [
    { value: "all", label: "전체" },
    { value: "recent", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "title", label: "제목순" },
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
    setSearchQuery("");
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(diaries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDiaries = diaries.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 일기쓰기 버튼 클릭 핸들러
  const handleWriteClick = () => {
    handleWriteModalOpen();
  };

  // 일기 삭제 핸들러
  const handleDeleteDiary = (diaryId: number) => {
    // TODO: 일기 삭제 로직 구현
    console.log("일기 삭제:", diaryId);
  };

  // 일기 카드 클릭 핸들러 (상세 페이지로 이동)
  const handleDiaryCardClick = (diaryId: number) => {
    handleDiaryDetailClick(diaryId);
  };

  return (
    <div className={styles.container} data-testid="diaries-container">
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
          {currentDiaries.map((diary) => (
            <div
              key={diary.id}
              className={styles.diaryCard}
              onClick={() => handleDiaryCardClick(diary.id)}
              data-testid={`diary-card-${diary.id}`}
            >
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
                  handleDeleteDiary(diary.id);
                }}
                aria-label="일기 삭제"
              >
                <img src="/icons/close_outline_light_m.svg" alt="삭제" />
              </button>
              <div className={styles.cardImage}>
                <img 
                  src={diary.image} 
                  alt={getEmotionLabel(diary.emotion)}
                  data-testid="emotion-image"
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <div
                    className={styles.cardEmotion}
                    style={{ color: EMOTION_COLORS[diary.emotion] }}
                    data-testid="emotion-text"
                  >
                    {getEmotionLabel(diary.emotion)}
                  </div>
                  <div className={styles.cardDate} data-testid="date-text">{diary.date}</div>
                </div>
                <div className={styles.cardText} data-testid="title-text">{diary.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.gap3}></div>
      <div className={styles.pagination}>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          variant="secondary"
          size="medium"
          theme="light"
          className={styles.paginationComponent}
        />
      </div>
      <div className={styles.gap4}></div>
    </div>
  );
}
