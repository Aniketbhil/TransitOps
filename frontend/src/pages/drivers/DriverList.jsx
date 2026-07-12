import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { driverApi } from '../../services/driverApi';
import { Plus, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';

const DriverStatusChip = ({ status }) => {
  const styles = {
    AVAILABLE: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]",
    ON_TRIP: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
    OFF_DUTY: "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#D1D5DB]",
    SUSPENDED: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]",
  };

  const labels = {
    AVAILABLE: "Available",
    ON_TRIP: "On Trip",
    OFF_DUTY: "Off Duty",
    SUSPENDED: "Suspended",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.OFF_DUTY}`}>
      {labels[status] || status}
    </span>
  );
};

export default function DriverList() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      const data = await driverApi.getAll();
      setDrivers(data);
    } catch (error) {
      console.error("Failed to fetch drivers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this driver?")) {
      try {
        await driverApi.delete(id);
        fetchDrivers();
      } catch (error) {
        alert("Error deleting driver");
      }
    }
  };

  // Helper to check if license is expired (simulated UI alert)
  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Driver Profiles</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Manage driver details, licenses, and safety scores</p>
        </div>
        <Link
          to="/dashboard/drivers/new"
          className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Add Driver
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Driver Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">License No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Expiry</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Safety Score</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading drivers...
                  </td>
                </tr>
              ) : drivers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    No drivers found. Add a driver to build your roster.
                  </td>
                </tr>
              ) : (
                drivers.map((d) => (
                  <tr key={d.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                    <td className="px-6 py-4 font-medium">{d.name}</td>
                    <td className="px-6 py-4">{d.license_number}</td>
                    <td className="px-6 py-4">{d.license_category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {d.license_expiry}
                        {isExpired(d.license_expiry) && (
                          <AlertCircle size={14} className="text-[#EF4444]" title="License Expired" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{d.contact_number}</td>
                    <td className="px-6 py-4">
                      <span className={d.safety_score < 70 ? 'text-[#DC2626] font-semibold' : 'text-[#15803D] dark:text-[#86EFAC] font-semibold'}>
                        {d.safety_score}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <DriverStatusChip status={d.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link to={`/dashboard/drivers/${d.id}`} className="inline-flex items-center justify-center p-2 text-[#9CA3AF] hover:text-[#22C55E] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D] rounded-full transition-colors">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => handleDelete(d.id)} className="inline-flex items-center justify-center p-2 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] rounded-full transition-colors">
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