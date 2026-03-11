'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useExerciseStore from '@/store/exerciseStore';
import Header from '@/components/common/Header';
import ActivityDetail from '@/components/exercise/ActivityDetail';
import Modal from '@/components/common/Modal';
import FileUploader from '@/components/common/FileUploader';
import Button from '@/components/common/Button';
import api from '@/lib/api';

export default function FitnessDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = Number(params.id);
  const { currentActivity, fetchActivity, isLoading } = useExerciseStore();
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchActivity(activityId);
  }, [activityId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reviewText', reviewText);
      formData.append('activityId', String(activityId));
      await api.post('/api/participations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setShowForm(false);
      router.back();
    } catch {
      // error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="건강체력 활동" />
      <div className="max-w-lg mx-auto px-4 py-6">
        {isLoading || !currentActivity ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <ActivityDetail
            activity={currentActivity}
            onParticipate={() => setShowForm(true)}
          />
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="활동 인증">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUploader onFileSelect={setFile} currentFile={file} />
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="활동 소감을 작성해주세요"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 placeholder:text-slate-400 resize-none"
          />
          <Button variant="cta" fullWidth loading={submitting} type="submit">
            인증완료
          </Button>
        </form>
      </Modal>
    </div>
  );
}
