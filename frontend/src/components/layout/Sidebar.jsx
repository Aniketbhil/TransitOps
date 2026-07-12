import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, Map, 
  Wrench, Droplet, LineChart, Settings 
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Fleet', path: '/dashboard/fleet', icon: Truck },
  { name: 'Drivers', path: '/dashboard/drivers', icon: Users },
  { name: 'Trips', path: '/dashboard/trips', icon: Map },
  { name: 'Maintenance', path: '/dashboard/maintenance', icon: Wrench },
  { name: 'Fuel & Expenses', path: '/dashboard/expenses', icon: Droplet },
  { name: 'Analytics', path: '/dashboard/analytics', icon: LineChart },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen flex flex-col bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-[#1F2937] transition-colors duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] dark:border-[#1F2937]">
        <Truck className="text-[#22C55E] mr-2" size={24} />
        <span className="text-xl font-bold text-[#111827] dark:text-white">TransitOps</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-[#DCFCE7] dark:bg-[#14532D] text-[#15803D] dark:text-[#86EFAC]'
                      : 'text-[#687280] dark:text-[#9CA3AF] hover:bg-[#F0FDF4] dark:hover:bg-[#1F2937]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#22C55E] rounded-r-md"></div>
                    )}
                    <item.icon className="mr-3" size={20} />
                    {item.name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}