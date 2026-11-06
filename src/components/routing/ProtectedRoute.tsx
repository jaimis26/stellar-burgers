import { useSelector } from '@/services/store';
import { Navigate } from 'react-router-dom';

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
  if (!isAuthChecked) {
    return <Preloader />;
  }
  const isLoggedIn = !!user;

  if (mode === 'private') {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }
  if (mode === 'public') {
    if (isLoggedIn) {
      return <Navigate to="/profile" replace />;
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};
