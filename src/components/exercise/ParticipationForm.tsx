'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/common/FileUploader';
import Button from '@/components/common/Button';
import api from '@/lib/api';

interface ParticipationFormProps {
  activityId: number;
}

export default function ParticipationForm({ activityId }: ParticipationFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('파일을 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reviewText', reviewText);
      formData.append('activityId', String(activityId));

      await api.post('/api/participations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.back();
    } catch {
      setError('제출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          인증 파일
        </label>
        <FileUploader onFileSelect={setFile} currentFile={file} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          소감 작성
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="활동 소감을 작성해주세요"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 placeholder:text-slate-400 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button variant="cta" fullWidth loading={isLoading} type="submit">
        인증완료
      </Button>
    </form>
  );
}
