import React, { useState } from 'react';
import { WeeklySchedule, DayOfWeek, TimeRange } from '../types';
import { Clock, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ScheduleEditorProps {
  initialSchedule: WeeklySchedule;
  onSave: (schedule: WeeklySchedule) => void;
  title: string;
}

const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: 'mon', label: 'Segunda-feira' },
  { key: 'tue', label: 'Terça-feira' },
  { key: 'wed', label: 'Quarta-feira' },
  { key: 'thu', label: 'Quinta-feira' },
  { key: 'fri', label: 'Sexta-feira' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
];

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ initialSchedule, onSave, title }) => {
  const [schedule, setSchedule] = useState<WeeklySchedule>(initialSchedule);
  const [expandedDay, setExpandedDay] = useState<DayOfWeek | null>(null);

  const toggleDayOpen = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
        // If opening and no ranges, add a default one
        ranges: !prev[day].isOpen && prev[day].ranges.length === 0 
          ? [{ start: '09:00', end: '18:00' }] 
          : prev[day].ranges
      }
    }));
    if (!schedule[day].isOpen) {
        setExpandedDay(day);
    }
  };

  const addRange = (day: DayOfWeek) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ranges: [...prev[day].ranges, { start: '12:00', end: '13:00' }]
      }
    }));
  };

  const removeRange = (day: DayOfWeek, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        ranges: prev[day].ranges.filter((_, i) => i !== index)
      }
    }));
  };

  const updateRange = (day: DayOfWeek, index: number, field: keyof TimeRange, value: string) => {
    setSchedule(prev => {
      const newRanges = [...prev[day].ranges];
      newRanges[index] = { ...newRanges[index], [field]: value };
      return {
        ...prev,
        [day]: { ...prev[day], ranges: newRanges }
      };
    });
  };

  const toggleExpand = (day: DayOfWeek) => {
      if (expandedDay === day) {
          setExpandedDay(null);
      } else {
          setExpandedDay(day);
      }
  }

  return (
    <div className="bg-slate-50 min-h-full pb-24">
      <div className="p-4 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">Defina os horários de trabalho e pausas.</p>
      </div>

      <div className="p-4 space-y-3">
        {DAYS.map(({ key, label }) => {
          const dayConfig = schedule[key];
          const isExpanded = expandedDay === key;

          return (
            <div key={key} className={`bg-white rounded-xl border transition-all duration-300 ${isExpanded ? 'border-primary shadow-md' : 'border-slate-200'}`}>
              
              {/* Day Header */}
              <div 
                className="flex items-center justify-between p-4"
                onClick={() => toggleExpand(key)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    onClick={(e) => { e.stopPropagation(); toggleDayOpen(key); }}
                    className={`
                        w-12 h-7 rounded-full relative transition-colors duration-300 cursor-pointer
                        ${dayConfig.isOpen ? 'bg-primary' : 'bg-slate-200'}
                    `}
                  >
                    <div className={`
                        absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm
                        ${dayConfig.isOpen ? 'left-6' : 'left-1'}
                    `} />
                  </div>
                  <span className={`font-bold ${dayConfig.isOpen ? 'text-slate-800' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                
                {dayConfig.isOpen && (
                   <div className="flex items-center text-slate-400">
                      <span className="text-xs mr-2">
                        {dayConfig.ranges.length > 0 
                            ? `${dayConfig.ranges.length} turno(s)` 
                            : 'Sem horários'}
                      </span>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                   </div>
                )}
              </div>

              {/* Expandable Content */}
              {isExpanded && dayConfig.isOpen && (
                <div className="px-4 pb-4 animate-slide-in">
                  <div className="space-y-3 border-t border-slate-100 pt-4">
                    {dayConfig.ranges.map((range, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                           <Clock size={16} className="text-slate-400" />
                           <input 
                              type="time" 
                              value={range.start}
                              onChange={(e) => updateRange(key, idx, 'start', e.target.value)}
                              className="bg-transparent font-bold text-slate-700 outline-none text-sm"
                           />
                           <span className="text-slate-400">-</span>
                           <input 
                              type="time" 
                              value={range.end}
                              onChange={(e) => updateRange(key, idx, 'end', e.target.value)}
                              className="bg-transparent font-bold text-slate-700 outline-none text-sm"
                           />
                        </div>
                        <button 
                            onClick={() => removeRange(key, idx)}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                      </div>
                    ))}

                    <button 
                        onClick={() => addRange(key)}
                        className="w-full py-3 flex items-center justify-center gap-2 text-primary font-bold text-sm bg-primary/5 rounded-lg border border-dashed border-primary/30 active:bg-primary/10 transition-colors"
                    >
                        <Plus size={16} /> Adicionar Pausa/Turno
                    </button>
                    
                    <p className="text-[10px] text-slate-400 text-center mt-2">
                        Adicione múltiplos turnos para criar pausas (ex: Almoço).
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-[90px] left-0 w-full px-4">
        <button 
            onClick={() => onSave(schedule)}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-300 active:scale-95 transition-transform"
        >
            Salvar Alterações
        </button>
      </div>
    </div>
  );
};

export default ScheduleEditor;
