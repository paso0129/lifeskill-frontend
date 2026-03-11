'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Button from '@/components/common/Button';
import KakaoLoginButton from './KakaoLoginButton';

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      router.push('/');
    } catch {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">아이디</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="아이디를 입력하세요"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 placeholder:text-slate-400"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 placeholder:text-slate-400"
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <Button variant="secondary" fullWidth loading={isLoading} type="submit">
          로그인
        </Button>
      </form>

      <div className="text-center">
        <button
          onClick={() => router.push('/signup')}
          className="text-sm text-primary hover:underline font-medium"
        >
          회원가입
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-400">또는</span>
        </div>
      </div>

      <KakaoLoginButton />
    </div>
  );
}
