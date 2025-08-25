import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { User } from '../types';

interface ProtectedRouteProps {
  user: User | null;
}

export function PublicRoute({ user }: ProtectedRouteProps) {
  const role = user?.user_metadata?.role;

  if (user) {
    return (
      <Navigate
        to={role === 'merchant' ? '/merchant/dashboard' : '/checkout'}
        replace
      />
    );
  }

  return <Outlet />;
}

export function UserRoute({ user }: ProtectedRouteProps) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  const role = user?.user_metadata?.role;
  return role === 'user' ? <Outlet /> : <Navigate to="/" replace />;
}

export function MerchantRoute({ user }: ProtectedRouteProps) {
  const location = useLocation();

  if (!user) {
    return (
      <Navigate
        to={`/merchant?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  const role = user?.user_metadata?.role;
  return role === 'merchant' ? <Outlet /> : <Navigate to="/merchant" replace />;
}
