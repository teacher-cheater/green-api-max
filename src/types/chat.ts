export type Message = {
    id: string;
    text: string;
    ts: number;
};

export type Chat = {
    key: string;
    phone: string;
    chatId: string;
    name: string;
    messages: Message[];
    unread: number;
};

export type Chats = Record<string, Chat>;

export type Credentials = {
    idInstance: string;
    apiTokenInstance: string;
};

export type ConnectionStatus = 'connecting' | 'online' | 'offline';

export type ChatMessagePatch = Partial<Message>;

export type ChatsAction =
    | {
          type: 'chat/add';
          chat: Chat;
      }
    | {
          type: 'message/add';
          chat: Chat;
          message: Message;
          markUnread: boolean;
      }
    | {
          type: 'message/update';
          key: string;
          id: string;
          patch: ChatMessagePatch;
      }
    | {
          type: 'chat/read';
          key: string;
      };
