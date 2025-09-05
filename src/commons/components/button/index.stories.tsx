import type { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonProps } from './index';
import { useState } from 'react';
import Image from 'next/image';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '버튼의 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '버튼의 테마',
    },
    loading: {
      control: { type: 'boolean' },
      description: '로딩 상태',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용',
    },
    children: {
      control: { type: 'text' },
      description: '버튼 텍스트',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive 래퍼 컴포넌트
const InteractiveButton = (args: ButtonProps) => {
  const [loading, setLoading] = useState(args.loading || false);
  
  const handleClick = () => {
    if (args.loading !== undefined) return; // 외부에서 loading을 제어하는 경우
    
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Button
      {...args}
      loading={args.loading !== undefined ? args.loading : loading}
      onClick={handleClick}
    />
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveButton,
  args: {
    children: 'Button',
  },
};

// Variant 스토리들
export const Primary: Story = {
  render: InteractiveButton,
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  render: InteractiveButton,
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Tertiary: Story = {
  render: InteractiveButton,
  args: {
    variant: 'tertiary',
    children: 'Tertiary Button',
  },
};

// Size 스토리들
export const Small: Story = {
  render: InteractiveButton,
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  render: InteractiveButton,
  args: {
    size: 'medium',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  render: InteractiveButton,
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  render: InteractiveButton,
  args: {
    theme: 'light',
    children: 'Light Theme',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  render: InteractiveButton,
  args: {
    theme: 'dark',
    children: 'Dark Theme',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  render: InteractiveButton,
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
};

// 아이콘 스토리들
export const WithLeftIcon: Story = {
  render: InteractiveButton,
  args: {
    children: 'Left Icon Button',
    icon: <Image src="/icons/copy_outline_light_m.svg" alt="복사" width={20} height={20} />,
  },
};

export const WithRightIcon: Story = {
  render: InteractiveButton,
  args: {
    children: 'Right Icon Button',
    icon: <Image src="/icons/rightenable_outline_light_m.svg" alt="다음" width={20} height={20} />,
    iconPosition: 'right',
  },
};

export const WithBothIcons: Story = {
  render: InteractiveButton,
  args: {
    children: 'Both Icons Button',
    icon: <Image src="/icons/copy_outline_light_m.svg" alt="복사" width={20} height={20} />,
  },
};

export const IconOnly: Story = {
  render: InteractiveButton,
  args: {
    icon: <Image src="/icons/plus_outline_light_m.svg" alt="추가" width={20} height={20} />,
    'aria-label': 'Settings',
  },
};

// 복합 스토리들
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <InteractiveButton variant="primary">Primary</InteractiveButton>
      <InteractiveButton variant="secondary">Secondary</InteractiveButton>
      <InteractiveButton variant="tertiary">Tertiary</InteractiveButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <InteractiveButton size="small">Small</InteractiveButton>
      <InteractiveButton size="medium">Medium</InteractiveButton>
      <InteractiveButton size="large">Large</InteractiveButton>
    </div>
  ),
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Light Theme</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <InteractiveButton theme="light" variant="primary">Primary</InteractiveButton>
          <InteractiveButton theme="light" variant="secondary">Secondary</InteractiveButton>
          <InteractiveButton theme="light" variant="tertiary">Tertiary</InteractiveButton>
        </div>
      </div>
      <div style={{ padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: 'white' }}>Dark Theme</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <InteractiveButton theme="dark" variant="primary">Primary</InteractiveButton>
          <InteractiveButton theme="dark" variant="secondary">Secondary</InteractiveButton>
          <InteractiveButton theme="dark" variant="tertiary">Tertiary</InteractiveButton>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// 실제 사용 예시
export const RealWorldExample: Story = {
  render: () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowModal(true);
      }, 2000);
    };

    const handleCancel = () => {
      setShowModal(false);
    };

    return (
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 20px 0' }}>사용자 정보 수정</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="primary"
                size="medium"
                loading={isSubmitting}
                onClick={handleSubmit}
                icon={<Image src="/icons/check_outline_light_xs.svg" alt="저장" width={16} height={16} />}
              >
                {isSubmitting ? '저장 중...' : '저장'}
              </Button>
              
              <Button
                variant="secondary"
                size="medium"
                disabled={isSubmitting}
              >
                취소
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                variant="tertiary"
                size="small"
                icon={<Image src="/icons/copy_outline_light_m.svg" alt="복사" width={16} height={16} />}
              >
                링크 복사
              </Button>
              
              <Button
                variant="tertiary"
                size="small"
                icon={<Image src="/icons/plus_outline_light_m.svg" alt="추가" width={16} height={16} />}
              >
                항목 추가
              </Button>
            </div>
          </div>
        </div>

        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h4 style={{ margin: '0 0 16px 0' }}>저장 완료</h4>
              <p style={{ margin: '0 0 24px 0', color: '#666' }}>
                사용자 정보가 성공적으로 저장되었습니다.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"
                  size="medium"
                  onClick={handleCancel}
                >
                  확인
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};