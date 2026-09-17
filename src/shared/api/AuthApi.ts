import HTTPTransport from '@/core/Http/HttpTransport';

import { host } from '../constants/api.constant';
import type {
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
  UserResponse,
} from '../models/api/auth.type';

export default class AuthApi {
  public url = `${host}auth/`;

  private _http = new HTTPTransport();

  public signIn(request: SignInRequest) {
    return this._http.post<SignInRequest>({
      url: this.url + 'signin',
      options: {
        credentials: 'include',
        mode: 'cors',
        data: request,
      },
    });
  }

  public signUp(request: SignUpRequest) {
    return this._http.post<SignUpRequest, SignUpResponse>({
      url: this.url + 'signup',
      options: {
        credentials: 'include',
        mode: 'cors',
        data: request,
      },
    });
  }

  public logout() {
    return this._http.post({
      url: this.url + 'logout',
      options: {
        credentials: 'include',
        mode: 'cors',
      },
    });
  }

  public user() {
    return this._http.get<unknown, UserResponse>({
      url: this.url + 'user',
      options: {
        credentials: 'include',
        mode: 'cors',
      },
    });
  }
}
