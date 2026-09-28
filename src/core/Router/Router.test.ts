import { beforeEach, describe, expect, it, vi } from 'vitest';

import GlobalStore from '@/core/GlobalStore/GlobalStore';
import { registerComponents } from '@/shared/lib/registerComponents';
import { registerHelpers } from '@/shared/lib/registerHelpers';

import Router from './Router';

vi.mock('@/core/GlobalStore/load', () => ({
  loadUser: vi.fn(() => Promise.resolve()),
  loadChats: vi.fn(() => Promise.resolve()),
  loadAppData: vi.fn(() => Promise.resolve()),
}));

const user = {
  id: 1,
  first_name: 'Ivan',
  second_name: 'Petrov',
  display_name: 'Ivan',
  login: 'ivan',
  email: 'ivan@test.com',
  phone: '+79990001122',
  avatar: '',
};

const resetRouter = () => {
  Reflect.set(Router, '__instance', null);
};

describe('Router', () => {
  beforeEach(() => {
    document.body.replaceChildren();
    document.title = '';
    window.history.pushState({}, '', '/');
    GlobalStore.reset();
    resetRouter();
    registerHelpers();
    registerComponents();
  });

  it('возвращает один и тот же экземпляр', () => {
    const router = new Router();

    expect(new Router()).toBe(router);
  });

  it('находит маршрут, параметры и более точный вложенный путь', () => {
    const router = new Router();

    expect(router.getRoute('/')?.route.pathname).toBe('/');
    expect(router.getRoute('/sign-up/')?.route.pathname).toBe('/sign-up');
    expect(router.getRoute('/SIGN-UP')?.route.pathname).toBe('/sign-up');
    expect(router.getRoute('/messenger/12')?.params).toEqual({ id: '12' });
    expect(router.getRoute('/messenger/12')?.route.pathname).toBe('/messenger/:id');
    expect(router.getRoute('/messenger/12/edit')?.route.pathname).toBe('/messenger/:id/edit');
    expect(router.getRoute('/missing')).toBeNull();
  });

  it('рисует гостевую страницу и заголовок', async () => {
    const router = new Router();

    router.go('/');

    await vi.waitFor(() => {
      expect(document.title).toBe('Вход');
      expect(document.body.textContent).toContain('Войти');
    });
  });

  it('уводит неавторизованного пользователя с защищённого маршрута на вход', async () => {
    const router = new Router();

    router.go('/messenger');

    await vi.waitFor(() => {
      expect(window.location.pathname).toBe('/');
      expect(document.title).toBe('Вход');
    });
  });

  it('уводит авторизованного пользователя с гостевого маршрута в чаты', async () => {
    GlobalStore.setState('user', user);
    const router = new Router();

    router.go('/');

    await vi.waitFor(() => {
      expect(window.location.pathname).toBe('/messenger');
      expect(document.title).toBe('Чаты');
      expect(document.body.textContent).toContain('Ivan');
    });
  });

  it('открывает страницу 404 для неизвестного адреса', async () => {
    const router = new Router();

    router.go('/missing');

    await vi.waitFor(() => {
      expect(window.location.pathname).toBe('/missing');
      expect(document.title).toBe('Страница не найдена');
      expect(document.body.textContent).toContain('Не туда попали');
    });
  });

  it('переходит по history при popstate', async () => {
    const router = new Router();

    router.start();

    await vi.waitFor(() => {
      expect(document.title).toBe('Вход');
    });

    window.history.pushState({}, '', '/sign-up');
    window.onpopstate?.(new PopStateEvent('popstate'));

    await vi.waitFor(() => {
      expect(document.title).toBe('Регистрация');
      expect(document.body.textContent).toContain('Регистрация');
    });
  });
});
