import { useState, useEffect, useRef } from 'react';
import { dashboardApi } from '../../services/dashboardApi';
import { 
  Percent, Droplet, DollarSign, TrendingUp, 
  BarChart3, AlertTriangle, Loader2, Download 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function AnalyticsHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const dashboardData = await dashboardApi.getDashboardData();
        setData(dashboardData);
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // PDF Export Function
  const handleExportPDF = async () => {
    if (!pdfRef.current) return;
    setIsExporting(true);

    try {
      // Capture the component as a high-res canvas
      const canvas = await html2canvas(pdfRef.current, { 
        scale: 2, 
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0F172A' : '#F8FAFC' 
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize PDF (A4, portrait)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Add image to PDF and trigger download
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('transitops_analytics_report.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-[#22C55E]" size={48} />
      </div>
    );
  }

  if (!data) return <div>Failed to load analytics.</div>;

  const { kpis, analytics } = data;

  // Mock data for the chart
  const monthlyRevenue = [
    { month: 'Jan', value: 45 }, { month: 'Feb', value: 52 },
    { month: 'Mar', value: 38 }, { month: 'Apr', value: 65 },
    { month: 'May', value: 48 }, { month: 'Jun', value: 85 },
    { month: 'Jul', value: 72 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header with PDF Export Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Fleet performance, ROI, and cost analysis</p>
        </div>
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-[#D1D5DB] dark:border-[#334155] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] text-[#374151] dark:text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm cursor-pointer disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
          {isExporting ? 'Generating PDF...' : 'Export PDF'}
        </button>
      </div>

      {/* Wrapping the content we want to export in the pdfRef */}
      <div ref={pdfRef} className="space-y-6 p-2 rounded-lg bg-[#F8FAFC] dark:bg-[#0F172A]">
        
        {/* 4 Main KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#F3E8FF] dark:bg-[#4C1D95] text-[#8B5CF6] rounded-lg">
                <Percent size={20} />
              </div>
              <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Fleet Utilization</h3>
            </div>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">{Math.round(kpis.fleet_utilization)}%</p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#DBEAFE] dark:bg-[#1E3A8A] text-[#3B82F6] rounded-lg">
                <Droplet size={20} />
              </div>
              <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Fuel Efficiency</h3>
            </div>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">
              {analytics.average_fuel_efficiency ? analytics.average_fuel_efficiency.toFixed(1) : '0.0'} <span className="text-lg text-[#6B7280] dark:text-[#9CA3AF]">km/L</span>
            </p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#FEE2E2] dark:bg-[#7F1D1D] text-[#EF4444] rounded-lg">
                <DollarSign size={20} />
              </div>
              <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Operational Cost</h3>
            </div>
            <p className="text-3xl font-bold text-[#EF4444]">₹{analytics.total_operational_cost.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[#DCFCE7] dark:bg-[#14532D] text-[#22C55E] rounded-lg">
                <TrendingUp size={20} />
              </div>
              <h3 className="text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Vehicle ROI</h3>
            </div>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">14.2%</p>
            <p className="text-[10px] text-[#6B7280] dark:text-[#9CA3AF] mt-1 italic">
              ROI = (Revenue - Maintenance - Fuel) / Acq. Cost
            </p>
          </div>
        </div>

        {/* Charts & Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] p-6 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2 mb-8">
              <BarChart3 className="text-[#8B5CF6]" size={20} />
              <h2 className="text-lg font-bold text-[#111827] dark:text-white uppercase">Monthly Revenue</h2>
            </div>
            
            <div className="h-56 flex items-end justify-between gap-4 border-b border-l border-[#E5E7EB] dark:border-[#334155] ml-8 relative">
              <div className="absolute -left-10 top-0 text-xs text-[#9CA3AF] w-8 text-right">100k</div>
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] w-8 text-right">50k</div>
              
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex flex-col justify-end items-center w-full h-full group relative pb-1">
                  <div 
                    className="w-full max-w-10 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-t-sm transition-all duration-300 relative z-10"
                    style={{ height: `${data.value}%` }}
                  >
                  </div>
                  <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF] absolute -bottom-6">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 bg-white dark:bg-[#1E293B] p-6 rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155]">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="text-[#F59E0B]" size={20} />
              <h2 className="text-lg font-bold text-[#111827] dark:text-white uppercase">Top Costliest Vehicles</h2>
            </div>
            
            <ul className="space-y-4">
              <li className="flex justify-between items-center p-3 bg-[#F9FAFB] dark:bg-[#111827] rounded-xl border border-[#E5E7EB] dark:border-[#334155]">
                <div>
                  <p className="font-bold text-[#111827] dark:text-white">TRUCK-11</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Maintenance & Fuel</p>
                </div>
                <p className="font-semibold text-[#EF4444]">₹26,400</p>
              </li>
              
              <li className="flex justify-between items-center p-3 bg-[#F9FAFB] dark:bg-[#111827] rounded-xl border border-[#E5E7EB] dark:border-[#334155]">
                <div>
                  <p className="font-bold text-[#111827] dark:text-white">MINI-03</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Maintenance Heavy</p>
                </div>
                <p className="font-semibold text-[#EF4444]">₹8,250</p>
              </li>

              <li className="flex justify-between items-center p-3 bg-[#F9FAFB] dark:bg-[#111827] rounded-xl border border-[#E5E7EB] dark:border-[#334155]">
                <div>
                  <p className="font-bold text-[#111827] dark:text-white">VAN-05</p>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Routine Servicing</p>
                </div>
                <p className="font-semibold text-[#EF4444]">₹5,650</p>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}