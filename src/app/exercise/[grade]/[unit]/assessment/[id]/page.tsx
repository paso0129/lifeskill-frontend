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

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = Number(params.id);
  const { currentActivity, fetchActivity, isLoading } = useExerciseStore();
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivity(activityId);
  }, [activityId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('인증 사진을 업로드해주세요.');
      return;
    }
    setSubmitting(true);
    setError('');
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
      setError('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="평가" />
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
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              인증 사진
            </label>
            <FileUploader onFileSelect={setFile} currentFile={file} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              참여 후기
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="후기를 작성해 주세요"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 placeholder:text-slate-400 resize-none"
            />
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth type="button" onClick={() => setShowForm(false)}>
              취소
            </Button>
            <Button variant="cta" fullWidth loading={submitting} type="submit">
              인증 완료
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
