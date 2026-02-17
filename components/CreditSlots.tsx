import React from 'react';
import { Crown } from 'lucide-react';

interface CreditSlotsProps {
  total: number;
  used: number;
  compact?: boolean;
}

const CreditSlots: React.FC<CreditSlotsProps> = ({ total, used, compact = false }) => {
  const slots = Array.from({ length: total });
  const remaining = total - used;

  return (
    <div className="flex items-center space-x-1">
      {compact ? (
        // Compact view for cards (just number)
        <div className="flex items-center space-x-1 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
           <Crown size={12} className="text-amber-600 fill-amber-600" />
           <span className="text-xs font-bold text-amber-700">{remaining} / {total}</span>
        </div>
      ) : (
        // Detailed "Slots" view for profile
        <div className="flex flex-wrap gap-2">
          {slots.map((_, i) => {
             const isUsed = i < used;
             return (
               <div 
                  key={i}
                  className={`
                    flex items-center justify-center rounded-full transition-all duration-300
                    ${compact ? 'w-4 h-4' : 'w-8 h-8'}
                    ${isUsed ? 'bg-slate-200 border-slate-300' : 'bg-primary border-primary shadow-sm shadow-amber-200'}
                    border-2
                  `}
               >
                 {!isUsed && <Crown size={compact ? 8 : 14} className="text-white fill-white" />}
               </div>
             )
          })}
        </div>
      )}
    </div>
  );
};

export default CreditSlots;
