import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { GitBranch, Star, GitFork, AlertCircle, Code, User, ExternalLink, FileText, Shield, Clock, ArrowLeft, Users } from 'lucide-react';

export default function RepositoryDetailsPage() {
  const { owner, repoName } = useParams();
  const navigate = useNavigate();
  const [repoData, setRepoData] = useState(null);
  const [languages, setLanguages] = useState({});
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchRepoDetails = async () => {
      setLoading(true);
      setError('');
      setRepoData(null);
      setLanguages({});
      setContributors([]);

      try {
        const [repoRes, langRes, contribRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${owner}/${repoName}`),
          fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`),
          fetch(`https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=5`)
        ]);
        
        if (!repoRes.ok) {
          if (repoRes.status === 404) {
            throw new Error(`Repository "${owner}/${repoName}" not found.`);
          }
          throw new Error('Failed to fetch repository data.');
        }

        const repoJson = await repoRes.json();
        const langJson = langRes.ok ? await langRes.json() : {};
        const contribJson = contribRes.ok ? await contribRes.json() : [];

        setRepoData(repoJson);
        setLanguages(langJson);
        setContributors(Array.isArray(contribJson) ? contribJson : []);

        // Check if repo is already favorited
        const favorites = JSON.parse(localStorage.getItem('devhub_fav_repos')) || [];
        const exists = favorites.some(fav => fav.owner === owner && fav.name === repoName);
        setIsFavorited(exists);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (owner && repoName) {
      fetchRepoDetails();
    }
  }, [owner, repoName]);

  const toggleFavorite = () => {
    if (!repoData) return;
    const favorites = JSON.parse(localStorage.getItem('devhub_fav_repos')) || [];
    let updated;
    if (isFavorited) {
      updated = favorites.filter(fav => !(fav.owner === owner && fav.name === repoName));
      setIsFavorited(false);
    } else {
      updated = [...favorites, { owner, name: repoName, description: repoData.description, stargazers_count: repoData.stargazers_count, html_url: repoData.html_url }];
      setIsFavorited(true);
    }
    localStorage.setItem('devhub_fav_repos', JSON.stringify(updated));
  };

  const totalBytes = Object.values(languages).reduce((acc, val) => acc + val, 0);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-400">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        Loading repository intelligence...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-400 gap-4 max-w-lg mx-auto px-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Error</h2>
        <p className="text-sm bg-red-950/50 border border-red-800 p-4 rounded-xl w-full">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-[#1c1c1c] border border-gray-700 text-gray-300 px-5 py-2.5 rounded-xl hover:bg-[#262626] hover:text-white transition mt-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>
    );
  }

  if (!repoData) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full text-sm">
      
      {/* Back Button & Breadcrumbs */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 bg-[#1c1c1c] border border-gray-800 text-gray-300 px-4 py-2 rounded-xl hover:bg-[#262626] hover:text-white transition text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-accent">Search</Link>
          <span>/</span>
          <span className="text-gray-300 font-medium">{owner}</span>
          <span>/</span>
          <span className="text-gray-300 font-medium">{repoName}</span>
        </div>
      </div>

      {/* Repository Header Section */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-3xl p-8 shadow-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <img 
              src={repoData.owner.avatar_url} 
              alt={repoData.owner.login} 
              className="w-20 h-20 rounded-2xl border-4 border-[#262626] shadow-lg mt-1 object-cover"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-accent mb-1">
                <GitBranch className="w-4 h-4" />
                <span>{repoData.private ? 'Private Repository' : 'Public Repository'}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight break-all">
                <a href={repoData.html_url} target="_blank" rel="noreferrer" className="hover:text-accent transition">
                  {repoData.name}
                </a>
              </h1>
              <p className="text-lg text-gray-400 mt-1 mb-3">
                Owned by <span className="text-gray-300 font-medium">{repoData.owner.login}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {repoData.license && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262626] border border-gray-700 text-xs text-gray-300">
                    <Shield className="w-3.5 h-3.5 text-accent" />
                    {repoData.license.spdx_id}
                  </span>
                )}
                {repoData.homepage && (
                  <a href={repoData.homepage} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262626] border border-gray-700 text-xs text-accent hover:text-[#00f0ff] transition">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Homepage
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleFavorite}
              className={`flex flex-col items-center justify-center gap-1 bg-[#161616] border rounded-2xl p-4 w-28 h-28 transition group ${
                isFavorited ? 'border-accent text-accent' : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
              }`}
              title={isFavorited ? 'Remove from Favorites' : 'Save to Favorites'}
            >
              <Star className={`w-7 h-7 transition ${isFavorited ? 'fill-accent text-accent' : 'group-hover:scale-110'}`} />
              <span className="text-sm font-bold text-white">{isFavorited ? 'Saved' : 'Favorite'}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Bookmark</span>
            </button>

            <a 
              href={`${repoData.html_url}/stargazers`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center justify-center gap-1 bg-[#161616] border border-gray-800 hover:border-yellow-500 rounded-2xl p-4 w-28 h-28 transition group"
            >
              <Star className="w-7 h-7 text-yellow-400 group-hover:scale-110 transition" />
              <span className="text-2xl font-bold text-white group-hover:text-yellow-400">{repoData.stargazers_count.toLocaleString()}</span>
              <span className="text-[11px] text-gray-400 uppercase tracking-wider">Stars</span>
            </a>
          </div>
        </div>

        {repoData.description && (
          <div className="mt-8 pt-6 border-t border-gray-800/80">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About</h3>
            <p className="text-gray-300 max-w-4xl text-base leading-relaxed">{repoData.description}</p>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Analytics & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Language Distribution Card */}
          <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Code className="w-5 h-5 text-accent" />
              Language Distribution
            </h3>

            {Object.keys(languages).length === 0 ? (
              <div className="text-gray-500 italic text-center py-4">No language data available.</div>
            ) : (
              <div>
                <div className="h-3 bg-[#161616] rounded-full overflow-hidden border border-gray-800 flex mb-5">
                  {Object.entries(languages).map(([lang, bytes]) => {
                    const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                    return (
                      <div 
                        key={lang} 
                        style={{ width: `${percentage}%` }} 
                        className="h-full bg-accent first:bg-[#00f0ff] last:bg-yellow-400 transition-all"
                        title={`${lang}: ${percentage}%`}
                      />
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3">
                  {Object.entries(languages).map(([lang, bytes]) => {
                    const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                    return (
                      <div key={lang} className="bg-[#161616] px-3 py-2 rounded-xl border border-gray-800/60 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
                        <span className="text-white font-medium">{lang}</span>
                        <span className="text-gray-400 text-xs">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top Contributors Card */}
          <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Top Contributors
            </h3>

            {contributors.length === 0 ? (
              <div className="text-gray-500 italic text-center py-4">No contributor data available.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contributors.map((contrib) => (
                  <a
                    key={contrib.id}
                    href={contrib.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#161616] border border-gray-800/60 hover:border-accent transition group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={contrib.avatar_url} alt={contrib.login} className="w-10 h-10 rounded-xl border border-gray-700 object-cover" />
                      <div>
                        <p className="font-bold text-white group-hover:text-accent transition truncate max-w-[120px]">{contrib.login}</p>
                        <p className="text-xs text-gray-400">{contrib.contributions.toLocaleString()} contributions</p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-accent" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Repository Activity Metrics */}
          <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Repository Activity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-[#161616] border border-gray-800/60 p-5 rounded-xl">
                <div className="text-3xl font-extrabold text-red-400">{repoData.open_issues_count.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Open Issues</div>
              </div>
              <a href={`${repoData.html_url}/pulls`} target="_blank" rel="noreferrer" className="bg-[#161616] border border-gray-800/60 p-5 rounded-xl hover:border-accent transition group">
                <div className="text-3xl font-extrabold text-accent group-hover:text-[#00f0ff]">∞</div>
                <div className="text-xs text-gray-400 group-hover:text-white mt-1">Pull Requests</div>
              </a>
              <div className="bg-[#161616] border border-gray-800/60 p-5 rounded-xl">
                <div className="text-3xl font-extrabold text-white">{repoData.watchers_count.toLocaleString()}</div>
                <div className="text-xs text-gray-400 mt-1">Watchers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Info Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl sticky top-28">
            <h3 className="text-base font-bold text-white mb-5">Quick Info</h3>
            <div className="space-y-4 text-sm">
              <InfoItem icon={User} label="Owner Type" value={repoData.owner.type} />
              <InfoItem icon={GitBranch} label="Default Branch" value={repoData.default_branch} />
              <InfoItem icon={Clock} label="Created" value={new Date(repoData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
              <InfoItem icon={Clock} label="Last Updated" value={new Date(repoData.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} />
              <div className="pt-4 mt-4 border-t border-gray-800">
                 <a 
                  href={repoData.html_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full flex items-center justify-center gap-2 bg-[#161616] border border-gray-700 text-white font-medium py-3 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 text-sm"
                >
                   <span>View on GitHub</span>
                   <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between gap-3 bg-[#161616] p-3 rounded-lg border border-gray-800/60">
        <div className="flex items-center gap-3 text-gray-400">
            <Icon className="w-4 h-4 text-accent" />
            <span>{label}</span>
        </div>
        <span className="font-medium text-white text-xs bg-[#212121] px-2 py-0.5 rounded">{value}</span>
    </div>
);