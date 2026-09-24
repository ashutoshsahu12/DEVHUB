import React, { useState } from 'react';
import { User, GitBranch, Star, Users, ExternalLink, ArrowRight, Shield, AlertCircle, Search } from 'lucide-react';
import { fetchWithCache } from '../utils/githubApi';

export default function CompareDevelopersPage() {
  const [username1, setUsername1] = useState('');
  const [username2, setUsername2] = useState('');
  
  const [dev1, setDev1] = useState(null);
  const [dev2, setDev2] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!username1.trim() || !username2.trim()) {
      setError('Please enter both developer usernames to compare.');
      return;
    }

    setLoading(true);
    setError('');
    setDev1(null);
    setDev2(null);

    try {
      // Fetch both user profiles concurrently
      const [res1, res2] = await Promise.all([
        fetchWithCache(`https://api.github.com/users/${encodeURIComponent(username1.trim())}`),
        fetchWithCache(`https://api.github.com/users/${encodeURIComponent(username2.trim())}`)
      ]);

      setDev1(res1.data);
      setDev2(res2.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch developer profiles. Check usernames and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full text-sm">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#212121] border border-gray-800 text-xs font-medium text-gray-300 mb-4">
          <Users className="w-3.5 h-3.5 text-accent" />
          <span>Developer Intelligence Suite</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
          Compare Two <span className="text-accent">Developers</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Contrast GitHub profiles side-by-side to analyze followers, public repositories, and activity metrics.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl mb-12">
        <form onSubmit={handleCompare} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">First Developer Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username1}
                onChange={(e) => setUsername1(e.target.value)}
                placeholder="e.g. torvalds"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#009ca6] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Second Developer Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={username2}
                onChange={(e) => setUsername2(e.target.value)}
                placeholder="e.g. gaearon"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#009ca6] transition"
              />
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-lg disabled:opacity-50"
            >
              <span>{loading ? 'Fetching Profiles...' : 'Compare Developers'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Results Section */}
      {dev1 && dev2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-fadeIn">
          
          {/* Developer 1 Card */}
          <DeveloperCard dev={dev1} />

          {/* Developer 2 Card */}
          <DeveloperCard dev={dev2} />

        </div>
      )}

    </div>
  );
}

// Subcomponent for Individual Developer Column
const DeveloperCard = ({ dev }) => (
  <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
    <div>
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800/80">
        <img src={dev.avatar_url} alt={dev.login} className="w-20 h-20 rounded-2xl border-2 border-gray-700 object-cover shadow-md" />
        <div>
          <h2 className="text-xl font-bold text-white truncate">{dev.name || dev.login}</h2>
          <a href={dev.html_url} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline flex items-center gap-1 mt-1">
            <span>@{dev.login}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#262626] border border-gray-700 text-[11px] text-gray-300 capitalize">
            {dev.type || 'Developer'}
          </span>
        </div>
      </div>

      {/* Bio */}
      {dev.bio && (
        <p className="text-gray-300 text-xs mb-6 bg-[#161616] p-3.5 rounded-xl border border-gray-800/60 leading-relaxed">
          {dev.bio}
        </p>
      )}

      {/* Core Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#161616] border border-gray-800/60 p-4 rounded-xl text-center">
          <div className="text-2xl font-extrabold text-white">{dev.public_repos.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">Public Repos</div>
        </div>
        <div className="bg-[#161616] border border-gray-800/60 p-4 rounded-xl text-center">
          <div className="text-2xl font-extrabold text-accent">{dev.followers.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">Followers</div>
        </div>
        <div className="bg-[#161616] border border-gray-800/60 p-4 rounded-xl text-center">
          <div className="text-2xl font-extrabold text-white">{dev.following.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">Following</div>
        </div>
        <div className="bg-[#161616] border border-gray-800/60 p-4 rounded-xl text-center">
          <div className="text-2xl font-extrabold text-yellow-400">{dev.public_gists.toLocaleString()}</div>
          <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">Gists</div>
        </div>
      </div>

      {/* Details List */}
      <div className="space-y-2.5 text-xs">
        {dev.company && <DetailRow label="Company" value={dev.company} />}
        {dev.location && <DetailRow label="Location" value={dev.location} />}
        {dev.blog && (
          <div className="flex items-center justify-between p-2.5 bg-[#161616] rounded-lg border border-gray-800/60">
            <span className="text-gray-400">Website</span>
            <a href={dev.blog.startsWith('http') ? dev.blog : `https://${dev.blog}`} target="_blank" rel="noreferrer" className="text-accent truncate max-w-[180px] hover:underline">
              {dev.blog}
            </a>
          </div>
        )}
      </div>
    </div>

    <div className="mt-6 pt-4 border-t border-gray-800/80">
      <a 
        href={dev.html_url} 
        target="_blank" 
        rel="noreferrer" 
        className="w-full flex items-center justify-center gap-2 bg-[#161616] border border-gray-700 text-white font-medium py-2.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 text-xs"
      >
        <span>View Full GitHub Profile</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex items-center justify-between p-2.5 bg-[#161616] rounded-lg border border-gray-800/60">
    <span className="text-gray-400">{label}</span>
    <span className="text-white font-medium truncate max-w-[180px]">{value}</span>
  </div>
);