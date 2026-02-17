import React from 'react';
import { Establishment } from '../types';
import { Settings, Clock, Share2, LogOut, ChevronRight, Store, MapPin, Phone, Users, Crown } from 'lucide-react';

interface ProfileProps {
  establishment: Establishment | null;
  clientsCount: number;
  onNavigate: (screen: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ establishment, clientsCount, onNavigate }) => {
  
  const MenuLink = ({ icon: Icon, label, subtitle, isDestructive = false, onClick }: any) => (
    <button 
        onClick={onClick}
        className="w-full bg-white p-4 flex items-center justify-between active:bg-purple-50 transition-colors group"
    >
       <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-purple-400 group-hover:text-primary group-hover:bg-pink-50'}`}>
             <Icon size={20} />
          </div>
          <div className="text-left">
             <p className={`font-semibold text-sm ${isDestructive ? 'text-red-500' : 'text-slate-800'}`}>{label}</p>
             {subtitle && <p className="text-xs text-slate-400 max-w-[200px] truncate">{subtitle}</p>}
          </div>
       </div>
       {!isDestructive && <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />}
    </button>
  );

  const formattedAddress = establishment?.address 
    ? `${establishment.address.street}, ${establishment.address.number}` 
    : "Toque para configurar";

  return (
    <div className="pb-24 min-h-full bg-background">
       
       {/* Profile Header */}
       <div className="bg-white pb-8 pt-8 px-6 rounded-b-[2.5rem] shadow-sm shadow-purple-100 border-b border-purple-50 text-center relative overflow-hidden">
          {/* Decorative Blob */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-200 via-primary to-purple-400"></div>

          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-purple-400 rounded-3xl rotate-3 mx-auto mb-4 flex items-center justify-center text-white shadow-xl shadow-purple-200">
             <Store size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{establishment?.name || 'Meu Espaço ForYou'}</h1>
          <p className="text-slate-500 text-sm">Gerenciado por {establishment?.ownerName}</p>

          {/* Quick Stats */}
          <div className="flex justify-center gap-4 mt-6">
              <div className="bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-wide">Clientes</p>
                  <p className="text-xl font-bold text-slate-800">{clientsCount}</p>
              </div>
              <div className="bg-yellow-50 px-6 py-3 rounded-2xl border border-yellow-100">
                  <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Plano Pro</p>
                  <p className="text-xl font-bold text-yellow-700">Ativo</p>
              </div>
          </div>
       </div>

       {/* Settings Lists */}
       <div className="mt-6 px-4 space-y-6">
          
          <div>
            <h3 className="text-xs font-bold text-purple-300 uppercase ml-2 mb-2">Loja & Equipe</h3>
            <div className="rounded-2xl overflow-hidden border border-purple-50 shadow-sm bg-white">
                <MenuLink 
                    icon={Clock} 
                    label="Horários da Loja" 
                    subtitle="Defina abertura e fechamento geral"
                    onClick={() => onNavigate('ScheduleSettings')}
                />
                <div className="h-[1px] bg-purple-50 w-full" />
                <MenuLink 
                    icon={Users} 
                    label="Profissionais" 
                    subtitle="Gerenciar equipe e horários individuais" 
                    onClick={() => onNavigate('ProfessionalList')}
                />
                <div className="h-[1px] bg-purple-50 w-full" />
                <MenuLink 
                  icon={MapPin} 
                  label="Endereço" 
                  subtitle={formattedAddress} 
                  onClick={() => onNavigate('AddressSettings')}
                />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-purple-300 uppercase ml-2 mb-2">Serviços & Planos</h3>
            <div className="rounded-2xl overflow-hidden border border-purple-50 shadow-sm bg-white">
                <MenuLink 
                  icon={Settings} 
                  label="Catálogo de Serviços" 
                  subtitle="Preços e duração" 
                  onClick={() => onNavigate('ServiceCatalog')}
                />
                <div className="h-[1px] bg-purple-50 w-full" />
                <MenuLink 
                  icon={Crown} 
                  label="Planos de Assinatura" 
                  subtitle="Criar planos mensais ou recorrentes" 
                  onClick={() => onNavigate('PlanSettings')}
                />
                <div className="h-[1px] bg-purple-50 w-full" />
                <MenuLink icon={Share2} label="Link de Agendamento" subtitle="Compartilhar com clientes" />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-purple-300 uppercase ml-2 mb-2">Sistema</h3>
            <div className="rounded-2xl overflow-hidden border border-purple-50 shadow-sm bg-white">
                <MenuLink icon={Phone} label="Suporte" subtitle="Falar via WhatsApp" />
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-red-100 shadow-sm bg-white">
             <MenuLink icon={LogOut} label="Sair da conta" isDestructive />
          </div>

          <div className="text-center text-xs text-purple-300 pb-4 font-medium">
             Versão 1.2.0 • ForYou
          </div>

       </div>
    </div>
  );
};

export default Profile;