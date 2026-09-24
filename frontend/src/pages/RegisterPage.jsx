import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitBranch, User, Mail, Lock, ArrowRight, AlertCircle, Loader2, Check, X } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [usernameStatus, setUsernameStatus] = useState(null); // 'checking' | 'available' | 'taken' | null
  const [emailStatus, setEmailStatus] = useState(null);       // 'checking' | 'available' | 'taken' | null
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Live username availability check with debounce
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/check-username/${username.trim()}`);
        const data = await response.json();
        if (response.ok) {
          setUsernameStatus(data.available ? 'available' : 'taken');
        } else {
          setUsernameStatus(null);
        }
      } catch (err) {
        setUsernameStatus(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username]);

  // Live email availability check with query param and debounce
  useEffect(() => {
    if (!email.trim() || !email.includes('@')) {
      setEmailStatus(null);
      return;
    }

    setEmailStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auth/check-email?email=${encodeURIComponent(email.trim())}`);
        const data = await response.json();
        if (response.ok) {
          setEmailStatus(data.available ? 'available' : 'taken');
        } else {
          setEmailStatus(null);
        }
      } catch (err) {
        setEmailStatus(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [email]);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (usernameStatus === 'taken') {
      setError('Username already exists. Please choose another one.');
      return;
    }

    if (emailStatus === 'taken') {
      setError('Email already exists. Please use a different one.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register account.');
      }

      navigate('/login', { state: { successMessage: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-[#1c1c1c] border border-gray-800/80 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 text-xl font-bold text-white tracking-wider mb-3 group">
            <div className="p-2 bg-[#212121] border border-gray-800 rounded-xl group-hover:border-accent transition">
              <GitBranch className="w-5 h-5 text-accent" />
            </div>
            <span>Dev<span className="text-accent">Hub</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create an Account</h1>
          <p className="text-gray-400 text-xs mt-1">Join DevHub to unlock code intelligence and save bookmarks</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ashutosh Sahu"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent transition"
              />
            </div>
          </div>

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
                className={`w-full bg-[#161616] border rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition ${
                  usernameStatus === 'taken' 
                    ? 'border-red-500/80 focus:border-red-500' 
                    : usernameStatus === 'available' 
                    ? 'border-green-500/80 focus:border-green-500' 
                    : 'border-gray-800 focus:border-accent'
                }`}
              />
              
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                {usernameStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                {usernameStatus === 'available' && <Check className="w-4 h-4 text-green-400" />}
                {usernameStatus === 'taken' && <X className="w-4 h-4 text-red-400" />}
              </div>
            </div>
            {usernameStatus === 'taken' && (
              <p className="text-[11px] text-red-400 mt-1 pl-1">Username already exists</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ashutoshsahu0369@gmail.com"
                className={`w-full bg-[#161616] border rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition ${
                  emailStatus === 'taken' 
                    ? 'border-red-500/80 focus:border-red-500' 
                    : emailStatus === 'available' 
                    ? 'border-green-500/80 focus:border-green-500' 
                    : 'border-gray-800 focus:border-accent'
                }`}
              />
              
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                {emailStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                {emailStatus === 'available' && <Check className="w-4 h-4 text-green-400" />}
                {emailStatus === 'taken' && <X className="w-4 h-4 text-red-400" />}
              </div>
            </div>
            {emailStatus === 'taken' && (
              <p className="text-[11px] text-red-400 mt-1 pl-1">Email already exists</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Password <span className="text-gray-500 font-normal">(at least 8 characters)</span>
            </label>
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

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">
              Confirm Password <span className="text-gray-500 font-normal">(at least 8 characters)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-[#161616] border rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-gray-600 focus:outline-none transition ${
                  passwordsMatch ? 'border-green-500/80 focus:border-green-500' : 'border-gray-800 focus:border-accent'
                }`}
              />
              {passwordsMatch && (
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-green-400 animate-fadeIn">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-md text-xs disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-accent" /> : <span>Create Account</span>}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}