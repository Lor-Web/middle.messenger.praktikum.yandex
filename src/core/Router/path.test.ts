import { describe, expect, it } from 'vitest';

import { joinPaths, matchPath, normalizePath, rankPath } from './path';

describe('normalizePath', () => {
  it('приводит пустой путь и корень к /', () => {
    expect(normalizePath('')).toBe('/');
    expect(normalizePath('/')).toBe('/');
  });

  it('добавляет ведущий слэш и убирает завершающий', () => {
    expect(normalizePath('messenger')).toBe('/messenger');
    expect(normalizePath('/sign-up/')).toBe('/sign-up');
  });
});

describe('joinPaths', () => {
  it('склеивает сегменты в один путь', () => {
    expect(joinPaths('/messenger', ':id', '/edit')).toBe('/messenger/:id/edit');
    expect(joinPaths('', '/')).toBe('/');
  });
});

describe('matchPath', () => {
  it('сравнивает статические сегменты без учёта регистра', () => {
    expect(matchPath('/sign-up', '/SIGN-UP')).toEqual({ params: {} });
    expect(matchPath('/sign-up', '/sign-in')).toBeNull();
  });

  it('достаёт параметры и отклоняет путь другой длины', () => {
    expect(matchPath('/messenger/:id', '/messenger/12')).toEqual({ params: { id: '12' } });
    expect(matchPath('/messenger/:id', '/messenger/a%20b')).toEqual({ params: { id: 'a b' } });
    expect(matchPath('/messenger/:id', '/messenger/12/edit')).toBeNull();
  });
});

describe('rankPath', () => {
  it('ставит статический сегмент выше параметра', () => {
    expect(rankPath('/messenger/:id/edit')).toBeGreaterThan(rankPath('/messenger/:id'));
  });
});
