'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Header from '@/components/common/Header';
import Pagination from '@/components/common/Pagination';
import api from '@/lib/api';
import { User } from '@/types/user';
import { PageResponse } from '@/types/participation';
import { GraduationCap } from 'lucide-react';

export default function TeacherStudentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [students, setStudents] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'TEACHER') {
      router.replace('/');
      return;
    }
    loadStudents(0);
  }, []);

  const loadStudents = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await api.get<PageResponse<User>>('/api/teacher/students', {
        params: { page, size: 10 },
      });
      setStudents(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      setCurrentPage(res.data.number);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="학생 관리" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <p className="text-sm text-slate-500">전체 학생 <span className="font-bold text-slate-800">{totalElements}명</span></p>
        </div>

        {/* Student List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <p className="text-slate-500">등록된 학생이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">{student.name}</h4>
                    <p className="text-xs text-slate-500">
                      {student.school} {student.grade}학년 {student.classNum}반
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">{student.username}</p>
                    <p className="text-xs text-slate-400">{student.gender}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => loadStudents(page)}
        />
      </div>
    </div>
  );
}
