'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Button from '@/components/common/Button';
import api from '@/lib/api';

export default function RegisterForm() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: '',
    gender: '',
    birthDate: '',
    username: '',
    password: '',
    passwordConfirm: '',
    school: '',
    grade: '',
    classNum: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER',
  });

  const [usernameChecked, setUsernameChecked] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'username') {
      setUsernameChecked(false);
      setUsernameAvailable(false);
    }
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const checkUsername = async () => {
    if (!form.username) return;
    try {
      const res = await api.get(`/api/auth/check-username?username=${form.username}`);
      setUsernameChecked(true);
      setUsernameAvailable(res.data.available);
      if (!res.data.available) {
        setErrors((prev) => ({ ...prev, username: '이미 사용중인 아이디입니다.' }));
      }
    } catch {
      setErrors((prev) => ({ ...prev, username: '중복 확인에 실패했습니다.' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name) newErrors.name = '이름을 입력하세요.';
    if (!form.gender) newErrors.gender = '성별을 선택하세요.';
    if (!form.birthDate) newErrors.birthDate = '생년월일을 입력하세요.';
    if (!form.username) newErrors.username = '아이디를 입력하세요.';
    if (!usernameChecked || !usernameAvailable) newErrors.username = '아이디 중복확인을 해주세요.';
    if (!form.password) newErrors.password = '비밀번호를 입력하세요.';
    if (form.password.length < 4) newErrors.password = '비밀번호는 4자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
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
      await signup({
        ...form,
        grade: parseInt(form.grade),
        classNum: parseInt(form.classNum),
      });
      router.push('/');
    } catch {
      setErrors({ form: '회원가입에 실패했습니다.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
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

      {/* Gender */}
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

      {/* Birth Date */}
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

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">아이디</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.username}
            onChange={(e) => updateField('username', e.target.value)}
            placeholder="아이디"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
          />
          <button
            type="button"
            onClick={checkUsername}
            className="px-4 py-3 rounded-xl bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300 transition-colors whitespace-nowrap"
          >
            중복확인
          </button>
        </div>
        {usernameChecked && usernameAvailable && (
          <p className="text-xs text-green-600 mt-1">사용 가능한 아이디입니다.</p>
        )}
        {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="비밀번호"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
        />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
      </div>

      {/* Password Confirm */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={form.passwordConfirm}
          onChange={(e) => updateField('passwordConfirm', e.target.value)}
          placeholder="비밀번호 확인"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
        />
        {errors.passwordConfirm && <p className="text-xs text-red-500 mt-1">{errors.passwordConfirm}</p>}
      </div>

      {/* School */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">학교</label>
        <input
          type="text"
          value={form.school}
          onChange={(e) => updateField('school', e.target.value)}
          placeholder="학교명"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800"
        />
        {errors.school && <p className="text-xs text-red-500 mt-1">{errors.school}</p>}
      </div>

      {/* Grade & Class */}
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
            {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
              <option key={c} value={c}>{c}반</option>
            ))}
          </select>
          {errors.classNum && <p className="text-xs text-red-500 mt-1">{errors.classNum}</p>}
        </div>
      </div>

      {errors.form && (
        <p className="text-sm text-red-500 text-center">{errors.form}</p>
      )}

      <Button variant="primary" fullWidth loading={isLoading} type="submit">
        회원가입
      </Button>
    </form>
  );
}
