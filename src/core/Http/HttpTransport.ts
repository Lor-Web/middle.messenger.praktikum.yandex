type RequiestOptionsData = Record<string, string | number | boolean | undefined | null>;

type RequestOptions = {
  method?: keyof typeof METHODS;
  headers?: Record<string, string>;
  data?: RequiestOptionsData;
  responseType?: XMLHttpRequestResponseType;
  timeout?: number;
};

export type Request = {
  url: string;
  options: RequestOptions;
};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

function queryStringify(data: RequiestOptionsData) {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be a non-null object');
  }

  const keys = Object.keys(data);

  if (keys.length === 0) {
    return '';
  }

  return keys.reduce((result, key, index) => {
    if (data[key] === undefined || data[key] === null) {
      return result;
    }

    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(data[key]);

    const separator = index < keys.length - 1 ? '&' : '';

    return `${result}${encodedKey}=${encodedValue}${separator}`;
  }, '?');
}

export default class HTTPTransport {
  get = ({ url, options = {} }: Request) => {
    return this.request({ url, options: { ...options, method: METHODS.GET } });
  };

  post = ({ url, options = {} }: Request) => {
    return this.request({ url, options: { ...options, method: METHODS.POST } });
  };

  put = ({ url, options = {} }: Request) => {
    return this.request({ url, options: { ...options, method: METHODS.PUT } });
  };

  delete = ({ url, options = {} }: Request) => {
    return this.request({ url, options: { ...options, method: METHODS.DELETE } });
  };

  request = ({ url, options = {} }: Request) => {
    const { headers = {}, method, data, responseType, timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error('HTTP method is required'));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === METHODS.GET;

      xhr.open(method, isGet && data ? `${url}${queryStringify(data)}` : url);

      if (responseType) {
        xhr.responseType = responseType;
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response;

          if (xhr.responseType) {
            response = xhr.response;
          } else {
            try {
              const contentType = xhr.getResponseHeader('Content-Type');
              if (contentType && contentType.includes('application/json')) {
                response = JSON.parse(xhr.responseText);
              } else {
                response = xhr.responseText;
              }
            } catch (_e) {
              response = xhr.responseText;
            }
          }

          resolve(response);
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            request: xhr,
          });
        }
      };

      xhr.onabort = () =>
        reject({
          reason: 'Request aborted',
          request: xhr,
        });

      xhr.onerror = () =>
        reject({
          reason: 'Network error',
          request: xhr,
        });

      xhr.timeout = timeout;

      xhr.ontimeout = () =>
        reject({
          reason: 'Request timeout',
          timeout: timeout,
          request: xhr,
        });

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else if (typeof data === 'object') {
        if (!headers['Content-Type']) {
          xhr.setRequestHeader('Content-Type', 'application/json');
        }
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data);
      }
    });
  };
}
