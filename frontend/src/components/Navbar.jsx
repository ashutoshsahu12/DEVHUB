import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GitBranch, LayoutDashboard, GitCompare, Search, User, Users, Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('devhub_token');
  const user = JSON.parse(localStorage.getItem('devhub_user'));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Clear user session storage and tokens
    localStorage.removeItem('devhub_token');
    localStorage.removeItem('devhub_user');
    localStorage.removeItem('devhub_fav_repos');
    localStorage.removeItem('devhub_fav_users');

    // Force clean redirect to prevent black screen unmounting issues
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#161616]/90 backdrop-blur-md border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo - Points strictly to Home ('/') */}
        <Link 
          to="/" 
          className="flex items-center gap-2.5 text-xl font-bold text-white tracking-wider group"
        >
          <div className="p-1.5 bg-[#212121] border border-gray-800 rounded-lg group-hover:border-accent transition">
            <GitBranch className="w-5 h-5 text-accent" />
          </div>
          <span>Dev<span className="text-accent">Hub</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-2 text-sm font-medium transition ${
              isActive('/dashboard') ? 'text-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/compare" 
            className={`flex items-center gap-2 text-sm font-medium transition ${
              isActive('/compare') ? 'text-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>Compare Repos</span>
          </Link>

          <Link 
            to="/compare-developers" 
            className={`flex items-center gap-2 text-sm font-medium transition ${
              isActive('/compare-developers') ? 'text-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Compare Devs</span>
          </Link>

          {/* Search Link - Points to /search */}
          <Link 
            to="/search" 
            className={`flex items-center gap-2 text-sm font-medium transition ${
              isActive('/search') ? 'text-accent' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>
        </div>

        {/* Right Side: Auth / Profile Dropdown & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {token ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-[#009ca6]/20 border border-gray-700 flex items-center justify-center text-accent font-bold hover:border-accent transition shadow-md"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#1c1c1c] border border-gray-800 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-800/80">
                    <p className="text-xs font-bold text-white truncate">{user?.name || 'Developer'}</p>
                    <p className="text-[11px] text-gray-400 truncate">@{user?.username || 'username'}</p>
                  </div>

                  <div className="py-1">
                    {/* Changed to /profile to point to your separate ProfilePage.jsx */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:bg-[#262626] hover:text-white transition"
                    >
                      <User className="w-4 h-4 text-accent" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs md:text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-xl transition"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="text-xs md:text-sm font-medium bg-[#1c1c1c] border border-[#009ca6] text-white px-4 py-2 rounded-xl hover:bg-[#00f0ff] hover:border-[#00f0ff] hover:text-black transition duration-200 shadow-md"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-[#212121] border border-gray-800 text-gray-300 hover:text-white transition"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1c1c1c] border-b border-gray-800 px-6 py-5 space-y-3 animate-fadeIn">
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-accent p-2.5 rounded-xl hover:bg-[#262626] transition"
          >
            <LayoutDashboard className="w-4 h-4 text-accent" />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/compare" 
            className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-accent p-2.5 rounded-xl hover:bg-[#262626] transition"
          >
            <GitCompare className="w-4 h-4 text-accent" />
            <span>Compare Repos</span>
          </Link>

          <Link 
            to="/compare-developers" 
            className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-accent p-2.5 rounded-xl hover:bg-[#262626] transition"
          >
            <Users className="w-4 h-4 text-accent" />
            <span>Compare Devs</span>
          </Link>

          <Link 
            to="/search" 
            className="flex items-center gap-3 text-sm font-medium text-gray-300 hover:text-accent p-2.5 rounded-xl hover:bg-[#262626] transition"
          >
            <Search className="w-4 h-4 text-accent" />
            <span>Search</span>
          </Link>

          {!token && (
            <div className="pt-3 border-t border-gray-800 flex gap-2">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl bg-[#262626] text-xs font-medium text-white">Log In</Link>
              <Link to="/register" className="flex-1 text-center py-2.5 rounded-xl bg-accent text-xs font-medium text-black">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}