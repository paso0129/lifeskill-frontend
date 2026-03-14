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

function isUnder14(birthDate: string): boolean {
  if (!birthDate) return false;
  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();
  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
  return actualAge < 14;
}

export default function KakaoCompletePage() {
  const router = useRouter();
  const { completeKakaoProfile, isLoading } = useAuthStore();

  const [step, setStep] = useState<'form' | 'guardian'>('form');

  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthDate: '',
    school: '',
    grade: '',
    classNum: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER',
  });

  const [guardian, setGuardian] = useState({
    name: '',
    phone: '',
    relationship: '',
    agreed: false,
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

  const validateGuardian = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!guardian.name) newErrors.guardianName = '보호자 이름을 입력하세요.';
    if (!guardian.phone) newErrors.guardianPhone = '보호자 연락처를 입력하세요.';
    if (!/^01[0-9]\d{7,8}$/.test(guardian.phone.replace(/-/g, ''))) {
      newErrors.guardianPhone = '올바른 연락처를 입력하세요.';
    }
    if (!guardian.relationship) newErrors.guardianRelationship = '관계를 선택하세요.';
    if (!guardian.agreed) newErrors.guardianAgreed = '보호자 동의가 필요합니다.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (form.role === 'STUDENT' && isUnder14(form.birthDate)) {
      setStep('guardian');
    } else {
      doSubmit();
    }
  };

  const handleGuardianSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateGuardian()) return;
    doSubmit();
  };

  const doSubmit = async () => {
    try {
      await completeKakaoProfile({
        ...form,
        grade: parseInt(form.grade),
        classNum: parseInt(form.classNum),
      });
      router.replace('/');
    } catch {
      setErrors({ form: '프로필 저장에 실패했습니다.' });
      setStep('form');
    }
  };

  if (step === 'guardian') {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <Header title="보호자 동의" showBack={false} showProfile={false} />
        <div className="max-w-lg mx-auto px-4 py-6">
          <form onSubmit={handleGuardianSubmit} className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                만 14세 미만 학생의 안전한 회원가입을 위하여<br />
                보호자(법정대리인)의 동의가 필요합니다.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">보호자 이름</label>
              <input
                type="text"
                value={guardian.name}
                onChange={(e) => setGuardian(prev => ({ ...prev, name: e.target.value }))}
                placeholder="보호자 이름"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
              />
              {errors.guardianName && <p className="text-xs text-red-500 mt-1">{errors.guardianName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">보호자 연락처</label>
              <input
                type="tel"
                value={guardian.phone}
                onChange={(e) => setGuardian(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
              />
              {errors.guardianPhone && <p className="text-xs text-red-500 mt-1">{errors.guardianPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">관계</label>
              <select
                value={guardian.relationship}
                onChange={(e) => setGuardian(prev => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 bg-white"
              >
                <option value="">선택</option>
                <option value="부">부</option>
                <option value="모">모</option>
                <option value="조부">조부</option>
                <option value="조모">조모</option>
                <option value="기타">기타</option>
              </select>
              {errors.guardianRelationship && <p className="text-xs text-red-500 mt-1">{errors.guardianRelationship}</p>}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
              <p className="text-sm font-medium text-slate-700">개인정보 수집 및 이용 동의</p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>- 수집 항목: 학생 이름, 생년월일, 성별, 학교, 학년, 반</p>
                <p>- 수집 목적: 체육 활동 참여 기록 및 관리</p>
                <p>- 보유 기간: 회원 탈퇴 시까지</p>
              </div>
              <label className="flex items-start gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={guardian.agreed}
                  onChange={(e) => setGuardian(prev => ({ ...prev, agreed: e.target.checked }))}
                  className="w-5 h-5 text-primary focus:ring-primary mt-0.5 rounded"
                />
                <span className="text-sm text-slate-700">
                  위 내용을 확인하였으며, 보호자로서 본 학생의 회원가입에 동의합니다.
                </span>
              </label>
              {errors.guardianAgreed && <p className="text-xs text-red-500 mt-1">{errors.guardianAgreed}</p>}
            </div>

            {errors.form && <p className="text-sm text-red-500 text-center">{errors.form}</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setStep('form'); setErrors({}); }}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                이전
              </button>
              <Button variant="primary" fullWidth loading={isLoading} type="submit">
                가입완료
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <Header title="추가 정보 입력" showBack={false} showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-6 text-center">
          서비스 이용을 위해 추가 정보를 입력해주세요.
        </p>
        <form onSubmit={handleNext} className="space-y-4">
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
              <p className="text-xs text-green-600 mt-1">{form.school}</p>
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
            {form.role === 'STUDENT' && form.birthDate && isUnder14(form.birthDate) ? '다음' : '완료'}
          </Button>
        </form>
      </div>
    </div>
  );
}
