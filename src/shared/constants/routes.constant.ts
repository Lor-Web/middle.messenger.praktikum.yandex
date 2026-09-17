import AuthPage from '@/pages/AuthPage';
import ChatEditPage from '@/pages/ChatEditPage';
import ChatPage from '@/pages/ChatPage';
import DashboardPage from '@/pages/DashboardPage';
import ErrorPage from '@/pages/ErrorPage';
import RegisterPage from '@/pages/RegisterPage';
import SettingsPage from '@/pages/SettingsPage';

import type { Route } from '../models/app.type';
import {
  AUTH_PATH,
  EDIT_PATH,
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
    access: 'guest',
  },
  {
    title: 'Регистрация',
    path: REGISTER_PATH,
    block: RegisterPage,
    access: 'guest',
  },
  {
    title: 'Чаты',
    path: MESSENGER_PATH,
    block: DashboardPage,
    access: 'protected',
    children: [
      {
        title: 'Чат',
        path: ID_PATH,
        block: ChatPage,
        children: [
          {
            title: 'Редактирование чата',
            path: EDIT_PATH,
            block: ChatEditPage,
          },
        ],
      },
    ],
  },
  {
    title: 'Настройки',
    path: SETTINGS_PATH,
    block: SettingsPage,
    access: 'protected',
  },
  {
    title: 'Страница не найдена',
    path: NOT_FOUND_PATH,
    block: ErrorPage,
    access: 'public',
    props: {
      title: '404',
      description: 'Не туда попали',
    },
  },
  {
    title: 'Ошибка сервера',
    path: SERVER_ERROR_PATH,
    block: ErrorPage,
    access: 'public',
    props: {
      title: '500',
      description: 'Мы уже фиксим',
    },
  },
];
