import { Activity, useReducer, useState } from 'react';
import { sendMessage } from '../../api/greenapi';
import { chatsReducer } from '../../state/chatsReducer';
import type { Credentials } from '../../types/chat';
import { formatPhone, toChatId } from '../../utils/phone';
import ChatWindow from '../ChatWindow/ChatWindow';
import NewChatDialog from '../NewChatDialog';
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
