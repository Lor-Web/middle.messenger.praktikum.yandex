export const AUTH_PATH = '/';
export const REGISTER_PATH = '/sign-up';

export const MESSENGER_PATH = '/messenger';

export const ID_PATH = ':id';

export const SETTINGS_PATH = '/settings';

export const NOT_FOUND_PATH = '/404';
export const SERVER_ERROR_PATH = '/500';

export const chatPath = (id: string | number) => `${MESSENGER_PATH}/${id}`;
