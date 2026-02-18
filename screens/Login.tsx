import React, { useState } from 'react';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
  onRegisterClick: () => void;
  onClientLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegisterClick, onClientLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      if (email === 'admin@demo.com' && password === '123456') {
        onLogin();
      } else {
        setError('Credenciais inválidas. Tente o usuário demo.');
        setLoading(false);
      }
    }, 1000);
  };

  const fillDemoUser = () => {
    setEmail('admin@demo.com');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor - Pastel Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-yellow-200/40 rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-100 overflow-hidden animate-slide-in relative z-10 border border-white">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-white to-purple-50 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-purple-400 rounded-2xl rotate-3 mx-auto mb-4 flex items-center justify-center text-white shadow-lg shadow-purple-200">
             <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">ForYou</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Beleza e Bem-estar para você</p>
        </div>

        {/* Form */}
        <div className="p-8 pt-4">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-purple-400 uppercase mb-2 ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-purple-300" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-purple-50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium placeholder:text-purple-200"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-purple-400 uppercase mb-2 ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-purple-300" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-purple-50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 font-medium placeholder:text-purple-200"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-purple-300 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-purple-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="animate-pulse">Entrando...</span>
              ) : (
                <>
                  Entrar <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
             <button onClick={fillDemoUser} className="text-purple-400 hover:text-primary transition-colors font-medium">
               Usar Demo Profissional
             </button>
             
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
             <button 
                onClick={onClientLogin}
                className="w-full py-3 bg-amber-50 text-amber-600 font-bold rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
             >
                <User size={18} /> Acessar como Cliente (Demo)
             </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-purple-50/50 p-6 text-center border-t border-purple-100">
          <p className="text-slate-600 text-sm">
            Novo por aqui?{' '}
            <button onClick={onRegisterClick} className="font-bold text-primary hover:underline">
              Crie sua conta
            </button>
          </p>
        </div>
      </div>
      
      <p className="text-purple-300 text-xs mt-8 opacity-80 font-medium">Versão 1.2.0 • ForYou App</p>
    </div>
  );
};

export default Login;