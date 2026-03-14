'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';

interface School {
  name: string;
  address: string;
  region: string;
  code: string;
}

export default function KakaoCompletePage() {
  const router = useRouter();
  const { completeKakaoProfile, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthDate: '',
    school: '',
    grade: '',
    classNum: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 학교 검색
  const [schoolQuery, setSchoolQuery] = useState('');
  const [schoolResults, setSchoolResults] = useState<School[]>([]);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [schoolSearching, setSchoolSearching] = useState(false);
  const schoolRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (schoolQuery.length < 2) {
      setSchoolResults([]);
      setShowSchoolDropdown(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSchoolSearching(true);
      try {
        const res = await fetch(`/api/schools?q=${encodeURIComponent(schoolQuery)}`);
        const data = await res.json();
        setSchoolResults(data);
        setShowSchoolDropdown(data.length > 0);
      } catch {
        setSchoolResults([]);
      } finally {
        setSchoolSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [schoolQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (schoolRef.current && !schoolRef.current.contains(e.target as Node)) {
        setShowSchoolDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = '이름을 입력하세요.';
    if (!form.gender) newErrors.gender = '성별을 선택하세요.';
    if (!form.birthDate) newErrors.birthDate = '생년월일을 입력하세요.';
    if (!form.school) newErrors.school = '학교를 입력하세요.';
    if (!form.grade) newErrors.grade = '학년을 선택하세요.';
    if (!form.classNum) newErrors.classNum = '반을 선택하세요.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await completeKakaoProfile({
        ...form,
        grade: parseInt(form.grade),
        classNum: parseInt(form.classNum),
      });
      router.replace('/');
    } catch {
      setErrors({ form: '프로필 저장에 실패했습니다.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="추가 정보 입력" showBack={false} showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-6 text-center">
          서비스 이용을 위해 추가 정보를 입력해주세요.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">이름</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="이름"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">성별</label>
            <div className="flex gap-4">
              {['남', '여'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700">{g}</span>
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">생년월일</label>
            <input
              type="date"
              value={form.birthDate}
              onChange={(e) => updateField('birthDate', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
            />
            {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
          </div>

          {/* 학교 - 자동완성 */}
          <div ref={schoolRef} className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">학교</label>
            <input
              type="text"
              value={form.school || schoolQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSchoolQuery(val);
                if (form.school) updateField('school', '');
              }}
              onFocus={() => {
                if (schoolResults.length > 0) setShowSchoolDropdown(true);
              }}
              placeholder="학교명 검색 (2글자 이상)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
            />
            {schoolSearching && (
              <div className="absolute right-3 top-[38px]">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {form.school && (
              <p className="text-xs text-green-600 mt-1">✓ {form.school}</p>
            )}
            {showSchoolDropdown && (
              <ul className="absolute z-50 w-full bottom-full mb-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {schoolResults.map((s) => (
                  <li
                    key={s.code}
                    onClick={() => {
                      updateField('school', s.name);
                      setSchoolQuery(s.name);
                      setShowSchoolDropdown(false);
                    }}
                    className="px-4 py-3 hover:bg-primary/10 cursor-pointer border-b border-slate-100 last:border-0"
                  >
                    <p className="text-sm font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.region} · {s.address}</p>
                  </li>
                ))}
              </ul>
            )}
            {errors.school && <p className="text-xs text-red-500 mt-1">{errors.school}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">학년</label>
              <select
                value={form.grade}
                onChange={(e) => updateField('grade', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 bg-white"
              >
                <option value="">선택</option>
                {[3, 4, 5, 6].map((g) => (
                  <option key={g} value={g}>{g}학년</option>
                ))}
              </select>
              {errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">반</label>
              <select
                value={form.classNum}
                onChange={(e) => updateField('classNum', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 bg-white"
              >
                <option value="">선택</option>
                {Array.from({ length: 15 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}반</option>
                ))}
              </select>
              {errors.classNum && <p className="text-xs text-red-500 mt-1">{errors.classNum}</p>}
            </div>
          </div>

          {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}

          <Button variant="primary" fullWidth loading={isLoading} type="submit">
            완료
          </Button>
        </form>
      </div>
    </div>
  );
}
