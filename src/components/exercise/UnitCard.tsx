'use client';

import { Unit } from '@/types/exercise';
import { Trophy } from 'lucide-react';

interface UnitCardProps {
  unit: Unit;
  onClick: () => void;
}

export default function UnitCard({ unit, onClick }: UnitCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl p-5 shadow-sm cursor-pointer
        hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]
        transition-all duration-200 border border-slate-100"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
          <Trophy className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800">{unit.name}</h3>
          {unit.description && (
            <p className="text-sm text-slate-500 mt-1">{unit.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
