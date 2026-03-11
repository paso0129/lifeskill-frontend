'use client';

export default function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `/api/auth/kakao/authorize`;
    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
        bg-[#FEE500] text-[#191919] hover:bg-[#FDD835] transition-all duration-200
        active:scale-95 shadow-md"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9 0.6C4.029 0.6 0 3.713 0 7.55C0 9.86 1.558 11.9 3.931 13.1L2.933 16.633C2.861 16.884 3.147 17.084 3.367 16.94L7.581 14.27C8.046 14.327 8.519 14.356 9 14.356C13.971 14.356 18 11.243 18 7.406C18 3.713 13.971 0.6 9 0.6Z"
          fill="#191919"
        />
      </svg>
      카카오 로그인
    </button>
  );
}
