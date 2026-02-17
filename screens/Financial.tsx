import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Transaction } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { TrendingUp, TrendingDown, CreditCard, Scissors, DollarSign, ChevronLeft, ChevronRight, Calendar, Wallet, ArrowUpRight, ArrowDownRight, Plus, X, Tag } from 'lucide-react';

const Financial: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Transaction Form
  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [txAmount, setTxAmount] = useState('');
  const [txDesc, setTxDesc] = useState('');

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => 
      t.date.getMonth() === currentDate.getMonth() &&
      t.date.getFullYear() === currentDate.getFullYear()
    ).sort((a, b) => b.date.getTime() - a.date.getTime()); // Newest first
  }, [currentDate]);

  // Group Transactions by Date
  const groupedTransactions = useMemo(() => {
      const groups: Record<string, Transaction[]> = {};
      
      filteredTransactions.forEach(t => {
          const dateKey = t.date.toLocaleDateString('pt-BR');
          if (!groups[dateKey]) groups[dateKey] = [];
          groups[dateKey].push(t);
      });

      return groups;
  }, [filteredTransactions]);

  // Metrics Calculations
  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    let subscription = 0;
    let serviceCount = 0;

    filteredTransactions.forEach(t => {
        if (t.type === 'expense') {
            expense += t.amount;
        } else {
            income += t.amount;
            if (t.type === 'subscription_sale') subscription += t.amount;
            if (t.type === 'service') serviceCount++;
        }
    });

    const profit = income - expense;
    const avgTicket = serviceCount > 0 ? (income - subscription) / serviceCount : 0;

    return { income, expense, profit, subscription, avgTicket };
  }, [filteredTransactions]);

  // Mock Chart Data (Weekly distribution)
  const chartData = [
      { day: 'Seg', val: 30, max: 100 },
      { day: 'Ter', val: 45, max: 100 },
      { day: 'Qua', val: 20, max: 100 },
      { day: 'Qui', val: 60, max: 100 },
      { day: 'Sex', val: 80, max: 100 },
      { day: 'Sab', val: 95, max: 100 },
      { day: 'Dom', val: 10, max: 100 },
  ];

  const formatDateHeader = (dateStr: string) => {
      const today = new Date().toLocaleDateString('pt-BR');
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('pt-BR');
      
      if (dateStr === today) return 'Hoje';
      if (dateStr === yesterday) return 'Ontem';
      return dateStr.substring(0, 5); // dd/mm
  };

  const handleAddTransaction = () => {
     // Here you would add to the state/backend
     alert("Transação registrada com sucesso!");
     setIsModalOpen(false);
     setTxAmount('');
     setTxDesc('');
  };

  return (
    <div className="pb-24 pt-2 min-h-full bg-background relative">
      
      {/* Top Navigation */}
      <div className="bg-white sticky top-0 z-20 px-4 py-3 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Financeiro</h1>
        <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-lg">
           <button onClick={handlePrevMonth} className="p-1 hover:bg-white rounded-md transition-colors text-purple-600">
             <ChevronLeft size={18} />
           </button>
           <span className="text-xs font-bold text-slate-700 w-24 text-center capitalize">
               {currentDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')}
           </span>
           <button onClick={handleNextMonth} className="p-1 hover:bg-white rounded-md transition-colors text-purple-600">
             <ChevronRight size={18} />
           </button>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-6">

          {/* Hero Card - Balance - Updated to Deep Purple for Pastel Theme contrast */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
             {/* Abstract Shapes */}
             <div className="absolute top-0 right-0 w-40 h-40 bg-primary/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -ml-10 -mb-10"></div>
             
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-purple-200 text-sm font-medium">Lucro Líquido</span>
                    <div className="bg-white/10 p-2 rounded-full text-primary">
                        <Wallet size={20} />
                    </div>
                </div>
                <h2 className="text-4xl font-bold mb-4">R$ {metrics.profit.toFixed(2)}</h2>
                
                <div className="flex gap-4 pt-2 border-t border-white/10">
                    <div className="flex-1">
                        <p className="text-xs text-purple-200 mb-1 flex items-center gap-1">
                            <ArrowUpRight size={12} className="text-green-300" /> Receitas
                        </p>
                        <p className="font-bold text-green-300">R$ {metrics.income.toFixed(2)}</p>
                    </div>
                    <div className="w-[1px] bg-white/10 h-8 self-center"></div>
                    <div className="flex-1">
                        <p className="text-xs text-purple-200 mb-1 flex items-center gap-1">
                            <ArrowDownRight size={12} className="text-red-300" /> Despesas
                        </p>
                        <p className="font-bold text-red-300">R$ {metrics.expense.toFixed(2)}</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-yellow-100 shadow-sm flex flex-col justify-between h-28">
                  <div className="bg-yellow-100 w-8 h-8 rounded-lg flex items-center justify-center text-yellow-600 mb-2">
                      <CreditCard size={16} />
                  </div>
                  <div>
                      <p className="text-xs text-yellow-600/70 font-bold uppercase">Assinaturas</p>
                      <p className="text-lg font-bold text-slate-800">R$ {metrics.subscription}</p>
                  </div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between h-28">
                  <div className="bg-purple-100 w-8 h-8 rounded-lg flex items-center justify-center text-purple-600 mb-2">
                      <Tag size={16} />
                  </div>
                  <div>
                      <p className="text-xs text-purple-500/70 font-bold uppercase">Ticket Médio</p>
                      <p className="text-lg font-bold text-slate-800">R$ {metrics.avgTicket.toFixed(0)}</p>
                  </div>
              </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-white p-5 rounded-3xl border border-purple-50 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-slate-800">Performance Semanal</h3>
                 <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">+12%</span>
             </div>
             
             <div className="flex justify-between items-end h-32 gap-2">
                 {chartData.map((d, i) => (
                     <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                         <div className="relative w-full flex justify-end flex-col h-full rounded-t-lg bg-purple-50 overflow-hidden">
                             <div 
                                style={{ height: `${d.val}%` }}
                                className={`w-full rounded-t-lg transition-all duration-500 ${i === 5 ? 'bg-primary' : 'bg-purple-200 group-hover:bg-purple-300'}`}
                             ></div>
                         </div>
                         <span className="text-[10px] font-bold text-slate-400">{d.day}</span>
                     </div>
                 ))}
             </div>
          </div>

          {/* Transactions List */}
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-4">Extrato</h3>
            
            {Object.keys(groupedTransactions).length > 0 ? (
                <div className="space-y-6">
                    {(Object.entries(groupedTransactions) as [string, Transaction[]][]).map(([date, transactions]) => (
                        <div key={date}>
                            <h4 className="text-xs font-bold text-purple-300 uppercase mb-3 ml-1 sticky top-14 bg-background py-1 z-10">
                                {formatDateHeader(date)}
                            </h4>
                            <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
                                {transactions.map((t, idx) => (
                                    <div key={t.id} className={`p-4 flex items-center justify-between ${idx !== transactions.length - 1 ? 'border-b border-purple-50' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`
                                                w-10 h-10 rounded-full flex items-center justify-center
                                                ${t.type === 'expense' ? 'bg-red-50 text-red-500' : 
                                                  t.type === 'subscription_sale' ? 'bg-yellow-50 text-yellow-500' : 'bg-green-50 text-green-500'}
                                            `}>
                                                {t.type === 'expense' ? <ArrowDownRight size={18} /> : 
                                                 t.type === 'subscription_sale' ? <CreditCard size={18} /> : <Scissors size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{t.description}</p>
                                                <p className="text-xs text-slate-400 capitalize">{t.category || (t.type === 'service' ? 'Serviço' : 'Assinatura')}</p>
                                            </div>
                                        </div>
                                        <span className={`font-bold ${t.type === 'expense' ? 'text-slate-800' : 'text-green-600'}`}>
                                            {t.type === 'expense' ? '-' : '+'} R$ {t.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 opacity-50">
                    <Wallet size={48} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm text-slate-500">Nenhum movimento neste mês.</p>
                </div>
            )}
          </div>
      </div>

      {/* FAB Add Transaction - Portal */}
      {createPortal(
        <button 
            onClick={() => setIsModalOpen(true)}
            className="fixed bottom-24 right-4 bg-slate-900 text-white p-4 rounded-full shadow-lg shadow-purple-300/40 active:scale-90 transition-transform z-50 group"
        >
            <Plus size={24} className="group-active:rotate-90 transition-transform" />
        </button>,
        document.body
      )}

      {/* Add Transaction Modal */}
      {isModalOpen && createPortal(
         <div className="fixed inset-0 z-[100] bg-purple-900/20 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
            <div className="bg-white w-full sm:w-[90%] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-slide-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Novo Lançamento</h2>
                    <button onClick={() => setIsModalOpen(false)} className="bg-purple-50 p-2 rounded-full text-purple-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Type Toggle */}
                <div className="flex bg-purple-50 p-1 rounded-xl mb-6">
                    <button 
                        onClick={() => setTxType('income')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${txType === 'income' ? 'bg-white shadow-sm text-green-600' : 'text-purple-300'}`}
                    >
                        Entrada
                    </button>
                    <button 
                        onClick={() => setTxType('expense')}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${txType === 'expense' ? 'bg-white shadow-sm text-red-500' : 'text-purple-300'}`}
                    >
                        Saída
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-purple-400 uppercase mb-1 ml-1">Valor</label>
                        <div className="relative">
                            <span className="absolute left-4 top-4 text-lg font-bold text-purple-300">R$</span>
                            <input 
                                type="number" 
                                value={txAmount}
                                onChange={(e) => setTxAmount(e.target.value)}
                                className="w-full pl-12 p-4 bg-purple-50 border-purple-100 rounded-xl text-2xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-400 uppercase mb-1 ml-1">Descrição</label>
                        <input 
                            type="text" 
                            value={txDesc}
                            onChange={(e) => setTxDesc(e.target.value)}
                            className="w-full p-4 bg-purple-50 border-purple-100 rounded-xl font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder={txType === 'expense' ? "Ex: Conta de Luz" : "Ex: Venda de Produto"}
                        />
                    </div>
                </div>

                <button 
                    onClick={handleAddTransaction}
                    disabled={!txAmount || !txDesc}
                    className={`w-full mt-8 py-4 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 ${txType === 'income' ? 'bg-green-500 shadow-green-200' : 'bg-red-500 shadow-red-200'}`}
                >
                    Confirmar {txType === 'income' ? 'Entrada' : 'Saída'}
                </button>
            </div>
         </div>,
         document.body
      )}
    </div>
  );
};

export default Financial;