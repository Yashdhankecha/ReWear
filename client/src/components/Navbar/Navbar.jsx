import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getUserInitials = (name) => {
    if (!name) return 'G';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserImage = () => {
    // For now, we'll use initials as placeholder
    // In the future, you can add actual user image support
    return null;
  };

  return (
    <nav className="bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link to={user?.role === 'owner' ? "/owner/dashboard" : "/dashboard"} className="flex items-center gap-2 group">
            <div className={`w-8 h-8 ${user?.role === 'owner' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'} rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className={`font-bold text-xl tracking-wide ${user?.role === 'owner' ? 'text-yellow-700' : 'text-slate-800 dark:text-white'} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
              ReWear
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {/* Owner navigation: only show owner dashboard */}
          {user?.role === 'owner' ? (
            <Link 
              to="/owner/dashboard" 
              className="text-yellow-700 font-bold transition-all duration-200 relative group"
            >
              Owner Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span>
            </Link>
          ) : (
            <>
              {/* User navigation links (only for non-admins) */}
              {(!isAuthenticated || user?.role !== 'admin') && <>
                <Link to="/dashboard" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 relative group">Home<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span></Link>
                <Link to="/browse" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 relative group">Browse Items<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span></Link>
                <Link to="/community" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 relative group">Community<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span></Link>
                <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-200 relative group">About<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-200"></span></Link>
              </>}
              {/* Admin navigation links (only for admins) */}
              {isAuthenticated && user?.role === 'admin' && <>
                <Link to="/admin/dashboard" className="text-yellow-400 hover:text-yellow-500 font-bold transition-all duration-200 relative group">Admin Dashboard<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span></Link>
                <Link to="/admin/users" className="text-yellow-400 hover:text-yellow-500 font-bold transition-all duration-200 relative group">Manage Users<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span></Link>
                <Link to="/admin/orders" className="text-yellow-400 hover:text-yellow-500 font-bold transition-all duration-200 relative group">Manage Orders<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span></Link>
              </>}
            </>
          )}
        </div>

        {/* Right: Search and Profile Dropdown */}
        <div className="flex items-center gap-4">
          {/* Hide search bar for owner */}
          {user?.role !== 'owner' && (
            <div className="relative hidden sm:block">
              <input type="text" placeholder="Search items..." className="w-64 pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200" />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setDropdownOpen((open) => !open)} className="flex items-center gap-3 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              {/* User Avatar */}
              <div className="relative">
                {getUserImage() ? (
                  <img src={getUserImage()} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                ) : (
                  <div className={`w-8 h-8 rounded-full ${user?.role === 'owner' ? 'bg-gradient-to-br from-yellow-500 to-yellow-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'} flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                    {getUserInitials(isAuthenticated ? user?.name : 'Guest')}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>
              {/* User Info */}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{isAuthenticated ? user?.name : 'Guest'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{isAuthenticated ? (user?.role || 'Member') : 'Visitor'}</p>
              </div>
            </button>
            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fade-in-up">
                {isAuthenticated && (
                  <>
                    {/* Owner dropdown: only show owner dashboard and sign out */}
                    {user?.role === 'owner' ? (
                      <>
                        <Link to="/owner/dashboard" className="block px-5 py-3 text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/40 transition-all font-bold">Owner Dashboard</Link>
                        <button onClick={logout} className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 transition-all">Sign Out</button>
                      </>
                    ) : (
                      <>
                        {/* User dropdown links (only for non-admins) */}
                        {user?.role !== 'admin' && <>
                          <Link to="/profile" className="block px-5 py-3 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">Profile</Link>
                          <Link to="/list" className="block px-5 py-3 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">List an Item</Link>
                          <Link to="/notifications" className="block px-5 py-3 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">Notifications</Link>
                          <Link to="/redemption" className="block px-5 py-3 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">🪙 Coins</Link>
                        </>}
                        {/* Admin dropdown links (only for admins) */}
                        {user?.role === 'admin' && <>
                          <Link to="/admin/dashboard" className="block px-5 py-3 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/40 transition-all font-bold">Admin Dashboard</Link>
                          <Link to="/admin/users" className="block px-5 py-3 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/40 transition-all font-bold">Manage Users</Link>
                          <Link to="/admin/orders" className="block px-5 py-3 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/40 transition-all font-bold">Manage Orders</Link>
                        </>}
                        <button onClick={logout} className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 transition-all">Sign Out</button>
                      </>
                    )}
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to="/profile" className="block px-5 py-3 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all">Profile</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
