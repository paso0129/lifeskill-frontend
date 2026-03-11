'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useExerciseStore from '@/store/exerciseStore';
import Header from '@/components/common/Header';
import ActivityDetail from '@/components/exercise/ActivityDetail';

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = Number(params.id);
  const { currentActivity, fetchActivity, isLoading } = useExerciseStore();

  useEffect(() => {
    fetchActivity(activityId);
  }, [activityId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="수업 활동" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading || !currentActivity ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <ActivityDetail
            activity={currentActivity}
            onParticipate={() => router.back()}
          />
        )}
      </div>
    </div>
  );
}
