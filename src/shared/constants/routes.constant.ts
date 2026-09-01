import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import ErrorPage from '@/pages/ErrorPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';

import { chats } from '../mocks/chats.mock';
import { chat } from '../mocks/messages.mock';
import { user } from '../mocks/user.mock';
import type { ErrorRoute, Route } from '../models/app.type';
import { AUTH_PATH, DASHBOARD_PATH, REGISTER_PATH, SETTINGS_PATH } from './paths.constant';

export const ROUTES: Route[] = [
  {
    title: 'Вход',
    path: AUTH_PATH,
    block: AuthPage,
  },
  {
    title: 'Регистрация',
    path: REGISTER_PATH,
    block: RegisterPage,
  },
  {
    title: 'Чаты',
    path: DASHBOARD_PATH,
    block: DashboardPage,
    props: {
      user,
      chats,
      chat,
    },
  },
  {
    title: 'Настройки',
    path: SETTINGS_PATH,
    block: SettingsPage,
    props: {
      user,
      chats,
    },
  },
];

export const ERRORS_ROUTES: ErrorRoute[] = [
  {
    title: 'Страница не найдена',
    code: 404,
    block: ErrorPage,
    props: {
      title: '404',
      description: 'Мы уже фиксим',
    },
  },
];
