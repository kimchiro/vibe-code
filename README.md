This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# vibe-code
cursorAI를 활용한 vibe-code 포토폴리오 레포지토리입니다.

## 환경 변수 설정

### Auth Guard 테스트 환경 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# 테스트 환경 설정
# 실제 환경: production (또는 주석 처리)
# 테스트 환경: test
NEXT_PUBLIC_TEST_ENV=production
```

### 테스트 환경에서의 권한 바이패스

테스트 환경에서 권한 검증을 바이패스하려면 브라우저 콘솔에서 다음을 실행하세요:

```javascript
// 로그인 검사 바이패스 (테스트 환경에서만 동작)
window.__TEST_BYPASS__ = true

// 로그인 검사 활성화
window.__TEST_BYPASS__ = false
```

**주의사항:**
- 실제 환경(`NEXT_PUBLIC_TEST_ENV !== 'test'`)에서는 항상 "비로그인 유저" 기본으로 실제 로그인 상태를 확인합니다.
- 테스트 환경에서는 기본적으로 "로그인 유저"로 간주되어 로그인 검사를 바이패스합니다.
- 비회원 가드 테스트가 필요한 경우에만 `window.__TEST_BYPASS__ = false`로 설정하여 실제 로그인 상태를 확인하세요.
