'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useExerciseStore from '@/store/exerciseStore';
import Header from '@/components/common/Header';
import CategoryCard from '@/components/exercise/CategoryCard';

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const gradeId = params.grade as string;
  const unitId = Number(params.unit);
  const { categories, fetchCategories, isLoading } = useExerciseStore();

  useEffect(() => {
    fetchCategories(unitId);
  }, [unitId]);

  const getCategoryPath = (type: string) => {
    const pathMap: Record<string, string> = {
      HOME: 'home',
      FITNESS: 'fitness',
      CLASS: 'class',
      ASSESSMENT: 'assessment',
      GAME: 'game',
    };
    return pathMap[type] || type.toLowerCase();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="영역 선택" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() =>
                  router.push(`/exercise/${gradeId}/${unitId}/${getCategoryPath(category.type)}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
