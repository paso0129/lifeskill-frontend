'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import ActivityCard from '@/components/exercise/ActivityCard';
import api from '@/lib/api';
import { Activity } from '@/types/exercise';

export default function AssessmentPage() {
  const params = useParams();
  const unitId = params.unit as string;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/units/${unitId}/categories/ASSESSMENT/activities`);
        setActivities(res.data);
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [unitId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="평가" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : activities.length === 0 ? (
          <p className="text-center text-slate-500 py-12">등록된 평가가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onClick={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
