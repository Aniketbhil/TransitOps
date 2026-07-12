import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'DISPATCHER' // Default role
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'Failed to register. Please try again.');
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
          <h2 className="text-4xl font-bold text-white mb-4">Join the Fleet</h2>
          <p className="text-[#14532D] text-lg max-w-md">
            Create an account to manage vehicles, drivers, and operations.
          </p>
        </div>
      </div>

      {/* Right Side: Register Card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md bg-white dark:bg-[#111827] rounded-[18px] shadow-[0_10px_25px_rgba(0,0,0,0.12)] dark:shadow-[0_6px_18px_rgba(0,0,0,0.35)] p-8 border border-transparent dark:border-[#1F2937]">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-8">Enter your details to register</p>

          {error && (
            <div className="mb-4 p-3 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">FULL NAME</label>
              <input
                type="text"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">EMAIL</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
                placeholder="name@transitops.in"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">PASSWORD</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">ROLE (RBAC)</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              >
                {/* <option value="ADMIN">Admin</option> */}
                <option value="FLEET_MANAGER">Fleet Manager</option>
                <option value="DISPATCHER">Dispatcher</option>
                <option value="SAFETY_OFFICER">Safety Officer</option>
                <option value="FINANCIAL_ANALYST">Financial Analyst</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-semibold py-3 rounded-xl transition-colors mt-4 cursor-pointer"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Already have an account? <Link to="/login" className="text-[#22C55E] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}