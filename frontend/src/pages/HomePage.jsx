import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Search, GitCompare, Users, ArrowRight, Shield, Zap, Terminal } from 'lucide-react';

export default function HomePage() {
  const token = localStorage.getItem('devhub_token');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto py-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c1c] border border-gray-800 text-xs font-medium text-gray-300 mb-6 shadow-lg">
          <Zap className="w-3.5 h-3.5 text-accent" />
          <span>Next-Gen GitHub Developer Intelligence Suite</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Analyze, Compare & Master <span className="text-accent">GitHub Code</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg mb-8 leading-relaxed">
          DevHub is your ultimate intelligence workspace. Explore public repositories, compare creators side-by-side, analyze language distributions, and save your bookmarks with secure database persistence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/search"
            className="flex items-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium px-6 py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-md text-xs md:text-sm"
          >
            <span>Start Searching</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          {!token && (
            <Link
              to="/register"
              className="flex items-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium px-6 py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-md text-xs md:text-sm"
            >
              <span>Create Account</span>
            </Link>
          )}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <FeatureCard 
          icon={Search} 
          title="Repository & Dev Search" 
          description="Instantly query GitHub's public REST API with built-in caching to bypass rate limits and inspect live repository metrics."
        />
        <FeatureCard 
          icon={GitCompare} 
          title="Side-by-Side Comparison" 
          description="Contrast two repositories or two developers head-to-head to analyze stars, forks, followers, and activity trends."
        />
        <FeatureCard 
          icon={Shield} 
          title="Secure Database Bookmarks" 
          description="Log in with JWT authentication to save and manage your favorite repositories directly in a persistent database."
        />
      </div>

      {/* Quick Launch Banner */}
      <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden my-12">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <GitBranch className="w-64 h-64 text-accent" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <Terminal className="w-8 h-8 text-accent mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to dive into code analytics?</h2>
          <p className="text-gray-400 text-sm mb-6">Launch the search tool now or log in to access your dashboard.</p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 bg-[#1c1c1c] border border-[#009ca6] text-white font-medium px-6 py-3.5 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 text-xs shadow-md"
          >
            <span>Launch DevHub Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-[#1c1c1c] border border-gray-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-gray-700 transition">
    <div>
      <div className="p-3 bg-[#262626] border border-gray-700/60 rounded-xl w-fit mb-4 text-accent">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
    </div>
  </div>
);