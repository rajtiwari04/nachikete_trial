import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, fetchMe, token } = useAuthStore();
  const location = useLocation();

  useEffect(() => { if (token && !user) fetchMe(); }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
