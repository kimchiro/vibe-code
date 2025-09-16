import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Emotion, isValidEmotion } from '@/commons/constants/enum';

// 일기 데이터 인터페이스
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

// 훅 반환 타입
export interface UseDiaryBindingReturn {
  diary: DiaryData | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 일기 상세 데이터 바인딩 훅
 * 다이나믹 라우팅된 [id]를 추출하여 로컬스토리지에서 해당 일기 데이터를 가져옵니다.
 */
export const useDiaryBinding = (): UseDiaryBindingReturn => {
  const params = useParams();
  const [diary, setDiary] = useState<DiaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDiaryData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // URL 파라미터에서 ID 추출
        const diaryId = params?.id;
        if (!diaryId) {
          setError('일기 ID가 없습니다.');
          setDiary(null);
          setIsLoading(false);
          return;
        }

        // ID를 숫자로 변환
        const numericId = parseInt(diaryId as string, 10);
        if (isNaN(numericId)) {
          setError('유효하지 않은 일기 ID입니다.');
          setDiary(null);
          setIsLoading(false);
          return;
        }

        // 로컬스토리지에서 일기 데이터 가져오기
        const diariesData = localStorage.getItem('diaries');
        if (!diariesData) {
          setError('저장된 일기가 없습니다.');
          setDiary(null);
          setIsLoading(false);
          return;
        }

        // JSON 파싱
        let diaries: unknown[];
        try {
          diaries = JSON.parse(diariesData);
        } catch {
          setError('일기 데이터를 읽을 수 없습니다.');
          setDiary(null);
          setIsLoading(false);
          return;
        }

        // 배열 검증
        if (!Array.isArray(diaries)) {
          setError('일기 데이터 형식이 올바르지 않습니다.');
          setDiary(null);
          setIsLoading(false);
          return;
        }

        // ID와 일치하는 일기 찾기
        const targetDiary = diaries.find((diary: unknown) => {
          return diary && typeof diary === 'object' && (diary as Record<string, unknown>).id === numericId;
        }) as Record<string, unknown> | undefined;
        if (!targetDiary) {
          setError(`ID ${numericId}에 해당하는 일기를 찾을 수 없습니다.`);
          setDiary(null);
          setIsLoading(false);
          return;
        }

        // 데이터 유효성 검증 및 변환
        const validatedDiary: DiaryData = {
          id: targetDiary.id as number,
          title: (targetDiary.title as string) || '',
          content: (targetDiary.content as string) || '',
          emotion: isValidEmotion(targetDiary.emotion as string) ? (targetDiary.emotion as Emotion) : Emotion.ETC,
          createdAt: (targetDiary.createdAt as string) || ''
        };

        setDiary(validatedDiary);
        setError(null);
      } catch (err) {
        console.error('일기 데이터 로드 중 오류:', err);
        setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
        setDiary(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadDiaryData();
  }, [params?.id]);

  return {
    diary,
    isLoading,
    error
  };
};

export default useDiaryBinding;
