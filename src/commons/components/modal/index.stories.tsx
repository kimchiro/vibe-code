import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './index';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'danger'],
      description: '모달의 스타일 변형',
    },
    actions: {
      control: { type: 'select' },
      options: ['single', 'dual'],
      description: '버튼 액션 타입',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '모달의 테마',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '모달의 크기',
    },
    title: {
      control: { type: 'text' },
      description: '모달 제목 (필수)',
    },
    description: {
      control: { type: 'text' },
      description: '모달 설명',
    },
    confirmText: {
      control: { type: 'text' },
      description: '확인 버튼 텍스트',
    },
    cancelText: {
      control: { type: 'text' },
      description: '취소 버튼 텍스트',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    onConfirm: {
      action: 'confirmed',
      description: '확인 버튼 클릭 이벤트',
    },
    onCancel: {
      action: 'cancelled',
      description: '취소 버튼 클릭 이벤트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    title: '확인',
    description: '이 작업을 진행하시겠습니까?',
  },
};

// Variant 스토리들
export const Info: Story = {
  args: {
    variant: 'info',
    title: '정보',
    description: '작업이 완료되었습니다.',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    title: '등록을 취소하시겠습니까?',
    description: '지금까지 작성한 내용이 모두 삭제됩니다.',
  },
};

// Actions 스토리들
export const SingleAction: Story = {
  args: {
    actions: 'single',
    title: '알림',
    description: '메시지가 성공적으로 전송되었습니다.',
  },
};

export const DualAction: Story = {
  args: {
    actions: 'dual',
    title: '삭제 확인',
    description: '정말로 이 항목을 삭제하시겠습니까?',
  },
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    title: '작은 모달',
    description: '작은 크기의 모달입니다.',
    actions: 'dual',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    title: '중간 모달',
    description: '중간 크기의 모달입니다.',
    actions: 'dual',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    title: '큰 모달',
    description: '큰 크기의 모달입니다.',
    actions: 'dual',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    title: '라이트 테마',
    description: '밝은 테마의 모달입니다.',
    actions: 'dual',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    title: '다크 테마',
    description: '어두운 테마의 모달입니다.',
    actions: 'dual',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const WithCustomText: Story = {
  args: {
    title: '커스텀 텍스트',
    description: '사용자 정의 버튼 텍스트를 사용합니다.',
    actions: 'dual',
    confirmText: '진행하기',
    cancelText: '돌아가기',
  },
};

export const TitleOnly: Story = {
  args: {
    title: '제목만 있는 모달',
    actions: 'single',
  },
};

export const Disabled: Story = {
  args: {
    title: '비활성화 모달',
    description: '모든 버튼이 비활성화되었습니다.',
    actions: 'dual',
    disabled: true,
  },
};

// 복합 스토리들 - 개별 스토리로 분리
export const InfoVariant: Story = {
  args: {
    variant: 'info',
    title: '정보 모달',
    description: '정보 변형 모달입니다.',
    actions: 'single',
  },
};

export const DangerVariant: Story = {
  args: {
    variant: 'danger',
    title: '위험 모달',
    description: '위험 변형 모달입니다.',
    actions: 'dual',
  },
};

// 사이즈별 개별 스토리
export const SmallSize: Story = {
  args: {
    size: 'small',
    title: 'Small Modal',
    description: '작은 크기의 모달입니다.',
    actions: 'dual',
  },
};

export const MediumSize: Story = {
  args: {
    size: 'medium',
    title: 'Medium Modal',
    description: '중간 크기의 모달입니다.',
    actions: 'dual',
  },
};

export const LargeSize: Story = {
  args: {
    size: 'large',
    title: 'Large Modal',
    description: '큰 크기의 모달입니다.',
    actions: 'dual',
  },
};

// 액션별 개별 스토리
export const SingleActionButton: Story = {
  args: {
    actions: 'single',
    title: 'Single Action',
    description: '하나의 버튼만 표시됩니다.',
  },
};

export const DualActionButtons: Story = {
  args: {
    actions: 'dual',
    title: 'Dual Action',
    description: '두 개의 버튼이 표시됩니다.',
  },
};

// 테마별 개별 스토리 (이미 위에 LightTheme, DarkTheme이 있으므로 제거)

// 실제 사용 예시들
export const SaveComplete: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    title: '저장 완료',
    description: '변경사항이 성공적으로 저장되었습니다.',
  },
};

export const SaveConfirmation: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    title: '변경사항 저장',
    description: '페이지를 떠나기 전에 변경사항을 저장하시겠습니까?',
    confirmText: '저장',
    cancelText: '저장 안함',
  },
};

export const AccountDeletion: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    title: '계정 삭제',
    description: '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    confirmText: '삭제',
    cancelText: '취소',
  },
};

export const CancelWriting: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    title: '등록을 취소하시겠습니까?',
    description: '지금까지 작성한 내용이 모두 삭제됩니다.',
    size: 'large',
  },
};

// 반응형 테스트
export const ResponsiveTest: Story = {
  args: {
    title: '반응형 모달',
    description: '화면 크기에 따라 모달의 크기가 조정됩니다.',
    actions: 'dual',
    size: 'medium',
  },
  parameters: {
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
      },
      defaultViewport: 'mobile',
    },
  },
};

// 이벤트 핸들링 예시
export const WithEventHandlers: Story = {
  args: {
    title: '이벤트 핸들링',
    description: '버튼을 클릭하면 이벤트가 발생합니다.',
    actions: 'dual',
    onConfirm: () => {
      alert('확인 버튼이 클릭되었습니다!');
    },
    onCancel: () => {
      alert('취소 버튼이 클릭되었습니다!');
    },
  },
};
