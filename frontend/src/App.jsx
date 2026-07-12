import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Route Guards & Layouts
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes wrapped in Layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                
                {/* Temporary Dashboard Home */}
                <Route path="/dashboard" element={
                  <div className="bg-white dark:bg-[#1E293B] rounded-[18px] p-8 shadow-[0_4px_10px_rgba(0,0,0,0.08)] dark:border dark:border-[#334155]">
                    <h1 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">Welcome to TransitOps</h1>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                      Select an option from the sidebar to begin managing your fleet operations.
                    </p>
                  </div>
                } />

                {/* Future routes we will build in next chapters */}
                <Route path="/dashboard/fleet" element={<div>Vehicle Module (Next Chapter)</div>} />
                <Route path="/dashboard/drivers" element={<div>Driver Module</div>} />

              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;