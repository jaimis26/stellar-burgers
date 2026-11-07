import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector((state) => state.user.user);
  const userName = user ? user.name : undefined;
  const location = useLocation();

  return <AppHeaderUI userName={userName} currentPath={location.pathname} />;
};
