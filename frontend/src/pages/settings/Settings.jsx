import { useState, useEffect } from 'react';
import { settingsApi } from '../../services/settingsApi';
import { Loader2, Save, Shield, Settings2 } from 'lucide-react';

export default function Settings() {
  const [formData, setFormData] = useState({
    depot_name: '',
    currency: 'INR (Rs)',
    distance_unit: 'Kilometers'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsApi.getSettings();
        if (data) {
          setFormData({
            depot_name: data.depot_name || '',
            currency: data.currency || 'INR (Rs)',
            distance_unit: data.distance_unit || 'Kilometers'
          });
        }
      } catch (error) {
        console.error("Failed to load settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await settingsApi.updateSettings(formData);
      setMessage({ type: 'success', text: 'Settings updated successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-[#22C55E]" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Settings</h1>
        <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Manage system preferences and view access roles.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-[#DCFCE7] text-[#15803D] dark:bg-[#14532D] dark:text-[#86EFAC]' : 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#7F1D1D] dark:text-[#FCA5A5]'}`}>
          {message.text}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-[#E5E7EB] dark:border-[#334155] pb-4">
          <Settings2 className="text-[#3B82F6]" size={20} />
          <h2 className="text-lg font-bold text-[#111827] dark:text-white uppercase tracking-wider">General</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB] uppercase">Depot Name</label>
              <input type="text" name="depot_name" required value={formData.depot_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]" />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB] uppercase">Currency</label>
              <select name="currency" required value={formData.currency} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
                <option value="INR (Rs)">INR (Rs)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB] uppercase">Distance Unit</label>
              <select name="distance_unit" required value={formData.distance_unit} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E]">
                <option value="Kilometers">Kilometers</option>
                <option value="Miles">Miles</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors cursor-pointer">
              {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>

      {/* RBAC Matrix */}
      <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
        <div className="p-6 border-b border-[#E5E7EB] dark:border-[#334155] flex items-center gap-2">
          <Shield className="text-[#8B5CF6]" size={20} />
          <h2 className="text-lg font-bold text-[#111827] dark:text-white uppercase tracking-wider">Role-Based Access (RBAC)</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-center">Fleet</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-center">Drivers</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-center">Trips</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-center">Fuel & Exp</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase text-center">Analytics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155] text-sm">
              <tr className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                <td className="px-6 py-4 font-bold">Admin</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
              </tr>
              <tr className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                <td className="px-6 py-4 font-bold">Fleet Manager</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
              </tr>
              <tr className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                <td className="px-6 py-4 font-bold">Dispatcher</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
              </tr>
              <tr className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                <td className="px-6 py-4 font-bold">Safety Officer</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
              </tr>
              <tr className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white">
                <td className="px-6 py-4 font-bold">Financial Analyst</td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">View</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
                <td className="px-6 py-4 text-center text-[#9CA3AF]">—</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
                <td className="px-6 py-4 text-center text-[#22C55E]">✓ Full</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}