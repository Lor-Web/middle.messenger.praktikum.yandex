import { beforeEach, describe, expect, it, vi } from 'vitest';

import HTTPTransport from './HttpTransport';

type XhrHandler = (() => void) | null;

class MockXMLHttpRequest {
  static instances: MockXMLHttpRequest[] = [];

  method = '';
  url = '';
  headers: Record<string, string> = {};
  body: Document | XMLHttpRequestBodyInit | null = null;
  withCredentials = false;
  timeout = 0;
  responseType: XMLHttpRequestResponseType = '';
  status = 200;
  statusText = 'OK';
  responseText = '';
  response: unknown = null;
  responseHeaders: Record<string, string> = {};

  onload: XhrHandler = null;
  onerror: XhrHandler = null;
  ontimeout: XhrHandler = null;
  onabort: XhrHandler = null;

  constructor() {
    MockXMLHttpRequest.instances.push(this);
  }

  open(method: string, url: string) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  getResponseHeader(name: string) {
    const key = Object.keys(this.responseHeaders).find(
      (header) => header.toLowerCase() === name.toLowerCase(),
    );

    return key ? this.responseHeaders[key] : null;
  }

  send(body?: Document | XMLHttpRequestBodyInit | null) {
    this.body = body ?? null;
  }
}

const lastRequest = () => {
  const request = MockXMLHttpRequest.instances.at(-1);

  if (!request) {
    throw new Error('Запрос не был создан');
  }

  return request;
};

describe('HTTPTransport', () => {
  const http = new HTTPTransport();

  beforeEach(() => {
    MockXMLHttpRequest.instances = [];
    vi.stubGlobal('XMLHttpRequest', MockXMLHttpRequest);
  });

  it('добавляет query-строку к GET и разбирает JSON-ответ', async () => {
    const pending = http.get({
      url: '/user',
      options: { data: { empty: null, login: 'ivan petrov' } },
    });
    const request = lastRequest();

    expect(request.method).toBe('GET');
    expect(request.url).toBe('/user?login=ivan%20petrov');
    expect(request.timeout).toBe(5000);

    request.responseHeaders = { 'Content-Type': 'application/json' };
    request.responseText = '{"id":1}';
    request.onload?.();

    await expect(pending).resolves.toEqual({ id: 1 });
  });

  it('отправляет POST как JSON и включает cookie, если credentials include', async () => {
    const pending = http.post({
      url: '/auth/signin',
      options: {
        credentials: 'include',
        data: { login: 'ivan', password: 'secret' },
      },
    });
    const request = lastRequest();

    expect(request.method).toBe('POST');
    expect(request.withCredentials).toBe(true);
    expect(request.headers['Content-Type']).toBe('application/json');
    expect(request.body).toBe(JSON.stringify({ login: 'ivan', password: 'secret' }));

    request.responseText = 'ok';
    request.onload?.();

    await expect(pending).resolves.toBe('ok');
  });

  it('отправляет FormData без своего Content-Type', async () => {
    const formData = new FormData();
    formData.append('avatar', 'file');

    const pending = http.put({
      url: '/user/profile/avatar',
      options: { data: formData, timeout: 1000 },
    });
    const request = lastRequest();

    expect(request.method).toBe('PUT');
    expect(request.body).toBe(formData);
    expect(request.headers['Content-Type']).toBeUndefined();
    expect(request.timeout).toBe(1000);

    request.responseType = '';
    request.responseText = 'saved';
    request.onload?.();

    await expect(pending).resolves.toBe('saved');
  });

  it('не перезаписывает переданный Content-Type', () => {
    http.post({
      url: '/user',
      options: {
        data: { login: 'ivan' },
        headers: { 'Content-Type': 'text/plain' },
      },
    });

    expect(lastRequest().headers['Content-Type']).toBe('text/plain');
    expect(lastRequest().body).toBe(JSON.stringify({ login: 'ivan' }));
  });

  it('возвращает response как есть, если задан responseType', async () => {
    const pending = http.get({
      url: '/chats',
      options: { responseType: 'json' },
    });
    const request = lastRequest();

    expect(request.responseType).toBe('json');
    request.response = [{ id: 7 }];
    request.onload?.();

    await expect(pending).resolves.toEqual([{ id: 7 }]);
  });

  it('отклоняет ответ с reason при статусе ошибки', async () => {
    const pending = http.delete({
      url: '/chats',
      options: { data: { chatId: 1 } },
    });
    const request = lastRequest();

    expect(request.method).toBe('DELETE');
    expect(request.body).toBe(JSON.stringify({ chatId: 1 }));

    request.status = 400;
    request.statusText = 'Bad Request';
    request.responseText = '{"reason":"Chat not found"}';
    request.onload?.();

    await expect(pending).rejects.toMatchObject({
      status: 400,
      statusText: 'Bad Request',
      response: 'Chat not found',
    });
  });

  it('сообщает о сетевой ошибке, таймауте и отмене', async () => {
    const network = http.get({ url: '/user', options: {} });
    lastRequest().onerror?.();
    await expect(network).rejects.toMatchObject({ reason: 'Network error' });

    const timeout = http.get({ url: '/user', options: { timeout: 1500 } });
    lastRequest().ontimeout?.();
    await expect(timeout).rejects.toMatchObject({
      reason: 'Request timeout',
      timeout: 1500,
    });

    const aborted = http.post({ url: '/auth/logout', options: {} });
    lastRequest().onabort?.();
    await expect(aborted).rejects.toMatchObject({ reason: 'Request aborted' });
  });

  it('бросает ошибку, если query-данные не объект', async () => {
    await expect(http.get({ url: '/user', options: { data: 'ivan' as never } })).rejects.toThrow(
      'Data must be a non-null object',
    );
  });
});
