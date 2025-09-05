import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';
import React from 'react';

import Image from 'next/image';

// 아이콘 컴포넌트들 (public/icons 사용)
const SearchIcon = () => (
  <Image
    src="/icons/search_outline_light_m.svg"
    alt="검색"
    width={20}
    height={20}
  />
);

const ClearIcon = () => (
  <Image
    src="/icons/close_outline_light_s.svg"
    alt="지우기"
    width={20}
    height={20}
  />
);

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '다양한 variant, size, theme을 지원하는 재사용 가능한 Input 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Input의 스타일 변형을 설정합니다.',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Input의 크기를 설정합니다.',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'Input의 테마를 설정합니다.',
    },
    error: {
      control: { type: 'boolean' },
      description: '에러 상태를 표시합니다.',
    },
    success: {
      control: { type: 'boolean' },
      description: '성공 상태를 표시합니다.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Input을 비활성화합니다.',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비를 사용합니다.',
    },
    label: {
      control: { type: 'text' },
      description: 'Input의 라벨을 설정합니다.',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Input의 placeholder를 설정합니다.',
    },
    helperText: {
      control: { type: 'text' },
      description: '도움말 텍스트를 설정합니다.',
    },
    errorText: {
      control: { type: 'text' },
      description: '에러 메시지를 설정합니다.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

// Variant 스토리들
export const Primary: Story = {
  args: {
    variant: 'primary',
    placeholder: 'Primary variant',
    label: 'Primary Input',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    placeholder: 'Secondary variant',
    label: 'Secondary Input',
  },
};

export const Tertiary: Story = {
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary variant',
    label: 'Tertiary Input',
  },
};

// Size 스토리들
export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small size',
    label: 'Small Input',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium size',
    label: 'Medium Input',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large size',
    label: 'Large Input',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: 'Light theme',
    label: 'Light Theme Input',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Dark theme',
    label: 'Dark Theme Input',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const WithError: Story = {
  args: {
    error: true,
    errorText: '올바른 이메일 주소를 입력해주세요.',
    placeholder: '이메일을 입력하세요',
    label: 'Email',
    value: 'invalid-email',
  },
};

export const WithSuccess: Story = {
  args: {
    success: true,
    helperText: '사용 가능한 이메일입니다.',
    placeholder: '이메일을 입력하세요',
    label: 'Email',
    value: 'user@example.com',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: '비활성화된 입력',
    label: 'Disabled Input',
    value: '수정할 수 없습니다',
  },
};

// 아이콘이 있는 스토리들
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <SearchIcon />,
    placeholder: '검색어를 입력하세요',
    label: 'Search',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ClearIcon />,
    placeholder: '텍스트를 입력하세요',
    label: 'Input with Clear',
    onRightIconClick: () => alert('Clear clicked!'),
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <SearchIcon />,
    rightIcon: <ClearIcon />,
    placeholder: '검색어를 입력하세요',
    label: 'Search with Clear',
    onRightIconClick: () => alert('Clear clicked!'),
  },
};

// 전체 너비 스토리
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    placeholder: '전체 너비 입력',
    label: 'Full Width Input',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

// 모든 조합 스토리
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <h3>Primary Variants</h3>
      <Input variant="primary" size="small" placeholder="Primary Small" label="Primary Small" />
      <Input variant="primary" size="medium" placeholder="Primary Medium" label="Primary Medium" />
      <Input variant="primary" size="large" placeholder="Primary Large" label="Primary Large" />
      
      <h3>Secondary Variants</h3>
      <Input variant="secondary" size="small" placeholder="Secondary Small" label="Secondary Small" />
      <Input variant="secondary" size="medium" placeholder="Secondary Medium" label="Secondary Medium" />
      <Input variant="secondary" size="large" placeholder="Secondary Large" label="Secondary Large" />
      
      <h3>Tertiary Variants</h3>
      <Input variant="tertiary" size="small" placeholder="Tertiary Small" label="Tertiary Small" />
      <Input variant="tertiary" size="medium" placeholder="Tertiary Medium" label="Tertiary Medium" />
      <Input variant="tertiary" size="large" placeholder="Tertiary Large" label="Tertiary Large" />
    </div>
  ),
};

// 다크 테마 모든 조합
export const AllVariantsDark: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
      <h3 style={{ color: 'white' }}>Primary Variants (Dark)</h3>
      <Input variant="primary" theme="dark" size="small" placeholder="Primary Small" label="Primary Small" />
      <Input variant="primary" theme="dark" size="medium" placeholder="Primary Medium" label="Primary Medium" />
      <Input variant="primary" theme="dark" size="large" placeholder="Primary Large" label="Primary Large" />
      
      <h3 style={{ color: 'white' }}>Secondary Variants (Dark)</h3>
      <Input variant="secondary" theme="dark" size="small" placeholder="Secondary Small" label="Secondary Small" />
      <Input variant="secondary" theme="dark" size="medium" placeholder="Secondary Medium" label="Secondary Medium" />
      <Input variant="secondary" theme="dark" size="large" placeholder="Secondary Large" label="Secondary Large" />
      
      <h3 style={{ color: 'white' }}>Tertiary Variants (Dark)</h3>
      <Input variant="tertiary" theme="dark" size="small" placeholder="Tertiary Small" label="Tertiary Small" />
      <Input variant="tertiary" theme="dark" size="medium" placeholder="Tertiary Medium" label="Tertiary Medium" />
      <Input variant="tertiary" theme="dark" size="large" placeholder="Tertiary Large" label="Tertiary Large" />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 조합 스토리
export const StateVariations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <Input 
        placeholder="정상 상태" 
        label="Normal State" 
        helperText="도움말 텍스트입니다." 
      />
      <Input 
        error 
        placeholder="에러 상태" 
        label="Error State" 
        errorText="에러가 발생했습니다." 
        value="잘못된 값"
      />
      <Input 
        success 
        placeholder="성공 상태" 
        label="Success State" 
        helperText="성공적으로 입력되었습니다." 
        value="올바른 값"
      />
      <Input 
        disabled 
        placeholder="비활성화 상태" 
        label="Disabled State" 
        value="수정 불가"
      />
    </div>
  ),
};

// 실제 사용 예시
export const RealWorldExample: Story = {
  render: () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [search, setSearch] = React.useState('');
    
    const isValidEmail = email.includes('@') && email.includes('.');
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px', padding: '20px' }}>
        <h3>로그인 폼 예시</h3>
        
        <Input
          type="email"
          variant="primary"
          size="medium"
          placeholder="이메일을 입력하세요"
          label="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={email.length > 0 && !isValidEmail}
          success={email.length > 0 && isValidEmail}
          errorText="올바른 이메일 형식이 아닙니다."
          helperText="예: user@example.com"
        />
        
        <Input
          type="password"
          variant="primary"
          size="medium"
          placeholder="비밀번호를 입력하세요"
          label="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="8자 이상 입력해주세요."
        />
        
        <Input
          variant="secondary"
          size="medium"
          placeholder="검색어를 입력하세요"
          label="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<SearchIcon />}
          rightIcon={search ? <ClearIcon /> : undefined}
          onRightIconClick={() => setSearch('')}
        />
      </div>
    );
  },
};
