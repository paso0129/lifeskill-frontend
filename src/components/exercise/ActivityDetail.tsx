'use client';

import { Activity } from '@/types/exercise';
import { Target, Ruler, BookOpen } from 'lucide-react';
import Button from '@/components/common/Button';

interface ActivityDetailProps {
  activity: Activity;
  onParticipate: () => void;
}

export default function ActivityDetail({ activity, onParticipate }: ActivityDetailProps) {
  return (
    <div className="space-y-6">
      {activity.imageUrl && (
        <img
          src={activity.imageUrl}
          alt={activity.name}
          className="w-full h-48 object-cover rounded-2xl"
        />
      )}

      <div>
        <h2 className="text-xl font-bold text-slate-800">{activity.name}</h2>
        {activity.description && (
          <p className="text-slate-600 mt-2">{activity.description}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <Target className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500">대상 학년</p>
            <p className="text-sm font-medium text-slate-700">{activity.targetGrade}</p>
          </div>
        </div>

        {activity.unitLabel && (
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <Ruler className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500">단위</p>
              <p className="text-sm font-medium text-slate-700">{activity.unitLabel}</p>
            </div>
          </div>
        )}

        {activity.guideText && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
            <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">활동 안내</p>
              <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">{activity.guideText}</p>
            </div>
          </div>
        )}
      </div>

      <Button variant="cta" fullWidth size="lg" onClick={onParticipate}>
        참여하기
      </Button>
    </div>
  );
}
