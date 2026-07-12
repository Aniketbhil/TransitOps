import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { vehicleApi } from '../../services/vehicleApi';
import { ArrowLeft } from 'lucide-react';

export default function VehicleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    registration_number: '',
    name: '',
    vehicle_type: '',
    max_load_capacity: '',
    odometer: '',
    acquisition_cost: '',
    status: 'AVAILABLE' // Default for creation
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const loadVehicle = async () => {
        try {
          const data = await vehicleApi.getById(id);
          setFormData({
            ...data,
            max_load_capacity: data.max_load_capacity.toString(),
            odometer: data.odometer.toString(),
            acquisition_cost: data.acquisition_cost.toString(),
          });
        } catch (err) {
          setError("Failed to load vehicle details.");
        }
      };
      loadVehicle();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Convert strings back to numbers for backend schema
    const payload = {
      ...formData,
      max_load_capacity: Number(formData.max_load_capacity),
      odometer: Number(formData.odometer),
      acquisition_cost: Number(formData.acquisition_cost),
    };

    try {
      if (isEditMode) {
        await vehicleApi.update(id, payload);
      } else {
        // Create doesn't need status initially in the UI flow typically, but we send it
        await vehicleApi.create(payload);
      }
      navigate('/dashboard/fleet');
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'Failed to save vehicle. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      <div className="flex items-center gap-4">
        <Link to="/dashboard/fleet" className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
            {isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            {isEditMode ? 'Update asset information and current status.' : 'Register a new vehicle into the fleet database.'}
          </p>
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
            
            {/* Input fields mapping to VehicleCreate schema */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">REGISTRATION NUMBER (UNIQUE)</label>
              <input type="text" name="registration_number" required value={formData.registration_number} onChange={handleChange} placeholder="e.g., GJ01AB4521"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">NAME/MODEL</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g., VAN-05"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">VEHICLE TYPE</label>
              <select name="vehicle_type" required value={formData.vehicle_type} onChange={handleChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]">
                <option value="" disabled>Select Type</option>
                <option value="Van">Van</option>
                <option value="Truck">Truck</option>
                <option value="Mini">Mini</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">MAX LOAD CAPACITY (KG)</label>
              <input type="number" name="max_load_capacity" required min="1" value={formData.max_load_capacity} onChange={handleChange} placeholder="500"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">CURRENT ODOMETER (KM)</label>
              <input type="number" name="odometer" required min="0" value={formData.odometer} onChange={handleChange} placeholder="10000"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">ACQUISITION COST (INR)</label>
              <input type="number" name="acquisition_cost" required min="0" value={formData.acquisition_cost} onChange={handleChange} placeholder="620000"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            {/* Status is usually only updated manually during edit, or set implicitly by trips/maintenance. But we expose it for manual override per typical admin CRUD */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">OPERATIONAL STATUS</label>
                <select name="status" required value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]">
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="IN_SHOP">In Shop</option>
                  <option value="RETIRED">Retired</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB] dark:border-[#334155] mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/fleet')}
              className="mr-3 px-6 py-2.5 rounded-[12px] text-sm font-semibold border border-[#D1D5DB] dark:border-[#334155] text-[#374151] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#273549] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-[12px] text-sm font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors cursor-pointer"
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update Vehicle' : 'Save Vehicle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}