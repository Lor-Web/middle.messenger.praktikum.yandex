import type ChatView from '../view/ChatView';

export default class ChatController {
  constructor(private view: ChatView) {}

  init(): void {
    const chatId = this.view.getChatId();

    if (!chatId) {
      return;
    }

    // Подключение вебсокета к чату будет здесь.
  }

  destroy(): void {
    // Закрытие вебсокета будет здесь.
  }
}
