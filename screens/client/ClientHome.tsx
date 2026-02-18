import React, { useState, useMemo } from 'react';
import { Appointment, Professional, Service, WeeklySchedule } from '../../types';
import { Calendar, ChevronRight, Clock, Scissors, User, CheckCircle, ChevronLeft, MapPin } from 'lucide-react';

interface ClientHomeProps {
  professionals: Professional[];
  services: Service[];
  existingAppointments: Appointment[];
  onBook: (appointment: Appointment) => void;
  clientId: string;
  clientName: string;
}

// ... (Helper functions remain the same, kept for logic integrity)
const getTimeSlots = (
    date: Date, 
    durationMinutes: number, 
    appointments: Appointment[], 
    schedule: WeeklySchedule
) => {
    const slots = [];
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase() as keyof WeeklySchedule;
    const daySchedule = schedule[dayOfWeek];

    if (!daySchedule?.isOpen) return [];

    const timeToMinutes = (str: string) => {
        const [h, m] = str.split(':').map(Number);
        return h * 60 + m;
    };

    const ranges = daySchedule.ranges;
    
    for (const range of ranges) {
        let current = timeToMinutes(range.start);
        const end = timeToMinutes(range.end);

        while (current + durationMinutes <= end) {
            const h = Math.floor(current / 60);
            const m = current % 60;
            
            const slotStart = new Date(date);
            slotStart.setHours(h, m, 0, 0);
            const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000);

            if (slotStart < new Date()) {
                current += 30; 
                continue;
            }

            const isBusy = appointments.some(app => {
                 return (slotStart < app.endTime && slotEnd > app.startTime);
            });

            if (!isBusy) {
                slots.push(slotStart);
            }

            current += 30;
        }
    }
    return slots;
};

const ClientHome: React.FC<ClientHomeProps> = ({ professionals, services, existingAppointments, onBook, clientId, clientName }) => {
  const [step, setStep] = useState(1);
  const [selectedProfId, setSelectedProfId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  // Computed data
  const selectedProf = professionals.find(p => p.id === selectedProfId);
  const selectedService = services.find(s => s.id === selectedServiceId);

  // Calendar Days
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let i = 0; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    return days;
  }, []);

  // Time Slots
  const availableSlots = useMemo(() => {
      if (!selectedProf || !selectedService) return [];
      const profApps = existingAppointments.filter(a => a.professionalId === selectedProfId);
      return getTimeSlots(selectedDate, selectedService.durationMinutes, profApps, selectedProf.schedule);
  }, [selectedProf, selectedService, selectedDate, existingAppointments]);

  // Group slots
  const groupedSlots = useMemo(() => {
      return {
          morning: availableSlots.filter(d => d.getHours() < 12),
          afternoon: availableSlots.filter(d => d.getHours() >= 12 && d.getHours() < 18),
          evening: availableSlots.filter(d => d.getHours() >= 18)
      };
  }, [availableSlots]);

  const handleBooking = () => {
      if (!selectedProfId || !selectedServiceId || !selectedTime) return;
      const newApp: Appointment = {
          id: `app_${Math.random()}`,
          clientId,
          clientName,
          professionalId: selectedProfId,
          serviceId: selectedServiceId,
          serviceName: selectedService!.name,
          startTime: selectedTime,
          endTime: new Date(selectedTime.getTime() + selectedService!.durationMinutes * 60000),
          status: 'scheduled',
          isSubscription: false
      };
      onBook(newApp);
      // Reset
      setStep(1);
      setSelectedProfId(null);
      setSelectedServiceId(null);
      setSelectedTime(null);
  };

  // --- Components for each Step ---

  const StepIndicator = () => (
      <div className="flex items-center gap-1 mb-6 px-1">
          {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-full flex-1 transition-colors duration-500 ${i <= step ? 'bg-primary' : 'bg-slate-200'}`} />
          ))}
      </div>
  );

  const Header = ({ title, subtitle, showBack = true }: any) => (
      <div className="mb-4">
         {showBack && step > 1 && (
             <button onClick={() => setStep(step - 1)} className="flex items-center text-slate-400 mb-2 font-bold text-sm">
                 <ChevronLeft size={20} /> Voltar
             </button>
         )}
         <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
         <p className="text-slate-500 mt-1 text-lg">{subtitle}</p>
      </div>
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24 relative overflow-hidden">
       <div className="p-6 pb-0 max-w-lg mx-auto w-full">
           <StepIndicator />
       </div>

       <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-6 pt-2 max-w-lg mx-auto w-full">
           
           {/* STEP 1: Professional */}
           {step === 1 && (
               <div className="animate-slide-in">
                   <Header title="Quem vai te atender?" subtitle="Escolha o profissional de sua preferência." showBack={false} />
                   
                   <div className="grid grid-cols-1 gap-4 mt-6">
                       {professionals.map(prof => (
                           <button
                               key={prof.id}
                               onClick={() => { setSelectedProfId(prof.id); setStep(2); }}
                               className="bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm flex items-center gap-5 active:scale-95 transition-all hover:border-primary group text-left"
                           >
                               <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center text-2xl font-bold text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                   {prof.photoUrl ? (
                                       <img src={prof.photoUrl} className="w-full h-full object-cover rounded-2xl" />
                                   ) : (
                                       prof.name.charAt(0).toUpperCase()
                                   )}
                               </div>
                               <div>
                                   <h3 className="font-bold text-slate-800 text-xl group-hover:text-primary transition-colors">{prof.name}</h3>
                                   <p className="text-slate-500 font-medium">{prof.role}</p>
                                   <div className="flex items-center gap-1 mt-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                                       <CheckCircle size={12} /> Disponível hoje
                                   </div>
                               </div>
                               <div className="ml-auto bg-slate-50 p-3 rounded-full text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                   <ChevronRight size={24} />
                               </div>
                           </button>
                       ))}
                   </div>
               </div>
           )}

           {/* STEP 2: Service */}
           {step === 2 && (
               <div className="animate-slide-in">
                    <Header title="Qual o serviço?" subtitle={`O que você gostaria de fazer com ${selectedProf?.name.split(' ')[0]}?`} />
                    
                    <div className="space-y-4 mt-6">
                        {services.map(svc => (
                            <button
                                key={svc.id}
                                onClick={() => { setSelectedServiceId(svc.id); setStep(3); }}
                                className="w-full bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm flex justify-between items-center active:bg-slate-50 transition-all hover:border-primary group text-left"
                            >
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">{svc.name}</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-sm text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg">
                                            <Clock size={14} /> {svc.durationMinutes} min
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-xl text-slate-900">R$ {svc.price.toFixed(0)}</span>
                                    <span className="text-xs text-slate-400">c/ {selectedProf?.name.split(' ')[0]}</span>
                                </div>
                            </button>
                        ))}
                    </div>
               </div>
           )}

           {/* STEP 3: Date & Time */}
           {step === 3 && (
               <div className="animate-slide-in pb-20">
                   <Header title="Quando?" subtitle="Selecione o melhor dia e horário." />
                   
                   {/* Calendar */}
                   <div className="mt-4">
                       <p className="text-sm font-bold text-slate-800 mb-3 ml-1">Selecione o Dia</p>
                       <div className="flex overflow-x-auto no-scrollbar gap-3 pb-4 -mx-6 px-6">
                            {calendarDays.map((date, idx) => {
                                const isSelected = date.getDate() === selectedDate.getDate();
                                const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
                                const isToday = new Date().getDate() === date.getDate();
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                                        className={`
                                            flex flex-col items-center justify-center min-w-[70px] h-[90px] rounded-3xl transition-all border-2 snap-center
                                            ${isSelected 
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-300 transform scale-105' 
                                                : 'bg-white border-slate-100 text-slate-400'}
                                        `}
                                    >
                                        <span className="text-xs font-bold uppercase mb-1">{isToday ? 'Hoje' : dayName}</span>
                                        <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>{date.getDate()}</span>
                                    </button>
                                )
                            })}
                       </div>
                   </div>

                   {/* Time Slots */}
                   <div className="mt-4">
                       <p className="text-sm font-bold text-slate-800 mb-3 ml-1">Horários Disponíveis</p>
                       
                       {availableSlots.length === 0 ? (
                           <div className="bg-slate-100 rounded-3xl p-8 text-center text-slate-400 border border-slate-200">
                               <Clock size={40} className="mx-auto mb-2 opacity-50" />
                               <p>Agenda cheia para este dia.</p>
                           </div>
                       ) : (
                           <div className="space-y-6">
                               {groupedSlots.morning.length > 0 && (
                                   <SlotGroup title="Manhã" icon={<span className="text-yellow-500">☀</span>} slots={groupedSlots.morning} selected={selectedTime} onSelect={setSelectedTime} />
                               )}
                               {groupedSlots.afternoon.length > 0 && (
                                   <SlotGroup title="Tarde" icon={<span className="text-orange-500">🌤</span>} slots={groupedSlots.afternoon} selected={selectedTime} onSelect={setSelectedTime} />
                               )}
                               {groupedSlots.evening.length > 0 && (
                                   <SlotGroup title="Noite" icon={<span className="text-indigo-500">🌙</span>} slots={groupedSlots.evening} selected={selectedTime} onSelect={setSelectedTime} />
                               )}
                           </div>
                       )}
                   </div>
               </div>
           )}

           {/* STEP 4: Summary & Confirm */}
           {step === 4 && (
               <div className="animate-slide-in">
                   <Header title="Revisão" subtitle="Confira os detalhes antes de agendar." />

                   <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-4 space-y-6">
                       
                       {/* Profissional */}
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                                {selectedProf?.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Profissional</p>
                                <p className="text-lg font-bold text-slate-900">{selectedProf?.name}</p>
                            </div>
                       </div>

                       {/* Serviço */}
                       <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center">
                                <Scissors size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Serviço</p>
                                <p className="text-lg font-bold text-slate-900">{selectedService?.name}</p>
                                <p className="text-sm font-bold text-primary">R$ {selectedService?.price.toFixed(2)}</p>
                            </div>
                       </div>

                       {/* Data */}
                       <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Data e Hora</p>
                                <p className="text-lg font-bold text-slate-900">
                                    {selectedTime?.toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-xl font-bold text-slate-900">
                                    às {selectedTime?.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                       </div>
                   </div>

                   <div className="bg-yellow-50 p-4 rounded-2xl mt-4 flex gap-3 items-start">
                       <MapPin className="text-yellow-600 mt-1 shrink-0" size={20} />
                       <div>
                           <p className="font-bold text-yellow-800 text-sm">ForYou Studio Recife</p>
                           <p className="text-xs text-yellow-700">Av. Conselheiro Aguiar, 1472 - Boa Viagem</p>
                       </div>
                   </div>
               </div>
           )}

       </div>

       {/* Floating Bottom Action Area */}
       <div className="fixed bottom-[85px] left-0 w-full px-6 z-20">
           {step === 3 && selectedTime && (
               <button
                   onClick={() => setStep(4)}
                   className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-300 active:scale-95 transition-transform flex items-center justify-center gap-2 animate-slide-in"
               >
                   Continuar <ChevronRight size={20} />
               </button>
           )}
           {step === 4 && (
               <button
                   onClick={handleBooking}
                   className="w-full bg-primary text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2 animate-slide-in"
               >
                   <CheckCircle size={20} /> Confirmar Agendamento
               </button>
           )}
       </div>
    </div>
  );
};

// Componente visual de slot de tempo aprimorado
const SlotGroup = ({ title, icon, slots, selected, onSelect }: any) => (
    <div>
        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3">
            {icon} {title}
        </h4>
        <div className="grid grid-cols-4 gap-3">
            {slots.map((slot: Date, i: number) => {
                const isSelected = selected?.getTime() === slot.getTime();
                return (
                    <button
                        key={i}
                        onClick={() => onSelect(slot)}
                        className={`
                            py-3 rounded-xl text-sm font-bold border-2 transition-all
                            ${isSelected 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg transform scale-105' 
                                : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300'}
                        `}
                    >
                        {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                )
            })}
        </div>
    </div>
);

export default ClientHome;