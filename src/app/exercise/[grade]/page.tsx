'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useExerciseStore from '@/store/exerciseStore';
import Header from '@/components/common/Header';
import UnitCard from '@/components/exercise/UnitCard';

export default function UnitPage() {
  const router = useRouter();
  const params = useParams();
  const gradeId = Number(params.grade);
  const { units, fetchUnits, isLoading } = useExerciseStore();

  useEffect(() => {
    fetchUnits(gradeId);
  }, [gradeId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="단원 선택" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                onClick={() => router.push(`/exercise/${gradeId}/${unit.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
