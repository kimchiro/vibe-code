import { useState, useEffect } from 'react';
import { Emotion } from '@/commons/constants/enum';

/**
 * 일기 데이터 타입 정의
 */
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

/**
 * 데이터 바인딩 훅의 반환 타입
 */
export interface UseDataBindingReturn {
  diaries: DiaryData[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * 로컬스토리지에서 일기 데이터를 가져오는 데이터 바인딩 훅
 * 
 * @returns {UseDataBindingReturn} 일기 데이터, 로딩 상태, 에러 상태, 재조회 함수
 */
export function useDataBinding(): UseDataBindingReturn {
  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 로컬스토리지에서 일기 데이터를 로드하는 함수
   */
  const loadDiaries = () => {
    try {
      setIsLoading(true);
      setError(null);

      // 로컬스토리지에서 diaries 키로 데이터 조회
      const storedData = localStorage.getItem('diaries');
      
      if (!storedData) {
        // 데이터가 없으면 빈 배열 설정
        setDiaries([]);
        return;
      }

      // JSON 파싱 시도
      const parsedData = JSON.parse(storedData);
      
      // 배열인지 확인
      if (!Array.isArray(parsedData)) {
        throw new Error('저장된 데이터가 배열 형식이 아닙니다.');
      }

      // 데이터 유효성 검사 및 타입 변환
      const validDiaries: DiaryData[] = parsedData
        .filter((item: any) => {
          // 필수 필드 존재 여부 확인
          return (
            item &&
            typeof item.id === 'number' &&
            typeof item.title === 'string' &&
            typeof item.content === 'string' &&
            typeof item.emotion === 'string' &&
            typeof item.createdAt === 'string' &&
            Object.values(Emotion).includes(item.emotion as Emotion)
          );
        })
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          content: item.content,
          emotion: item.emotion as Emotion,
          createdAt: item.createdAt
        }));

      setDiaries(validDiaries);
      
    } catch (err) {
      console.error('일기 데이터 로드 중 오류 발생:', err);
      setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
      setDiaries([]); // 오류 발생 시 빈 배열로 설정
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 데이터 재조회 함수
   */
  const refetch = () => {
    loadDiaries();
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadDiaries();
  }, []);

  // 로컬스토리지 변경 감지 (다른 탭에서 데이터 변경 시)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'diaries') {
        loadDiaries();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    diaries,
    isLoading,
    error,
    refetch
  };
}