import GlobalStore from '@/core/GlobalStore/GlobalStore';

import type { UserResponse } from '../models/api/auth.type';

export default (id: unknown) => {
  const user = GlobalStore.getState('user') as UserResponse | undefined;

  if (!user || (typeof id !== 'number' && typeof id !== 'string')) {
    return false;
  }

  return Number(id) === user.id;
};
