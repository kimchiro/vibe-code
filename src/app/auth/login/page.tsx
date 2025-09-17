export default function SigninPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1>로그인 페이지</h1>
      <p>로그인 기능은 아직 구현되지 않았습니다.</p>
      <a href="/auth/signup" style={{ color: '#6DA5FA', textDecoration: 'underline' }}>
        회원가입하러 가기
      </a>
    </div>
  );
}
