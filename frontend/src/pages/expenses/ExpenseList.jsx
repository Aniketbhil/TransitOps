import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { expenseApi } from '../../services/expenseApi';
import { Plus, Droplet, Receipt, Loader2 } from 'lucide-react';

export default function ExpenseList() {
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const [fuelData, expenseData] = await Promise.all([
          expenseApi.getFuelLogs(),
          expenseApi.getExpenses()
        ]);
        setFuelLogs(fuelData);
        setExpenses(expenseData);
      } catch (error) {
        console.error("Failed to fetch financial data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFinancialData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Fuel & Expenses</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Monitor fleet operational costs and fuel efficiency.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/expenses/fuel/new"
            className="flex items-center gap-2 bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
          >
            <Droplet size={16} />
            Log Fuel
          </Link>
          <Link
            to="/dashboard/expenses/other/new"
            className="flex items-center gap-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-2 rounded-xl transition-colors font-medium text-sm"
          >
            <Receipt size={16} />
            Add Expense
          </Link>
        </div>
      </div>

      {/* Fuel Logs Table */}
      <div>
        <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-4 flex items-center gap-2">
          <Droplet className="text-[#F59E0B]" size={20} /> Fuel Logs
        </h2>
        <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Vehicle</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Liters</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Cost (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                      <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    </td>
                  </tr>
                ) : fuelLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">No fuel logs found.</td>
                  </tr>
                ) : (
                  fuelLogs.map((log) => (
                    <tr key={log.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                      <td className="px-6 py-4">{log.date}</td>
                      <td className="px-6 py-4 font-medium">{log.vehicle_name}</td>
                      <td className="px-6 py-4">{log.liters} L</td>
                      <td className="px-6 py-4">₹{log.cost.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Other Expenses Table */}
      <div>
        <h2 className="text-lg font-bold text-[#111827] dark:text-white mb-4 flex items-center gap-2">
          <Receipt className="text-[#22C55E]" size={20} /> Other Expenses
        </h2>
        <div className="bg-white dark:bg-[#1E293B] rounded-[18px] shadow-[0_4px_10px_rgba(0,0,0,0.08)] border border-[#E5E7EB] dark:border-[#334155] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F9FAFB] dark:bg-[#1E293B] border-b border-[#E5E7EB] dark:border-[#334155]">
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Vehicle</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] uppercase">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">
                      <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[#6B7280] dark:text-[#9CA3AF]">No expenses found.</td>
                  </tr>
                ) : (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="bg-white dark:bg-[#111827] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937] transition-colors text-sm text-[#111827] dark:text-[#F8FAFC]">
                      <td className="px-6 py-4">{expense.date}</td>
                      <td className="px-6 py-4 font-medium">{expense.vehicle_name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-[#F3F4F6] dark:bg-[#374151] text-[#374151] dark:text-[#D1D5DB] text-xs font-semibold">
                          {expense.expense_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#EF4444] font-medium">₹{expense.amount.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}