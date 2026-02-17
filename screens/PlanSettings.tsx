import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plan } from '../types';
import { ArrowLeft, Plus, Trash2, Edit2, Crown, DollarSign, X, Calendar, Infinity } from 'lucide-react';

interface PlanSettingsProps {
  plans: Plan[];
  onUpdate: (plans: Plan[]) => void;
  onBack: () => void;
}

const PlanSettings: React.FC<PlanSettingsProps> = ({ plans, onUpdate, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'credits' | 'unlimited'>('credits');
  const [credits, setCredits] = useState('4');
  const [validity, setValidity] = useState('30');

  const openEditor = (plan?: Plan) => {
    if (plan) {
      setEditingId(plan.id);
      setName(plan.name);
      setPrice(plan.price.toString());
      setType(plan.type);
      setCredits(plan.credits.toString());
      setValidity(plan.validityDays.toString());
    } else {
      setEditingId(null);
      setName('');
      setPrice('');
      setType('credits');
      setCredits('4');
      setValidity('30');
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name || !price || !validity) return;

    const newPlan: Plan = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name,
      price: parseFloat(price.replace(',', '.')),
      type,
      credits: type === 'unlimited' ? 0 : parseInt(credits),
      validityDays: parseInt(validity)
    };

    if (editingId) {
      onUpdate(plans.map(p => p.id === editingId ? newPlan : p));
    } else {
      onUpdate([...plans, newPlan]);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano? Clientes ativos não serão afetados.')) {
      onUpdate(plans.filter(p => p.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white p-4 border-b border-slate-100 shadow-sm z-10 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-800">Planos de Assinatura</h1>
         </div>
         <button 
            onClick={() => openEditor()}
            className="bg-amber-100 text-amber-700 p-2 rounded-full active:bg-amber-200 transition-colors"
         >
            <Plus size={24} />
         </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {plans.length === 0 ? (
           <div className="text-center text-slate-400 mt-10 border-2 border-dashed border-slate-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-300">
                  <Crown size={32} />
              </div>
              <p>Nenhum plano cadastrado.</p>
              <button 
                onClick={() => openEditor()}
                className="mt-4 text-primary font-bold text-sm hover:underline"
              >
                + Criar primeiro plano
              </button>
           </div>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden group animate-slide-in">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                      <Crown size={16} className="text-amber-500 fill-amber-500" />
                      <h3 className="font-bold text-slate-800 text-lg">{plan.name}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600 uppercase">
                            {plan.type === 'unlimited' ? 'Ilimitado' : `${plan.credits} Créditos`}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} /> {plan.validityDays} dias
                        </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                    <div className="font-bold text-xl text-green-600">
                        R$ {plan.price.toFixed(2)}
                    </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-50">
                <button 
                  onClick={() => openEditor(plan)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Edit2 size={14} /> Editar
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Create Modal Overlay - Portal */}
      {isEditing && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-white w-full sm:w-[90%] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                      <Crown size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {editingId ? 'Editar' : 'Novo'} Plano
                    </h2>
                    <p className="text-xs text-slate-400">Configure a recorrência</p>
                  </div>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                    Nome do Plano
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Vip Gold"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                />
              </div>

              {/* Tipo de Plano (Toggle) */}
              <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Tipo de Recorrência</label>
                  <div className="flex p-1 bg-slate-100 rounded-xl">
                    <button 
                        onClick={() => setType('credits')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            type === 'credits' 
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-400'
                        }`}
                    >
                        <Crown size={16} /> Por Créditos
                    </button>
                    <button 
                        onClick={() => setType('unlimited')}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                            type === 'unlimited' 
                            ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-400'
                        }`}
                    >
                        <Infinity size={16} /> Ilimitado
                    </button>
                  </div>
              </div>

              {/* Detalhes do Plano */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-500 mb-1">Valor (R$)</label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-4 top-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-bold"
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-500 mb-1">Validade (Dias)</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={validity}
                      onChange={(e) => setValidity(e.target.value)}
                      placeholder="30"
                      className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Input Condicional: Quantidade de Créditos */}
              {type === 'credits' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-medium text-slate-500 mb-1">Quantidade de Créditos</label>
                    <div className="relative">
                        <Crown size={18} className="absolute left-4 top-4 text-amber-500" />
                        <input 
                        type="number" 
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        placeholder="Ex: 4"
                        className="w-full p-4 pl-10 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-amber-900 font-bold"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 ml-1">Quantos serviços o cliente pode realizar neste plano.</p>
                  </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={!name || !price || !validity || (type === 'credits' && !credits)}
              className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-300 active:scale-95 transition-transform disabled:opacity-50"
            >
              Salvar Plano
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default PlanSettings;