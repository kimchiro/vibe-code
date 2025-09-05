import type { Meta, StoryObj } from '@storybook/react';
import { SelectBox, SelectBoxProps, SelectOption } from './index';
import { useState } from 'react';

// 샘플 옵션 데이터
const basicOptions: SelectOption[] = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4' },
  { value: 'option5', label: '옵션 5' },
];

const fruitOptions: SelectOption[] = [
  { value: 'apple', label: '🍎 사과' },
  { value: 'banana', label: '🍌 바나나' },
  { value: 'orange', label: '🍊 오렌지' },
  { value: 'grape', label: '🍇 포도' },
  { value: 'strawberry', label: '🍓 딸기' },
];

const countryOptions: SelectOption[] = [
  { value: 'kr', label: '대한민국' },
  { value: 'us', label: '미국' },
  { value: 'jp', label: '일본' },
  { value: 'cn', label: '중국' },
  { value: 'uk', label: '영국' },
  { value: 'fr', label: '프랑스' },
  { value: 'de', label: '독일' },
];

const disabledOptions: SelectOption[] = [
  { value: 'enabled1', label: '활성화된 옵션 1' },
  { value: 'disabled1', label: '비활성화된 옵션 1', disabled: true },
  { value: 'enabled2', label: '활성화된 옵션 2' },
  { value: 'disabled2', label: '비활성화된 옵션 2', disabled: true },
  { value: 'enabled3', label: '활성화된 옵션 3' },
];

const meta: Meta<typeof SelectBox> = {
  title: 'Components/SelectBox',
  component: SelectBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '셀렉트박스의 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '셀렉트박스의 크기',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '셀렉트박스의 테마',
    },
    placeholder: {
      control: { type: 'text' },
      description: '플레이스홀더 텍스트',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: '전체 너비 사용',
    },
    value: {
      control: { type: 'text' },
      description: '선택된 값',
    },
    defaultValue: {
      control: { type: 'text' },
      description: '기본 선택 값',
    },
    onChange: {
      action: 'changed',
      description: '값 변경 시 호출되는 콜백',
    },
    onFocus: {
      action: 'focused',
      description: '포커스 시 호출되는 콜백',
    },
    onBlur: {
      action: 'blurred',
      description: '블러 시 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive 래퍼 컴포넌트
const InteractiveSelectBox = (args: SelectBoxProps) => {
  const [value, setValue] = useState(args.value || args.defaultValue || '');
  
  const handleChange = (newValue: string, option: SelectOption) => {
    setValue(newValue);
    args.onChange?.(newValue, option);
  };

  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <SelectBox
        {...args}
        value={value}
        onChange={handleChange}
      />
      {value && (
        <div style={{ 
          marginTop: '10px', 
          fontSize: '14px', 
          color: '#666',
          textAlign: 'center'
        }}>
          선택된 값: "{value}"
        </div>
      )}
    </div>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractiveSelectBox,
  args: {
    options: basicOptions,
    placeholder: '옵션을 선택하세요',
  },
};

// Variant 스토리들
export const Primary: Story = {
  render: InteractiveSelectBox,
  args: {
    variant: 'primary',
    options: basicOptions,
    placeholder: 'Primary 셀렉트박스',
  },
};

export const Secondary: Story = {
  render: InteractiveSelectBox,
  args: {
    variant: 'secondary',
    options: basicOptions,
    placeholder: 'Secondary 셀렉트박스',
  },
};

export const Tertiary: Story = {
  render: InteractiveSelectBox,
  args: {
    variant: 'tertiary',
    options: basicOptions,
    placeholder: 'Tertiary 셀렉트박스',
  },
};

// Size 스토리들
export const Small: Story = {
  render: InteractiveSelectBox,
  args: {
    size: 'small',
    options: basicOptions,
    placeholder: '작은 셀렉트박스',
  },
};

export const Medium: Story = {
  render: InteractiveSelectBox,
  args: {
    size: 'medium',
    options: basicOptions,
    placeholder: '중간 셀렉트박스',
  },
};

export const Large: Story = {
  render: InteractiveSelectBox,
  args: {
    size: 'large',
    options: basicOptions,
    placeholder: '큰 셀렉트박스',
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  render: InteractiveSelectBox,
  args: {
    theme: 'light',
    options: basicOptions,
    placeholder: '라이트 테마 셀렉트박스',
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  render: InteractiveSelectBox,
  args: {
    theme: 'dark',
    options: basicOptions,
    placeholder: '다크 테마 셀렉트박스',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const Disabled: Story = {
  render: InteractiveSelectBox,
  args: {
    disabled: true,
    options: basicOptions,
    placeholder: '비활성화된 셀렉트박스',
    defaultValue: 'option2',
  },
};

export const FullWidth: Story = {
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '500px', padding: '20px' }}>
      <InteractiveSelectBox {...args} />
    </div>
  ),
  args: {
    fullWidth: true,
    options: basicOptions,
    placeholder: '전체 너비 셀렉트박스',
  },
};

// 옵션 데이터 변형 스토리들
export const WithFruits: Story = {
  render: InteractiveSelectBox,
  args: {
    options: fruitOptions,
    placeholder: '과일을 선택하세요',
  },
  name: '과일 옵션',
};

export const WithCountries: Story = {
  render: InteractiveSelectBox,
  args: {
    options: countryOptions,
    placeholder: '국가를 선택하세요',
    defaultValue: 'kr',
  },
  name: '국가 옵션',
};

export const WithDisabledOptions: Story = {
  render: InteractiveSelectBox,
  args: {
    options: disabledOptions,
    placeholder: '일부 옵션이 비활성화됨',
  },
  name: '비활성화된 옵션 포함',
};

export const WithManyOptions: Story = {
  render: InteractiveSelectBox,
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      value: `option${i + 1}`,
      label: `옵션 ${i + 1}`,
    })),
    placeholder: '많은 옵션 (20개)',
  },
  name: '많은 옵션',
};

// 복합 스토리들
export const AllVariants: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px',
      padding: '20px',
      width: '400px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Primary</h3>
        <InteractiveSelectBox
          variant="primary"
          options={basicOptions}
          placeholder="Primary 셀렉트박스"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Secondary</h3>
        <InteractiveSelectBox
          variant="secondary"
          options={basicOptions}
          placeholder="Secondary 셀렉트박스"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Tertiary</h3>
        <InteractiveSelectBox
          variant="tertiary"
          options={basicOptions}
          placeholder="Tertiary 셀렉트박스"
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
      width: '400px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Small</h3>
        <InteractiveSelectBox
          size="small"
          options={basicOptions}
          placeholder="작은 셀렉트박스"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Medium</h3>
        <InteractiveSelectBox
          size="medium"
          options={basicOptions}
          placeholder="중간 셀렉트박스"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Large</h3>
        <InteractiveSelectBox
          size="large"
          options={basicOptions}
          placeholder="큰 셀렉트박스"
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
        <InteractiveSelectBox
          theme="light"
          options={basicOptions}
          placeholder="라이트 테마 셀렉트박스"
          onChange={() => {}}
        />
      </div>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '30px', 
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <InteractiveSelectBox
          theme="dark"
          options={basicOptions}
          placeholder="다크 테마 셀렉트박스"
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
      width: '400px'
    }}>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Normal</h3>
        <InteractiveSelectBox
          options={basicOptions}
          placeholder="일반 상태"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Disabled</h3>
        <SelectBox
          disabled
          options={basicOptions}
          placeholder="비활성화 상태"
          defaultValue="option2"
          onChange={() => {}}
        />
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>Full Width</h3>
        <div style={{ width: '100%' }}>
          <InteractiveSelectBox
            fullWidth
            options={basicOptions}
            placeholder="전체 너비"
            onChange={() => {}}
          />
        </div>
      </div>
      <div>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>With Disabled Options</h3>
        <InteractiveSelectBox
          options={disabledOptions}
          placeholder="일부 옵션 비활성화"
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
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedFruit, setSelectedFruit] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categoryOptions: SelectOption[] = [
      { value: 'electronics', label: '전자제품' },
      { value: 'clothing', label: '의류' },
      { value: 'books', label: '도서' },
      { value: 'sports', label: '스포츠' },
      { value: 'home', label: '홈&리빙' },
    ];

    return (
      <div style={{ 
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600' }}>
            사용자 정보 입력 폼
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500' 
              }}>
                국가 선택
              </label>
              <SelectBox
                options={countryOptions}
                value={selectedCountry}
                onChange={(value) => setSelectedCountry(value)}
                placeholder="국가를 선택하세요"
                fullWidth
                variant="primary"
                size="medium"
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500' 
              }}>
                선호 과일
              </label>
              <SelectBox
                options={fruitOptions}
                value={selectedFruit}
                onChange={(value) => setSelectedFruit(value)}
                placeholder="과일을 선택하세요"
                fullWidth
                variant="secondary"
                size="medium"
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500' 
              }}>
                관심 카테고리
              </label>
              <SelectBox
                options={categoryOptions}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                placeholder="카테고리를 선택하세요"
                fullWidth
                variant="tertiary"
                size="medium"
              />
            </div>
          </div>

          {/* 선택된 값들 표시 */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>
              선택된 정보
            </h4>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>국가:</strong> {selectedCountry ? countryOptions.find(o => o.value === selectedCountry)?.label : '선택되지 않음'}
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>선호 과일:</strong> {selectedFruit ? fruitOptions.find(o => o.value === selectedFruit)?.label : '선택되지 않음'}
              </p>
              <p style={{ margin: '0' }}>
                <strong>관심 카테고리:</strong> {selectedCategory ? categoryOptions.find(o => o.value === selectedCategory)?.label : '선택되지 않음'}
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
            border: '1px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Small Size</h4>
            <SelectBox
              size="small"
              options={basicOptions}
              placeholder="작은 크기"
              variant="primary"
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Medium Size</h4>
            <SelectBox
              size="medium"
              options={basicOptions}
              placeholder="중간 크기"
              variant="secondary"
            />
          </div>

          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Large Size</h4>
            <SelectBox
              size="large"
              options={basicOptions}
              placeholder="큰 크기"
              variant="tertiary"
            />
          </div>

          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'white' }}>Dark Theme</h4>
            <SelectBox
              theme="dark"
              options={basicOptions}
              placeholder="다크 테마"
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
