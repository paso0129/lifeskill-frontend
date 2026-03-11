'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import { GraduationCap, School } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="회원가입" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-slate-800 text-center mb-2">
          가입 유형을 선택하세요
        </h2>
        <p className="text-sm text-slate-500 text-center mb-8">
          학생 또는 선생님으로 가입할 수 있습니다
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => {
              sessionStorage.setItem('signup_role', 'STUDENT');
              router.push('/signup/terms');
            }}
            className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer
              hover:shadow-md hover:-translate-y-1 active:scale-[0.98]
              transition-all duration-200 border-2 border-transparent
              hover:border-primary text-center"
          >
            <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-slate-800">학생</h3>
            <p className="text-xs text-slate-500 mt-1">운동에 참여해요</p>
          </div>

          <div
            onClick={() => {
              sessionStorage.setItem('signup_role', 'TEACHER');
              router.push('/signup/terms');
            }}
            className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer
              hover:shadow-md hover:-translate-y-1 active:scale-[0.98]
              transition-all duration-200 border-2 border-transparent
              hover:border-primary text-center"
          >
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <School className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-semibold text-slate-800">선생님</h3>
            <p className="text-xs text-slate-500 mt-1">학생을 관리해요</p>
          </div>
        </div>
      </div>
    </div>
  );
}
