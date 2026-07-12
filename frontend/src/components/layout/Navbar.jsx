import { useAuth } from '../../context/AuthContext';
import { Search, LogOut, User } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between px-6 transition-colors duration-300">
      
      {/* Search Bar */}
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-[#9CA3AF]" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-[#F3F4F6] dark:bg-[#1E293B] border border-transparent focus:bg-white dark:focus:bg-[#111827] focus:border-[#22C55E] dark:focus:border-[#22C55E] rounded-lg text-sm text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-6">
        <ThemeToggle />
        
        {/* User Profile & Sign Out */}
        <div className="flex items-center space-x-4 border-l border-[#E5E7EB] dark:border-[#1F2937] pl-6">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-[#111827] dark:text-white">
              {user?.full_name || 'User'}
            </span>
            <span className="text-xs font-semibold text-[#22C55E]">
              {user?.role?.replace('_', ' ') || 'ROLE'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-[#DCFCE7] dark:bg-[#14532D] flex items-center justify-center text-[#15803D] dark:text-[#86EFAC]">
            <User size={18} />
          </div>
          
          <button 
            onClick={logout}
            className="p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] rounded-full transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}