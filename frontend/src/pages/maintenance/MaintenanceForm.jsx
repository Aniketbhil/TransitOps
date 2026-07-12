import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { maintenanceApi } from '../../services/maintenanceApi';
import { vehicleApi } from '../../services/vehicleApi';
import { ArrowLeft } from 'lucide-react';

export default function MaintenanceForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicle_id: '',
    service_type: '',
    cost: '',
    service_date: new Date().toISOString().split('T')[0] // Default to today
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        // Fetch all vehicles because a vehicle might be AVAILABLE or currently ON_TRIP needing emergency repair
        const data = await vehicleApi.getAll();
        // Filter out retired vehicles, as they don't need maintenance
        setVehicles(data.filter(v => v.status !== 'RETIRED'));
      } catch (err) {
        setError("Failed to load vehicles.");
      }
    };
    loadVehicles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      ...formData,
      cost: Number(formData.cost),
    };

    try {
      await maintenanceApi.create(payload);
      navigate('/dashboard/maintenance');
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'The Vehicle is already IN SHOP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/maintenance" className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Log Service Record</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Record repairs, oil changes, and part replacements.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] p-6">
        {error && (
          <div className="mb-6 p-4 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">VEHICLE</label>
              <select name="vehicle_id" required value={formData.vehicle_id} onChange={handleChange} className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
                <option value="" disabled>Select a vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.registration_number}) - Status: {v.status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">SERVICE TYPE</label>
              <input type="text" name="service_type" required value={formData.service_type} onChange={handleChange} placeholder="e.g., Oil Change, Engine Repair" className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">SERVICE DATE</label>
              <input type="date" name="service_date" required value={formData.service_date} onChange={handleChange} className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">COST (INR)</label>
              <input type="number" name="cost" required min="1" value={formData.cost} onChange={handleChange} placeholder="e.g., 2500" className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

          </div>

          <div className="p-4 mt-2 bg-[#FEF3C7] dark:bg-[#78350F] text-[#D97706] dark:text-[#FCD34D] text-sm rounded-[12px] flex items-start">
            Note: <span className='ml-1'>Logging this service will automatically set the vehicle's status to In Shop and remove it from the available dispatch pool.</span>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB] dark:border-[#334155] mt-6">
            <button type="button" onClick={() => navigate('/dashboard/maintenance')} className="mr-3 px-6 py-2.5 rounded-[12px] text-sm font-semibold border border-[#D1D5DB] dark:border-[#334155] text-[#374151] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#273549] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-[12px] text-sm font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors cursor-pointer">
              {isLoading ? 'Saving...' : 'Save Service Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}