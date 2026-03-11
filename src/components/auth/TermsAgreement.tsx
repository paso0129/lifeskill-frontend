'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import Button from '@/components/common/Button';

export default function TermsAgreement() {
  const router = useRouter();
  const [allChecked, setAllChecked] = useState(false);
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  const handleAllCheck = () => {
    const next = !allChecked;
    setAllChecked(next);
    setTerms(next);
    setPrivacy(next);
  };

  const handleTermsCheck = () => {
    const next = !terms;
    setTerms(next);
    setAllChecked(next && privacy);
  };

  const handlePrivacyCheck = () => {
    const next = !privacy;
    setPrivacy(next);
    setAllChecked(terms && next);
  };

  const canProceed = terms && privacy;

  return (
    <div className="space-y-6">
      <div
        onClick={handleAllCheck}
        className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
          ${allChecked ? 'border-primary bg-primary-light' : 'border-slate-200 bg-white'}`}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
          ${allChecked ? 'bg-primary' : 'border-2 border-slate-300'}`}>
          {allChecked && <Check className="w-4 h-4 text-white" />}
        </div>
        <span className="font-semibold text-slate-800">전체 동의</span>
      </div>

      <div className="space-y-3 pl-2">
        <div
          onClick={handleTermsCheck}
          className="flex items-center gap-3 p-3 cursor-pointer"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
            ${terms ? 'bg-primary' : 'border-2 border-slate-300'}`}>
            {terms && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-slate-700">
            이용약관 동의 <span className="text-red-500">(필수)</span>
          </span>
        </div>

        <div
          onClick={handlePrivacyCheck}
          className="flex items-center gap-3 p-3 cursor-pointer"
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
            ${privacy ? 'bg-primary' : 'border-2 border-slate-300'}`}>
            {privacy && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-slate-700">
            개인정보 수집 및 이용 동의 <span className="text-red-500">(필수)</span>
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        fullWidth
        disabled={!canProceed}
        onClick={() => router.push('/signup/register')}
      >
        다음
      </Button>
    </div>
  );
}
