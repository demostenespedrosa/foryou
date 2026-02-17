import React, { useState } from 'react';
import { Address } from '../types';
import { ArrowLeft, MapPin, Navigation, Home, Hash, Building } from 'lucide-react';

interface AddressSettingsProps {
  initialAddress?: Address;
  onSave: (address: Address) => void;
  onBack: () => void;
}

const AddressSettings: React.FC<AddressSettingsProps> = ({ initialAddress, onSave, onBack }) => {
  const [zipCode, setZipCode] = useState(initialAddress?.zipCode || '');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [number, setNumber] = useState(initialAddress?.number || '');
  const [neighborhood, setNeighborhood] = useState(initialAddress?.neighborhood || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [state, setState] = useState(initialAddress?.state || '');
  const [complement, setComplement] = useState(initialAddress?.complement || '');

  const handleSave = () => {
    if (!street || !number || !city || !state) return;
    
    onSave({
      zipCode,
      street,
      number,
      neighborhood,
      city,
      state,
      complement
    });
  };

  // Mock function to simulate CEP search
  const handleBlurCep = () => {
      if (zipCode.length >= 8 && !street) {
          // In a real app, fetch from viaCEP API
          // Simulating auto-fill for Recife
          setCity('Recife');
          setState('PE');
          if (zipCode.startsWith('51')) {
             setNeighborhood('Boa Viagem');
          } else if (zipCode.startsWith('52')) {
             setNeighborhood('Casa Forte');
          }
      }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="bg-white p-4 flex items-center gap-4 border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600 active:bg-slate-100 rounded-full">
            <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg text-slate-800">Endereço da Loja</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
         
         <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start mb-2">
            <MapPin className="text-blue-500 shrink-0 mt-1" size={20} />
            <p className="text-sm text-blue-800">
                Este endereço será exibido para seus clientes no link de agendamento e no comprovante.
            </p>
         </div>

         {/* CEP */}
         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">CEP</label>
            <div className="relative">
                <Navigation className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onBlur={handleBlurCep}
                    placeholder="51020-000"
                    maxLength={9}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                />
            </div>
         </div>

         <div className="flex gap-4">
             {/* Rua */}
             <div className="flex-[3]">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Logradouro</label>
                <div className="relative">
                    <Home className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Rua, Av..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                    />
                </div>
             </div>

             {/* Número */}
             <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Nº</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="123"
                        className="w-full pl-10 pr-2 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                    />
                </div>
             </div>
         </div>

         {/* Complemento */}
         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Complemento <span className="text-slate-300 font-normal">(Opcional)</span></label>
            <input 
                type="text" 
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto 101, Loja B..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
            />
         </div>

         {/* Bairro */}
         <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Bairro</label>
            <div className="relative">
                <Building className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Boa Viagem"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                />
            </div>
         </div>

         <div className="flex gap-4">
             {/* Cidade */}
             <div className="flex-[3]">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Cidade</label>
                <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Recife"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium"
                />
             </div>

             {/* UF */}
             <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">UF</label>
                <input 
                    type="text" 
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="PE"
                    maxLength={2}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium text-center"
                />
             </div>
         </div>

      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <button 
            onClick={handleSave}
            disabled={!street || !number || !city || !state}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-300 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Salvar Endereço
        </button>
      </div>
    </div>
  );
};

export default AddressSettings;