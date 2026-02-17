import React, { useState } from 'react';
import { Role, Establishment, Service } from '../types';
import { DEFAULT_SERVICES } from '../constants';
import { Scissors, Check, Briefcase, ChevronRight, User, Lock, Mail, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onComplete: (data: { role: Role; establishment: Establishment; services: Service[] }) => void;
  onBackToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onComplete, onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>('Barber');
  const [establishmentName, setEstablishmentName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setServices(DEFAULT_SERVICES[selectedRole]);
    setStep(2);
  };

  const finish = () => {
    if (!establishmentName || !ownerName || !email || !password) return;
    // In a real app, you would submit email/password to backend here
    onComplete({
      role,
      establishment: { name: establishmentName, ownerName },
      services
    });
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-between animate-slide-in">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
         {step === 1 ? (
             <button onClick={onBackToLogin} className="flex items-center text-slate-400 gap-1 text-sm font-bold">
                <ArrowLeft size={16} /> Login
             </button>
         ) : (
             <button onClick={() => setStep(step - 1)} className="flex items-center text-slate-400 gap-1 text-sm font-bold">
                <ArrowLeft size={16} /> Voltar
             </button>
         )}
         
         {/* Step Indicator */}
         <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-slate-100'}`} />
            ))}
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-slide-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Qual seu perfil?</h1>
                <p className="text-slate-500 mt-2">Escolha a categoria que melhor define seu negócio para personalizarmos sua experiência.</p>
            </div>
            
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
          <div className="space-y-6 animate-slide-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Serviços Iniciais</h1>
                <p className="text-slate-500 mt-2">Estes são os serviços padrão para {role === 'Barber' ? 'Barbeiros' : role}. Você pode editar tudo depois.</p>
            </div>
            
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
            
            <button className="w-full py-3 text-center text-primary font-bold text-sm bg-primary/5 rounded-xl">
              + Adicionar Serviço Personalizado
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-slide-in">
             <div>
                <h1 className="text-3xl font-bold text-slate-900">Criar Conta</h1>
                <p className="text-slate-500 mt-2">Preencha seus dados para finalizar o cadastro e acessar o painel.</p>
             </div>

             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nome da Loja</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={establishmentName}
                        onChange={(e) => setEstablishmentName(e.target.value)}
                        placeholder="Ex: Barbearia do Zé"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Seu Nome</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Ex: José Silva"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="h-[1px] bg-slate-100 w-full my-4" />

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">E-mail de Login</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Crie uma senha segura"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
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
             className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200"
           >
             Continuar <ChevronRight size={20} />
           </button>
        )}
        {step === 3 && (
          <button 
            disabled={!establishmentName || !ownerName || !email || !password}
            onClick={finish}
            className={`w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Finalizar Cadastro <Check size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Register;
