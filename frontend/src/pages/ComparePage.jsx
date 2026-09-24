import React, { useState } from 'react';
import { GitCompare, Search, ArrowRight, Star, GitFork, Code, Shield, CheckCircle2 } from 'lucide-react';

export default function ComparePage() {
  const [targetA, setTargetA] = useState('');
  const [targetB, setTargetB] = useState('');
  const [comparedData, setComparedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = (e) => {
    e.preventDefault();
    if (!targetA.trim() || !targetB.trim()) return;

    setLoading(true);

    // Simulate fetching or comparing repository/user data
    setTimeout(() => {
      setComparedData({
        itemA: {
          name: targetA.trim(),
          stars: Math.floor(Math.random() * 10000) + 500,
          forks: Math.floor(Math.random() * 2000) + 100,
          issues: Math.floor(Math.random() * 150) + 5,
          language: 'TypeScript / React',
          score: Math.floor(Math.random() * 20) + 80,
        },
        itemB: {
          name: targetB.trim(),
          stars: Math.floor(Math.random() * 10000) + 500,
          forks: Math.floor(Math.random() * 2000) + 100,
          issues: Math.floor(Math.random() * 150) + 5,
          language: 'Python / FastAPI',
          score: Math.floor(Math.random() * 20) + 80,
        }
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#212121] border border-gray-800 text-xs font-medium text-gray-300 mb-4">
          <GitCompare className="w-3.5 h-3.5 text-accent" />
          Repository & Developer Intelligence Benchmark
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Compare Code <span className="text-accent">Ecosystems</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base">
          Analyze two GitHub repositories or user profiles side-by-side to evaluate performance, engagement, and code metrics instantly.
        </p>
      </div>

      {/* Input Form Box */}
      <form onSubmit={handleCompare} className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">First Target (Repo or User)</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={targetA}
                onChange={(e) => setTargetA(e.target.value)}
                placeholder="e.g. facebook/react"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#009ca6] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2">Second Target (Repo or User)</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={targetB}
                onChange={(e) => setTargetB(e.target.value)}
                placeholder="e.g. vuejs/core"
                className="w-full bg-[#161616] border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#009ca6] transition"
              />
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-lg text-sm disabled:opacity-50"
        >
          <span>{loading ? 'Analyzing Metrics...' : 'Compare Side-by-Side'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Comparison Results Section */}
      {comparedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto animate-fadeIn">
          
          {/* Target A Card */}
          <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white truncate">{comparedData.itemA.name}</h2>
              <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                Score: {comparedData.itemA.score}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-[#161616] p-3 rounded-xl border border-gray-800/60">
                <span className="text-gray-400 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Stargazers</span>
                <span className="font-bold text-white">{comparedData.itemA.stars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-[#161616] p-3 rounded-xl border border-gray-800/60">
                <span className="text-gray-400 flex items-center gap-2"><GitFork className="w-4 h-4 text-[#00f0ff]" /> Forks</span>
                <span className="font-bold text-white">{comparedData.itemA.forks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-[#161616] p-3 rounded-xl border border-gray-800/60">
                <span className="text-gray-400 flex items-center gap-2"><Code className="w-4 h-4 text-accent" /> Primary Stack</span>
                <span className="font-bold text-white">{comparedData.itemA.language}</span>
              </div>
            </div>
          </div>

          {/* Target B Card */}
          <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <h2 className="text-lg font-bold text-white truncate">{comparedData.itemB.name}</h2>
              <span className="px-3 py-1 rounded-full bg-[#009ca6]/10 border border-[#009ca6]/20 text-[#00f0ff] text-xs font-semibold">
                Score: {comparedData.itemB.score}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center bg-[#161616] p-3 rounded-xl border border-gray-800/60">
                <span className="text-gray-400 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Stargazers</span>
                <span className="font-bold text-white">{comparedData.itemB.stars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-[#161616] p-3 rounded-xl border border-gray-800/60">
                <span className="text-gray-400 flex items-center gap-2"><GitFork className="w-4 h-4 text-[#00f0ff]" /> Forks</span>
                <span className="font-bold text-white">{comparedData.itemB.forks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center bg-[#161616] p-3 rounded-xl border border-gray-800/60">
                <span className="text-gray-400 flex items-center gap-2"><Code className="w-4 h-4 text-accent" /> Primary Stack</span>
                <span className="font-bold text-white">{comparedData.itemB.language}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}