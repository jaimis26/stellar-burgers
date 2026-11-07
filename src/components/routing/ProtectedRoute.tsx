import { useSelector } from '@/services/store';
import { Navigate, useLocation } from 'react-router-dom';

import { Preloader } from '../ui';

import type { ReactNode } from 'react';

type ProtectionMode = 'public' | 'private';

type ProtectedRouteProps = {
  children: ReactNode;
  mode?: ProtectionMode;
};

export const ProtectedRoute = ({
  children,
  mode = 'private',
}: ProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  const isLoggedIn = !!user;

  if (mode === 'private') {
    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }
  if (mode === 'public') {
    if (isLoggedIn) {
      const from = (location.state as { from?: Location })?.from ?? '/';
      return <Navigate to={from} replace />;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};
