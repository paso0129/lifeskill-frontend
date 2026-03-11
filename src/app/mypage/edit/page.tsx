'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import api from '@/lib/api';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState({
    name: user?.name || '',
    school: user?.school || '',
    grade: String(user?.grade || ''),
    classNum: String(user?.classNum || ''),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await api.put('/api/auth/profile', {
        name: form.name,
        school: form.school,
        grade: parseInt(form.grade),
        classNum: parseInt(form.classNum),
      });
      setUser(res.data);
      router.back();
    } catch {
      setError('프로필 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="프로필 수정" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">학교</label>
            <input
              type="text"
              value={form.school}
              onChange={(e) => updateField('school', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">학년</label>
              <select
                value={form.grade}
                onChange={(e) => updateField('grade', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 bg-white"
              >
                {[3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>{g}학년</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">반</label>
              <select
                value={form.classNum}
                onChange={(e) => updateField('classNum', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 bg-white"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}반</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button variant="primary" fullWidth loading={isLoading} type="submit">
            저장
          </Button>
        </form>
      </div>
    </div>
  );
}
