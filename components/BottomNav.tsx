import React from 'react';
import { Calendar, Users, DollarSign, User } from 'lucide-react';
import { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const NavItem = ({ screen, icon: Icon, label }: { screen: ScreenName; icon: any; label: string }) => {
    const isActive = currentScreen === screen;
    return (
      <button
        onClick={() => onNavigate(screen)}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 ${
          isActive ? 'text-primary' : 'text-slate-400'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[10px] font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-4 z-50 flex justify-around items-center px-2">
      <NavItem screen="Home" icon={Calendar} label="Agenda" />
      <NavItem screen="Clients" icon={Users} label="Clientes" />
      <NavItem screen="Financial" icon={DollarSign} label="Financeiro" />
      <NavItem screen="Profile" icon={User} label="Perfil" />
    </div>
  );
};

export default BottomNav;
