'use client';

import { Grade } from '@/types/exercise';
import { Star } from 'lucide-react';

interface GradeCardProps {
  grade: Grade;
  onClick: () => void;
}

const gradients = [
  'from-sky-400 to-blue-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-500',
];

export default function GradeCard({ grade, onClick }: GradeCardProps) {
  const gradient = gradients[(grade.orderNum - 1) % gradients.length];

  return (
    <div
      onClick={onClick}
      className={`
        bg-gradient-to-br ${gradient} rounded-2xl p-6 cursor-pointer
        shadow-md hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]
        transition-all duration-200 text-white min-h-[140px]
        flex flex-col justify-between
      `}
    >
      <Star className="w-8 h-8 text-white/80" />
      <div>
        <h3 className="text-2xl font-bold">{grade.name}</h3>
      </div>
    </div>
  );
}
