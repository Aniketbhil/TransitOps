import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-[#111827] dark:text-white transition-colors duration-300">
      {/* Left Side: Gradient Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#22C55E] to-[#86EFAC] p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-white mb-8">
            <Truck size={32} />
            <h1 className="text-3xl font-bold tracking-tight">TransitOps</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Smart Transport Operations Platform</h2>
          <p className="text-[#14532D] text-lg max-w-md">
            One login, four roles: <br />
             Fleet Manager <br />
             Dispatcher <br />
             Safety Officer <br />
            Financial Analyst <br />
          </p>
        </div>
      </div>

      {/* Right Side: Login Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.35)] p-8 border border-transparent dark:border-[#1F2937]">
          <h2 className="text-2xl font-bold mb-2">Sign in to your account</h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8">Enter your credentials to continue</p>

          {error && (
            <div className="mb-4 p-3 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">EMAIL</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
                placeholder="name@transitops.in"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">PASSWORD</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-3 rounded-xl transition-colors mt-4 flex justify-center items-center cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Don't have an account? <Link to="/register" className="text-[#22C55E] font-semibold hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}