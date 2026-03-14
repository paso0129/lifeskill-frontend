'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Button from '@/components/common/Button';
import { Dumbbell, User, ClipboardList, Users } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      checkAuth();
    } else {
      router.replace('/login');
    }
  }, []);

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const isTeacher = user?.role === 'TEACHER';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 pt-12 pb-8">
        {/* Logo area */}
        <div className="text-center mb-10">
          <div className={`w-20 h-20 bg-gradient-to-br ${isTeacher ? 'from-emerald-500 to-emerald-700' : 'from-primary to-primary-dark'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            {isTeacher ? <ClipboardList className="w-10 h-10 text-white" /> : <Dumbbell className="w-10 h-10 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-800">라이프 스킬을 통한</h1>
          <h1 className="text-2xl font-bold text-slate-800">피지컬 리터러시 기르기</h1>
        </div>

        {/* Welcome */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-800">
            안녕하세요, {user?.name || (isTeacher ? '선생' : '학생')}님!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {user?.school} {isTeacher ? '교사' : `${user?.grade}학년 ${user?.classNum}반`}
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          {isTeacher ? (
            <>
              <Button
                variant="cta"
                fullWidth
                size="lg"
                onClick={() => router.push('/teacher/submissions')}
              >
                <span className="flex items-center justify-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  제출물 관리
                </span>
              </Button>
              <Button
                variant="outline"
                fullWidth
                size="md"
                onClick={() => router.push('/teacher/students')}
              >
                <span className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  학생 관리
                </span>
              </Button>
            </>
          ) : (
            <Button
              variant="cta"
              fullWidth
              size="lg"
              onClick={() => router.push('/exercise')}
            >
              <span className="flex items-center justify-center gap-2">
                <Dumbbell className="w-5 h-5" />
                운동시작
              </span>
            </Button>
          )}

          <Button
            variant="outline"
            fullWidth
            size="md"
            onClick={() => router.push('/mypage')}
          >
            <span className="flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              마이페이지
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
