'use client';

import { Activity } from '@/types/exercise';
import { Image as ImageIcon } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
  onClick: () => void;
}

export default function ActivityCard({ activity, onClick }: ActivityCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 border border-slate-100
        flex items-center gap-4 p-4"
    >
      {activity.imageUrl ? (
        <img
          src={activity.imageUrl}
          alt={activity.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="font-semibold text-slate-800 truncate">{activity.name}</h3>
        <p className="text-sm text-slate-500 mt-0.5">{activity.targetGrade}</p>
      </div>
    </div>
  );
}
