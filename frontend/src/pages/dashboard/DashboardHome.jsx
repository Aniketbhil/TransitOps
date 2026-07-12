import { useState, useEffect } from 'react';
import { dashboardApi } from '../../services/dashboardApi';
import { 
  Truck, Activity, Wrench, Users, 
  Map, Percent, DollarSign, Droplet, Loader2 
} from 'lucide-react';

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

  const { kpis, analytics, recent_trips } = data;

  const StatusChip = ({ status }) => {
    const styles = {
      DRAFT: "bg-[#F3F4F6] text-[#6B7280] dark:bg-[#374151] dark:text-[#D1D5DB]",
      DISPATCHED: "bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
      COMPLETED: "bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]",
      CANCELLED: "bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || styles.DRAFT}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Dashboard</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Overview of fleet operations and financials</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Vehicles - Green */}
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Active Vehicles</span>
            <div className="p-2 bg-[#DCFCE7] dark:bg-[#14532D] text-[#22C55E] rounded-lg">
              <Truck size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.active_vehicles}</div>
          <div className="text-sm text-[#15803D] mt-1">{kpis.available_vehicles} Available</div>
        </div>

        {/* Trips - Blue */}
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Active Trips</span>
            <div className="p-2 bg-[#DBEAFE] dark:bg-[#1E3A8A] text-[#3B82F6] rounded-lg">
              <Map size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.active_trips}</div>
          <div className="text-sm text-[#3B82F6] mt-1">{kpis.pending_trips} Pending</div>
        </div>

        {/* Maintenance - Orange */}
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">In Maintenance</span>
            <div className="p-2 bg-[#FEF3C7] dark:bg-[#78350F] text-[#F59E0B] rounded-lg">
              <Wrench size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.vehicles_in_maintenance}</div>
        </div>

        {/* Utilization - Purple */}
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Fleet Utilization</span>
            <div className="p-2 bg-[#F3E8FF] dark:bg-[#4C1D95] text-[#8B5CF6] rounded-lg">
              <Percent size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#111827] dark:text-white">{kpis.fleet_utilization.toFixed(1)}%</div>
          <div className="w-full bg-[#F3F4F6] dark:bg-[#374151] rounded-full h-1.5 mt-2">
            <div className="bg-[#8B5CF6] h-1.5 rounded-full" style={{ width: `${kpis.fleet_utilization}%` }}></div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Financials */}
         <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="text-[#EF4444]" size={20} />
            <h2 className="text-lg font-bold text-[#111827] dark:text-white">Operational Costs</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Fuel Cost</span>
              <span className="font-semibold text-[#111827] dark:text-white">₹{analytics.total_fuel_cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Maintenance</span>
              <span className="font-semibold text-[#111827] dark:text-white">₹{analytics.total_maintenance_cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB] dark:border-[#334155]">
              <span className="text-sm font-bold text-[#111827] dark:text-white">Total</span>
              <span className="font-bold text-[#EF4444]">₹{analytics.total_operational_cost.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Fuel Efficiency */}
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
          <div className="flex items-center gap-2 mb-4">
            <Droplet className="text-[#F59E0B]" size={20} />
            <h2 className="text-lg font-bold text-[#111827] dark:text-white">Fuel Analytics</h2>
          </div>
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase block mb-1">Average Efficiency</span>
              <span className="text-3xl font-bold text-[#111827] dark:text-white">
                {analytics.average_fuel_efficiency ? analytics.average_fuel_efficiency.toFixed(2) : '0.00'} <span className="text-base text-[#6B7280]">km/L</span>
              </span>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase block mb-1">Total Fuel Consumed</span>
              <span className="text-lg font-bold text-[#111827] dark:text-white">{analytics.total_fuel_consumed.toLocaleString()} Liters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips Table */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB] dark:border-[#334155] flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#111827] dark:text-white flex items-center gap-2">
            <Activity className="text-[#3B82F6]" size={20} /> Recent Dispatches
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Driver</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
              {recent_trips.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">No recent trips found.</td>
                </tr>
              ) : (
                recent_trips.map((trip) => (
                  <tr key={trip.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                    <td className="px-6 py-4 font-medium">{trip.source} → {trip.destination}</td>
                    <td className="px-6 py-4">{trip.vehicle_name}</td>
                    <td className="px-6 py-4">{trip.driver_name}</td>
                    <td className="px-6 py-4">
                      <StatusChip status={trip.status} />
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