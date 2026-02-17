import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Service } from '../types';
import { ArrowLeft, Plus, Trash2, Edit2, Clock, DollarSign, X, Layers, Scissors } from 'lucide-react';

interface ServiceCatalogProps {
  services: Service[];
  onUpdate: (services: Service[]) => void;
  onBack: () => void;
}

const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ services, onUpdate, onBack }) => {
  const [activeTab, setActiveTab] = useState<'service' | 'combo'>('service');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('30');

  // Filter services based on active tab
  const filteredServices = services.filter(s => {
    const type = s.type || 'service'; // Default to service if undefined
    return type === activeTab;
  });

  const openEditor = (service?: Service) => {
    if (service) {
      setEditingId(service.id);
      setName(service.name);
      setPrice(service.price.toString());
      setDuration(service.durationMinutes.toString());
    } else {
      setEditingId(null);
      setName('');
      setPrice('');
      setDuration('30');
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!name || !price || !duration) return;

    const newService: Service = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      name,
      price: parseFloat(price.replace(',', '.')),
      durationMinutes: parseInt(duration),
      type: activeTab // Create with the type of the current tab
    };

    if (editingId) {
      onUpdate(services.map(s => s.id === editingId ? newService : s));
    } else {
      onUpdate([...services, newService]);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      onUpdate(services.filter(s => s.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Header */}
      <div className="bg-white pt-4 px-4 pb-2 border-b border-slate-100 shadow-sm z-10">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <h1 className="font-bold text-lg text-slate-800">Catálogo</h1>
            </div>
            <button 
            onClick={() => openEditor()}
            className="bg-primary/10 text-primary p-2 rounded-full active:bg-primary/20 transition-colors"
            >
            <Plus size={24} />
            </button>
        </div>

        {/* Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
                onClick={() => setActiveTab('service')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'service' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Scissors size={16} /> Serviços
            </button>
            <button 
                onClick={() => setActiveTab('combo')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'combo' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
            >
                <Layers size={16} /> Combos
            </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {filteredServices.length === 0 ? (
           <div className="text-center text-slate-400 mt-10 border-2 border-dashed border-slate-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  {activeTab === 'service' ? <Scissors size={32} /> : <Layers size={32} />}
              </div>
              <p>Nenhum {activeTab === 'service' ? 'serviço' : 'combo'} cadastrado.</p>
              <button 
                onClick={() => openEditor()}
                className="mt-4 text-primary font-bold text-sm hover:underline"
              >
                + Criar primeiro {activeTab === 'service' ? 'serviço' : 'combo'}
              </button>
           </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group animate-slide-in">
              <div>
                <div className="flex items-center gap-2">
                    {service.type === 'combo' && (
                        <div className="bg-amber-100 text-amber-600 p-1 rounded">
                            <Layers size={12} />
                        </div>
                    )}
                    <h3 className="font-bold text-slate-800 text-lg">{service.name}</h3>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {service.durationMinutes} min
                  </span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                     R$ {service.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEditor(service)}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Create Modal Overlay - Portal to Body */}
      {isEditing && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
          <div className="bg-white w-full sm:w-[90%] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      {activeTab === 'service' ? <Scissors size={24} /> : <Layers size={24} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                        {editingId ? 'Editar' : 'Novo'} {activeTab === 'service' ? 'Serviço' : 'Combo'}
                    </h2>
                    <p className="text-xs text-slate-400">Preencha os detalhes abaixo</p>
                  </div>
              </div>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 p-2 hover:bg-slate-50 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">
                    Nome {activeTab === 'service' ? 'do Serviço' : 'do Combo'}
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={activeTab === 'service' ? "Ex: Corte Degrade" : "Ex: Corte + Barba + Sobrancelha"}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-medium"
                  autoFocus
                />
              </div>

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
                  <label className="block text-sm font-medium text-slate-500 mb-1">Duração (min)</label>
                  <div className="relative">
                    <Clock size={18} className="absolute left-4 top-4 text-slate-400" />
                    <input 
                      type="number" 
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="30"
                      step="5"
                      className="w-full p-4 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              disabled={!name || !price || !duration}
              className="w-full mt-8 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-200 active:scale-95 transition-transform disabled:opacity-50"
            >
              Salvar {activeTab === 'service' ? 'Serviço' : 'Combo'}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ServiceCatalog;