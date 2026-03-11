'use client';

import Header from '@/components/common/Header';
import TermsAgreement from '@/components/auth/TermsAgreement';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="약관 동의" showProfile={false} />
      <div className="max-w-lg mx-auto px-4 py-8">
        <TermsAgreement />
      </div>
    </div>
  );
}
