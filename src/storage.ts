import type { ApiCredentials } from './api/greenapi';

const CREDS_KEY = 'max-chat:credentials';
const chatsKey = (idInstance: string) => `max-chat:chats:${idInstance}`;

function read<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function write<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.log('Ошибка');
    }
}

export const loadCredentials = (): ApiCredentials | null =>
    read<ApiCredentials | null>(CREDS_KEY, null);

export const saveCredentials = (creds: ApiCredentials): void =>
    write(CREDS_KEY, creds);

export const clearCredentials = (): void => localStorage.removeItem(CREDS_KEY);
export const loadChats = (idInstance: string) => read(chatsKey(idInstance), {});
export const saveChats = (idInstance: string, chats: any) =>
    write(chatsKey(idInstance), chats);
