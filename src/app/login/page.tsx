'use client';

import { Dumbbell } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="max-w-lg mx-auto w-full px-4 pt-16 pb-8 flex-1 flex flex-col">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">생활체육</h1>
          <p className="text-sm text-slate-500 mt-1">로그인하고 운동을 시작하세요</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
