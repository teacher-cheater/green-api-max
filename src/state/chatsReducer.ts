import type { Chats, ChatsAction } from '../types/chat';

export function chatsReducer(state: Chats, action: ChatsAction): Chats {
    switch (action.type) {
        case 'chat/add': {
            const { chat } = action;

            if (state[chat.key]) return state;

            return {
                ...state,
                [chat.key]: { ...chat, unread: 0, messages: [] },
            };
        }

        case 'message/add': {
            const { chat, message, markUnread } = action;
            const current = state[chat.key] ?? {
                ...chat,
                unread: 0,
                messages: [],
            };

            if (current.messages.some(m => m.id === message.id)) return state;

            return {
                ...state,
                [chat.key]: {
                    ...current,
                    name: chat.name || current.name,
                    unread: current.unread + (markUnread ? 1 : 0),
                    messages: [...current.messages, message],
                },
            };
        }

        case 'message/update': {
            const { key, id, patch } = action;
            const current = state[key];
            if (!current) return state;
            return {
                ...state,
                [key]: {
                    ...current,
                    messages: current.messages.map(m =>
                        m.id === id ? { ...m, ...patch } : m,
                    ),
                },
            };
        }

        case 'chat/read': {
            const current = state[action.key];
            if (!current || current.unread === 0) return state;
            return { ...state, [action.key]: { ...current, unread: 0 } };
        }

        default:
            return state;
    }
}
