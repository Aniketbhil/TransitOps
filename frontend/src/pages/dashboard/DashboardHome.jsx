import { useState, useEffect } from 'react';
import { dashboardApi } from '../../services/dashboardApi';
import { Loader2 } from 'lucide-react';

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await dashboardApi.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-[#22C55E]" size={48} />
      </div>
    );
  }

  if (!data) return <div>Failed to load dashboard.</div>;

  const { kpis, vehicle_status, recent_trips } = data;

  // Status Chip mapping perfectly aligned with the Color Theme PDF
  const StatusChip = ({ status }) => {
    const styles = {
      DRAFT: "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#D1D5DB]",
      DISPATCHED: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
      ON_TRIP: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
      COMPLETED: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]",
      CANCELLED: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]",
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${styles[status] || styles.DRAFT}`}>
        {status === 'ON_TRIP' ? 'On Trip' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
      </span>
    );
  };

  // Helper for formatting UUIDs to short strings like "TR001" for the table
  const formatTripId = (uuid, index) => `TR00${index + 1}`;

  // Vehicle Status Calculation for Progress Bars
  const totalVehicles = Object.values(vehicle_status).reduce((acc, val) => acc + val, 0) || 1; // prevent div by 0

  return (
    <div className="space-y-8">
      
      {/* 1. Filters Section
      <div>
        <h3 className="text-xs font-semibold text-[#9CA3AF] uppercase mb-2 tracking-wider">Filters</h3>
        <div className="flex flex-wrap gap-4">
          <select className="px-4 py-2 text-sm rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
            <option>Vehicle Type: All</option>
          </select>
          <select className="px-4 py-2 text-sm rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
            <option>Status: All</option>
          </select>
          <select className="px-4 py-2 text-sm rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
            <option>Region: All</option>
          </select>
        </div>
      </div> */}

      {/* 2. KPI Cards Row (7 Columns matching wireframe exactly) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        
        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#3B82F6]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Active Vehicles</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.active_vehicles}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#22C55E]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Available Vehicles</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.available_vehicles}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#F59E0B]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Vehicles In Maintenance</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.vehicles_in_maintenance < 10 ? `0${kpis.vehicles_in_maintenance}` : kpis.vehicles_in_maintenance}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#3B82F6]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Active Trips</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.active_trips}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#3B82F6]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Pending Trips</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.pending_trips < 10 ? `0${kpis.pending_trips}` : kpis.pending_trips}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#3B82F6]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Drivers On Duty</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.drivers_on_trip}</p>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] border-l-4 border-l-[#22C55E]">
          <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase mb-2">Fleet Utilization</h3>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{Math.round(kpis.fleet_utilization)}%</p>
        </div>

      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Recent Trips Table (Takes up 2 columns) */}
        <div className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-4">Recent Trips</h3>
          <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#334155]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase font-mono">Trip</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase">Vehicle</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase">Driver</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#9CA3AF] uppercase">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                {recent_trips.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">No recent trips found.</td>
                  </tr>
                ) : (
                  recent_trips.slice(0, 5).map((trip, idx) => (
                    <tr key={trip.id} className="bg-white dark:bg-[#111827] hover:bg-[#F9FAFB] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-white">
                      <td className="px-6 py-4 font-mono font-medium">{formatTripId(trip.id, idx)}</td>
                      <td className="px-6 py-4">{trip.vehicle_name}</td>
                      <td className="px-6 py-4">{trip.driver_name}</td>
                      <td className="px-6 py-4">
                        <StatusChip status={trip.status} />
                      </td>
                      <td className="px-6 py-4 text-[#6B7280] dark:text-[#9CA3AF]">
                        {trip.status === 'DRAFT' ? 'Awaiting vehicle' : trip.status === 'DISPATCHED' ? '45 min' : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Vehicle Status Bar Charts */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-4">Vehicle Status</h3>
          
          <div className="space-y-6 mt-6">
            
            {/* Available */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-[#111827] dark:text-white">
                <span>Available</span>
              </div>
              <div className="w-full bg-[#E5E7EB] dark:bg-[#374151] rounded-none h-4">
                <div 
                  className="bg-[#22C55E] h-4" 
                  style={{ width: `${(vehicle_status.available / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* On Trip */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-[#111827] dark:text-white">
                <span>On Trip</span>
              </div>
              <div className="w-full bg-[#E5E7EB] dark:bg-[#374151] rounded-none h-4">
                <div 
                  className="bg-[#3B82F6] h-4" 
                  style={{ width: `${(vehicle_status.on_trip / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* In Shop */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-[#111827] dark:text-white">
                <span>In Shop</span>
              </div>
              <div className="w-full bg-[#E5E7EB] dark:bg-[#374151] rounded-none h-4">
                <div 
                  className="bg-[#F59E0B] h-4" 
                  style={{ width: `${(vehicle_status.in_shop / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Retired */}
            <div>
              <div className="flex justify-between text-sm mb-2 text-[#111827] dark:text-white">
                <span>Retired</span>
              </div>
              <div className="w-full bg-[#E5E7EB] dark:bg-[#374151] rounded-none h-4">
                <div 
                  className="bg-[#EF4444] h-4" 
                  style={{ width: `${(vehicle_status.retired / totalVehicles) * 100}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}