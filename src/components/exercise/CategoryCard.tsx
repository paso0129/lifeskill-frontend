'use client';

import { Category } from '@/types/exercise';
import { Home, Dumbbell, BookOpen, ClipboardCheck, Gamepad2 } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

const categoryConfig: Record<Category['type'], {
  icon: typeof Home;
  color: string;
  bgColor: string;
  label: string;
}> = {
  HOME: { icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-100', label: '가정연계' },
  FITNESS: { icon: Dumbbell, color: 'text-green-600', bgColor: 'bg-green-100', label: '건강체력' },
  CLASS: { icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-100', label: '수업' },
  ASSESSMENT: { icon: ClipboardCheck, color: 'text-amber-600', bgColor: 'bg-amber-100', label: '평가' },
  GAME: { icon: Gamepad2, color: 'text-red-600', bgColor: 'bg-red-100', label: '게임' },
};

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const config = categoryConfig[category.type] || categoryConfig.HOME;
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 border border-slate-100
        flex flex-col items-center text-center gap-3"
    >
      <div className={`w-14 h-14 rounded-xl ${config.bgColor} flex items-center justify-center`}>
        <Icon className={`w-7 h-7 ${config.color}`} />
      </div>
      <span className="font-semibold text-slate-800 text-sm">{category.name}</span>
    </div>
  );
}
