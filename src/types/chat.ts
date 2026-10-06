export type MessageStatus = 'sending' | 'sent' | 'error';
export type MessageDirection = 'in' | 'out';
export type ChatInfo = Pick<Chat, 'key' | 'phone' | 'chatId' | 'name'>;

export type Message = {
    id: string;
    text: string;
    ts: number;
    direction: MessageDirection;
    status?: MessageStatus;
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
          chat: ChatInfo;
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
