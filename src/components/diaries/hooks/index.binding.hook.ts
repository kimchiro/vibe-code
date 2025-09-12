import { useState, useEffect } from 'react';
import { Emotion } from '@/commons/constants/enum';

// 일기 데이터 타입 정의 (요구사항에 따른 구조)
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

// 데이터 바인딩 훅의 반환 타입
export interface UseDataBindingReturn {
  diaries: DiaryData[];
  isLoading: boolean;
  error: string | null;
  refreshDiaries: () => void;
}

/**
 * 로컬스토리지에서 일기 데이터를 바인딩하는 훅
 * 요구사항에 따라 실제 데이터를 로드하고 관리
 */
export function useDataBinding(): UseDataBindingReturn {
  const [diaries, setDiaries] = useState<DiaryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로컬스토리지에서 일기 데이터 로드
  const loadDiaries = () => {
    try {
      setIsLoading(true);
      setError(null);

      const storedDiaries = localStorage.getItem('diaries');

      if (!storedDiaries) {
        // 로컬스토리지에 데이터가 없는 경우
        setDiaries([]);
        return;
      }

      const parsedDiaries = JSON.parse(storedDiaries);

      // 데이터 유효성 검사
      if (!Array.isArray(parsedDiaries)) {
        throw new Error('일기 데이터 형식이 올바르지 않습니다.');
      }

      // 각 일기 객체의 필수 필드 검사
      const validDiaries = parsedDiaries.filter((diary: any) => {
        return (
          typeof diary.id === 'number' &&
          typeof diary.title === 'string' &&
          typeof diary.content === 'string' &&
          typeof diary.emotion === 'string' &&
          typeof diary.createdAt === 'string' &&
          Object.values(Emotion).includes(diary.emotion as Emotion)
        );
      });

      setDiaries(validDiaries);
    } catch (err) {
      console.error('일기 데이터 로드 중 오류:', err);
      setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
      setDiaries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 일기 데이터 새로고침
  const refreshDiaries = () => {
    loadDiaries();
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadDiaries();
  }, []);

  // 로컬스토리지 변경 감지 (다른 탭에서 변경된 경우)
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
    refreshDiaries,
  };
}
