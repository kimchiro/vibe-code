'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Emotion } from '@/commons/constants/enum';
import { UrlPath, generateDynamicUrl } from '@/commons/constants/url';
import { useModal } from '@/commons/providers/modal/modal.provuder';
import { Modal } from '@/commons/components/modal';

// 일기 데이터 타입 정의
export interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: Emotion;
  createdAt: string;
}

// 폼 데이터 스키마 정의
const diaryFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(1, '내용을 입력해주세요'),
  emotion: z.nativeEnum(Emotion).refine((val) => val !== undefined, {
    message: '감정을 선택해주세요'
  })
});

export type DiaryFormData = z.infer<typeof diaryFormSchema>;

// 로컬스토리지 유틸리티 함수들
const getDiariesFromStorage = (): DiaryData[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem('diaries');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('로컬스토리지에서 일기 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};

const saveDiariesToStorage = (diaries: DiaryData[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('diaries', JSON.stringify(diaries));
  } catch (error) {
    console.error('로컬스토리지에 일기 데이터를 저장하는 중 오류 발생:', error);
  }
};

const getNextId = (diaries: DiaryData[]): number => {
  if (diaries.length === 0) return 1;
  return Math.max(...diaries.map(diary => diary.id)) + 1;
};

// 일기 폼 훅
export const useDiaryForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  const form = useForm<DiaryFormData>({
    resolver: zodResolver(diaryFormSchema),
    defaultValues: {
      title: '',
      content: '',
      emotion: undefined
    }
  });

  const { handleSubmit, formState: { isValid, isSubmitting }, reset, watch } = form;

  // 폼 필드 값들을 감시
  const watchedValues = watch();
  const isFormComplete = watchedValues.title && watchedValues.content && watchedValues.emotion;

  // 일기 등록 함수
  const onSubmit = async (data: DiaryFormData) => {
    try {
      // 기존 일기 데이터 가져오기
      const existingDiaries = getDiariesFromStorage();
      
      // 새 일기 데이터 생성
      const newDiary: DiaryData = {
        id: getNextId(existingDiaries),
        title: data.title,
        content: data.content,
        emotion: data.emotion,
        createdAt: new Date().toISOString()
      };

      // 새 일기를 기존 데이터에 추가
      const updatedDiaries = [...existingDiaries, newDiary];
      
      // 로컬스토리지에 저장
      saveDiariesToStorage(updatedDiaries);

      // 등록완료 모달 표시
      openModal({
        content: (
          <Modal
            variant="info"
            actions="single"
            title="등록 완료"
            description="일기가 성공적으로 등록되었습니다."
            onConfirm={() => {
              // 상세페이지로 이동
              const detailUrl = generateDynamicUrl(UrlPath.DIARY_DETAIL, { id: newDiary.id });
              router.push(detailUrl);
              
              // 모든 모달 닫기
              closeAllModals();
            }}
            confirmText="확인"
          />
        )
      });

      // 폼 초기화
      reset();

    } catch (error) {
      console.error('일기 등록 중 오류 발생:', error);
      
      // 에러 모달 표시
      openModal({
        content: (
          <Modal
            variant="danger"
            actions="single"
            title="등록 실패"
            description="일기 등록 중 오류가 발생했습니다. 다시 시도해주세요."
            onConfirm={() => closeAllModals()}
            confirmText="확인"
          />
        )
      });
    }
  };

  return {
    form,
    onSubmit: handleSubmit(onSubmit),
    isValid,
    isSubmitting,
    isFormComplete: Boolean(isFormComplete),
    reset
  };
};
