import type { Meta, StoryObj } from '@storybook/react';
import Pagination, { PaginationProps } from './index';
import { useState } from 'react';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 (1부터 시작)',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '총 페이지 수',
    },
    visiblePages: {
      control: { type: 'number', min: 3, max: 10 },
      description: '보여줄 페이지 버튼 수',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary'],
      description: '페이지네이션의 스타일 변형',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: '페이지네이션의 크기',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '페이지네이션의 테마',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '비활성화 상태',
    },
    onPageChange: {
      action: 'pageChanged',
      description: '페이지 변경 시 호출되는 콜백',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive 래퍼 컴포넌트
const InteractivePagination = (args: PaginationProps) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    args.onPageChange?.(page);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
          현재 페이지: <strong>{currentPage}</strong> / {args.totalPages}
        </p>
      </div>
      <Pagination
        {...args}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

// 기본 스토리
export const Default: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 10,
    visiblePages: 5,
  },
};

// Variant 스토리들
export const Primary: Story = {
  render: InteractivePagination,
  args: {
    variant: 'primary',
    currentPage: 5,
    totalPages: 10,
    visiblePages: 5,
  },
};

export const Secondary: Story = {
  render: InteractivePagination,
  args: {
    variant: 'secondary',
    currentPage: 5,
    totalPages: 10,
    visiblePages: 5,
  },
};

export const Tertiary: Story = {
  render: InteractivePagination,
  args: {
    variant: 'tertiary',
    currentPage: 5,
    totalPages: 10,
    visiblePages: 5,
  },
};

// Size 스토리들
export const Small: Story = {
  render: InteractivePagination,
  args: {
    size: 'small',
    currentPage: 3,
    totalPages: 8,
    visiblePages: 5,
  },
};

export const Medium: Story = {
  render: InteractivePagination,
  args: {
    size: 'medium',
    currentPage: 3,
    totalPages: 8,
    visiblePages: 5,
  },
};

export const Large: Story = {
  render: InteractivePagination,
  args: {
    size: 'large',
    currentPage: 3,
    totalPages: 8,
    visiblePages: 5,
  },
};

// Theme 스토리들
export const LightTheme: Story = {
  render: InteractivePagination,
  args: {
    theme: 'light',
    currentPage: 4,
    totalPages: 10,
    visiblePages: 5,
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};

export const DarkTheme: Story = {
  render: InteractivePagination,
  args: {
    theme: 'dark',
    currentPage: 4,
    totalPages: 10,
    visiblePages: 5,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// 상태 스토리들
export const Disabled: Story = {
  render: InteractivePagination,
  args: {
    disabled: true,
    currentPage: 5,
    totalPages: 10,
    visiblePages: 5,
  },
};

// 페이지 수 변형 스토리들
export const FewPages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 2,
    totalPages: 3,
    visiblePages: 5,
  },
  name: '적은 페이지 수 (3페이지)',
};

export const ManyPages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 15,
    totalPages: 50,
    visiblePages: 5,
  },
  name: '많은 페이지 수 (50페이지)',
};

export const SinglePage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 1,
    visiblePages: 5,
  },
  name: '단일 페이지',
};

// Visible Pages 변형 스토리들
export const ThreeVisiblePages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 5,
    totalPages: 20,
    visiblePages: 3,
  },
  name: '3개 페이지 표시',
};

export const SevenVisiblePages: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 10,
    totalPages: 20,
    visiblePages: 7,
  },
  name: '7개 페이지 표시',
};

// 경계 케이스 스토리들
export const FirstPage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 1,
    totalPages: 20,
    visiblePages: 5,
  },
  name: '첫 번째 페이지',
};

export const LastPage: Story = {
  render: InteractivePagination,
  args: {
    currentPage: 20,
    totalPages: 20,
    visiblePages: 5,
  },
  name: '마지막 페이지',
};

// 복합 스토리들
export const AllVariants: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '30px',
      padding: '20px',
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Primary</h3>
        <InteractivePagination
          variant="primary"
          currentPage={3}
          totalPages={8}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Secondary</h3>
        <InteractivePagination
          variant="secondary"
          currentPage={3}
          totalPages={8}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Tertiary</h3>
        <InteractivePagination
          variant="tertiary"
          currentPage={3}
          totalPages={8}
          visiblePages={5}
          onPageChange={() => {}}
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
      gap: '30px',
      padding: '20px',
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Small</h3>
        <InteractivePagination
          size="small"
          currentPage={3}
          totalPages={8}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Medium</h3>
        <InteractivePagination
          size="medium"
          currentPage={3}
          totalPages={8}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>Large</h3>
        <InteractivePagination
          size="large"
          currentPage={3}
          totalPages={8}
          visiblePages={5}
          onPageChange={() => {}}
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
        border: '1px solid #e0e0e0',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Light Theme</h3>
        <InteractivePagination
          theme="light"
          currentPage={4}
          totalPages={10}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '30px', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: 'white' }}>Dark Theme</h3>
        <InteractivePagination
          theme="dark"
          currentPage={4}
          totalPages={10}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

export const DifferentPageCounts: Story = {
  render: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '30px',
      padding: '20px',
      alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>3 페이지</h3>
        <InteractivePagination
          currentPage={2}
          totalPages={3}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>10 페이지</h3>
        <InteractivePagination
          currentPage={5}
          totalPages={10}
          visiblePages={5}
          onPageChange={() => {}}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600' }}>50 페이지</h3>
        <InteractivePagination
          currentPage={25}
          totalPages={50}
          visiblePages={5}
          onPageChange={() => {}}
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const totalItems = 247; // 예시 데이터
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // 현재 페이지의 아이템 범위 계산
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

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
            게시물 목록
          </h3>
          
          {/* 가상의 게시물 목록 */}
          <div style={{ marginBottom: '20px' }}>
            {Array.from({ length: Math.min(itemsPerPage, totalItems - (currentPage - 1) * itemsPerPage) }, (_, i) => {
              const itemNumber = startItem + i;
              return (
                <div 
                  key={itemNumber}
                  style={{ 
                    padding: '12px 16px', 
                    backgroundColor: 'white', 
                    marginBottom: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontWeight: '500' }}>게시물 #{itemNumber}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    2024.01.{String(itemNumber % 30 + 1).padStart(2, '0')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 페이지 정보 */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '20px',
            fontSize: '14px',
            color: '#666'
          }}>
            총 {totalItems}개 중 {startItem}-{endItem}번째 항목 표시
          </div>

          {/* 페이지네이션 */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              visiblePages={5}
              variant="primary"
              size="medium"
              theme="light"
            />
          </div>
        </div>

        {/* 다른 설정의 페이지네이션 예시 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px'
        }}>
          <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '20px', 
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Compact (3 visible)</h4>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              visiblePages={3}
              variant="secondary"
              size="small"
            />
          </div>
          
          <div style={{ 
            backgroundColor: '#1a1a1a', 
            padding: '20px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: 'white' }}>Dark Theme</h4>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              visiblePages={5}
              variant="primary"
              size="medium"
              theme="dark"
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
