import HTTPTransport from '@/core/Http/HttpTransport';

import { host } from '../constants/api.constant';
import type {
  EditPasswordRequest,
  EditProfileRequest,
  EditProfileResponse,
} from '../models/api/user.type';

export default class UserApi {
  public url = `${host}user/`;

  private _http = new HTTPTransport();

  public editProfile(request: EditProfileRequest) {
    this._http.put<EditProfileRequest, EditProfileResponse>({
      url: this.url + 'profile',
      options: {
        credentials: 'include',
        mode: 'cors',
        data: request,
      },
    });
  }

  public editPassword(request: EditPasswordRequest) {
    this._http.put<EditPasswordRequest>({
      url: this.url + 'password',
      options: {
        credentials: 'include',
        mode: 'cors',
        data: request,
      },
    });
  }
}
