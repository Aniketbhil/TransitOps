import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { maintenanceApi } from '../../services/maintenanceApi';
import { Plus, Loader2, CheckCircle } from 'lucide-react';

const MaintenanceStatusChip = ({ status }) => {
  const styles = {
    ACTIVE: "bg-[#FEF3C7] text-[#D97706] dark:bg-[#78350F] dark:text-[#FCD34D]", // Warning Orange
    COMPLETED: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]", // Success Green
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.ACTIVE}`}>
      {status === 'ACTIVE' ? 'Active / In Shop' : 'Completed'}
    </span>
  );
};

export default function MaintenanceList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const data = await maintenanceApi.getAll();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch maintenance logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleComplete = async (id) => {
    if (window.confirm("Mark this maintenance as completed? The vehicle will become Available again.")) {
      try {
        await maintenanceApi.complete(id);
        fetchLogs();
      } catch (error) {
        alert(error.response?.data?.detail?.[0]?.msg || "Error completing maintenance");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Maintenance Logs</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Track vehicle servicing, repairs, and costs</p>
        </div>
        <Link
          to="/dashboard/maintenance/new"
          className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Log Service
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Service Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Cost (INR)</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading maintenance logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    No maintenance records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                    <td className="px-6 py-4">{log.service_date}</td>
                    <td className="px-6 py-4 font-medium">{log.vehicle_name}</td>
                    <td className="px-6 py-4">{log.service_type}</td>
                    <td className="px-6 py-4">₹{log.cost.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <MaintenanceStatusChip status={log.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {log.status === 'ACTIVE' && (
                        <button onClick={() => handleComplete(log.id)} className="inline-flex items-center justify-center p-2 text-[#15803D] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D] rounded-full transition-colors" title="Mark as Completed">
                          <CheckCircle size={16} />
                        </button>
                      )}
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