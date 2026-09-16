export type Chat = {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      first_name: string;
      second_name: string;
      avatar: string;
      email: string;
      login: string;
      phone: string;
    };
    time: string;
    content: string;
  } | null;
};

export type ChatsRequest = {
  offset?: number;
  limit?: number;
  title?: string;
};
export type ChatsResponse = Chat[];

export type CreateChatRequest = { title: string };
export type CreateChatResponse = { id: number };

export type AddUserToChatRequest = { users: number[]; chatId: number };

export type GetChatUsersRequest = {
  offset?: number;
  limit?: number;
  name?: string;
  email?: string;
};
export type ChatUserResponse = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  role: string;
};

export type DeleteUsersRequest = { users: number[]; chatId: number };
