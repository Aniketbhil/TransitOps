import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
        isDark ? 'bg-[#22C55E]' : 'bg-[#E5E7EB]'
      }`}
      aria-label="Toggle Dark Mode"
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 flex items-center justify-center shadow-sm ${
          isDark ? 'translate-x-8' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon size={12} className="text-[#14532D]" />
        ) : (
          <Sun size={12} className="text-[#F59E0B]" />
        )}
      </span>
    </button>
  );
}