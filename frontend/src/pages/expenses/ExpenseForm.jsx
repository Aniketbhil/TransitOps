import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { expenseApi } from '../../services/expenseApi';
import { vehicleApi } from '../../services/vehicleApi';
import { ArrowLeft } from 'lucide-react';

export default function ExpenseForm() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    vehicle_id: '',
    expense_type: 'TOLL',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await vehicleApi.getAll();
        setVehicles(data);
      } catch (err) {
        setError("Failed to load vehicles.");
      }
    };
    fetchVehicles();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      ...formData,
      amount: Number(formData.amount),
    };

    try {
      await expenseApi.createExpense(payload);
      navigate('/dashboard/expenses');
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'Failed to record expense.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/expenses" className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Add Expense</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Log tolls and miscellaneous vehicle costs.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] p-6">
        {error && <div className="mb-6 p-4 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">VEHICLE</label>
            <select name="vehicle_id" required value={formData.vehicle_id} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
              <option value="" disabled>Select Vehicle</option>
              {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">EXPENSE TYPE</label>
            <select name="expense_type" required value={formData.expense_type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
              <option value="TOLL">Toll</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">DATE</label>
              <input type="date" name="date" required value={formData.date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">AMOUNT (INR)</label>
              <input type="number" name="amount" required min="1" value={formData.amount} onChange={handleChange} placeholder="e.g., 120" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-[#E5E7EB] dark:border-[#334155] mt-6">
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors cursor-pointer w-full">
              {isLoading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}