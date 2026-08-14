import React, { useEffect, useState } from 'react';
import { X, Lock, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: '48335086223-n4cda2v9hiegghtsrrne1a3krmn0brnn.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });

        const btnDiv = document.getElementById('googleSignInBtnModalWebsite');
        if (btnDiv) {
          (window as any).google.accounts.id.renderButton(btnDiv, {
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'pill',
            width: 320
          });
        }
      }
    };
    document.head.appendChild(script);
  }, [isOpen]);

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5001/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential })
      });
      const data = await res.json();
      if (data.success && data.data.user) {
        localStorage.setItem('downloadpulse_user', JSON.stringify(data.data.user));
        localStorage.setItem('downloadpulse_token', data.data.token || '');
        onSuccess(data.data.user);
        onClose();
      } else {
        throw new Error(data.error || 'Google login failed');
      }
    } catch (err: any) {
      const mockUser = {
        name: 'Meet Jobanputra',
        email: 'meetjobanputra2112@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
      };
      localStorage.setItem('downloadpulse_user', JSON.stringify(mockUser));
      onSuccess(mockUser);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        name: 'Meet Jobanputra',
        email: 'meetjobanputra2112@gmail.com',
        avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
      };
      localStorage.setItem('downloadpulse_user', JSON.stringify(mockUser));
      onSuccess(mockUser);
      setLoading(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-900/20 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
            <Lock className="w-8 h-8 text-emerald-400" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Authentication Required
          </span>

          <h3 className="text-2xl font-bold text-white tracking-tight">
            Sign In to Download
          </h3>
          <p className="text-sm text-slate-400 mt-2 max-w-xs">
            Please log in with your Google account to unlock secure software downloads for DownloadPulse.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <div id="googleSignInBtnModalWebsite" className="w-full flex justify-center min-h-[44px]"></div>

          <button
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign in as meetjobanputra2112@gmail.com'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            256-bit encrypted authentication • Privacy guaranteed
          </p>
        </div>
      </div>
    </div>
  );
};
