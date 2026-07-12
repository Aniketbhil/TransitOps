import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';

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

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* We will add the DashboardLayout here in Part 2 */}
              <Route path="/dashboard" element={
                <div className="p-8 text-center dark:text-white">
                  <h1>Dashboard Skeleton Loaded Successfully!</h1>
                  <p>User is authenticated.</p>
                </div>
              } />
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