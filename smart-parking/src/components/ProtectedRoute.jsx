import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { token, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
        );
    }

    if (!token) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        // Redirect based on role to avoid infinite loops
        if (user?.role === 'SUPER_ADMIN') return <Navigate to="/super-admin" replace />;
        if (user?.role === 'MANAGER') return <Navigate to="/manager" replace />;
        if (user?.role === 'DRIVER') return <Navigate to="/driver" replace />;

        // If no specific role dashboard, fallback to home (or login if invalid)
        return <Navigate to="/login" replace />;
    }

    return children;
}
