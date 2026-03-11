'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
}

export default function Header({ title, showBack = true, showProfile = true }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-lg mx-auto flex items-center justify-between h-14 px-4">
        <div className="w-10">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>
        <h1 className="text-lg font-semibold text-slate-800 absolute left-1/2 -translate-x-1/2">
          {title}
        </h1>
        <div className="w-10 flex justify-end">
          {showProfile && (
            <button
              onClick={() => router.push('/mypage')}
              className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <User className="w-5 h-5 text-slate-700" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
