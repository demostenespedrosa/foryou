import React from 'react';
import { WeeklySchedule, Professional } from '../types';
import ScheduleEditor from '../components/ScheduleEditor';
import { ArrowLeft } from 'lucide-react';

interface ScheduleSettingsProps {
  initialSchedule: WeeklySchedule;
  onSave: (schedule: WeeklySchedule) => void;
  onBack: () => void;
  title?: string;
}

const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({ initialSchedule, onSave, onBack, title }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50">
        <div className="bg-white p-4 flex items-center gap-4 border-b border-slate-100">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-800">Voltar</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
            <ScheduleEditor 
                initialSchedule={initialSchedule} 
                onSave={(s) => { onSave(s); onBack(); }} 
                title={title || "Configuração de Horários"}
            />
        </div>
    </div>
  );
};

export default ScheduleSettings;
