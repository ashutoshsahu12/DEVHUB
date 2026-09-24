import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, AtSign, Shield, Edit3, Save, Check, ArrowRight, Lock, Terminal } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', username: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('devhub_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('devhub_user'));
    if (savedUser) {
      setUser(savedUser);
      setName(savedUser.name || '');
      setEmail(savedUser.email || '');
    }
  }, [navigate]);

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim()) {
      setError('Name and Email cannot be empty.');
      return;
    }

    const updatedUser = { ...user, name: name.trim(), email: email.trim() };
    
    // Update localStorage
    localStorage.setItem('devhub_user', JSON.stringify(updatedUser));
    
    // Also update registered users list if matching
    const registeredUsers = JSON.parse(localStorage.getItem('devhub_registered_users')) || [];
    const updatedRegistered = registeredUsers.map(u => 
      u.username === user.username ? { ...u, name: name.trim(), email: email.trim() } : u
    );
    localStorage.setItem('devhub_registered_users', JSON.stringify(updatedRegistered));

    setUser(updatedUser);
    setIsEditing(false);
    setSuccess('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full">
      
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#212121] border border-gray-800 text-xs font-medium text-gray-300 mb-2">
            <Shield className="w-3.5 h-3.5 text-accent" />
            Developer Security & Identity
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Profile</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your personal developer credentials and preferences.</p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium px-4 py-2.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 text-sm w-fit shadow-lg"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Main Profile Box */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 md:p-8 shadow-xl">
        
        {/* Profile Avatar / Top Section */}
        <div className="flex items-center gap-5 pb-6 mb-6 border-b border-gray-800/80">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-[#009ca6]/20 border border-gray-700 flex items-center justify-center text-accent font-bold text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name || 'Developer'}</h2>
            <p className="text-xs text-gray-400">@{user?.username || 'username'}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#262626] border border-gray-700/60 text-[10px] font-medium text-[#00ff0f]">
              Verified Developer
            </span>
          </div>
        </div>

        {/* Profile Form / View Details */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#009ca6] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Username (Read-Only)</label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full bg-[#161616]/50 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#009ca6] transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium px-5 py-3 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 text-sm shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setName(user.name); setEmail(user.email); }}
                className="px-5 py-3 rounded-xl bg-[#161616] border border-gray-800 text-gray-400 hover:text-white transition text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#161616] border border-gray-800/60">
              <span className="text-gray-400 flex items-center gap-2.5">
                <User className="w-4 h-4 text-accent" /> Full Name
              </span>
              <span className="font-medium text-white">{user.name}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#161616] border border-gray-800/60">
              <span className="text-gray-400 flex items-center gap-2.5">
                <AtSign className="w-4 h-4 text-accent" /> Username
              </span>
              <span className="font-medium text-white">@{user.username}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#161616] border border-gray-800/60">
              <span className="text-gray-400 flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent" /> Email Address
              </span>
              <span className="font-medium text-white">{user.email}</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#161616] border border-gray-800/60">
              <span className="text-gray-400 flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-accent" /> Authentication Role
              </span>
              <span className="font-medium text-[#00ff0f]">Standard Developer</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}