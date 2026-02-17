import React, { useState, useRef } from 'react';
import { Appointment, Client, Professional } from '../types';
import { Clock, CheckCircle, Trash2, Crown, User, ChevronRight } from 'lucide-react';
import CreditSlots from './CreditSlots';

interface AppointmentCardProps {
  appointment: Appointment;
  clientData?: Client; // Enriched data for subscription info
  professional?: Professional; // Add professional data
  isNext?: boolean;
  onStatusChange: (id: string, newStatus: Appointment['status']) => void;
  onClientClick?: (clientId: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, clientData, professional, isNext, onStatusChange, onClientClick }) => {
  const [isPressing, setIsPressing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = () => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      setShowActions(true);
      if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    }, 800); // 800ms long press
  };

  const handleTouchEnd = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClientAreaClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent card interactions
    if (onClientClick && appointment.clientId) {
      onClientClick(appointment.clientId);
    }
  };

  const startTimeStr = appointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTimeStr = appointment.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Status colors
  const statusColor = {
    scheduled: 'border-l-4 border-l-slate-300',
    completed: 'border-l-4 border-l-green-500 bg-green-50/50',
    cancelled: 'border-l-4 border-l-red-400 bg-red-50/50',
    noshow: 'border-l-4 border-l-red-500 opacity-60',
  }[appointment.status];

  const isSubscriber = !!clientData?.activeSubscription?.active;

  return (
    <div 
      className="relative mb-4 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart} // For desktop testing
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {/* Transformation wrapper for "squish" effect on press */}
      <div 
        className={`
          relative bg-white rounded-xl shadow-sm border border-slate-100 p-4 transition-transform duration-200
          ${isPressing ? 'scale-95' : 'scale-100'}
          ${isNext ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${statusColor}
        `}
      >
        {isNext && (
          <div className="absolute -top-3 right-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            PRÓXIMO CLIENTE
          </div>
        )}

        <div className="flex items-start gap-4">
          {/* Time Column */}
          <div className="flex flex-col items-center min-w-[50px] pt-1">
            <span className="text-lg font-bold text-slate-800 leading-none">{startTimeStr}</span>
            <span className="text-xs text-slate-400">{endTimeStr}</span>
            <div className={`mt-2 h-full w-0.5 rounded-full ${appointment.status === 'completed' ? 'bg-green-300' : 'bg-slate-200'}`}></div>
          </div>

          {/* Content Column */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div 
                onClick={handleClientAreaClick}
                className="cursor-pointer active:opacity-60 transition-opacity"
              >
                 <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2 group">
                   {appointment.clientName}
                   {isSubscriber && <Crown size={14} className="text-amber-500 fill-amber-500" />}
                   <ChevronRight size={14} className="text-slate-300 opacity-0 -ml-1 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                 </h3>
                 <p className="text-slate-500 text-sm">{appointment.serviceName}</p>
              </div>
              
              {/* Avatar also clickable */}
              <div 
                onClick={handleClientAreaClick}
                className="h-10 w-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer"
              >
                {appointment.clientPhoto ? (
                    <img src={appointment.clientPhoto} alt={appointment.clientName} className="h-full w-full object-cover" />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">IMG</div>
                )}
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                  {isSubscriber && clientData?.activeSubscription ? (
                    <CreditSlots 
                      total={clientData.activeSubscription.totalCredits} 
                      used={clientData.activeSubscription.usedCredits}
                      compact={true}
                    />
                  ) : (
                     <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">Avulso</span>
                  )}

                  {professional && (
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                          {professional.photoUrl ? (
                              <img src={professional.photoUrl} className="w-4 h-4 rounded-full" />
                          ) : <User size={10} className="text-slate-400"/>}
                          <span className="text-[10px] text-slate-500 font-medium truncate max-w-[60px]">{professional.name.split(' ')[0]}</span>
                      </div>
                  )}
              </div>
              
              {appointment.status === 'scheduled' && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(appointment.id, 'completed');
                  }}
                  className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg active:scale-95 transition-transform"
                >
                  Iniciar
                </button>
              )}
               {appointment.status === 'completed' && (
                <span className="flex items-center text-green-600 text-xs font-bold gap-1">
                   <CheckCircle size={14} /> Finalizado
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Long Press Action Menu Overlay */}
      {showActions && (
        <div className="absolute inset-0 bg-slate-900/90 rounded-xl z-10 flex items-center justify-center gap-6 animate-fade-in backdrop-blur-sm">
          <button 
            onClick={() => { setShowActions(false); onStatusChange(appointment.id, 'cancelled'); }}
            className="flex flex-col items-center text-red-400"
          >
            <div className="bg-red-500/20 p-3 rounded-full mb-1">
              <Trash2 size={24} />
            </div>
            <span className="text-xs font-bold">Cancelar</span>
          </button>
          
          <button 
             onClick={() => setShowActions(false)}
             className="text-white text-sm font-medium border border-white/30 px-4 py-2 rounded-full"
          >
            Fechar
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;