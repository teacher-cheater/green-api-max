import { Activity, useEffect, useReducer, useRef, useState } from 'react';
import { sendMessage } from '../../api/greenapi';
import { parseIncomingMessage } from '../../api/parseNotification';
import { chatsReducer } from '../../state/chatsReducer';
import type { Credentials } from '../../types/chat';
import type { NotificationBody } from '../../types/greenapi';
import { formatPhone, toChatId } from '../../utils/phone';
import ChatWindow from '../ChatWindow/ChatWindow';
import { useNotifications } from '../hooks/useNotification';
import NewChatDialog from '../NewChatDialog/NewChatDialog';
import Sidebar from '../Sidebar/Sidebar';
import './Messenger.css';

interface MessengerProps {
    creds: Credentials;
    onLogout: () => void;
}

export default function Messenger({ creds, onLogout }: MessengerProps) {
    const [chats, dispatch] = useReducer(chatsReducer, {});
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const activeChat = activeKey ? chats[activeKey] : null;

    const activeKeyRef = useRef<string | null>(null);
    useEffect(() => {
        activeKeyRef.current = activeKey;
    }, [activeKey]);

    function handleNotification(body: NotificationBody) {
        const incoming = parseIncomingMessage(body);
        if (!incoming) return;
        dispatch({
            type: 'message/add',
            chat: incoming.chat,
            message: incoming.message,
            markUnread: activeKey !== incoming.chat.key,
        });
    }

    const connection = useNotifications(creds, handleNotification);

    function selectChat(key: string) {
        setActiveKey(key);
        dispatch({ type: 'chat/read', key });
    }

    function createChat(phone: string) {
        dispatch({
            type: 'chat/add',
            chat: {
                key: phone,
                phone,
                chatId: toChatId(phone),
                name: formatPhone(phone),
                unread: 0,
                messages: [],
            },
        });
        setDialogOpen(false);
        selectChat(phone);
    }

    async function handleSend(text: string) {
        if (!activeChat) return;
        const chat = activeChat;
        const tempId = `local-${Date.now()}`;

        dispatch({
            type: 'message/add',
            chat,
            message: {
                id: tempId,
                text,
                direction: 'out',
                ts: Date.now(),
                status: 'sending',
            },
            markUnread: false,
        });

        try {
            const { idMessage } = await sendMessage(creds, chat.chatId, text);
            dispatch({
                type: 'message/update',
                key: chat.key,
                id: tempId,
                patch: { id: idMessage, status: 'sent' },
            });
        } catch {
            dispatch({
                type: 'message/update',
                key: chat.key,
                id: tempId,
                patch: { status: 'error' },
            });
        }
    }

    return (
        <div className={`messenger${activeChat ? ' messenger--open' : ''}`}>
            <Sidebar
                idInstance={creds.idInstance}
                connection={connection}
                chats={chats}
                activeKey={activeKey}
                onSelect={selectChat}
                onNewChat={() => setDialogOpen(true)}
                onLogout={onLogout}
            />

            {activeChat ? (
                <ChatWindow
                    key={activeChat.key}
                    chat={activeChat}
                    onSend={handleSend}
                    onBack={() => setActiveKey(null)}
                />
            ) : (
                <main className="chat">
                    <div className="empty">Выберите чат или создайте новый</div>
                </main>
            )}
            <Activity mode={dialogOpen ? 'visible' : 'hidden'}>
                <NewChatDialog
                    onCreate={createChat}
                    onClose={() => setDialogOpen(false)}
                />
            </Activity>
        </div>
    );
}
