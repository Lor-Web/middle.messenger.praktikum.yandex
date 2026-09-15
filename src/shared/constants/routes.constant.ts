import AuthPage from '@/pages/AuthPage';
import ChatPage from '@/pages/ChatPage';
import DashboardPage from '@/pages/DashboardPage';
import ErrorPage from '@/pages/ErrorPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';

import type { Route } from '../models/app.type';
import {
  AUTH_PATH,
  ID_PATH,
  MESSENGER_PATH,
  NOT_FOUND_PATH,
  REGISTER_PATH,
  SERVER_ERROR_PATH,
  SETTINGS_PATH,
} from './paths.constant';

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
    path: MESSENGER_PATH,
    block: DashboardPage,
    children: [
      {
        title: 'Чат',
        path: ID_PATH,
        block: ChatPage,
      },
    ],
  },
  {
    title: 'Настройки',
    path: SETTINGS_PATH,
    block: SettingsPage,
  },
  {
    title: 'Страница не найдена',
    path: NOT_FOUND_PATH,
    block: ErrorPage,
    props: {
      title: '404',
      description: 'Не туда попали',
    },
  },
  {
    title: 'Ошибка сервера',
    path: SERVER_ERROR_PATH,
    block: ErrorPage,
    props: {
      title: '500',
      description: 'Мы уже фиксим',
    },
  },
];
