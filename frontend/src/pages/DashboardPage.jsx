import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GitCompare, Search, User, Mail, Star, Code, Terminal, ArrowUpRight, Trash2, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [favRepos, setFavRepos] = useState([]);
  const [favUsers, setFavUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('devhub_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('devhub_user'));
    if (savedUser) setUser(savedUser);

    const savedFavs = JSON.parse(localStorage.getItem('devhub_fav_repos')) || [];
    setFavRepos(savedFavs);

    const savedFavUsers = JSON.parse(localStorage.getItem('devhub_fav_users')) || [];
    setFavUsers(savedFavUsers);
  }, [navigate]);

  const removeFavorite = (owner, name) => {
    const updated = favRepos.filter(fav => !(fav.owner === owner && fav.name === name));
    setFavRepos(updated);
    localStorage.setItem('devhub_fav_repos', JSON.stringify(updated));
  };

  const removeFavUser = (id) => {
    const updated = favUsers.filter(u => u.id !== id);
    setFavUsers(updated);
    localStorage.setItem('devhub_fav_users', JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#212121] border border-gray-800 text-xs font-medium text-gray-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff0f] animate-pulse"></span>
            Session Active
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-accent">{user?.name || 'Developer'}</span>!
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Here is your developer activity overview and saved bookmarks.
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Left Column: User Profile Card */}
        <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-[#009ca6]/20 border border-gray-700 flex items-center justify-center text-accent font-bold text-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">{user?.name || 'User'}</h2>
                <p className="text-xs text-gray-400">@{user?.username || 'developer'}</p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-800/60 text-sm">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="truncate">{user?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Terminal className="w-4 h-4 text-gray-500 shrink-0" />
                <span>DevHub v1.0.0</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-500">
            <span>Status: Online</span>
            <span className="text-[#00ff0f]">Connected</span>
          </div>
        </div>

        {/* Right Column: Quick Stat Cards & Navigation */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            to="/compare"
            className="group bg-[#1c1c1c] border border-gray-800/80 hover:border-[#009ca6] transition duration-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-[#262626] border border-gray-700/60 rounded-xl w-fit mb-4 text-accent group-hover:text-[#00ff0f] transition">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00ff0f] transition">Compare Repositories</h3>
              <p className="text-xs text-gray-400">Analyze and compare GitHub repositories or developer accounts side-by-side.</p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-medium text-accent group-hover:translate-x-1 transition">
              <span>Launch tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/"
            className="group bg-[#1c1c1c] border border-gray-800/80 hover:border-[#009ca6] transition duration-200 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-[#262626] border border-gray-700/60 rounded-xl w-fit mb-4 text-accent group-hover:text-[#00ff0f] transition">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00ff0f] transition">Developer Search</h3>
              <p className="text-xs text-gray-400">Discover top-tier open-source creators, codebases, and trending repositories.</p>
            </div>
            <div className="mt-6 flex items-center gap-1 text-xs font-medium text-accent group-hover:translate-x-1 transition">
              <span>Start searching</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

      </div>

      {/* Saved Favorite Repositories Section */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl mb-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          Saved Favorite Repositories ({favRepos.length})
        </h3>

        {favRepos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs italic">
            No saved repositories yet. Search for a repository and click 'Favorite' to save it here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favRepos.map((repo) => (
              <div key={`${repo.owner}/${repo.name}`} className="bg-[#161616] border border-gray-800/60 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Link to={`/repository/${repo.owner}/${repo.name}`} className="font-bold text-white text-sm hover:text-accent truncate">
                      {repo.name}
                    </Link>
                    <button 
                      onClick={() => removeFavorite(repo.owner, repo.name)}
                      className="text-gray-500 hover:text-red-400 transition p-1"
                      title="Remove Favorite"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-800/60 text-xs">
                  <span className="text-gray-500">@{repo.owner}</span>
                  <Link to={`/repository/${repo.owner}/${repo.name}`} className="text-accent hover:underline font-medium">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Favorite Developers Section */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl mb-8">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-accent" />
          Saved Favorite Developers ({favUsers.length})
        </h3>

        {favUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs italic">
            No saved developers yet. Search for a developer and click the star icon to save them here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favUsers.map((dev) => (
              <div key={dev.id} className="bg-[#161616] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={dev.avatar_url} alt={dev.login} className="w-10 h-10 rounded-xl border border-gray-700 object-cover" />
                  <div>
                    <a href={dev.html_url} target="_blank" rel="noreferrer" className="font-bold text-white text-sm hover:text-accent transition truncate max-w-[120px] block">
                      {dev.login}
                    </a>
                    <p className="text-[11px] text-gray-400 capitalize">{dev.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={dev.html_url} target="_blank" rel="noreferrer" className="p-2 bg-[#212121] border border-gray-700/60 text-gray-300 hover:text-accent rounded-lg transition" title="Open Profile">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => removeFavUser(dev.id)}
                    className="p-2 bg-[#212121] border border-gray-700/60 text-gray-500 hover:text-red-400 rounded-lg transition"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Analytics Overview */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Code className="w-4 h-4 text-accent" />
          Quick Analytics Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#161616] border border-gray-800/60 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Saved Bookmarks</p>
            <p className="text-2xl font-bold text-white">{favRepos.length + favUsers.length}</p>
          </div>
          <div className="bg-[#161616] border border-gray-800/60 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Saved Comparisons</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
          <div className="bg-[#161616] border border-gray-800/60 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">API Status</p>
            <p className="text-2xl font-bold text-[#00ff0f]">Operational</p>
          </div>
        </div>
      </div>

    </div>
  );
}