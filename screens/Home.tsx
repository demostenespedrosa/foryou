import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Appointment, Client, Professional, Service } from '../types';
import AppointmentCard from '../components/AppointmentCard';
import { CardSkeleton } from '../components/Skeleton';
import { Plus, Users, Calendar as CalendarIcon, X, Clock, Scissors, User, Crown } from 'lucide-react';

interface HomeProps {
  appointments: Appointment[];
  clients: Client[];
  professionals: Professional[];
  services: Service[];
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onNewAppointment: (appointment: Appointment) => void;
  onClientClick?: (clientId: string) => void;
}

const Home: React.FC<HomeProps> = ({ appointments, clients, professionals, services, onUpdateStatus, onNewAppointment, onClientClick }) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProfId, setSelectedProfId] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientId, setNewClientId] = useState('');
  const [newServiceId, setNewServiceId] = useState('');
  const [newProfId, setNewProfId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [useCredits, setUseCredits] = useState(false);

  const dateScrollRef = useRef<HTMLDivElement>(null);

  // Simulate initial load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Initialize form defaults when modal opens
  useEffect(() => {
    if (isModalOpen) {
        // Default to selected date in calendar or today
        const defaultDate = selectedDate >= new Date() ? selectedDate : new Date();
        setNewDate(defaultDate.toISOString().split('T')[0]);
        
        // Default time to next hour
        const now = new Date();
        now.setHours(now.getHours() + 1, 0, 0, 0);
        setNewTime(now.toTimeString().slice(0, 5));

        // Default to first professional
        if (professionals.length > 0) setNewProfId(professionals[0].id);
    }
  }, [isModalOpen, selectedDate, professionals]);

  // Generate 2 weeks of dates around selected date
  const calendarDays = useMemo(() => {
    const days = [];
    // Start 3 days before today, go 14 days ahead
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for (let i = -3; i <= 14; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    return days;
  }, []);

  // Filter Logic
  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(app => {
        // Date Match
        const appDate = new Date(app.startTime);
        const isSameDay = appDate.getDate() === selectedDate.getDate() &&
                          appDate.getMonth() === selectedDate.getMonth() &&
                          appDate.getFullYear() === selectedDate.getFullYear();
        
        // Professional Match
        const isSameProf = selectedProfId ? app.professionalId === selectedProfId : true;

        return isSameDay && isSameProf;
      })
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }, [appointments, selectedDate, selectedProfId]);

  // Statistics for the view
  const stats = useMemo(() => {
    const scheduled = filteredAppointments.filter(a => a.status === 'scheduled').length;
    
    const value = filteredAppointments.reduce((acc, curr) => {
        if (curr.status === 'cancelled') return acc;
        // Simple heuristic for demo value
        return acc + 40; 
    }, 0);
    
    return { scheduled, value };
  }, [filteredAppointments]);

  // Helper for Date Display
  const formatDate = (date: Date) => {
      const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      const dayNumber = date.getDate();
      return { dayName, dayNumber };
  };

  const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
      return date.getDate() === selectedDate.getDate() &&
             date.getMonth() === selectedDate.getMonth() &&
             date.getFullYear() === selectedDate.getFullYear();
  };

  const handleSaveAppointment = () => {
      if (!newClientId || !newServiceId || !newProfId || !newDate || !newTime) return;

      const client = clients.find(c => c.id === newClientId);
      const service = services.find(s => s.id === newServiceId);
      
      if (!client || !service) return;

      const startDateTime = new Date(`${newDate}T${newTime}`);
      const endDateTime = new Date(startDateTime.getTime() + service.durationMinutes * 60000);

      const newAppointment: Appointment = {
          id: `appt_${Math.random().toString(36).substr(2, 9)}`,
          clientId: client.id,
          clientName: client.name,
          clientPhoto: client.photoUrl,
          professionalId: newProfId,
          serviceId: service.id,
          serviceName: service.name,
          startTime: startDateTime,
          endTime: endDateTime,
          status: 'scheduled',
          isSubscription: useCredits
      };

      onNewAppointment(newAppointment);
      setIsModalOpen(false);
      
      // Reset form
      setNewClientId('');
      setNewServiceId('');
      setUseCredits(false);
  };

  // Check if selected client has active subscription
  const selectedClientObj = clients.find(c => c.id === newClientId);
  const hasActiveSub = selectedClientObj?.activeSubscription?.active;

  return (
    <div className="pb-24 pt-2 min-h-full bg-slate-50 flex flex-col">
      
      {/* Header Sticky Area */}
      <div className="bg-white sticky top-0 z-20 shadow-sm pt-2 pb-1 rounded-b-2xl mb-4">
          
          {/* Top Bar: Month & Year */}
          <div className="flex justify-between items-center px-4 mb-3">
            <div className="flex items-center gap-2">
                 <CalendarIcon size={20} className="text-primary" />
                 <h1 className="text-xl font-bold text-slate-800 capitalize">
                    {selectedDate.toLocaleDateString('pt-BR', { month: 'long' })}
                 </h1>
            </div>
            <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {selectedDate.getFullYear()}
            </span>
          </div>

          {/* Calendar Strip */}
          <div 
            ref={dateScrollRef}
            className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-3"
          >
            {calendarDays.map((date, idx) => {
                const { dayName, dayNumber } = formatDate(date);
                const selected = isSelected(date);
                const today = isToday(date);

                return (
                    <button
                        key={idx}
                        onClick={() => setSelectedDate(date)}
                        className={`
                            flex flex-col items-center justify-center min-w-[56px] h-20 rounded-2xl transition-all duration-300 snap-center
                            ${selected 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-300 scale-105' 
                                : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-slate-300'
                            }
                        `}
                    >
                        <span className={`text-[10px] font-bold uppercase mb-1 ${selected ? 'text-slate-400' : 'text-slate-400'}`}>
                            {dayName}
                        </span>
                        <span className={`text-xl font-bold ${selected ? 'text-white' : 'text-slate-800'}`}>
                            {dayNumber}
                        </span>
                        {today && (
                            <div className={`w-1.5 h-1.5 rounded-full mt-1 ${selected ? 'bg-primary' : 'bg-primary'}`} />
                        )}
                    </button>
                )
            })}
          </div>

          {/* Team Filter */}
          <div className="flex items-center px-4 gap-3 py-2 border-t border-slate-50 overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setSelectedProfId(null)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all
                    ${selectedProfId === null 
                        ? 'bg-primary text-white shadow-md shadow-amber-200' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }
                `}
            >
                <Users size={14} /> Todos
            </button>
            {professionals.map(prof => (
                <button
                    key={prof.id}
                    onClick={() => setSelectedProfId(prof.id)}
                    className={`
                        flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                        ${selectedProfId === prof.id 
                            ? 'bg-white border-primary text-primary shadow-sm' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }
                    `}
                >
                    <img src={prof.photoUrl} className="w-6 h-6 rounded-full bg-slate-200 object-cover" />
                    {prof.name.split(' ')[0]}
                </button>
            ))}
          </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 flex-1">
          
          {/* Daily Stats Summary */}
          <div className="flex justify-between items-end mb-4 animate-fade-in">
              <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Resumo do Dia</p>
                  <p className="text-slate-500 text-sm">
                    {filteredAppointments.length} agendamentos totais
                  </p>
              </div>
              <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Potencial</p>
                  <p className="text-lg font-bold text-green-600">
                    R$ {stats.value},00
                  </p>
              </div>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-slate-200 ml-3 pl-6 space-y-6 pb-6">
            {loading ? (
                <>
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                </>
            ) : (
                <>
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((app) => {
                            // Find next app logic (closest to now if today)
                            const now = new Date();
                            const isNext = isToday(selectedDate) && 
                                           app.status === 'scheduled' && 
                                           app.startTime > now &&
                                           // Only show 'next' tag if it's the very first one meeting criteria
                                           app.id === filteredAppointments.find(a => a.status === 'scheduled' && a.startTime > now)?.id;

                            return (
                                <div key={app.id} className="relative animate-slide-in">
                                    {/* Timeline Dot */}
                                    <div 
                                        className={`
                                        absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10
                                        ${app.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}
                                        ${isNext ? 'bg-primary ring-4 ring-primary/20 scale-125' : ''}
                                        `}
                                    ></div>
                                    
                                    <AppointmentCard 
                                        appointment={app} 
                                        clientData={clients.find(c => c.id === app.clientId)}
                                        professional={professionals.find(p => p.id === app.professionalId)}
                                        isNext={isNext}
                                        onStatusChange={onUpdateStatus}
                                        onClientClick={onClientClick}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                <CalendarIcon size={32} />
                            </div>
                            <p className="font-medium">Agenda livre</p>
                            <p className="text-xs opacity-70">Nenhum agendamento para este filtro.</p>
                        </div>
                    )}
                </>
            )}
          </div>
      </div>

      {/* Floating Action Button (FAB) - Portaled to body to escape transform context */}
      {createPortal(
        <button 
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-24 right-4 bg-primary text-white p-4 rounded-full shadow-lg shadow-amber-500/40 active:scale-90 transition-transform z-50 group"
        >
            <Plus size={28} strokeWidth={3} className="group-active:rotate-90 transition-transform duration-200" />
        </button>,
        document.body
      )}

      {/* New Appointment Modal */}
      {isModalOpen && createPortal(
         <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white w-full sm:w-[90%] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto no-scrollbar">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 text-slate-600 p-2 rounded-lg">
                            <CalendarIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Novo Agendamento</h2>
                            <p className="text-xs text-slate-400">Preencha os dados do serviço</p>
                        </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    
                    {/* Cliente */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Cliente</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <select 
                                value={newClientId}
                                onChange={(e) => {
                                    setNewClientId(e.target.value);
                                    setUseCredits(false); // Reset credits when changing client
                                }}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium appearance-none"
                            >
                                <option value="" disabled>Selecione um cliente</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Serviço */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Serviço</label>
                        <div className="relative">
                            <Scissors size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <select 
                                value={newServiceId}
                                onChange={(e) => setNewServiceId(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium appearance-none"
                            >
                                <option value="" disabled>Selecione o serviço</option>
                                {services.map(service => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - R$ {service.price} ({service.durationMinutes} min)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Profissional */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Profissional</label>
                        <div className="relative">
                            <Users size={18} className="absolute left-4 top-3.5 text-slate-400" />
                            <select 
                                value={newProfId}
                                onChange={(e) => setNewProfId(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium appearance-none"
                            >
                                <option value="" disabled>Selecione o profissional</option>
                                {professionals.map(prof => (
                                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Data e Hora */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Data</label>
                            <input 
                                type="date" 
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Hora</label>
                            <div className="relative">
                                <Clock size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                <input 
                                    type="time" 
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="w-full pl-10 pr-2 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checkbox Assinatura */}
                    {hasActiveSub && (
                        <div 
                            onClick={() => setUseCredits(!useCredits)}
                            className={`
                                flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                                ${useCredits 
                                    ? 'bg-amber-50 border-amber-200 shadow-sm' 
                                    : 'bg-white border-slate-200 hover:bg-slate-50'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${useCredits ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <Crown size={20} className={useCredits ? 'fill-amber-600' : ''} />
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${useCredits ? 'text-amber-800' : 'text-slate-700'}`}>
                                        Usar Créditos da Assinatura
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Saldo: {selectedClientObj.activeSubscription!.totalCredits - selectedClientObj.activeSubscription!.usedCredits} créditos disponíveis
                                    </p>
                                </div>
                            </div>
                            <div className={`
                                w-6 h-6 rounded-full border-2 flex items-center justify-center
                                ${useCredits ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}
                            `}>
                                {useCredits && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                            </div>
                        </div>
                    )}

                </div>

                <button 
                    onClick={handleSaveAppointment}
                    disabled={!newClientId || !newServiceId || !newProfId || !newDate || !newTime}
                    className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-300 active:scale-95 transition-transform disabled:opacity-50"
                >
                    Agendar
                </button>
            </div>
         </div>,
         document.body
      )}
    </div>
  );
};

export default Home;