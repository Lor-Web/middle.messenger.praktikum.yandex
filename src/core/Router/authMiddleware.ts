import GlobalStore from '@/core/GlobalStore/GlobalStore';
import { loadChats, loadUser } from '@/core/GlobalStore/load';
import { AUTH_PATH, MESSENGER_PATH } from '@/shared/constants/paths.constant';

import type Route from './Route';

export default async function authMiddleware(route: Route) {
  await loadUser();

  const isAuth = Boolean(GlobalStore.getState('user'));

  if (route.access === 'protected' && !isAuth) {
    return AUTH_PATH;
  }

  if (route.access === 'guest' && isAuth) {
    return MESSENGER_PATH;
  }

  if (isAuth) {
    loadChats();
  }

  return undefined;
}
