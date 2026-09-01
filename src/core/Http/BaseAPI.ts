export class BaseAPI {
  create() {
    throw new Error('Create Not implemented');
  }

  request() {
    throw new Error('Request Not implemented');
  }

  update() {
    throw new Error('Update Not implemented');
  }

  delete() {
    throw new Error('Delete Not implemented');
  }
}

// import HTTPTransport from 'modules/httpTransport';
// import { BaseAPI } from 'modules/http/base-api';

// const chatAPIInstance = new HTTPTransport('api/v1/chats');

// class ChatAPI extends BaseAPI {
//     create() {
//         // Здесь уже не нужно писать полный путь /api/v1/chats/
//         return chatAPIInstance.post('/', {title: 'string'});
//     }

//     request() {
//         // Здесь уже не нужно писать полный путь /api/v1/chats/
//         return chatAPIInstance.get('/full');
//     }
// }
