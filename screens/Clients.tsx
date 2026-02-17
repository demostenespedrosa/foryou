import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Client, Subscription, Plan } from '../types';
import CreditSlots from '../components/CreditSlots';
import { Search, ChevronRight, Crown, User, Calendar, MoreHorizontal, X, Minus, Plus, Save, UserPlus, Phone, Cake, Users } from 'lucide-react';

interface ClientsProps {
  clients: Client[];
  plans: Plan[];
  onUpdateClient: (client: Client) => void;
  onAddClient: (client: Client) => void;
}

const Clients: React.FC<ClientsProps> = ({ clients, plans, onUpdateClient, onAddClient }) => {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'regular'>('subscribers');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  // New Client State
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const [newGender, setNewGender] = useState<'male' | 'female' | 'other'>('male');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(''); // Empty = Avulso

  // Filter clients based on subscription status
  const subscribers = clients.filter(c => c.activeSubscription?.active);
  const regulars = clients.filter(c => !c.activeSubscription?.active);

  // Apply search filter to the active list
  const currentList = activeTab === 'subscribers' ? subscribers : regulars;
  const filteredList = currentList.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const openSubscriptionManager = (client: Client) => {
    if (client.activeSubscription) {
        setSelectedClient(client);
        setEditingSub({ ...client.activeSubscription });
    }
  };

  const handleSaveSubscription = () => {
    if (!selectedClient || !editingSub) return;
    onUpdateClient({
        ...selectedClient,
        activeSubscription: editingSub
    });
    setSelectedClient(null);
    setEditingSub(null);
  };

  const adjustCredits = (delta: number) => {
      if (!editingSub) return;
      const newUsed = Math.max(0, Math.min(editingSub.totalCredits, editingSub.usedCredits + delta));
      setEditingSub({ ...editingSub, usedCredits: newUsed });
  };

  const saveNewClient = () => {
      if (!newName || !newPhone) return;

      let newSubscription: Subscription | undefined = undefined;

      // Create subscription if plan selected
      if (selectedPlanId) {
        const plan = plans.find(p => p.id === selectedPlanId);
        if (plan) {
            newSubscription = {
                id: `sub_${Math.random().toString(36).substr(2, 9)}`,
                planName: plan.name,
                totalCredits: plan.type === 'unlimited' ? 999 : plan.credits,
                usedCredits: 0,
                expiresAt: new Date(Date.now() + (plan.validityDays * 86400000)),
                active: true
            };
        }
      }

      const newClient: Client = {
          id: `c_${Math.random().toString(36).substr(2, 9)}`,
          name: newName,
          phone: newPhone,
          birthDate: newBirthDate ? new Date(newBirthDate) : undefined,
          gender: newGender,
          photoUrl: undefined, // No photo needed anymore
          activeSubscription: newSubscription
      };

      onAddClient(newClient);
      
      // Reset and close
      setNewName('');
      setNewPhone('');
      setNewBirthDate('');
      setNewGender('male');
      setSelectedPlanId('');
      setIsCreating(false);
      
      // Switch tab depending on if they have a sub
      setActiveTab(selectedPlanId ? 'subscribers' : 'regular');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Header & Search - Fixed at top */}
      <div className="bg-white px-4 pt-4 pb-2 border-b border-slate-100 shadow-sm z-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Meus Clientes</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="w-full bg-slate-100 p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-800"
          />
          <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
                onClick={() => setActiveTab('subscribers')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'subscribers' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Crown size={16} className={activeTab === 'subscribers' ? 'text-amber-500 fill-amber-500' : ''} /> 
                Assinantes
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'subscribers' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
                    {subscribers.length}
                </span>
            </button>
            <button 
                onClick={() => setActiveTab('regular')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'regular' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <User size={16} /> 
                Avulsos
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'regular' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {regulars.length}
                </span>
            </button>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 pb-24">
        {filteredList.length === 0 ? (
           <div className="text-center text-slate-400 mt-10 border-2 border-dashed border-slate-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  {activeTab === 'subscribers' ? <Crown size={32} /> : <Search size={32} />}
              </div>
              <p>Nenhum cliente encontrado.</p>
           </div>
        ) : (
          filteredList.map(client => (
            <div key={client.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-slide-in group">
                {/* Card Header / Main Info */}
                <div className="p-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            {client.name}
                            {client.activeSubscription?.active && (
                                <div className="bg-amber-100 p-1 rounded-md" title="Assinante">
                                    <Crown size={14} className="text-amber-600 fill-amber-600" />
                                </div>
                            )}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                            <span className="flex items-center gap-1"><Phone size={12}/> {client.phone}</span>
                            {client.birthDate && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                        <Cake size={12} /> 
                                        {new Date(client.birthDate).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit'})}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-primary hover:bg-slate-50 rounded-full transition-colors">
                        <MoreHorizontal size={20} />
                    </button>
                </div>

                {/* Subscription Specific Details */}
                {activeTab === 'subscribers' && client.activeSubscription && (
                    <div className="bg-amber-50/50 px-4 py-3 border-t border-amber-100 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                                {client.activeSubscription.planName}
                            </span>
                            <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
                                <Calendar size={10} />
                                Expira em {new Date(client.activeSubscription.expiresAt).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                             <CreditSlots 
                                total={client.activeSubscription.totalCredits}
                                used={client.activeSubscription.usedCredits}
                             />
                             <button 
                                onClick={() => openSubscriptionManager(client)}
                                className="text-xs font-bold text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
                             >
                                Gerenciar
                             </button>
                        </div>
                    </div>
                )}

                {/* Regular Client Details (Last Visit placeholder) */}
                {activeTab === 'regular' && (
                    <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-400">Última visita: 12/02/2024</span>
                        <button className="text-xs font-bold text-slate-600 flex items-center gap-1 hover:text-primary transition-colors">
                            Ver Histórico <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>
          ))
        )}
      </div>

      {/* FAB - Add Client - Portaled to body */}
      {createPortal(
        <button 
            onClick={() => setIsCreating(true)}
            className="fixed bottom-24 right-4 bg-slate-900 text-white p-4 rounded-full shadow-lg shadow-slate-400/40 active:scale-90 transition-transform z-50"
        >
            <UserPlus size={24} />
        </button>,
        document.body
      )}

      {/* Create Client Modal */}
      {isCreating && createPortal(
         <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white w-full sm:w-[90%] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-100 text-slate-600 p-2 rounded-lg">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Novo Cliente</h2>
                            <p className="text-xs text-slate-400">Preencha os dados completos</p>
                        </div>
                    </div>
                    <button onClick={() => setIsCreating(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Basic Info */}
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Nome Completo</label>
                        <div className="relative">
                            <User size={18} className="absolute left-4 top-4 text-slate-400" />
                            <input 
                                type="text" 
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Ex: João Silva"
                                className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Telefone / WhatsApp</label>
                        <div className="relative">
                            <Phone size={18} className="absolute left-4 top-4 text-slate-400" />
                            <input 
                                type="tel" 
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                                className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                         {/* Birth Date */}
                         <div className="flex-[1.5]">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Nascimento</label>
                            <div className="relative">
                                <Cake size={18} className="absolute left-4 top-4 text-slate-400" />
                                <input 
                                    type="date" 
                                    value={newBirthDate}
                                    onChange={(e) => setNewBirthDate(e.target.value)}
                                    className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                                />
                            </div>
                         </div>
                         
                         {/* Gender */}
                         <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-500 mb-1">Sexo</label>
                            <div className="relative">
                                <div className="absolute left-3 top-4 text-slate-400 pointer-events-none">
                                    <Users size={18} />
                                </div>
                                <select 
                                    value={newGender}
                                    onChange={(e) => setNewGender(e.target.value as any)}
                                    className="w-full p-4 pl-9 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium appearance-none"
                                >
                                    <option value="male">Masc.</option>
                                    <option value="female">Fem.</option>
                                    <option value="other">Outro</option>
                                </select>
                            </div>
                         </div>
                    </div>

                    {/* Plan Selection */}
                    <div className="pt-2 border-t border-slate-100 mt-2">
                         <label className="block text-sm font-bold text-slate-700 mb-3">Tipo de Cliente</label>
                         
                         <div className="grid grid-cols-2 gap-3 mb-3">
                             <button
                                onClick={() => setSelectedPlanId('')}
                                className={`p-3 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-1
                                    ${selectedPlanId === '' 
                                        ? 'border-slate-800 bg-slate-800 text-white shadow-md' 
                                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}
                                `}
                             >
                                <User size={20} /> Avulso
                             </button>
                             <button
                                onClick={() => plans.length > 0 && setSelectedPlanId(plans[0].id)}
                                className={`p-3 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-center gap-1
                                    ${selectedPlanId !== '' 
                                        ? 'border-primary bg-primary text-white shadow-md shadow-amber-200' 
                                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}
                                `}
                             >
                                <Crown size={20} /> Assinante
                             </button>
                         </div>

                         {/* Plan Dropdown (Only if Assinante selected) */}
                         {selectedPlanId !== '' && (
                             <div className="animate-fade-in bg-amber-50 p-4 rounded-xl border border-amber-100">
                                 <label className="block text-xs font-bold text-amber-700 uppercase mb-2">Selecione o Plano</label>
                                 <select 
                                    value={selectedPlanId}
                                    onChange={(e) => setSelectedPlanId(e.target.value)}
                                    className="w-full p-3 bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 font-bold"
                                 >
                                     {plans.map(plan => (
                                         <option key={plan.id} value={plan.id}>
                                             {plan.name} - R$ {plan.price.toFixed(2)}
                                         </option>
                                     ))}
                                 </select>
                                 <p className="text-[10px] text-amber-600 mt-2">
                                     O cliente receberá a assinatura imediatamente.
                                 </p>
                             </div>
                         )}
                    </div>
                </div>

                <button 
                    onClick={saveNewClient}
                    disabled={!newName || !newPhone}
                    className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-300 active:scale-95 transition-transform disabled:opacity-50"
                >
                    Cadastrar Cliente
                </button>
            </div>
         </div>,
         document.body
      )}

      {/* Subscription Management Modal */}
      {selectedClient && editingSub && createPortal(
         <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
             <div className="bg-white w-full sm:w-[90%] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-in">
                {/* Modal Header */}
                <div className="bg-amber-50 p-6 flex justify-between items-start border-b border-amber-100">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Crown size={20} className="text-amber-500 fill-amber-500" />
                            <h2 className="text-xl font-bold text-amber-900">Gerenciar Assinatura</h2>
                        </div>
                        <p className="text-sm text-amber-700/80">
                           Cliente: <span className="font-bold">{selectedClient.name}</span>
                        </p>
                    </div>
                    <button 
                        onClick={() => { setSelectedClient(null); setEditingSub(null); }}
                        className="bg-white/50 p-2 rounded-full hover:bg-white text-amber-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="font-bold text-slate-700">Status da Assinatura</span>
                        <button 
                            onClick={() => setEditingSub({...editingSub, active: !editingSub.active})}
                            className={`
                                relative w-12 h-7 rounded-full transition-colors duration-300
                                ${editingSub.active ? 'bg-green-500' : 'bg-slate-300'}
                            `}
                        >
                             <div className={`
                                absolute top-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm
                                ${editingSub.active ? 'left-6' : 'left-1'}
                            `} />
                        </button>
                    </div>

                    {/* Credits Editor */}
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Créditos Utilizados</label>
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <button 
                                onClick={() => adjustCredits(-1)}
                                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 active:scale-95 transition-transform"
                            >
                                <Minus size={20} />
                            </button>
                            
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-slate-800">
                                    {editingSub.usedCredits} <span className="text-slate-400 text-lg">/ {editingSub.totalCredits}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Consumidos</span>
                            </div>

                            <button 
                                onClick={() => adjustCredits(1)}
                                className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-200 text-slate-600 active:scale-95 transition-transform"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Expiration Date */}
                    <div>
                         <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Vencimento do Plano</label>
                         <div className="relative">
                             <Calendar className="absolute left-4 top-3.5 text-slate-400" size={20} />
                             <input 
                                type="date"
                                value={editingSub.expiresAt instanceof Date 
                                    ? editingSub.expiresAt.toISOString().split('T')[0] 
                                    : new Date(editingSub.expiresAt).toISOString().split('T')[0]
                                }
                                onChange={(e) => {
                                    // Handle date string to Date object conversion
                                    // Create date at noon to avoid timezone rollover issues with simple dates
                                    const d = new Date(e.target.value);
                                    d.setHours(12,0,0,0);
                                    setEditingSub({...editingSub, expiresAt: d});
                                }}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                             />
                         </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-slate-100 flex gap-3">
                    <button 
                         onClick={() => { setSelectedClient(null); setEditingSub(null); }}
                         className="flex-1 py-3.5 text-slate-500 font-bold text-sm bg-slate-100 rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSaveSubscription}
                        className="flex-[2] py-3.5 bg-primary text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                        <Save size={18} /> Salvar Alterações
                    </button>
                </div>
             </div>
         </div>,
         document.body
      )}
    </div>
  );
};

export default Clients;