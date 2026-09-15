export const AUTH_PATH = 'auth';
export const REGISTER_PATH = 'register';

export const DASHBOARD_PATH = 'dashboard';

export const ID_PATH = ':id';

export const SETTINGS_PATH = 'settings';

export const chatPath = (id: string | number) => `${DASHBOARD_PATH}/${id}`;
