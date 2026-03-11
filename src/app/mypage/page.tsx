'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import api from '@/lib/api';
import { Participation } from '@/types/participation';
import { Settings, LogOut, CheckCircle, Clock } from 'lucide-react';

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadParticipations = async () => {
      try {
        const res = await api.get('/api/participations/me');
        setParticipations(res.data);
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    loadParticipations();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="마이페이지" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-sm text-slate-500">
                {user?.school} {user?.grade}학년 {user?.classNum}반
              </p>
            </div>
            <button
              onClick={() => router.push('/mypage/edit')}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-500">아이디</p>
              <p className="font-medium text-slate-700">{user?.username}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-slate-500">성별</p>
              <p className="font-medium text-slate-700">{user?.gender}</p>
            </div>
          </div>
        </div>

        {/* Participation History */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">참여 기록</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : participations.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <p className="text-slate-500">아직 참여한 활동이 없습니다.</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => router.push('/exercise')}
              >
                운동 시작하기
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {participations.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-800">
                      {p.activityName || `활동 #${p.activityId}`}
                    </h4>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        p.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.status === 'APPROVED' ? (
                        <><CheckCircle className="w-3 h-3" /> 승인</>
                      ) : (
                        <><Clock className="w-3 h-3" /> 대기</>
                      )}
                    </span>
                  </div>
                  {p.reviewText && (
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{p.reviewText}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(p.submittedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </div>
  );
}
