import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Route Guards & Layouts
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Fleet Module Pages
import VehicleList from './pages/vehicles/VehicleList';
import VehicleForm from './pages/vehicles/VehicleForm';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes wrapped in Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                
                {/* Dashboard Home */}
                <Route path="/dashboard" element={
                  <div className="bg-white dark:bg-[#1E293B] rounded-[18px] p-8 shadow-[0_4px_10px_rgba(0,0,0,0.08)] dark:border dark:border-[#334155]">
                    <h1 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">Welcome to TransitOps</h1>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                      Select an option from the sidebar to begin managing your fleet operations.
                    </p>
                  </div>
                } />

                {/* Fleet / Vehicle Module */}
                <Route path="/dashboard/fleet" element={<VehicleList />} />
                <Route path="/dashboard/fleet/new" element={<VehicleForm />} />
                <Route path="/dashboard/fleet/:id" element={<VehicleForm />} />

                {/* Future routes we will build in next chapters */}
                <Route path="/dashboard/drivers" element={<div className="p-6">Driver Module (Next Chapter)</div>} />

              </Route>
            </Route>
            
            {/* Catch-all 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;