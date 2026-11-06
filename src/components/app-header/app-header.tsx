import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const user = useSelector((state) => state.user.user);
  const userName = user ? user.name : undefined;

  return <AppHeaderUI userName={userName} />;
};
