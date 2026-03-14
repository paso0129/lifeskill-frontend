'use client';

import { Activity } from '@/types/exercise';
import { Dumbbell } from 'lucide-react';
import Button from '@/components/common/Button';

interface FitnessActivityCardProps {
  activity: Activity;
  onStart: () => void;
}

export default function FitnessActivityCard({ activity, onStart }: FitnessActivityCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
          {activity.imageUrl ? (
            <img
              src={activity.imageUrl}
              alt={activity.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
          ) : (
            <Dumbbell className="w-7 h-7 text-green-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-lg">{activity.name}</h3>
          {activity.description && (
            <p className="text-sm text-slate-500 mt-1">{activity.description}</p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Button
          variant="cta"
          fullWidth
          size="sm"
          onClick={onStart}
        >
          시작
        </Button>
      </div>
    </div>
  );
}
