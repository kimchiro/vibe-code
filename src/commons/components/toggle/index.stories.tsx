import type { Meta, StoryObj } from '@storybook/react';
import { Toggle, ToggleProps } from './index';
import { useState } from 'react';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '토글의 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '토글의 크기',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '토글의 테마',
    },
    checked: {
      control: { type: 'boolean' },
      description: '토글 상태 (켜짐/꺼짐)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    label: {
      control: { type: 'text' },
      description: '토글 레이블',
    },
    description: {
      control: { type: 'text' },
      description: '토글 설명 텍스트',
    },
    onChange: {
      action: 'changed',
      description: '토글 상태 변경 시 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive 래퍼 컴포넌트
const InteractiveToggle = (args: ToggleProps) => {
  const [checked, setChecked] = useState(args.checked || false);
  
  const handleChange = (newChecked: boolean) => {
    setChecked(newChecked);
    args.onChange?.(newChecked);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Toggle
        {...args}
        checked={checked}
        onChange={handleChange}
      />
      <div style={{ 
        marginTop: '15px', 
        fontSize: '14px', 
        color: '#666',
        textAlign: 'center'
      }}>
        상태: <strong>{checked ? 'ON' : 'OFF'}</strong>
      </div>
    </div>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveToggle,
  args: {},
};

// Variant 스토리들
export const Primary: Story = {
  render: InteractiveToggle,
  args: {
    variant: 'primary',
    label: 'Primary 토글',
  },
};

export const Secondary: Story = {
  render: InteractiveToggle,
  args: {
    variant: 'secondary',
    label: 'Secondary 토글',
  },
};

export const Tertiary: Story = {
  render: InteractiveToggle,
  args: {
    variant: 'tertiary',
    label: 'Tertiary 토글',
  },
};

// Size 스토리들
export const Small: Story = {
  render: InteractiveToggle,
  args: {
    size: 'small',
    label: '작은 토글',
  },
};

export const Medium: Story = {
  render: InteractiveToggle,
  args: {
    size: 'medium',
    label: '중간 토글',
  },
};

export const Large: Story = {
  render: InteractiveToggle,
  args: {
    size: 'large',
    label: '큰 토글',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  render: InteractiveToggle,
  args: {
    theme: 'light',
    label: '라이트 테마 토글',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  render: InteractiveToggle,
  args: {
    theme: 'dark',
    label: '다크 테마 토글',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const Checked: Story = {
  render: InteractiveToggle,
  args: {
    checked: true,
    label: '켜진 상태 토글',
  },
};

export const Unchecked: Story = {
  render: InteractiveToggle,
  args: {
    checked: false,
    label: '꺼진 상태 토글',
  },
};

export const Disabled: Story = {
  render: InteractiveToggle,
  args: {
    disabled: true,
    label: '비활성화된 토글',
  },
};

export const DisabledChecked: Story = {
  render: InteractiveToggle,
  args: {
    disabled: true,
    checked: true,
    label: '비활성화된 켜진 토글',
  },
};

// 레이블과 설명 스토리들
export const WithLabel: Story = {
  render: InteractiveToggle,
  args: {
    label: '알림 받기',
  },
};

export const WithDescription: Story = {
  render: InteractiveToggle,
  args: {
    label: '이메일 알림',
    description: '새로운 메시지가 도착하면 이메일로 알림을 받습니다.',
  },
};

export const WithLongDescription: Story = {
  render: InteractiveToggle,
  args: {
    label: '자동 저장',
    description: '작업 중인 내용을 자동으로 저장합니다. 이 기능을 활성화하면 5분마다 자동으로 저장되며, 브라우저가 예기치 않게 종료되어도 작업 내용을 복구할 수 있습니다.',
  },
};

export const WithoutLabel: Story = {
  render: InteractiveToggle,
  args: {
    description: '레이블 없이 설명만 있는 토글',
  },
};

// 복합 스토리들
export const AllVariants: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      padding: '20px',
      width: '300px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Primary</h3>
        <InteractiveToggle
          variant="primary"
          label="Primary 토글"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Secondary</h3>
        <InteractiveToggle
          variant="secondary"
          label="Secondary 토글"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Tertiary</h3>
        <InteractiveToggle
          variant="tertiary"
          label="Tertiary 토글"
          onChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      padding: '20px',
      width: '300px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Small</h3>
        <InteractiveToggle
          size="small"
          label="작은 토글"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Medium</h3>
        <InteractiveToggle
          size="medium"
          label="중간 토글"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Large</h3>
        <InteractiveToggle
          size="large"
          label="큰 토글"
          onChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllThemes: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '30px',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '30px', 
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Light Theme</h3>
        <InteractiveToggle
          theme="light"
          label="라이트 테마 토글"
          description="밝은 테마에서의 토글 모습입니다."
          onChange={() => {}}
        />
      </div>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '30px', 
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <InteractiveToggle
          theme="dark"
          label="다크 테마 토글"
          description="어두운 테마에서의 토글 모습입니다."
          onChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      padding: '20px',
      width: '350px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Normal (Off)</h3>
        <InteractiveToggle
          checked={false}
          label="일반 상태 (꺼짐)"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Normal (On)</h3>
        <InteractiveToggle
          checked={true}
          label="일반 상태 (켜짐)"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Disabled (Off)</h3>
        <Toggle
          disabled
          checked={false}
          label="비활성화 상태 (꺼짐)"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Disabled (On)</h3>
        <Toggle
          disabled
          checked={true}
          label="비활성화 상태 (켜짐)"
          onChange={() => {}}
        />
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
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [autoSave, setAutoSave] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [marketing, setMarketing] = useState(false);

    return (
      <div style={{ 
        padding: '40px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
            설정
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px'
          }}>
            <Toggle
              checked={notifications}
              onChange={setNotifications}
              label="알림 받기"
              description="새로운 메시지나 업데이트가 있을 때 알림을 받습니다."
              variant="primary"
              size="medium"
            />

            <Toggle
              checked={darkMode}
              onChange={setDarkMode}
              label="다크 모드"
              description="어두운 테마를 사용합니다. 눈의 피로를 줄이고 배터리를 절약할 수 있습니다."
              variant="secondary"
              size="medium"
            />

            <Toggle
              checked={autoSave}
              onChange={setAutoSave}
              label="자동 저장"
              description="작업 중인 내용을 5분마다 자동으로 저장합니다."
              variant="tertiary"
              size="medium"
            />

            <Toggle
              checked={analytics}
              onChange={setAnalytics}
              label="사용 통계 수집"
              description="서비스 개선을 위해 익명화된 사용 통계를 수집합니다."
              variant="primary"
              size="medium"
            />

            <Toggle
              checked={marketing}
              onChange={setMarketing}
              label="마케팅 정보 수신"
              description="새로운 기능이나 이벤트 정보를 이메일로 받습니다."
              variant="secondary"
              size="medium"
            />
          </div>

          {/* 설정 요약 */}
          <div style={{ 
            marginTop: '30px',
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>
              현재 설정
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>알림:</strong> {notifications ? '켜짐' : '꺼짐'}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>다크 모드:</strong> {darkMode ? '켜짐' : '꺼짐'}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>자동 저장:</strong> {autoSave ? '켜짐' : '꺼짐'}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>사용 통계:</strong> {analytics ? '수집함' : '수집 안함'}
              </p>
              <p style={{ margin: '0' }}>
                <strong>마케팅 정보:</strong> {marketing ? '수신함' : '수신 안함'}
              </p>
            </div>
          </div>
        </div>

        {/* 다양한 크기와 스타일 비교 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textAlign: 'center' }}>Small Size</h4>
            <Toggle
              size="small"
              label="작은 토글"
              variant="primary"
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textAlign: 'center' }}>Medium Size</h4>
            <Toggle
              size="medium"
              label="중간 토글"
              variant="secondary"
            />
          </div>

          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', textAlign: 'center' }}>Large Size</h4>
            <Toggle
              size="large"
              label="큰 토글"
              variant="tertiary"
            />
          </div>

          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'white', textAlign: 'center' }}>Dark Theme</h4>
            <Toggle
              theme="dark"
              label="다크 테마"
              variant="primary"
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};
