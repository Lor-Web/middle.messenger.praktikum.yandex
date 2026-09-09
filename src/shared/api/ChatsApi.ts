import HTTPTransport from '@/core/Http/HttpTransport';

import { host } from '../constants/api.constant';
import type { ChatsRequest, ChatsResponse, CreateChatRequest } from '../models/api/chats.type';

export default class ChatsApi {
  public url = `${host}chats/`;

  private _http = new HTTPTransport();

  public createChat(request: CreateChatRequest) {
    return this._http.post<CreateChatRequest>({
      url: this.url,
      options: {
        credentials: 'include',
        mode: 'cors',
        data: request,
      },
    });
  }

  public chats(request: ChatsRequest) {
    return this._http.get<ChatsRequest, ChatsResponse>({
      url: this.url,
      options: {
        credentials: 'include',
        mode: 'cors',
        data: request,
      },
    });
  }
}
