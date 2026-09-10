import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { useEffect } from 'react';
import PageLoader from '@/components/ui/PageLoader';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, fetchMe, token, hasHydrated } = useAuthStore();
  const location = useLocation();

  useEffect(() => { if (token && !user) fetchMe(); }, [token]);

  // The store hasn't finished reading localStorage yet — we genuinely don't
  // know if there's a valid session or not. Redirecting here (the old bug)
  // would kick out an already-authenticated user on every refresh.
  if (!hasHydrated) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}