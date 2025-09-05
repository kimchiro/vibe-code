import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalProps } from './index';
import { useState } from 'react';

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
      description: '모달의 액션 버튼 개수',
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
      description: '모달의 제목',
    },
    description: {
      control: { type: 'text' },
      description: '모달의 설명 텍스트',
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive 래퍼 컴포넌트
const InteractiveModal = (args: ModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const handleConfirm = () => {
    console.log('확인 버튼 클릭됨');
    args.onConfirm?.();
  };

  const handleCancel = () => {
    console.log('취소 버튼 클릭됨');
    args.onCancel?.();
  };

  if (!isOpen) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          모달 다시 열기
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <Modal
        {...args}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveModal,
  args: {
    title: '기본 모달',
    description: '이것은 기본 모달입니다.',
  },
};

// Variant 스토리들
export const InfoModal: Story = {
  render: InteractiveModal,
  args: {
    variant: 'info',
    title: '정보 모달',
    description: '중요한 정보를 알려드립니다.',
  },
};

export const DangerModal: Story = {
  render: InteractiveModal,
  args: {
    variant: 'danger',
    title: '위험 모달',
    description: '이 작업은 되돌릴 수 없습니다. 정말 진행하시겠습니까?',
  },
};

// Actions 스토리들
export const SingleAction: Story = {
  render: InteractiveModal,
  args: {
    actions: 'single',
    title: '단일 액션 모달',
    description: '확인 버튼만 있는 모달입니다.',
  },
};

export const DualAction: Story = {
  render: InteractiveModal,
  args: {
    actions: 'dual',
    title: '이중 액션 모달',
    description: '확인과 취소 버튼이 모두 있는 모달입니다.',
  },
};

// Size 스토리들
export const SmallModal: Story = {
  render: InteractiveModal,
  args: {
    size: 'small',
    title: '작은 모달',
    description: '작은 크기의 모달입니다.',
  },
};

export const MediumModal: Story = {
  render: InteractiveModal,
  args: {
    size: 'medium',
    title: '중간 모달',
    description: '중간 크기의 모달입니다.',
  },
};

export const LargeModal: Story = {
  render: InteractiveModal,
  args: {
    size: 'large',
    title: '큰 모달',
    description: '큰 크기의 모달입니다. 더 많은 내용을 담을 수 있습니다.',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  render: InteractiveModal,
  args: {
    theme: 'light',
    title: '라이트 테마 모달',
    description: '밝은 테마의 모달입니다.',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  render: InteractiveModal,
  args: {
    theme: 'dark',
    title: '다크 테마 모달',
    description: '어두운 테마의 모달입니다.',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const DisabledModal: Story = {
  render: InteractiveModal,
  args: {
    disabled: true,
    title: '비활성화된 모달',
    description: '버튼이 비활성화된 모달입니다.',
  },
};

// 커스텀 텍스트 스토리들
export const CustomTexts: Story = {
  render: InteractiveModal,
  args: {
    actions: 'dual',
    title: '커스텀 텍스트 모달',
    description: '버튼 텍스트를 커스터마이징할 수 있습니다.',
    confirmText: '저장하기',
    cancelText: '나중에',
  },
};

// 설명 없는 모달
export const NoDescription: Story = {
  render: InteractiveModal,
  args: {
    title: '제목만 있는 모달',
  },
};

// 복합 스토리들
export const AllVariants: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          variant="info"
          title="정보 모달"
          description="정보를 전달하는 모달입니다."
        />
      </div>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          variant="danger"
          title="위험 모달"
          description="주의가 필요한 작업입니다."
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          size="small"
          title="작은 모달"
          description="작은 크기"
        />
      </div>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          size="medium"
          title="중간 모달"
          description="중간 크기"
        />
      </div>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          size="large"
          title="큰 모달"
          description="큰 크기"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const AllActions: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          actions="single"
          title="단일 액션"
          description="확인 버튼만 있습니다."
        />
      </div>
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          actions="dual"
          title="이중 액션"
          description="확인과 취소 버튼이 있습니다."
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
      gap: '20px',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        border: '1px solid #e0e0e0'
      }}>
        <Modal
          theme="light"
          title="라이트 테마"
          description="밝은 테마의 모달입니다."
        />
      </div>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        <Modal
          theme="dark"
          title="다크 테마"
          description="어두운 테마의 모달입니다."
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// 실제 사용 예시
export const RealWorldExample: Story = {
  render: () => {
    const [currentModal, setCurrentModal] = useState<string | null>(null);

    const modals = [
      {
        id: 'save',
        variant: 'info' as const,
        actions: 'dual' as const,
        title: '변경사항 저장',
        description: '작성하신 내용을 저장하시겠습니까?',
        confirmText: '저장',
        cancelText: '취소'
      },
      {
        id: 'delete',
        variant: 'danger' as const,
        actions: 'dual' as const,
        title: '항목 삭제',
        description: '이 항목을 삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?',
        confirmText: '삭제',
        cancelText: '취소'
      },
      {
        id: 'success',
        variant: 'info' as const,
        actions: 'single' as const,
        title: '작업 완료',
        description: '요청하신 작업이 성공적으로 완료되었습니다.',
        confirmText: '확인'
      }
    ];

    return (
      <div style={{ 
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
          실제 사용 예시
        </h3>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setCurrentModal('save')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            저장 모달 열기
          </button>
          <button 
            onClick={() => setCurrentModal('delete')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            삭제 모달 열기
          </button>
          <button 
            onClick={() => setCurrentModal('success')}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            성공 모달 열기
          </button>
        </div>

        {currentModal && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <Modal
              {...modals.find(m => m.id === currentModal)!}
              onConfirm={() => {
                console.log(`${currentModal} 확인됨`);
                setCurrentModal(null);
              }}
              onCancel={() => {
                console.log(`${currentModal} 취소됨`);
                setCurrentModal(null);
              }}
            />
          </div>
        )}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
