import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { driverApi } from '../../services/driverApi';
import { ArrowLeft } from 'lucide-react';

export default function DriverForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    license_number: '',
    license_category: 'LMV',
    license_expiry: '',
    contact_number: '',
    safety_score: '',
    status: 'AVAILABLE'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const loadDriver = async () => {
        try {
          const data = await driverApi.getById(id);
          setFormData({
            ...data,
            safety_score: data.safety_score.toString(),
          });
        } catch (err) {
          setError("Failed to load driver details.");
        }
      };
      loadDriver();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const payload = {
      ...formData,
      safety_score: Number(formData.safety_score),
    };

    try {
      if (isEditMode) {
        await driverApi.update(id, payload);
      } else {
        await driverApi.create(payload);
      }
      navigate('/dashboard/drivers');
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || 'Failed to save driver. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/drivers" className="p-2 text-[#6B7280] dark:text-[#9CA3AF] hover:bg-[#F3F4F6] dark:hover:bg-[#1F2937] rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
            {isEditMode ? 'Edit Driver' : 'Add New Driver'}
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            {isEditMode ? 'Update driver profile and license information.' : 'Register a new driver to your active roster.'}
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
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">FULL NAME</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g., Alex Johnson"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">LICENSE NUMBER</label>
              <input type="text" name="license_number" required value={formData.license_number} onChange={handleChange} placeholder="e.g., DL-88213"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">LICENSE CATEGORY</label>
              <select name="license_category" required value={formData.license_category} onChange={handleChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]">
                <option value="LMV">LMV (Light Motor Vehicle)</option>
                <option value="HMV">HMV (Heavy Motor Vehicle)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">LICENSE EXPIRY DATE</label>
              <input type="date" name="license_expiry" required value={formData.license_expiry} onChange={handleChange}
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">CONTACT NUMBER</label>
              <input type="text" name="contact_number" required value={formData.contact_number} onChange={handleChange} placeholder="e.g., 9876543210"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">SAFETY SCORE (0-100)</label>
              <input type="number" name="safety_score" required min="0" max="100" value={formData.safety_score} onChange={handleChange} placeholder="96"
                className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]"
              />
            </div>

            {isEditMode && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#374151] dark:text-[#D1D5DB]">DUTY STATUS</label>
                <select name="status" required value={formData.status} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-[12px] border border-[#D1D5DB] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-[#111827] dark:text-white focus:outline-none focus:border-[#22C55E] dark:focus:border-[#22C55E]">
                  <option value="AVAILABLE">Available</option>
                  <option value="ON_TRIP">On Trip</option>
                  <option value="OFF_DUTY">Off Duty</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E5E7EB] dark:border-[#334155] mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard/drivers')}
              className="mr-3 px-6 py-2.5 rounded-[12px] text-sm font-semibold border border-[#D1D5DB] dark:border-[#334155] text-[#374151] dark:text-white hover:bg-[#F3F4F6] dark:hover:bg-[#273549] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-[12px] text-sm font-semibold bg-[#22C55E] hover:bg-[#16A34A] text-white transition-colors cursor-pointer"
            >
              {isLoading ? 'Saving...' : (isEditMode ? 'Update Driver' : 'Save Driver')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}