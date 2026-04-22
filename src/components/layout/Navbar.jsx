import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChefHat, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useSearchStore } from '../../stores/searchStore';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { openSearch } = useSearchStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openSearch]);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-red-500 shrink-0">
          <ChefHat className="w-6 h-6" /> ResepPedia
        </Link>

        {/* Nav Links — desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/explore" className="hover:text-red-500 transition">Jelajahi</Link>
          <Link to="/categories" className="hover:text-red-500 transition">Kategori</Link>
          <Link to="/regions" className="hover:text-red-500 transition">Daerah</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button onClick={openSearch} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Search className="w-5 h-5" />
            <span className="hidden md:flex items-center gap-1 text-xs border border-gray-200 rounded px-1.5 py-0.5">
              <span>⌘K</span>
            </span>
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm overflow-hidden">
                  {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : user?.name?.[0]?.toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.role}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm">Daftar</Button></Link>
            </div>
          )}

          {/* Hamburger */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <Link to="/explore" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Jelajahi</Link>
          <Link to="/categories" className="block py-2 text-sm text-gray-700" onClick={() => setMenuOpen(false)}>Kategori</Link>
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Login</Button></Link>
              <Link to="/register" className="flex-1"><Button size="sm" className="w-full">Daftar</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
