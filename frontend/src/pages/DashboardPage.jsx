import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GitCompare, Search, User, Mail, Star, Code, Terminal, ArrowUpRight, Trash2, ExternalLink } from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Your deployed Render backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://devhub-backend-lpen.onrender.com';

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('devhub_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load saved user info
    const savedUser = JSON.parse(localStorage.getItem('user') || localStorage.getItem('devhub_user'));
    if (savedUser) setUser(savedUser);

    // Fetch bookmarks from MongoDB backend
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bookmarks`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) {
          setBookmarks(data);
        }
      } catch (err) {
        console.error('Failed to fetch bookmarks from database:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [navigate, API_URL]);

  // Remove bookmark from MongoDB and update UI state
  const removeBookmark = async (itemId) => {
    const token = localStorage.getItem('token') || localStorage.getItem('devhub_token');
    try {
      const response = await fetch(`${API_URL}/api/bookmarks/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setBookmarks(prev => prev.filter(b => b.itemId !== String(itemId)));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove bookmark.');
      }
    } catch (err) {
      console.error('Error deleting bookmark:', err);
    }
  };

  // Separate bookmarks into developers/users and repositories based on schema type
  const favUsers = bookmarks.filter(b => b.type === 'user' || b.type === 'developer');
  const favRepos = bookmarks.filter(b => b.type === 'repo' || b.type === 'repository');

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
            Here is your developer activity overview and saved bookmarks synced with MongoDB.
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
                <span>DevHub v1.0.0 (Cloud Connected)</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-500">
            <span>Status: Online</span>
            <span className="text-[#00ff0f]">Database Live</span>
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

        {loading ? (
          <div className="text-center py-6 text-gray-500 text-xs">Loading bookmarks from database...</div>
        ) : favRepos.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs italic">
            No saved repositories yet. Search for a repository and bookmark it to save it here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favRepos.map((repo) => (
              <div key={repo.itemId} className="bg-[#161616] border border-gray-800/60 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-white text-sm truncate">{repo.title}</span>
                    <button 
                      onClick={() => removeBookmark(repo.itemId)}
                      className="text-gray-500 hover:text-red-400 transition p-1"
                      title="Remove Bookmark"
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
                  <a href={repo.url} target="_blank" rel="noreferrer" className="text-accent hover:underline font-medium flex items-center gap-1">
                    View Link <ExternalLink className="w-3 h-3" />
                  </a>
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

        {loading ? (
          <div className="text-center py-6 text-gray-500 text-xs">Loading bookmarks from database...</div>
        ) : favUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-xs italic">
            No saved developers yet. Search for a developer and click the star icon to save them here!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favUsers.map((dev) => (
              <div key={dev.itemId} className="bg-[#161616] border border-gray-800/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl border border-gray-700 bg-gray-800 flex items-center justify-center text-white font-bold">
                    {dev.title ? dev.title.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <a href={dev.url} target="_blank" rel="noreferrer" className="font-bold text-white text-sm hover:text-accent transition truncate max-w-[120px] block">
                      {dev.title}
                    </a>
                    <p className="text-[11px] text-gray-400 capitalize">{dev.description || 'Developer'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={dev.url} target="_blank" rel="noreferrer" className="p-2 bg-[#212121] border border-gray-700/60 text-gray-300 hover:text-accent rounded-lg transition" title="Open Profile">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button 
                    onClick={() => removeBookmark(dev.itemId)}
                    className="p-2 bg-[#212121] border border-gray-700/60 text-gray-500 hover:text-red-400 rounded-lg transition"
                    title="Remove Bookmark"
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
            <p className="text-xs text-gray-400 mb-1">Total Saved Bookmarks</p>
            <p className="text-2xl font-bold text-white">{bookmarks.length}</p>
          </div>
          <div className="bg-[#161616] border border-gray-800/60 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Database Sync</p>
            <p className="text-2xl font-bold text-[#00ff0f]">Active</p>
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