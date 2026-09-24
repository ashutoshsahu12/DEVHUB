import React, { useState, useEffect } from 'react';
import { Search, GitBranch, Star, GitFork, User, ExternalLink, ArrowRight, Code, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWithCache, getRateLimitStatus } from '../utils/githubApi';

export default function SearchPage() {
  const [searchType, setSearchType] = useState('repositories');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  
  // State to track bookmarked item IDs fetched from MongoDB
  const [bookmarkedItemIds, setBookmarkedItemIds] = useState(new Set());

  const navigate = useNavigate();
  const rateStatus = getRateLimitStatus();
  
  // Your deployed Render backend URL
  const API_URL = import.meta.env.VITE_API_URL || 'https://devhub-backend-lpen.onrender.com';

  // Fetch user's saved bookmarks from MongoDB on component load
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('devhub_token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/bookmarks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          // Store bookmarked itemIds in a Set for instant lookup
          const ids = new Set(data.map(b => String(b.itemId)));
          setBookmarkedItemIds(ids);
        }
      } catch (err) {
        console.error('Failed to load user bookmarks:', err);
      }
    };

    fetchUserBookmarks();
  }, [API_URL]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const endpoint = searchType === 'repositories'
        ? `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=6`
        : `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=6`;

      const result = await fetchWithCache(endpoint);
      setResults(result.data.items || []);
    } catch (err) {
      setError(err.message || 'Something went wrong while searching.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving/removing bookmarks via MongoDB backend
  const handleToggleBookmark = async (user, e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || localStorage.getItem('devhub_token');
    
    // Redirect to login if user is not authenticated
    if (!token) {
      navigate('/login');
      return;
    }

    const itemIdStr = String(user.id);
    const isFav = bookmarkedItemIds.has(itemIdStr);

    try {
      if (isFav) {
        // DELETE bookmark from backend
        const res = await fetch(`${API_URL}/api/bookmarks/${itemIdStr}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          setBookmarkedItemIds(prev => {
            const next = new Set(prev);
            next.delete(itemIdStr);
            return next;
          });
        }
      } else {
        // POST new bookmark to backend matching your schema
        const res = await fetch(`${API_URL}/api/bookmarks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: 'user',
            itemId: itemIdStr,
            title: user.login,
            owner: user.login,
            description: user.type || 'Developer',
            url: user.html_url
          })
        });

        if (res.ok) {
          setBookmarkedItemIds(prev => {
            const next = new Set(prev);
            next.add(itemIdStr);
            return next;
          });
        } else {
          const data = await res.json();
          alert(data.error || 'Failed to save bookmark.');
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      
      {/* Hero Badge & Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#212121] border border-gray-800 text-xs font-medium text-gray-300 mb-4">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span>API Quota: <strong className="text-white">{rateStatus.remaining}/60</strong> remaining</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Explore GitHub <span className="text-accent">{searchType === 'repositories' ? 'Repositories' : 'Developers'}</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Search live open-source codebases or creator profiles with instant local caching.
        </p>
      </div>

      {/* Search Bar & Toggle Box */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-xl mb-12">
        
        <div className="flex rounded-xl bg-[#161616] border border-gray-800/80 p-1 mb-6">
          <button
            type="button"
            onClick={() => { setSearchType('repositories'); setResults([]); setSearched(false); }}
            className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-medium transition ${
              searchType === 'repositories' ? 'bg-[#262626] text-white border border-gray-700/60 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Repositories
          </button>
          <button
            type="button"
            onClick={() => { setSearchType('users'); setResults([]); setSearched(false); }}
            className={`flex-1 py-2.5 rounded-lg text-xs md:text-sm font-medium transition ${
              searchType === 'users' ? 'bg-[#262626] text-white border border-gray-700/60 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Users / Developers
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === 'repositories' ? 'e.g. react, fastapi, tailwindcss' : 'e.g. torvalds, gaearon'}
              className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#009ca6] transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium px-6 py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-lg text-sm disabled:opacity-50 shrink-0"
          >
            <span>{loading ? 'Searching...' : 'Search GitHub'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-sm">No results found for "{query}". Try another query.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {searchType === 'repositories' ? (
            results.map((repo) => (
              <div key={repo.id} className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-gray-700 transition">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base font-bold text-white truncate">
                      <Link to={`/repository/${repo.owner.login}/${repo.name}`} className="hover:text-accent transition flex items-center gap-1.5">
                        {repo.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800/60">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-400" /> {repo.stargazers_count.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-[#00ff0f]" /> {repo.forks_count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {repo.language && <span className="text-xs text-accent font-medium">{repo.language}</span>}
                      <Link
                        to={`/repository/${repo.owner.login}/${repo.name}`}
                        className="p-2.5 bg-[#262626] border border-gray-700/60 text-gray-300 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black rounded-xl transition"
                        title="View Repository Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-[#262626] border border-gray-700/60 text-gray-300 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black rounded-xl transition"
                        title="Open on GitHub in New Tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            results.map((user) => {
              const isFav = bookmarkedItemIds.has(String(user.id));

              return (
                <div key={user.id} className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl flex items-center justify-between hover:border-gray-700 transition">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-xl border border-gray-700 object-cover" />
                    <div>
                      <h3 className="text-base font-bold text-white">
                        <a href={user.html_url} target="_blank" rel="noreferrer" className="hover:text-accent transition flex items-center gap-1.5">
                          {user.login}
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                        </a>
                      </h3>
                      <p className="text-xs text-gray-400 capitalize">{user.type || 'Developer'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleToggleBookmark(user, e)}
                      className={`p-2.5 rounded-xl border transition duration-200 ${
                        isFav 
                          ? 'bg-[#1c1c1c] border-[#009ca6] text-[#00f0ff]' 
                          : 'bg-[#1c1c1c] border-[#009ca6] text-gray-400 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black'
                      }`}
                      title={isFav ? "Remove Bookmark" : "Save Favorite Developer"}
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-[#00f0ff]' : ''}`} />
                    </button>
                    <a
                      href={user.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 bg-[#262626] border border-gray-700/60 text-gray-300 hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black rounded-xl transition"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}