import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { supabase } from '../lib/supabaseClient';

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

    if (!supabase) {
      // Local demo mode fallback login
      if (email === 'admin@inexserv.com' && password === 'admin123') {
        dispatch(loginSuccess({
          token: 'demo-admin-token-12345',
          user: { email: 'admin@inexserv.com', role: 'admin' }
        }));
        navigate('/admin/dashboard');
        return;
      }
      setErrorMsg('Supabase env vars not configured. Use demo credentials: admin@inexserv.com / admin123');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        dispatch(loginSuccess({
          token: data.session.access_token,
          user: data.user
        }));
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#074476] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 space-y-6">
        <div className="text-center">
          <img src="/images/inexserv-logo.png" alt="IES Logo" className="h-12 mx-auto mb-4 object-contain" />
          <h2 className="text-2xl font-bold text-[#0f2b48]">Admin CMS Login</h2>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage website content dynamically</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0f2b48] mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@inexserv.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#04A552] focus:ring-1 focus:ring-[#04A552]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0f2b48] mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#04A552] focus:ring-1 focus:ring-[#04A552]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#04A552] hover:bg-[#038843] text-white font-medium rounded-lg transition-colors shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-gray-100">
          <a href="/" className="text-sm text-gray-500 hover:text-[#074476] font-medium transition-colors">
            ← Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
