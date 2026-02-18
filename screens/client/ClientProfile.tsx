import React from 'react';
import { Client } from '../../types';
import { User, Bell, LogOut, Shield, HelpCircle, ChevronRight, Settings } from 'lucide-react';

interface ClientProfileProps {
  client: Client;
  onLogout: () => void;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ client, onLogout }) => {
  const MenuLink = ({ icon: Icon, label, onClick, isDestructive = false }: any) => (
    <button 
        onClick={onClick}
        className="w-full bg-white p-5 flex items-center gap-5 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
    >
        <div className={`p-3 rounded-2xl ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600 group-hover:bg-primary/10 group-hover:text-primary'}`}>
            <Icon size={24} />
        </div>
        <div className="flex-1 text-left">
            <span className={`font-bold text-lg ${isDestructive ? 'text-red-500' : 'text-slate-800'}`}>{label}</span>
        </div>
        {!isDestructive && <ChevronRight size={20} className="text-slate-300" />}
    </button>
  );

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24">
       <div className="bg-white px-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-sm mb-6">
           <div className="flex items-center gap-6">
               <div className="w-24 h-24 bg-slate-200 rounded-full border-4 border-slate-50 shadow-lg overflow-hidden flex items-center justify-center shrink-0">
                   {client.photoUrl ? (
                       <img src={client.photoUrl} className="w-full h-full object-cover" />
                   ) : (
                       <span className="text-4xl font-bold text-slate-400">{client.name.charAt(0)}</span>
                   )}
               </div>
               <div>
                   <h1 className="text-2xl font-bold text-slate-900 leading-tight">{client.name}</h1>
                   <p className="text-slate-500 mt-1">{client.phone}</p>
                   <button className="mt-3 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                       Editar Perfil
                   </button>
               </div>
           </div>
       </div>

       <div className="px-6 space-y-6">
           <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 ml-2 tracking-wider">Configurações</h3>
               <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                   <MenuLink icon={User} label="Meus Dados" />
                   <MenuLink icon={Bell} label="Notificações" />
                   <MenuLink icon={Settings} label="Preferências" />
               </div>
           </div>

           <div>
               <h3 className="text-sm font-bold text-slate-400 uppercase mb-3 ml-2 tracking-wider">Suporte</h3>
               <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                   <MenuLink icon={HelpCircle} label="Fale Conosco" />
                   <MenuLink icon={Shield} label="Privacidade" />
               </div>
           </div>

           <button 
                onClick={onLogout}
                className="w-full bg-white p-5 rounded-[2rem] text-red-500 font-bold text-lg shadow-sm border border-red-50 flex items-center justify-center gap-3 active:scale-95 transition-transform"
           >
               <LogOut size={24} /> Sair do Aplicativo
           </button>

           <p className="text-center text-xs text-slate-300 pb-4">Versão 1.2.0</p>
       </div>
    </div>
  );
};

export default ClientProfile;