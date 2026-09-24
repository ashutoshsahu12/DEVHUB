import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GitBranch, User, Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const successMessage = location.state?.successMessage;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://devhub-backend-lpen.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to log in.');
      }

      // Save token and user info
      localStorage.setItem('devhub_token', data.token);
      localStorage.setItem('devhub_user', JSON.stringify(data.user));

      // Force a full reload to transition the app state and route to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-[#1c1c1c] border border-gray-800/80 rounded-3xl p-8 shadow-2xl">
        
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-xl font-bold text-white tracking-wider mb-3 group">
            <div className="p-2 bg-[#212121] border border-gray-800 rounded-xl group-hover:border-accent transition">
              <GitBranch className="w-5 h-5 text-accent" />
            </div>
            <span>Dev<span className="text-accent">Hub</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-xs mt-1">Log in using your username to access your dashboard</p>
        </div>

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ashutoshsahu12"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-md text-xs disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : <span>Log In</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}