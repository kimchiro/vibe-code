import type { Meta, StoryObj } from '@storybook/react';
import { Searchbar, SearchbarProps } from './index';
import { useState } from 'react';
import Image from 'next/image';

const meta: Meta<typeof Searchbar> = {
  title: 'Components/Searchbar',
  component: Searchbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '검색바의 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '검색바의 크기',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '검색바의 테마',
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    error: {
      control: { type: 'boolean' },
      description: '에러 상태',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: '로딩 상태',
    },
    showClearButton: {
      control: { type: 'boolean' },
      description: '클리어 버튼 표시 여부',
    },
    helperText: {
      control: { type: 'text' },
      description: '도움말 텍스트',
    },
    value: {
      control: { type: 'text' },
      description: '입력 값',
    },
    onChange: {
      action: 'changed',
      description: '값 변경 시 호출되는 콜백',
    },
    onClear: {
      action: 'cleared',
      description: '클리어 버튼 클릭 시 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive 래퍼 컴포넌트
const InteractiveSearchbar = (args: SearchbarProps) => {
  const [value, setValue] = useState(args.value || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    args.onChange?.(e);
  };

  const handleClear = () => {
    setValue('');
    args.onClear?.();
  };

  return (
    <div style={{ width: '400px', padding: '20px' }}>
      <Searchbar
        {...args}
        value={value}
        onChange={handleChange}
        onClear={handleClear}
      />
      {value && (
        <div style={{ 
          marginTop: '10px', 
          fontSize: '14px', 
          color: '#666',
          textAlign: 'center'
        }}>
          입력된 값: &quot;{value}&quot;
        </div>
      )}
    </div>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveSearchbar,
  args: {
    placeholder: '검색어를 입력해 주세요.',
  },
};

// Variant 스토리들
export const Primary: Story = {
  render: InteractiveSearchbar,
  args: {
    variant: 'primary',
    placeholder: 'Primary 검색바',
  },
};

export const Secondary: Story = {
  render: InteractiveSearchbar,
  args: {
    variant: 'secondary',
    placeholder: 'Secondary 검색바',
  },
};

export const Tertiary: Story = {
  render: InteractiveSearchbar,
  args: {
    variant: 'tertiary',
    placeholder: 'Tertiary 검색바',
  },
};

// Size 스토리들
export const Small: Story = {
  render: InteractiveSearchbar,
  args: {
    size: 'small',
    placeholder: '작은 검색바',
  },
};

export const Medium: Story = {
  render: InteractiveSearchbar,
  args: {
    size: 'medium',
    placeholder: '중간 검색바',
  },
};

export const Large: Story = {
  render: InteractiveSearchbar,
  args: {
    size: 'large',
    placeholder: '큰 검색바',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  render: InteractiveSearchbar,
  args: {
    theme: 'light',
    placeholder: '라이트 테마 검색바',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  render: InteractiveSearchbar,
  args: {
    theme: 'dark',
    placeholder: '다크 테마 검색바',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const Disabled: Story = {
  render: InteractiveSearchbar,
  args: {
    disabled: true,
    placeholder: '비활성화된 검색바',
    value: '비활성화 상태',
  },
};

export const Error: Story = {
  render: InteractiveSearchbar,
  args: {
    error: true,
    placeholder: '에러 상태 검색바',
    helperText: '검색어를 다시 확인해 주세요.',
    value: '잘못된 검색어',
  },
};

export const Loading: Story = {
  render: InteractiveSearchbar,
  args: {
    isLoading: true,
    placeholder: '로딩 중...',
    value: '검색 중',
  },
};

// 기능 스토리들
export const WithClearButton: Story = {
  render: InteractiveSearchbar,
  args: {
    showClearButton: true,
    placeholder: '클리어 버튼이 있는 검색바',
    value: '지울 수 있는 텍스트',
  },
};

export const WithHelperText: Story = {
  render: InteractiveSearchbar,
  args: {
    placeholder: '도움말이 있는 검색바',
    helperText: '최소 2글자 이상 입력해 주세요.',
  },
};

export const WithCustomIcons: Story = {
  render: InteractiveSearchbar,
  args: {
    placeholder: '커스텀 아이콘 검색바',
    leftIcon: <Image src="/icons/search_outline_light_m.svg" alt="검색" width={16} height={16} />,
    rightIcon: <Image src="/icons/plus_outline_light_m.svg" alt="설정" width={16} height={16} />,
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
      width: '500px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Primary</h3>
        <InteractiveSearchbar
          variant="primary"
          placeholder="Primary 검색바"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Secondary</h3>
        <InteractiveSearchbar
          variant="secondary"
          placeholder="Secondary 검색바"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Tertiary</h3>
        <InteractiveSearchbar
          variant="tertiary"
          placeholder="Tertiary 검색바"
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
      width: '500px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Small</h3>
        <InteractiveSearchbar
          size="small"
          placeholder="작은 검색바"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Medium</h3>
        <InteractiveSearchbar
          size="medium"
          placeholder="중간 검색바"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Large</h3>
        <InteractiveSearchbar
          size="large"
          placeholder="큰 검색바"
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
        <InteractiveSearchbar
          theme="light"
          placeholder="라이트 테마 검색바"
          onChange={() => {}}
        />
      </div>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '30px', 
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <InteractiveSearchbar
          theme="dark"
          placeholder="다크 테마 검색바"
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
      width: '500px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Normal</h3>
        <InteractiveSearchbar
          placeholder="일반 상태"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Disabled</h3>
        <Searchbar
          disabled
          placeholder="비활성화 상태"
          value="비활성화된 텍스트"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Error</h3>
        <Searchbar
          error
          placeholder="에러 상태"
          helperText="검색어를 다시 확인해 주세요."
          value="잘못된 검색어"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Loading</h3>
        <Searchbar
          isLoading
          placeholder="로딩 중..."
          value="검색 중"
          onChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const AllFeatures: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      padding: '20px',
      width: '500px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>기본 검색바</h3>
        <InteractiveSearchbar
          placeholder="기본 검색바"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>클리어 버튼 포함</h3>
        <InteractiveSearchbar
          showClearButton
          placeholder="클리어 버튼 포함"
          value="지울 수 있는 텍스트"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>커스텀 아이콘</h3>
        <InteractiveSearchbar
          leftIcon={<Image src="/icons/search_outline_light_m.svg" alt="검색" width={16} height={16} />}
          rightIcon={<Image src="/icons/plus_outline_light_m.svg" alt="설정" width={16} height={16} />}
          placeholder="커스텀 아이콘"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>도움말 텍스트</h3>
        <InteractiveSearchbar
          placeholder="도움말이 있는 검색바"
          helperText="최소 2글자 이상 입력해 주세요."
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
    const [searchValue, setSearchValue] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<string[]>([]);

    // 가상의 데이터
    const mockData = [
      '리액트 컴포넌트 개발',
      '타입스크립트 기초',
      '스토리북 사용법',
      '웹 접근성 가이드',
      '반응형 웹 디자인',
      '성능 최적화 방법',
      '테스트 코드 작성',
      '상태 관리 라이브러리',
      'CSS 모듈 활용',
      '빌드 도구 설정'
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
      
      if (value.length > 0) {
        setIsSearching(true);
        // 실제 검색 시뮬레이션
        setTimeout(() => {
          const results = mockData.filter(item => 
            item.toLowerCase().includes(value.toLowerCase())
          );
          setSearchResults(results);
          setIsSearching(false);
        }, 500);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    };

    const handleClear = () => {
      setSearchValue('');
      setSearchResults([]);
      setIsSearching(false);
    };

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
            검색 기능 예시
          </h3>
          
          {/* 검색바 */}
          <div style={{ marginBottom: '20px' }}>
            <Searchbar
              value={searchValue}
              onChange={handleSearch}
              onClear={handleClear}
              showClearButton={searchValue.length > 0}
              isLoading={isSearching}
              placeholder="검색어를 입력해 주세요..."
              size="large"
              variant="primary"
              helperText={searchValue.length > 0 ? `"${searchValue}" 검색 중...` : '최소 1글자 이상 입력해 주세요.'}
            />
          </div>

          {/* 검색 결과 */}
          {searchResults.length > 0 && (
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}>
              <div style={{ 
                padding: '12px 16px', 
                backgroundColor: '#f8f9fa',
                borderBottom: '1px solid #e0e0e0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#666'
              }}>
                검색 결과 ({searchResults.length}개)
              </div>
              {searchResults.map((result, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: '12px 16px', 
                    borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {result}
                </div>
              ))}
            </div>
          )}

          {/* 검색 결과 없음 */}
          {searchValue.length > 0 && !isSearching && searchResults.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px',
              color: '#666',
              fontSize: '14px'
            }}>
              &quot;{searchValue}&quot;에 대한 검색 결과가 없습니다.
            </div>
          )}
        </div>

        {/* 다양한 검색바 예시 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>필터 검색</h4>
            <Searchbar
              placeholder="필터링할 항목 검색"
              leftIcon={<Image src="/icons/search_outline_light_m.svg" alt="검색" width={16} height={16} />}
              rightIcon={<Image src="/icons/plus_outline_light_m.svg" alt="설정" width={16} height={16} />}
              size="small"
              variant="secondary"
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'white' }}>다크 모드 검색</h4>
            <Searchbar
              placeholder="다크 모드에서 검색"
              theme="dark"
              size="medium"
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
