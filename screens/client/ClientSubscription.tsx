import React from 'react';
import { Client, Plan } from '../../types';
import { Crown, Check, Zap, Star } from 'lucide-react';
import CreditSlots from '../../components/CreditSlots';

interface ClientSubscriptionProps {
  client: Client;
  plans: Plan[];
}

const ClientSubscription: React.FC<ClientSubscriptionProps> = ({ client, plans }) => {
  const sub = client.activeSubscription;

  return (
    <div className="h-full bg-slate-50 flex flex-col pb-24 overflow-y-auto">
       {/* Header */}
       <div className="p-6 pt-10">
           <h1 className="text-3xl font-bold text-slate-900">Assinatura</h1>
           <p className="text-slate-500">Seu clube de benefícios exclusivo.</p>
       </div>

       <div className="px-6 relative z-10 mb-8">
           {sub && sub.active ? (
               // Active Card - Gold/Dark Theme
               <div className="bg-slate-900 p-6 rounded-[2rem] shadow-2xl shadow-slate-400/50 text-white relative overflow-hidden h-[240px] flex flex-col justify-between">
                   {/* Decorative elements */}
                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-amber-300 to-amber-600 rounded-full blur-3xl opacity-30"></div>
                   <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent"></div>
                   
                   <div className="flex justify-between items-start relative z-10">
                       <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                           <Crown size={16} className="text-amber-400 fill-amber-400" />
                           <span className="text-xs font-bold text-amber-100 uppercase tracking-widest">Membro VIP</span>
                       </div>
                       <div className="text-right">
                           <p className="text-xs text-slate-400 uppercase">Validade</p>
                           <p className="font-bold font-mono">{new Date(sub.expiresAt).toLocaleDateString('pt-BR')}</p>
                       </div>
                   </div>

                   <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-1">{sub.planName}</h2>
                        <div className="flex justify-center mt-4">
                            <CreditSlots total={sub.totalCredits} used={sub.usedCredits} />
                        </div>
                   </div>

                   <div className="relative z-10 flex justify-between items-end">
                        <div>
                            <p className="text-xs text-slate-400 uppercase mb-1">Saldo de Créditos</p>
                            <p className="text-2xl font-bold text-amber-400">{sub.totalCredits - sub.usedCredits} <span className="text-sm text-slate-500">/ {sub.totalCredits}</span></p>
                        </div>
                        <Zap size={32} className="text-amber-400 opacity-50" />
                   </div>
               </div>
           ) : (
               // Empty State Card
               <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center border border-slate-100">
                   <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500 shadow-inner">
                       <Crown size={40} />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800">Seja VIP</h2>
                   <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                       Economize até 30% e tenha prioridade na agenda assinando um de nossos planos.
                   </p>
               </div>
           )}
       </div>

       {/* Available Plans */}
       <div className="px-6 space-y-4">
           <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
               <Star size={18} className="text-amber-500 fill-amber-500" /> Planos Disponíveis
           </h3>
           
           {plans.map(plan => (
               <div key={plan.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 active:scale-[0.98] transition-transform">
                   <div className="flex justify-between items-center">
                       <div>
                           <h4 className="font-bold text-slate-800 text-xl">{plan.name}</h4>
                           <p className="text-sm text-slate-500 font-medium">{plan.type === 'unlimited' ? 'Acesso Ilimitado' : `${plan.credits} Serviços inclusos`}</p>
                       </div>
                       <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold">
                           R$ {plan.price.toFixed(0)}
                       </div>
                   </div>
                   
                   <div className="h-[1px] bg-slate-100 w-full" />

                   <button className="w-full py-4 bg-primary/10 text-primary font-bold rounded-2xl text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2">
                       Escolher este plano
                   </button>
               </div>
           ))}
       </div>
    </div>
  );
};

export default ClientSubscription;