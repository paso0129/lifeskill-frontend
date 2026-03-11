'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';

function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { kakaoLogin } = useAuthStore();
  const isProcessing = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      router.replace('/login');
      return;
    }

    // 중복 호출 방지 (React StrictMode / 카카오 code는 1회용)
    if (isProcessing.current) return;
    isProcessing.current = true;

    const processLogin = async () => {
      try {
        const { profileComplete } = await kakaoLogin(code);
        if (profileComplete) {
          router.replace('/');
        } else {
          router.replace('/auth/kakao/complete');
        }
      } catch {
        router.replace('/login');
      }
    };

    processLogin();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-slate-500">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
