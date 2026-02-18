import React, { useState } from 'react';
import { Appointment, Client } from '../../types';
import { Calendar, Clock, Scissors, ChevronRight } from 'lucide-react';

interface ClientHistoryProps {
  appointments: Appointment[];
  client: Client;
}

const ClientHistory: React.FC<ClientHistoryProps> = ({ appointments, client }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const myAppointments = appointments.filter(a => a.clientId === client.id);
  const now = new Date();

  const upcoming = myAppointments
    .filter(a => a.startTime >= now && a.status !== 'cancelled')
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  const past = myAppointments
    .filter(a => a.startTime < now || a.status === 'cancelled')
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  const displayed = activeTab === 'upcoming' ? upcoming : past;

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-10 pb-4 shadow-sm z-10 rounded-b-[2rem]">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Meus Cortes</h1>
          
          <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            <button 
                onClick={() => setActiveTab('upcoming')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                }`}
            >
                Agendados ({upcoming.length})
            </button>
            <button 
                onClick={() => setActiveTab('past')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    activeTab === 'past' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                }`}
            >
                Histórico
            </button>
          </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center text-slate-400 opacity-60">
                  <Calendar size={64} className="mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Sua agenda está vazia.</p>
                  <p className="text-sm">Que tal marcar um horário?</p>
              </div>
          ) : (
              displayed.map(app => (
                  <div key={app.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 animate-slide-in active:scale-[0.98] transition-transform">
                      
                      <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                              <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center text-primary">
                                  <Scissors size={24} />
                              </div>
                              <div>
                                  <h3 className="font-bold text-slate-800 text-lg leading-tight">{app.serviceName}</h3>
                                  <p className="text-slate-500 text-sm">Profissional: {app.id.includes('prof') ? 'Equipe' : 'Equipe ForYou'}</p>
                              </div>
                          </div>
                      </div>

                      <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="bg-white p-2 rounded-lg border border-slate-100 text-slate-900 font-bold text-center min-w-[50px]">
                                  <span className="block text-xs uppercase text-slate-400">{app.startTime.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                                  <span className="text-xl">{app.startTime.getDate()}</span>
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                                      <Clock size={14} className="text-slate-400" />
                                      {app.startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                  </p>
                                  <p className="text-xs text-slate-400 capitalize">
                                      {app.startTime.toLocaleDateString('pt-BR', { month: 'long' })}
                                  </p>
                              </div>
                          </div>
                          
                          <span className={`
                              text-xs font-bold px-3 py-1.5 rounded-lg
                              ${app.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                                app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                          `}>
                              {app.status === 'scheduled' ? 'Confirmado' : 
                               app.status === 'completed' ? 'Realizado' : 'Cancelado'}
                          </span>
                      </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default ClientHistory;