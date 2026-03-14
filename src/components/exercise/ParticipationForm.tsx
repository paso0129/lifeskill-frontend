'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/common/FileUploader';
import Button from '@/components/common/Button';
import api from '@/lib/api';
import { Minus, Plus } from 'lucide-react';

interface ParticipationFormProps {
  activityId: number;
  showExerciseCount?: boolean; // 횟수 입력 표시 여부 (체력기르기용)
  defaultCount?: number;
  defaultSets?: number;
}

export default function ParticipationForm({
  activityId,
  showExerciseCount = false,
  defaultCount = 10,
  defaultSets = 3,
}: ParticipationFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [exerciseCount, setExerciseCount] = useState(defaultCount);
  const [exerciseSets, setExerciseSets] = useState(defaultSets);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('인증 사진을 업로드해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('reviewText', reviewText);
      formData.append('activityId', String(activityId));
      if (showExerciseCount) {
        formData.append('exerciseCount', String(exerciseCount));
        formData.append('exerciseSets', String(exerciseSets));
      }

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

  const adjustCount = (delta: number) => {
    setExerciseCount((prev) => Math.max(1, prev + delta));
  };

  const adjustSets = (delta: number) => {
    setExerciseSets((prev) => Math.max(1, prev + delta));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 사진 업로드 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          인증 사진
        </label>
        <FileUploader onFileSelect={setFile} currentFile={file} />
      </div>

      {/* 횟수 입력 (체력기르기 카테고리용) */}
      {showExerciseCount && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              운동 횟수
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => adjustCount(-1)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  min={1}
                  value={exerciseCount}
                  onChange={(e) => setExerciseCount(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-center text-2xl font-bold text-primary bg-transparent border-b-2 border-primary focus:outline-none"
                />
                <span className="text-lg text-slate-500 ml-1">회</span>
              </div>
              <button
                type="button"
                onClick={() => adjustCount(1)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              세트 수
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => adjustSets(-1)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Minus className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex-1 text-center">
                <input
                  type="number"
                  min={1}
                  value={exerciseSets}
                  onChange={(e) => setExerciseSets(Math.max(1, Number(e.target.value)))}
                  className="w-20 text-center text-2xl font-bold text-primary bg-transparent border-b-2 border-primary focus:outline-none"
                />
                <span className="text-lg text-slate-500 ml-1">세트</span>
              </div>
              <button
                type="button"
                onClick={() => adjustSets(1)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-sm text-blue-700">
              총 <span className="font-bold">{exerciseCount * exerciseSets}회</span> 수행
              ({exerciseCount}회 x {exerciseSets}세트)
            </p>
          </div>
        </div>
      )}

      {/* 소감 작성 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          참여 후기
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="후기를 작성해 주세요"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 placeholder:text-slate-400 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="secondary"
          fullWidth
          type="button"
          onClick={() => router.back()}
        >
          취소
        </Button>
        <Button variant="cta" fullWidth loading={isLoading} type="submit">
          인증 완료
        </Button>
      </div>
    </form>
  );
}
