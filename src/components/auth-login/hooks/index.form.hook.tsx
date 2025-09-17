'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useModal } from '@/commons/providers/modal/modal.provuder';
import { Modal } from '@/commons/components/modal';
import { UrlPath } from '@/commons/constants/url';
import { useAuth } from '@/commons/providers/auth/auth.provider';

// 로그인 폼 스키마 정의
const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// API 응답 타입 정의
interface LoginUserResponse {
  loginUser: {
    accessToken: string;
  };
}

interface FetchUserLoggedInResponse {
  fetchUserLoggedIn: {
    _id: string;
    name: string;
  };
}

// GraphQL API 호출 함수들
const loginUser = async (data: LoginFormData): Promise<LoginUserResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation loginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            accessToken
          }
        }
      `,
      variables: {
        email: data.email,
        password: data.password,
      },
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || '로그인에 실패했습니다.');
  }
  
  return result.data;
};

const fetchUserLoggedIn = async (accessToken: string): Promise<FetchUserLoggedInResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query fetchUserLoggedIn {
          fetchUserLoggedIn {
            _id
            name
          }
        }
      `,
    }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0]?.message || '사용자 정보를 가져오는데 실패했습니다.');
  }
  
  return result.data;
};

// 로그인 폼 훅
export const useAuthLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();
  const { login } = useAuth();

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // 폼 필드 값 감시
  const watchedFields = watch();
  
  // 수동으로 유효성 검사
  const isEmailValid = watchedFields.email && watchedFields.email.includes('@');
  const isPasswordValid = watchedFields.password && watchedFields.password.length >= 1;
  
  const isFormFilled = Boolean(
    isEmailValid && 
    isPasswordValid && 
    Object.keys(errors).length === 0
  );

  // 로그인 뮤테이션
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data, variables) => {
      try {
        const accessToken = data.loginUser.accessToken;
        
        // 사용자 정보 조회
        const userResponse = await fetchUserLoggedIn(accessToken);
        const userInfo = userResponse.fetchUserLoggedIn;
        
        // Auth Provider를 통해 로그인 처리
        login(accessToken, {
          id: userInfo._id,
          email: variables.email, // 로그인 시 입력한 이메일 사용
          name: userInfo.name,
        });
        
        // 로그인 성공 모달 표시
        openModal({
          content: (
            <Modal
              variant="info"
              actions="single"
              title="로그인 성공"
              description="로그인이 완료되었습니다."
              onConfirm={() => {
                closeAllModals();
                router.push(UrlPath.DIARIES);
              }}
            />
          ),
        });
      } catch (error) {
        // 사용자 정보 조회 실패 시 로그인 실패 모달 표시
        openModal({
          content: (
            <Modal
              variant="danger"
              actions="single"
              title="로그인 실패"
              description={error instanceof Error ? error.message : "사용자 정보를 가져오는데 실패했습니다."}
              onConfirm={() => {
                closeAllModals();
              }}
            />
          ),
        });
      }
    },
    onError: (error) => {
      // 로그인 실패 모달 표시
      openModal({
        content: (
          <Modal
            variant="danger"
            actions="single"
            title="로그인 실패"
            description={error.message || '로그인에 실패했습니다.'}
            onConfirm={() => {
              closeAllModals();
            }}
          />
        ),
      });
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return {
    // Form methods
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    
    // Form state
    isValid,
    isFormFilled,
    isLoading: loginMutation.isPending,
    
    // Form data
    formData: watchedFields,
  };
};

export default useAuthLoginForm;
