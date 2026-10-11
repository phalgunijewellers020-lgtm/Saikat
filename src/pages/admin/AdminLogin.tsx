import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please provide an admin email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@saikatphotography.com');
    setPassword('admin1234');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D91B24]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 rounded-xl p-8 sm:p-10 shadow-2xl relative z-10">
        {/* Brand Logo Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <BrandLogo size="md" />
          </div>
          <div>
            <h2 className="text-xl font-serif-display text-white font-medium">
              Studio Admin Portal
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Authorized personnel only. Direct CMS access.
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-6 p-3 rounded bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@saikatphotography.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 pl-10 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Please contact the super administrator or use the demo credentials below.')}
                className="text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 pl-10 pr-10 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs uppercase tracking-[0.2em] font-semibold py-3.5 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(217,27,36,0.4)] active:scale-98"
          >
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In To Studio CMS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Role-Based Access Control Enabled</span>
          </div>

          <div className="bg-[#050505] p-3 rounded border border-white/5 text-left">
            <p className="text-[11px] text-neutral-400 font-medium mb-1">
              One-Click Studio Login:
            </p>
            <p className="text-[11px] text-neutral-400 font-mono">
              admin@saikatphotography.com / admin1234
            </p>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="mt-2 text-xs text-[#D91B24] hover:underline font-semibold cursor-pointer block"
            >
              Fill Demo Credentials &rarr;
            </button>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                window.history.pushState(null, '', '/');
                window.dispatchEvent(new Event('hashchange'));
              }}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>&larr; Exit to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
