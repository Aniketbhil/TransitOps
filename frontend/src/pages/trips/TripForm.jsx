import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { tripApi } from '../../services/tripApi';
import { vehicleApi } from '../../services/vehicleApi';
import { driverApi } from '../../services/driverApi';
import { ArrowLeft } from 'lucide-react';

export default function TripForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle_id: '',
    driver_id: '',
    cargo_weight: '',
    planned_distance: ''
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailableAssets = async () => {
      try {
        const [vData, dData] = await Promise.all([
          vehicleApi.getAvailable(),
          driverApi.getAvailable()
        ]);
        setVehicles(vData);
        setDrivers(dData);
      } catch (err) {
        setError("Failed to load available vehicles and drivers.");
      }
    };
    fetchAvailableAssets();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Business Logic: Check Capacity
    const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id);
    if (selectedVehicle && Number(formData.cargo_weight) > selectedVehicle.max_load_capacity) {
      setError(`Capacity exceeded! Cargo (${formData.cargo_weight} kg) is heavier than vehicle max capacity (${selectedVehicle.max_load_capacity} kg).`);
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      cargo_weight: Number(formData.cargo_weight),
      planned_distance: Number(formData.planned_distance),
    };

    try {
      await tripApi.create(payload);
      navigate('/dashboard/trips');
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'Failed to create trip. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/trips" className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Create Trip</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Draft a new journey and assign assets.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] p-6">
        {error && (
          <div className="mb-6 p-4 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#DC2626] dark:text-[#FCA5A5] rounded-md text-sm border border-[#F87171] dark:border-[#991B1B]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">SOURCE</label>
              <input type="text" name="source" required value={formData.source} onChange={handleChange} placeholder="e.g., Gandhinagar Depot" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">DESTINATION</label>
              <input type="text" name="destination" required value={formData.destination} onChange={handleChange} placeholder="e.g., Ahmedabad Hub" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">VEHICLE (AVAILABLE ONLY)</label>
              <select name="vehicle_id" required value={formData.vehicle_id} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
                <option value="" disabled>Select Vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (Capacity: {v.max_load_capacity} kg)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">DRIVER (AVAILABLE ONLY)</label>
              <select name="driver_id" required value={formData.driver_id} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
                <option value="" disabled>Select Driver</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} (Score: {d.safety_score}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">CARGO WEIGHT (KG)</label>
              <input type="number" name="cargo_weight" required min="1" value={formData.cargo_weight} onChange={handleChange} placeholder="e.g., 450" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">PLANNED DISTANCE (KM)</label>
              <input type="number" name="planned_distance" required min="1" value={formData.planned_distance} onChange={handleChange} placeholder="e.g., 45" className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB] dark:border-[#334155] mt-6">
            <button type="button" onClick={() => navigate('/dashboard/trips')} className="mr-3 px-6 py-2.5 rounded-xl text-sm font-semibold border border-[#D1D5DB] dark:border-[#334155] text-[#374151] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#273549] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors cursor-pointer">
              {isLoading ? 'Creating...' : 'Draft Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}