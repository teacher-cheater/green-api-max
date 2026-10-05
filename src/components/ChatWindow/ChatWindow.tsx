import { useEffect, useRef, useState } from 'react';
import type { Chat } from '../../types/chat';
import './ChatWindow.css';

interface ChatWindowProps {
    chat: Chat;
    onSend: (text: string) => void;
    onBack: () => void;
}

interface statusLabel {
    direction: 'in' | 'out';
    status?: 'sending' | 'sent' | 'error';
}

const MAX_LENGTH = 4000;

const time = (ts: number) =>
    new Date(ts).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

function statusLabel(message: statusLabel) {
    if (message.direction !== 'out') return '';
    if (message.status === 'sending') return ' · отправка…';
    if (message.status === 'error') return ' · не отправлено';
    return '';
}

export default function ChatWindow({ chat, onSend, onBack }: ChatWindowProps) {
    const [text, setText] = useState('');
    const endRef = useRef<null | HTMLInputElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'end' });
    }, [chat.key, chat.messages.length]);

    function submit() {
        const value = text.trim();
        if (!value) return;
        onSend(value);
        setText('');
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
        }
    }

    return (
        <main className="chat">
            <header className="chat__head">
                <button
                    className="btn btn--ghost btn--icon chat__back"
                    onClick={onBack}
                    aria-label="Назад к чатам"
                >
                    ←
                </button>
                <span className="avatar avatar--sm">
                    {(chat.name || '?').replace('+', '').charAt(0)}
                </span>
                <span className="chat__name">{chat.name}</span>
            </header>

            <div className="messages" aria-live="polite">
                {chat.messages.length === 0 && (
                    <p className="empty">Напишите первое сообщение</p>
                )}
                {chat.messages.map(m => (
                    <div
                        key={m.id}
                        className={`bubble bubble--${m.direction}${m.status === 'error' ? ' bubble--error' : ''}`}
                    >
                        {m.text}
                        <span className="bubble__meta">
                            {time(m.ts)}
                            {statusLabel(m)}
                        </span>
                    </div>
                ))}
                <div ref={endRef} />
            </div>

            <div className="composer">
                <textarea
                    rows={1}
                    value={text}
                    maxLength={MAX_LENGTH}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Сообщение"
                    aria-label="Сообщение"
                />
                <button
                    className="btn btn--icon"
                    onClick={submit}
                    disabled={!text.trim()}
                    aria-label="Отправить"
                >
                    ➤
                </button>
            </div>
        </main>
    );
}
