import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleApi } from '../../services/vehicleApi';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

// Helper component for perfectly themed status chips
const StatusChip = ({ status }) => {
  const styles = {
    AVAILABLE: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]",
    ON_TRIP: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
    IN_SHOP: "bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F] dark:text-[#FCD34D]",
    RETIRED: "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#D1D5DB]",
  };

  const labels = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    IN_SHOP: "In Shop",
    RETIRED: "Retired",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.RETIRED}`}>
      {labels[status] || status}
    </span>
  );
};

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleApi.delete(id);
        fetchVehicles(); // Refresh list
      } catch (error) {
        alert("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Fleet Management</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Manage your transport assets and statuses</p>
        </div>
        <Link
          to="/dashboard/fleet/new"
          className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-[12px] transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Add Vehicle
        </Link>
      </div>

      {/* Main Table Card */}
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
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading vehicles...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    No vehicles found. Add your first vehicle to get started.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                    <td className="px-6 py-4 font-medium">{v.registration_number}</td>
                    <td className="px-6 py-4">{v.name}</td>
                    <td className="px-6 py-4">{v.vehicle_type}</td>
                    <td className="px-6 py-4">{v.max_load_capacity} kg</td>
                    <td className="px-6 py-4">{v.odometer.toLocaleString()} km</td>
                    <td className="px-6 py-4">
                      <StatusChip status={v.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to={`/dashboard/fleet/${v.id}`} className="inline-flex items-center justify-center p-2 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D] rounded-full transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(v.id)} className="inline-flex items-center justify-center p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] rounded-full transition-colors">
                        <Trash2 size={16} />
                      </button>
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