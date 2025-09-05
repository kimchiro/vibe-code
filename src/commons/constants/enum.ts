// Emotion Enum System
// 감정 관련 enum 및 관련 데이터 정의

import { baseColors } from './color';

/**
 * 감정 타입 enum
 * 프로젝트에서 사용되는 모든 감정 상태를 정의
 */
export enum Emotion {
  HAPPY = 'HAPPY',
  SAD = 'SAD',
  ANGRY = 'ANGRY',
  SURPRISE = 'SURPRISE',
  ETC = 'ETC'
}

/**
 * 이미지 크기 타입
 */
export type ImageSize = 'm' | 's';

/**
 * 감정별 이미지 정보 인터페이스
 */
export interface EmotionImages {
  medium: string;
  small: string;
}

/**
 * 감정 데이터 인터페이스
 */
export interface EmotionData {
  label: string;
  images: EmotionImages;
  color: string;
}

/**
 * 감정별 표시 텍스트 매핑
 */
export const EMOTION_LABELS: Record<Emotion, string> = {
  [Emotion.HAPPY]: '행복해요',
  [Emotion.SAD]: '슬퍼요',
  [Emotion.ANGRY]: '화나요',
  [Emotion.SURPRISE]: '놀랐어요',
  [Emotion.ETC]: '기타'
} as const;

/**
 * 감정별 이미지 매핑
 */
export const EMOTION_IMAGES: Record<Emotion, EmotionImages> = {
  [Emotion.HAPPY]: {
    medium: '/icons/emotion-happy-m.svg',
    small: '/icons/emotion-happy-s.svg'
  },
  [Emotion.SAD]: {
    medium: '/icons/emotion-sad-m.svg',
    small: '/icons/emotion-sad-s.svg'
  },
  [Emotion.ANGRY]: {
    medium: '/icons/emotion-angry-m.svg',
    small: '/icons/emotion-angry-s.svg'
  },
  [Emotion.SURPRISE]: {
    medium: '/icons/emotion-surprise-m.svg',
    small: '/icons/emotion-surprise-s.svg'
  },
  [Emotion.ETC]: {
    medium: '/icons/emotion-etc-m.svg',
    small: '/icons/emotion-etc-s.svg'
  }
} as const;

/**
 * 감정별 색상 매핑 (600 레벨 사용)
 */
export const EMOTION_COLORS: Record<Emotion, string> = {
  [Emotion.HAPPY]: baseColors.error[600],    // red60 - #dc2626
  [Emotion.SAD]: baseColors.primary[600],    // blue60 - #0284c7
  [Emotion.ANGRY]: baseColors.neutral[600],  // gray60 - #525252
  [Emotion.SURPRISE]: baseColors.warning[600], // yellow60 - #d97706
  [Emotion.ETC]: baseColors.success[600]     // green60 - #A229ED
} as const;

/**
 * 전체 감정 데이터 매핑
 */
export const EMOTION_DATA: Record<Emotion, EmotionData> = {
  [Emotion.HAPPY]: {
    label: EMOTION_LABELS[Emotion.HAPPY],
    images: EMOTION_IMAGES[Emotion.HAPPY],
    color: EMOTION_COLORS[Emotion.HAPPY]
  },
  [Emotion.SAD]: {
    label: EMOTION_LABELS[Emotion.SAD],
    images: EMOTION_IMAGES[Emotion.SAD],
    color: EMOTION_COLORS[Emotion.SAD]
  },
  [Emotion.ANGRY]: {
    label: EMOTION_LABELS[Emotion.ANGRY],
    images: EMOTION_IMAGES[Emotion.ANGRY],
    color: EMOTION_COLORS[Emotion.ANGRY]
  },
  [Emotion.SURPRISE]: {
    label: EMOTION_LABELS[Emotion.SURPRISE],
    images: EMOTION_IMAGES[Emotion.SURPRISE],
    color: EMOTION_COLORS[Emotion.SURPRISE]
  },
  [Emotion.ETC]: {
    label: EMOTION_LABELS[Emotion.ETC],
    images: EMOTION_IMAGES[Emotion.ETC],
    color: EMOTION_COLORS[Emotion.ETC]
  }
} as const;

// ===== 유틸리티 함수들 =====

/**
 * 감정 enum 값으로 라벨 텍스트 가져오기
 * @param emotion 감정 enum 값
 * @returns 해당 감정의 한글 라벨
 */
export function getEmotionLabel(emotion: Emotion): string {
  return EMOTION_LABELS[emotion];
}

/**
 * 감정 enum 값으로 이미지 경로 가져오기
 * @param emotion 감정 enum 값
 * @param size 이미지 크기 ('m' | 's')
 * @returns 해당 감정과 크기의 이미지 경로
 */
export function getEmotionImage(emotion: Emotion, size: ImageSize): string {
  const images = EMOTION_IMAGES[emotion];
  return size === 'm' ? images.medium : images.small;
}

/**
 * 감정 enum 값으로 색상 가져오기
 * @param emotion 감정 enum 값
 * @returns 해당 감정의 색상 hex 값
 */
export function getEmotionColor(emotion: Emotion): string {
  return EMOTION_COLORS[emotion];
}

/**
 * 감정 enum 값으로 전체 데이터 가져오기
 * @param emotion 감정 enum 값
 * @returns 해당 감정의 전체 데이터 (라벨, 이미지, 색상)
 */
export function getEmotionData(emotion: Emotion): EmotionData {
  return EMOTION_DATA[emotion];
}

/**
 * 모든 감정 enum 값 배열 반환
 * @returns 모든 감정 enum 값들의 배열
 */
export function getAllEmotions(): Emotion[] {
  return Object.values(Emotion);
}

/**
 * 모든 감정 데이터 배열 반환
 * @returns 모든 감정의 데이터 배열 (enum 값과 데이터 포함)
 */
export function getAllEmotionData(): Array<{ emotion: Emotion; data: EmotionData }> {
  return getAllEmotions().map(emotion => ({
    emotion,
    data: getEmotionData(emotion)
  }));
}

/**
 * 문자열로부터 감정 enum 값 파싱
 * @param value 파싱할 문자열
 * @returns 유효한 감정 enum 값 또는 null
 */
export function parseEmotion(value: string): Emotion | null {
  const upperValue = value.toUpperCase();
  if (Object.values(Emotion).includes(upperValue as Emotion)) {
    return upperValue as Emotion;
  }
  return null;
}

/**
 * 감정 enum 값 유효성 검사
 * @param value 검사할 값
 * @returns 유효한 감정 enum 값인지 여부
 */
export function isValidEmotion(value: unknown): value is Emotion {
  return typeof value === 'string' && Object.values(Emotion).includes(value as Emotion);
}

/**
 * 라벨 텍스트로부터 감정 enum 값 찾기
 * @param label 찾을 라벨 텍스트
 * @returns 해당하는 감정 enum 값 또는 null
 */
export function findEmotionByLabel(label: string): Emotion | null {
  for (const [emotion, emotionLabel] of Object.entries(EMOTION_LABELS)) {
    if (emotionLabel === label) {
      return emotion as Emotion;
    }
  }
  return null;
}

// ===== 타입 가드 함수들 =====

/**
 * ImageSize 타입 가드
 * @param size 검사할 값
 * @returns ImageSize 타입인지 여부
 */
export function isValidImageSize(size: unknown): size is ImageSize {
  return size === 'm' || size === 's';
}

// ===== 개발자 도구 =====

/**
 * 감정 enum 시스템 디버깅 정보 출력
 */
export function debugEmotionSystem(): void {
  console.group('😊 Emotion System Debug');
  
  console.log('📊 Available Emotions:', getAllEmotions());
  
  console.group('🏷️ Emotion Labels');
  Object.entries(EMOTION_LABELS).forEach(([emotion, label]) => {
    console.log(`${emotion}: ${label}`);
  });
  console.groupEnd();
  
  console.group('🎨 Emotion Colors');
  Object.entries(EMOTION_COLORS).forEach(([emotion, color]) => {
    console.log(`${emotion}: ${color}`);
  });
  console.groupEnd();
  
  console.group('🖼️ Emotion Images');
  Object.entries(EMOTION_IMAGES).forEach(([emotion, images]) => {
    console.log(`${emotion}:`, images);
  });
  console.groupEnd();
  
  console.groupEnd();
}

// ===== 사용 예제 =====

/**
 * 감정 시스템 사용 예제
 */
export const EMOTION_EXAMPLES = {
  // 기본 사용법
  basic: {
    emotion: Emotion.HAPPY,
    label: getEmotionLabel(Emotion.HAPPY),
    color: getEmotionColor(Emotion.HAPPY),
    mediumImage: getEmotionImage(Emotion.HAPPY, 'm'),
    smallImage: getEmotionImage(Emotion.HAPPY, 's')
  },
  
  // 전체 데이터 사용
  fullData: getEmotionData(Emotion.SAD),
  
  // 모든 감정 나열
  allEmotions: getAllEmotionData(),
  
  // 파싱 및 검증
  parsing: {
    valid: parseEmotion('HAPPY'),
    invalid: parseEmotion('INVALID'),
    validation: isValidEmotion('ANGRY')
  }
} as const;

// 기본 export
const emotionSystem = {
  Emotion,
  EMOTION_LABELS,
  EMOTION_IMAGES,
  EMOTION_COLORS,
  EMOTION_DATA,
  getEmotionLabel,
  getEmotionImage,
  getEmotionColor,
  getEmotionData,
  getAllEmotions,
  getAllEmotionData,
  parseEmotion,
  isValidEmotion,
  findEmotionByLabel,
  isValidImageSize,
  debugEmotionSystem
};

export default emotionSystem;
