import React, { useState } from 'react';
import { Role, Establishment, Service } from '../types';
import { DEFAULT_SERVICES } from '../constants';
import { Scissors, Check, Briefcase, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (data: { role: Role; establishment: Establishment; services: Service[] }) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>('Barber');
  const [establishmentName, setEstablishmentName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setServices(DEFAULT_SERVICES[selectedRole]);
    setStep(2);
  };

  const finish = () => {
    if (!establishmentName || !ownerName) return;
    onComplete({
      role,
      establishment: { name: establishmentName, ownerName },
      services
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-between animate-slide-in">
      {/* Step Indicator */}
      <div className="flex space-x-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-slate-100'}`} />
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Qual seu perfil?</h1>
            <p className="text-slate-500">Isso ajuda a configurar seus serviços iniciais.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'Barber', label: 'Barbeiro', icon: Scissors },
                { id: 'Manicure', label: 'Manicure', icon: Scissors }, // simplified icon
                { id: 'Hairdresser', label: 'Cabeleireira', icon: Scissors },
                { id: 'Esthetician', label: 'Estética', icon: Scissors }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleRoleSelect(item.id as Role)}
                  className="p-6 border-2 border-slate-100 rounded-2xl flex items-center justify-between hover:border-primary active:bg-slate-50 transition-colors group"
                >
                  <span className="text-lg font-bold text-slate-700">{item.label}</span>
                  <div className="bg-slate-100 p-2 rounded-full group-hover:bg-primary/10">
                    <item.icon className="text-slate-400 group-hover:text-primary" size={24} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Serviços Padrão</h1>
            <p className="text-slate-500">Confirme ou edite os serviços sugeridos.</p>
            
            <div className="space-y-3">
              {services.map((svc) => (
                <div key={svc.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800">{svc.name}</h4>
                    <p className="text-xs text-slate-500">{svc.durationMinutes} min</p>
                  </div>
                  <span className="font-bold text-primary">R$ {svc.price}</span>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 text-center text-primary font-bold text-sm">
              + Adicionar Serviço Personalizado
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
             <h1 className="text-3xl font-bold text-slate-900">Sua Loja</h1>
             <p className="text-slate-500">Detalhes finais para começar.</p>

             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Estabelecimento</label>
                  <input 
                    type="text" 
                    value={establishmentName}
                    onChange={(e) => setEstablishmentName(e.target.value)}
                    placeholder="Ex: Barbearia do Zé"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seu Nome</label>
                  <input 
                    type="text" 
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ex: José Silva"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-6">
        {step > 1 && step < 3 && (
           <button 
             onClick={() => setStep(step + 1)}
             className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
           >
             Continuar <ChevronRight size={20} />
           </button>
        )}
        {step === 3 && (
          <button 
            disabled={!establishmentName || !ownerName}
            onClick={finish}
            className={`w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50`}
          >
            Começar <Check size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
