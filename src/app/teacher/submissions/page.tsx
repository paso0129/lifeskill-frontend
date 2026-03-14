'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Header from '@/components/common/Header';
import Pagination from '@/components/common/Pagination';
import api from '@/lib/api';
import { Participation, PageResponse } from '@/types/participation';
import { CheckCircle, XCircle, Clock, FileText, Image } from 'lucide-react';

export default function TeacherSubmissionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<Participation[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    if (user?.role !== 'TEACHER') {
      router.replace('/');
      return;
    }
    loadSubmissions(0);
  }, [filter]);

  const loadSubmissions = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await api.get<PageResponse<Participation>>('/api/teacher/participations', {
        params: { page, size: 10 },
      });
      let filtered = res.data.content;
      if (filter !== 'ALL') {
        filtered = filtered.filter((p) => p.status === filter);
      }
      setSubmissions(filtered);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      setCurrentPage(res.data.number);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/api/teacher/participations/${id}/approve`);
      loadSubmissions(currentPage);
    } catch {
      // ignore
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.put(`/api/teacher/participations/${id}/reject`);
      loadSubmissions(currentPage);
    } catch {
      // ignore
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> 승인
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> 반려
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3" /> 대기
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="제출물 관리" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-sm text-slate-500">전체 제출물 <span className="font-bold text-slate-800">{totalElements}건</span></p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(0); }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'ALL' ? '전체' : f === 'PENDING' ? '대기중' : f === 'APPROVED' ? '승인됨' : '반려됨'}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <p className="text-slate-500">제출물이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-800 truncate">
                      {s.activity?.name || `활동 #${s.activity?.id}`}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s.user?.name} | {s.user?.school} {s.user?.grade}학년 {s.user?.classNum}반
                    </p>
                  </div>
                  {getStatusBadge(s.status)}
                </div>

                {s.reviewText && (
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mb-3 line-clamp-3">{s.reviewText}</p>
                )}

                {s.fileUrl && (
                  <div className="flex items-center gap-1 text-xs text-primary mb-3">
                    {s.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <Image className="w-3 h-3" />
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    첨부파일 있음
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {new Date(s.submittedAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {s.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(s.id)}
                        className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleReject(s.id)}
                        className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        반려
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => loadSubmissions(page)}
        />
      </div>
    </div>
  );
}
