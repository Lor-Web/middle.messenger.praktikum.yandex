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
