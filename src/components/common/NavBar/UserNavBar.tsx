import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import store from '../../../redux/store';
import { logout } from '../../../redux/auth/actions';
import { UserCircle, Search, Menu, X } from 'lucide-react';
import { useAppSelector } from '../../../redux/hooks';

export default function UserNavBar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    store.dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-[#071426] to-[#042b36] border-b border-white/10 p-4 shadow-md mt-2">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <h1
            onClick={() => navigate('/dashboard')}
            className="text-3xl h-8 font-grifter cursor-pointer text-cyan-300"
          >
            <span className='text-yellow-400'>U</span>NIPAY
          </h1>

          <nav className="hidden md:flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-2 rounded-md bg-white/5 text-white/90 hover:bg-white/10 transition font-aeonik"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="px-3 py-2 rounded-md bg-white/5 text-white/90 hover:bg-white/10 transition font-aeonik"
            >
              Checkout
            </button>
          </nav>
        </div>

        <div className="flex-1 hidden md:flex items-center justify-center">
          <div className="w-full max-w-2xl flex items-center bg-transparent border border-white/10 rounded-md px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent border-0 focus:border-0 outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 appearance-none shadow-none focus:shadow-none focus-visible:shadow-none text-md font-aeonik text-white placeholder-white/60"
            />
            <Search size={18} className="text-white/70" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 cursor-pointer text-md text-white"
            >
              <UserCircle size={24} className="text-cyan-400" />
              <span className="truncate max-w-[160px] font-aeonik">
                {user?.user_metadata?.name}
              </span>
            </div>

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-44 bg-[#0f1720] text-white border border-white/10 rounded-lg p-2 shadow z-50"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-white/10 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-2 bg-[#0f1720] border border-white/10 rounded-lg p-4 shadow text-md space-y-2 text-white">
          <button
            onClick={() => navigate('/dashboard')}
            className="block w-full text-left py-2 hover:underline"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="block w-full text-left py-2 hover:underline"
          >
            Checkout
          </button>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

