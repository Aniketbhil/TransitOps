import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripApi } from '../../services/tripApi';
import { Plus, Loader2, Send, CheckCircle, XCircle } from 'lucide-react';

const TripStatusChip = ({ status }) => {
  const styles = {
    DRAFT: "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#D1D5DB]",
    DISPATCHED: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
    COMPLETED: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]",
    CANCELLED: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
};

export default function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Completion Modal
  const [completingTripId, setCompletingTripId] = useState(null);
  const [completeData, setCompleteData] = useState({ final_odometer: '', fuel_consumed: '' });

  const fetchTrips = async () => {
    try {
      const data = await tripApi.getAll();
      setTrips(data);
    } catch (error) {
      console.error("Failed to fetch trips", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDispatch = async (id) => {
    if (window.confirm("Dispatch this trip? Vehicle and Driver will be marked 'On Trip'.")) {
      try {
        await tripApi.dispatch(id);
        fetchTrips();
      } catch (error) {
        alert(error.response?.data?.detail?.[0]?.msg || "Error dispatching trip");
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this trip?")) {
      try {
        await tripApi.cancel(id);
        fetchTrips();
      } catch (error) {
        alert(error.response?.data?.detail?.[0]?.msg || "Error cancelling trip");
      }
    }
  };

  const submitComplete = async (e) => {
    e.preventDefault();
    try {
      await tripApi.complete(completingTripId, {
        final_odometer: Number(completeData.final_odometer),
        fuel_consumed: Number(completeData.fuel_consumed)
      });
      setCompletingTripId(null);
      setCompleteData({ final_odometer: '', fuel_consumed: '' });
      fetchTrips();
    } catch (error) {
      alert(error.response?.data?.detail?.[0]?.msg || "Error completing trip");
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Trip Dispatcher</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Manage live board and trip lifecycles</p>
        </div>
        <Link
          to="/dashboard/trips/new"
          className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
        >
          <Plus size={16} />
          Create Trip
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Driver</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Distance</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading trips...
                  </td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                    No trips found. Create a new draft to begin.
                  </td>
                </tr>
              ) : (
                trips.map((t) => (
                  <tr key={t.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                    <td className="px-6 py-4 font-medium">{t.source} → {t.destination}</td>
                    <td className="px-6 py-4">{t.vehicle_name}</td>
                    <td className="px-6 py-4">{t.driver_name}</td>
                    <td className="px-6 py-4">{t.planned_distance} km</td>
                    <td className="px-6 py-4">
                      <TripStatusChip status={t.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {t.status === 'DRAFT' && (
                        <>
                          <button onClick={() => handleDispatch(t.id)} className="p-2 text-[#2563EB] hover:bg-[#DBEAFE] dark:hover:bg-[#1E3A8A] rounded-full transition-colors" title="Dispatch">
                            <Send size={16} />
                          </button>
                          <button onClick={() => handleCancel(t.id)} className="p-2 text-[#EF4444] hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] rounded-full transition-colors" title="Cancel">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {t.status === 'DISPATCHED' && (
                        <button onClick={() => setCompletingTripId(t.id)} className="p-2 text-[#15803D] hover:bg-[#DCFCE7] dark:hover:bg-[#14532D] rounded-full transition-colors" title="Complete Trip">
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

      {/* Completion Modal */}
      {completingTripId && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-[18px]">
          <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[18px] shadow-lg w-96 border border-[#E5E7EB] dark:border-[#334155]">
            <h3 className="text-lg font-bold text-[#111827] dark:text-white mb-4">Complete Trip</h3>
            <form onSubmit={submitComplete} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#374151] dark:text-[#D1D5DB]">FINAL ODOMETER</label>
                <input type="number" required min="0" value={completeData.final_odometer} onChange={e => setCompleteData({...completeData, final_odometer: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-[#334155] dark:bg-[#111827] text-black dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#374151] dark:text-[#D1D5DB]">FUEL CONSUMED (LITERS)</label>
                <input type="number" required min="0" value={completeData.fuel_consumed} onChange={e => setCompleteData({...completeData, fuel_consumed: e.target.value})} className="w-full px-3 py-2 rounded-lg border dark:border-[#334155] dark:bg-[#111827] text-black dark:text-white" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setCompletingTripId(null)} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-[#22C55E] text-white rounded-lg">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}