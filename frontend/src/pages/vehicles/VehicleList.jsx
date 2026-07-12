import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleApi } from '../../services/vehicleApi';
import { Plus, Edit2, Trash2, Loader2, Search } from 'lucide-react';

const StatusChip = ({ status }) => {
  const styles = {
    AVAILABLE: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]",
    ON_TRIP: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
    IN_SHOP: "bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F] dark:text-[#FCD34D]",
    RETIRED: "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#D1D5DB]",
  };
  const labels = { AVAILABLE: "Available", ON_TRIP: "On Trip", IN_SHOP: "In Shop", RETIRED: "Retired" };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.RETIRED}`}>
      {labels[status] || status}
    </span>
  );
};

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      // Clean params: only send if they have a value
      const params = {};
      if (search) params.search = search;
      if (status) params.status = status;
      if (vehicleType) params.vehicle_type = vehicleType;

      const data = await vehicleApi.getAll(params);
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVehicles();
    }, 300); // 300ms debounce for typing
    return () => clearTimeout(delayDebounceFn);
  }, [search, status, vehicleType]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleApi.delete(id);
        fetchVehicles();
      } catch (error) {
        alert("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Fleet Management</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Manage your transport assets and statuses</p>
        </div>
        <Link to="/dashboard/fleet/new" className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm">
          <Plus size={16} /> Add Vehicle
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
        <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="px-4 py-2 text-sm rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
          <option value="">Type: All</option>
          <option value="Van">Van</option>
          <option value="Truck">Truck</option>
          <option value="Mini">Mini</option>
        </select>
        
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2 text-sm rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
          <option value="">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>

        <div className="relative flex-1 min-w-50">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-[#9CA3AF]" />
          </span>
          <input 
            type="text" 
            placeholder="Search reg no. or name..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Reg. No. (Unique)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Name/Model</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Capacity</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Odometer</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} /> Loading vehicles...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">No vehicles found.</td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                    <td className="px-6 py-4 font-medium">{v.registration_number}</td>
                    <td className="px-6 py-4">{v.name}</td>
                    <td className="px-6 py-4">{v.vehicle_type}</td>
                    <td className="px-6 py-4">{v.max_load_capacity} kg</td>
                    <td className="px-6 py-4">{v.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4"><StatusChip status={v.status} /></td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to={`/dashboard/fleet/${v.id}`} className="inline-flex items-center justify-center p-2 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D] rounded-full transition-colors"><Edit2 size={16} /></Link>
                      <button onClick={() => handleDelete(v.id)} className="inline-flex items-center justify-center p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] rounded-full transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}