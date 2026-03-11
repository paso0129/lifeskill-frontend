'use client';

import Header from '@/components/common/Header';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="정보 입력" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <RegisterForm />
      </div>
    </div>
  );
}
