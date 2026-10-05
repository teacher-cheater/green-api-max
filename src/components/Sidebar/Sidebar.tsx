import type { Chat, Chats, ConnectionStatus } from '../../types/chat';
import { formatPhone } from '../../utils/phone';
import './Sidebar.css';

interface SidebarProps {
    idInstance: string;
    connection?: ConnectionStatus;
    chats: Chats;
    activeKey: string | null;
    onSelect: (key: string) => void;
    onNewChat: () => void;
    onLogout: () => void;
}

const lastMessage = (chat: Chat) => chat.messages[chat.messages.length - 1];

const CONNECTION = {
    connecting: 'подключение…',
    online: 'на связи',
    offline: 'нет связи',
};

export default function Sidebar({
    idInstance,
    chats,
    activeKey,
    onSelect,
    onNewChat,
    onLogout,
}: SidebarProps) {
    const sorted = Object.values(chats).sort(
        (a, b) => (lastMessage(b)?.ts ?? 0) - (lastMessage(a)?.ts ?? 0),
    );

    return (
        <aside className="sidebar">
            <header className="sidebar__head">
                <div>
                    <h1 className="sidebar__title">Чаты</h1>
                    <p className="sidebar__sub">
                        Инстанс {idInstance} · {'Статус Неизвестно'}
                    </p>
                </div>
                <div>
                    <button
                        className="btn btn--icon"
                        onClick={onNewChat}
                        aria-label="Новый чат"
                        title="Новый чат"
                    >
                        +
                    </button>
                </div>
            </header>

            {sorted.length === 0 ? (
                <p className="empty empty--list">
                    Чатов пока нет. Нажмите «+», чтобы написать по номеру
                    телефона.
                </p>
            ) : (
                <ul className="chat-list">
                    {sorted.map(chat => {
                        const last = lastMessage(chat);
                        return (
                            <li key={chat.key}>
                                <button
                                    className="chat-item"
                                    aria-current={chat.key === activeKey}
                                    onClick={() => onSelect(chat.key)}
                                >
                                    <span className="avatar">
                                        {(chat.name || '?')
                                            .replace('+', '')
                                            .charAt(0)}
                                    </span>
                                    <div className="chat-item__body">
                                        <span className="chat-item__name">
                                            {chat.name ||
                                                formatPhone(chat.phone)}
                                        </span>
                                        <span className="chat-item__preview">
                                            {last ? last.text : 'Нет сообщений'}
                                        </span>
                                    </div>
                                    {chat.unread > 0 && (
                                        <span className="badge">
                                            {chat.unread}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            <footer className="sidebar__head">
                <button className="btn btn--ghost" onClick={onLogout}>
                    Выйти
                </button>
            </footer>
        </aside>
    );
}
