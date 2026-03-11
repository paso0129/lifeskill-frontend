'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/common/Header';
import ParticipationForm from '@/components/exercise/ParticipationForm';

export default function HomeParticipatePage() {
  const params = useParams();
  const activityId = Number(params.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="활동 인증" />
      <div className="max-w-lg mx-auto px-4 py-6">
        <ParticipationForm activityId={activityId} />
      </div>
    </div>
  );
}
