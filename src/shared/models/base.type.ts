export type User = {
  firstName: string;
  secondName: string;
  displayName: string;
  login: string;
  email: string;
  phone: string;
};

export type ChatItem = {
  avatar: string;
  name: string;
  message: string;
  count: number;
  date: string;
  myMessage?: boolean;
};

export type Chat = {
  chatId: number;
  companion: Companion;
  messages: Message[];
};

export type Companion = {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
};

export type Message = {
  id: number;
  reading?: boolean;
  senderId: number;
  message: { type: 'text' | 'image'; value: string };
  timestamp: string;
};
