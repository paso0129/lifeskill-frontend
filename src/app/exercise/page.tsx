'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useExerciseStore from '@/store/exerciseStore';
import Header from '@/components/common/Header';
import GradeCard from '@/components/exercise/GradeCard';

export default function ExercisePage() {
  const router = useRouter();
  const { grades, fetchGrades, isLoading } = useExerciseStore();

  useEffect(() => {
    fetchGrades();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="학년 선택" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {grades.map((grade) => (
              <GradeCard
                key={grade.id}
                grade={grade}
                onClick={() => {
                  if (grade.name !== '6학년') {
                    alert('아직 준비 중입니다.');
                    return;
                  }
                  router.push(`/exercise/${grade.id}`);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
