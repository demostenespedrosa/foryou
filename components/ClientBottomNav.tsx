import React from 'react';
import { CalendarPlus, Clock, Crown, User, CalendarDays } from 'lucide-react';
import { ClientScreenName } from '../types';

interface ClientBottomNavProps {
  currentScreen: ClientScreenName;
  onNavigate: (screen: ClientScreenName) => void;
}

const ClientBottomNav: React.FC<ClientBottomNavProps> = ({ currentScreen, onNavigate }) => {
  
  const NavItem = ({ screen, icon: Icon, label, isPrimary = false }: { screen: ClientScreenName; icon: any; label: string; isPrimary?: boolean }) => {
    const isActive = currentScreen === screen;
    
    return (
      <button
        onClick={() => onNavigate(screen)}
        className={`
          relative flex flex-col items-center justify-center h-full transition-all duration-300
          ${isPrimary ? 'w-auto -mt-6' : 'w-full'}
        `}
      >
        {isPrimary ? (
            // Botão de Destaque (Agendar)
            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border-4 border-slate-50 transition-transform duration-200
                ${isActive ? 'bg-slate-900 scale-110' : 'bg-primary scale-100'}
            `}>
                <Icon size={32} className="text-white ml-0.5" />
            </div>
        ) : (
            // Botões Normais
            <div className={`
                p-2 rounded-xl transition-colors duration-200
                ${isActive ? 'bg-slate-100' : 'bg-transparent'}
            `}>
                <Icon 
                    size={26} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'text-slate-900' : 'text-slate-400'} 
                />
            </div>
        )}
        
        <span className={`
            text-[10px] font-bold mt-1 transition-colors
            ${isPrimary ? (isActive ? 'text-slate-900 translate-y-1' : 'text-primary translate-y-1') : ''}
            ${!isPrimary && isActive ? 'text-slate-900' : 'text-slate-400'}
        `}>
            {label}
        </span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-2 z-50 px-2">
      <div className="flex justify-around items-end h-full pb-2">
          {/* Ordem: Agendar (Destaque), Histórico, Assinatura, Perfil */}
          <NavItem screen="ClientHome" icon={CalendarPlus} label="Agendar" isPrimary />
          <NavItem screen="ClientHistory" icon={Clock} label="Histórico" />
          <NavItem screen="ClientSubscription" icon={Crown} label="Assinatura" />
          <NavItem screen="ClientProfile" icon={User} label="Perfil" />
      </div>
    </div>
  );
};

export default ClientBottomNav;