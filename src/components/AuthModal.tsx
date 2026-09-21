import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (tab === 'login') {
        if (!email.trim()) return;
        await login(email);
      } else {
        if (!name.trim() || !email.trim()) return;
        await register(name, email, phone);
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    try {
      await login(demoEmail);
      onClose();
    } catch {
      setError('Could not sign in with demo profile.');
    }
  };

  return (
    <div id="auth-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div id="auth-modal-card" className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 text-left">
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-sm">
            V
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">VYNORA</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">
          {tab === 'login' ? 'Welcome Back!' : 'Create Your Vynora Account'}
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          {tab === 'login'
            ? 'Sign in to access your orders, SuperCoins rewards and saved addresses.'
            : 'Join today and get 100 bonus SuperCoins + exclusive wholesale pricing.'}
        </p>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              tab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Angelin Anand"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email or Mobile Number</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com or +91 98765..."
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            id="btn-auth-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-600/30 disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Please wait...' : tab === 'login' ? 'Sign In to Vynora' : 'Register & Claim 100 Coins'}
          </button>
        </form>

        {/* 1-Click Demo Accounts */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick 1-Click Demo Profiles
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="btn-demo-login-angelin"
              onClick={() => handleQuickDemoLogin('angelin@vynora.in')}
              className="p-2 border border-slate-200 hover:border-rose-300 rounded-xl bg-slate-50/70 hover:bg-rose-50/50 text-left transition-colors"
            >
              <p className="text-xs font-bold text-slate-900 truncate">Angelin Anand</p>
              <p className="text-[10px] text-slate-500">450 SuperCoins &bull; Orders</p>
            </button>
            <button
              type="button"
              id="btn-demo-login-guest"
              onClick={() => handleQuickDemoLogin('shopper@vynora.in')}
              className="p-2 border border-slate-200 hover:border-rose-300 rounded-xl bg-slate-50/70 hover:bg-rose-50/50 text-left transition-colors"
            >
              <p className="text-xs font-bold text-slate-900 truncate">Guest Shopper</p>
              <p className="text-[10px] text-slate-500">Fresh profile</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
