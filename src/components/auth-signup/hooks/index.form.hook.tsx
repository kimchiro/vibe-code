'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { UrlPath } from '@/commons/constants/url';

// Zod 스키마 정의
const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식이 아닙니다.')
    .refine((email) => email.includes('@'), {
      message: '이메일에 @가 포함되어야 합니다.',
    }),
  password: z
    .string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '비밀번호는 영문과 숫자를 포함해야 합니다.'),
  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  name: z.string().min(1, '이름을 입력해주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// API 요청 타입
interface CreateUserInput {
  email: string;
  password: string;
  name: string;
}

interface CreateUserResponse {
  _id: string;
}

// GraphQL createUser mutation
const createUserMutation = async (input: CreateUserInput): Promise<CreateUserResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation createUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
          }
        }
      `,
      variables: {
        createUserInput: input,
      },
    }),
  });

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(data.errors[0]?.message || '회원가입에 실패했습니다.');
  }

  return data.data.createUser;
};


export const useSignupForm = () => {
  const router = useRouter();
  
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
  });

  // 모든 필드 값 감시
  const watchedValues = watch();
  
  // 모든 필드가 입력되었는지 확인
  const isAllFieldsFilled = Object.values(watchedValues).every(value => 
    typeof value === 'string' && value.trim() !== ''
  );
  
  // 버튼 활성화 조건: 모든 필드 입력 + 유효성 검사 통과
  const isSubmitEnabled = isAllFieldsFilled && isValid;

  // React Query mutation
  const mutation = useMutation({
    mutationFn: createUserMutation,
    onSuccess: (data) => {
      console.log('회원가입 성공:', data);
      // 성공 모달 표시 로직은 컴포넌트에서 처리
    },
    onError: (error) => {
      console.error('회원가입 실패:', error);
      // 실패 모달 표시 로직은 컴포넌트에서 처리
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: SignupFormData) => {
    const { email, password, name } = data;
    
    mutation.mutate({
      email,
      password,
      name,
    });
  };

  // 성공 모달 확인 버튼 핸들러
  const handleSuccessConfirm = () => {
    router.push(UrlPath.LOGIN);
    // 모달 닫기는 컴포넌트에서 처리
  };

  // 실패 모달 확인 버튼 핸들러
  const handleErrorConfirm = () => {
    // 모달 닫기만 처리 (컴포넌트에서)
  };

  // 폼 리셋
  const resetForm = () => {
    reset();
    mutation.reset();
  };

  return {
    // Form 관련
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isValid,
    isDirty,
    isSubmitEnabled,
    
    // API 관련
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    
    // 핸들러
    handleSuccessConfirm,
    handleErrorConfirm,
    resetForm,
    
    // 유틸리티
    watchedValues,
    isAllFieldsFilled,
  };
};

export default useSignupForm;
