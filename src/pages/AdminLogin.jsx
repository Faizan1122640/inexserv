import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { supabase } from '../lib/supabaseClient';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Try Backend Express API
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        dispatch(
          loginSuccess({
            token: json.data.token,
            user: json.data.user
          })
        );
        navigate('/admin/dashboard');
        return;
      } else {
        setErrorMsg(json.error || 'Invalid email or password. Access Denied.');
        setLoading(false);
        return;
      }
    } catch (apiErr) {
      console.warn('Backend API login offline, attempting Direct Supabase Auth:', apiErr.message);
    }

    // 2. Try Direct Supabase Auth (Fallback if Express API offline)
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });

        if (!error && data && data.session) {
          dispatch(
            loginSuccess({
              token: data.session.access_token,
              user: data.user
            })
          );
          navigate('/admin/dashboard');
          return;
        }

        if (error) {
          setErrorMsg(error.message || 'Invalid email or password. Access Denied.');
          setLoading(false);
          return;
        }
      } catch (sbErr) {
        console.warn('Supabase Auth notice:', sbErr.message);
      }
    }

    setErrorMsg('Invalid email or password. Access Denied.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#032038] via-[#074476] to-[#0d5897] flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#04A552]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#074476]/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 bg-[#074476]/95 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
        {/* Brand Logo Display on Transparent Background */}
        <div className="text-center space-y-3">
          <div className="mx-auto max-w-[280px] flex items-center justify-center transition-transform hover:scale-105 duration-200 py-1">
            <img
              src="/images/inexserv-white.avif"
              alt="Integrated Excellence Service L.L.C"
              className="h-12 w-auto object-contain drop-shadow-md"
              onError={(e) => {
                e.currentTarget.src = '/images/inexserv-logo.png';
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Admin Studio Login
            </h2>
            <p className="text-xs text-white/70 mt-1">
              Sign in to manage website content, customer leads &amp; settings
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-400/40 p-3.5 text-xs text-red-200 rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-[#05335a]/90 border border-white/20 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#04A552] focus:ring-1 focus:ring-[#04A552] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/90 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#05335a]/90 border border-white/20 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-[#04A552] focus:ring-1 focus:ring-[#04A552] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#04A552] hover:bg-[#038843] text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/10">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-[#04A552] font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            ← Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
