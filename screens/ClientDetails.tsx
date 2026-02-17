import React from 'react';
import { Client, Appointment } from '../types';
import { ArrowLeft, Phone, Calendar, Crown, CheckCircle, XCircle, Clock } from 'lucide-react';
import CreditSlots from '../components/CreditSlots';

interface ClientDetailsProps {
  client: Client;
  appointments: Appointment[]; // Full list of appointments to filter
  onBack: () => void;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, appointments, onBack }) => {
  
  // Filter history for this client
  const history = appointments
    .filter(a => a.clientId === client.id)
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime()); // Newest first

  const completedCount = history.filter(a => a.status === 'completed').length;
  const cancelledCount = history.filter(a => a.status === 'cancelled' || a.status === 'noshow').length;
  
  return (
    <div className="h-full flex flex-col bg-slate-50">
      
      {/* Header */}
      <div className="bg-white relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-slate-800 to-slate-900"></div>
          
          <div className="relative px-4 pt-4 pb-6">
            <button 
                onClick={onBack}
                className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
            >
                <ArrowLeft size={20} />
            </button>
            
            <div className="flex flex-col items-center mt-8">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-slate-200 overflow-hidden mb-3">
                     {client.photoUrl ? (
                         <img src={client.photoUrl} className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full flex items-center justify-center text-4xl text-slate-300 font-bold bg-slate-100">
                             {client.name.charAt(0)}
                         </div>
                     )}
                </div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {client.name}
                    {client.activeSubscription?.active && <Crown size={18} className="text-amber-500 fill-amber-500"/>}
                </h1>
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                    <Phone size={12} /> {client.phone}
                </p>
            </div>

            {/* Stats Row */}
            <div className="flex justify-center gap-4 mt-6">
                <div className="flex-1 bg-green-50 rounded-xl p-3 border border-green-100 text-center">
                    <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                    <p className="text-[10px] font-bold text-green-400 uppercase">Visitas</p>
                </div>
                <div className="flex-1 bg-red-50 rounded-xl p-3 border border-red-100 text-center">
                    <p className="text-2xl font-bold text-red-500">{cancelledCount}</p>
                    <p className="text-[10px] font-bold text-red-400 uppercase">Cancelados</p>
                </div>
            </div>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        
        {/* Subscription Card */}
        {client.activeSubscription?.active && (
            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 rounded-bl-full -mr-8 -mt-8"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded-md">Assinatura Ativa</span>
                        <h3 className="text-lg font-bold text-slate-800 mt-1">{client.activeSubscription.planName}</h3>
                    </div>
                    <Crown size={24} className="text-amber-500" />
                </div>

                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500 font-medium">Créditos Restantes</span>
                    <span className="font-bold text-slate-800">
                        {client.activeSubscription.totalCredits - client.activeSubscription.usedCredits} <span className="text-slate-400 font-normal">/ {client.activeSubscription.totalCredits}</span>
                    </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden mb-4">
                    <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(client.activeSubscription.usedCredits / client.activeSubscription.totalCredits) * 100}%` }}
                    ></div>
                </div>

                <div className="flex items-center gap-2 text-xs text-amber-700/70 bg-white/60 p-2 rounded-lg backdrop-blur-sm">
                    <Calendar size={12} />
                    Expira em {new Date(client.activeSubscription.expiresAt).toLocaleDateString('pt-BR')}
                </div>
            </div>
        )}

        {/* History Timeline */}
        <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Clock size={16} className="text-slate-400" /> Histórico
            </h3>
            
            <div className="space-y-3 pl-2 border-l-2 border-slate-200 ml-2">
                {history.length > 0 ? (
                    history.map(app => (
                        <div key={app.id} className="relative pl-6 pb-2">
                            {/* Dot */}
                            <div className={`
                                absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm
                                ${app.status === 'completed' ? 'bg-green-500' : 
                                  app.status === 'cancelled' ? 'bg-red-500' : 'bg-slate-300'}
                            `}></div>

                            <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{app.serviceName}</p>
                                        <p className="text-xs text-slate-400">
                                            {app.startTime.toLocaleDateString('pt-BR')} às {app.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                    {app.isSubscription && (
                                        <Crown size={14} className="text-amber-500" title="Usou assinatura" />
                                    )}
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`
                                        text-[10px] font-bold px-2 py-0.5 rounded-md uppercase
                                        ${app.status === 'completed' ? 'bg-green-50 text-green-600' : 
                                          app.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}
                                    `}>
                                        {app.status === 'completed' ? 'Finalizado' : 
                                         app.status === 'cancelled' ? 'Cancelado' : 
                                         app.status === 'noshow' ? 'Não Compareceu' : 'Agendado'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="pl-6 text-slate-400 text-sm italic">
                        Nenhum histórico encontrado.
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ClientDetails;