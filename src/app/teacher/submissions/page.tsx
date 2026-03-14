'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Header from '@/components/common/Header';
import Pagination from '@/components/common/Pagination';
import api from '@/lib/api';
import { Participation, PageResponse } from '@/types/participation';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';

export default function TeacherSubmissionsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<Participation[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [dashboard, setDashboard] = useState<{
    school?: string; grade?: number; classNum?: number;
    totalStudents?: number; pendingCount?: number; approvedCount?: number; rejectedCount?: number;
  }>({});

  useEffect(() => {
    if (user?.role !== 'TEACHER') {
      router.replace('/');
      return;
    }
    loadDashboard();
  }, []);

  useEffect(() => {
    loadSubmissions(0);
  }, [filter]);

  const loadDashboard = async () => {
    try {
      const res = await api.get('/api/teacher/dashboard');
      setDashboard(res.data);
    } catch {
      // ignore
    }
  };

  const loadSubmissions = async (page: number) => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page, size: 10 };
      if (filter !== 'ALL') params.status = filter;
      const res = await api.get<PageResponse<Participation>>('/api/teacher/participations', { params });
      setSubmissions(res.data.content);
      setTotalPages(res.data.totalPages);
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
      loadDashboard();
    } catch {
      // ignore
    }
  };

  const handleReject = async (id: number) => {
    try {
      await api.put(`/api/teacher/participations/${id}/reject`);
      loadSubmissions(currentPage);
      loadDashboard();
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

  const getImageUrl = (fileUrl: string) => {
    if (fileUrl.startsWith('http')) return fileUrl;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    return `${baseUrl}${fileUrl}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="제출물 관리" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Dashboard Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-sm font-medium text-slate-800 mb-2">
            {dashboard.school} {dashboard.grade}학년 {dashboard.classNum}반
          </p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-50 rounded-xl p-2">
              <p className="text-lg font-bold text-slate-800">{dashboard.totalStudents || 0}</p>
              <p className="text-xs text-slate-500">학생</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-2">
              <p className="text-lg font-bold text-amber-600">{dashboard.pendingCount || 0}</p>
              <p className="text-xs text-slate-500">대기</p>
            </div>
            <div className="bg-green-50 rounded-xl p-2">
              <p className="text-lg font-bold text-green-600">{dashboard.approvedCount || 0}</p>
              <p className="text-xs text-slate-500">승인</p>
            </div>
            <div className="bg-red-50 rounded-xl p-2">
              <p className="text-lg font-bold text-red-600">{dashboard.rejectedCount || 0}</p>
              <p className="text-xs text-slate-500">반려</p>
            </div>
          </div>
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
            {submissions.map((s) => {
              const isExpanded = expandedId === s.id;
              return (
                <div key={s.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  {/* Header - always visible */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 truncate">
                          {s.activity?.name || `활동 #${s.activity?.id}`}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {s.user?.name} · {new Date(s.submittedAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(s.status)}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
                      {/* 사진 */}
                      {s.fileUrl && s.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                        <div className="rounded-xl overflow-hidden border border-slate-200">
                          <img
                            src={getImageUrl(s.fileUrl)}
                            alt="제출 사진"
                            className="w-full max-h-80 object-contain bg-slate-100"
                          />
                        </div>
                      )}

                      {/* 파일 링크 (이미지가 아닌 경우) */}
                      {s.fileUrl && !s.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                        <a
                          href={getImageUrl(s.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-primary underline"
                        >
                          첨부파일 보기
                        </a>
                      )}

                      {/* 코멘트 */}
                      {s.reviewText && (
                        <div className="bg-slate-50 rounded-xl p-3">
                          <p className="text-xs font-medium text-slate-500 mb-1">학생 코멘트</p>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{s.reviewText}</p>
                        </div>
                      )}

                      {/* 운동 기록 */}
                      {(s.exerciseCount || s.exerciseSets) && (
                        <div className="flex gap-3">
                          {s.exerciseCount && (
                            <div className="bg-blue-50 rounded-xl px-3 py-2">
                              <p className="text-xs text-blue-500">횟수</p>
                              <p className="text-sm font-bold text-blue-700">{s.exerciseCount}회</p>
                            </div>
                          )}
                          {s.exerciseSets && (
                            <div className="bg-blue-50 rounded-xl px-3 py-2">
                              <p className="text-xs text-blue-500">세트</p>
                              <p className="text-sm font-bold text-blue-700">{s.exerciseSets}세트</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 승인/반려 버튼 */}
                      {s.status === 'PENDING' && (
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApprove(s.id); }}
                            className="flex-1 px-4 py-2.5 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors"
                          >
                            승인
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReject(s.id); }}
                            className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors"
                          >
                            반려
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
