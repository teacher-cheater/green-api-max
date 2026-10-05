import { Activity, useReducer, useState } from 'react';
import { chatsReducer } from '../state/chatsReducer';
import type { Credentials } from '../types/chat';
import { formatPhone, toChatId } from '../utils/phone';
import NewChatDialog from './NewChatDialog';
import Sidebar from './Sidebar';

interface MessengerProps {
    creds: Credentials;
    onLogout: () => void;
}

export default function Messenger({ creds, onLogout }: MessengerProps) {
    const [chats, dispatch] = useReducer(chatsReducer, {});
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean | null>(false);

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

            <main className="chat">
                <div className="empty">
                    {activeChat
                        ? `Чат с ${activeChat.name}`
                        : 'Выберите чат или создайте новый'}
                </div>
            </main>
            <Activity mode={dialogOpen ? 'visible' : 'hidden'}>
                <NewChatDialog
                    onCreate={createChat}
                    onClose={() => setDialogOpen(false)}
                />
            </Activity>
        </div>
    );
}
