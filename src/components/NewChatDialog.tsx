import { Activity, useState } from 'react';
import { normalizePhone } from '../utils/phone';

interface NewChatDialogProps {
    onCreate: (phone: string) => void;
    onClose: () => void;
}

export default function NewChatDialog({
    onCreate,
    onClose,
}: NewChatDialogProps) {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const phone = normalizePhone(value);
        if (!phone) {
            setError('+7 999 123-45-67');
            return;
        }
        onCreate(phone);
    }

    return (
        <div
            className="dialog-backdrop"
            onMouseDown={e => e.target === e.currentTarget && onClose()}
        >
            <form
                className="dialog"
                onSubmit={handleSubmit}
                role="dialog"
                aria-modal="true"
                aria-labelledby="new-chat-title"
            >
                <h2 id="new-chat-title">Новый чат</h2>
                <label className="field">
                    <span className="field__label">Номер получателя</span>
                    <input
                        type="tel"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="+7 999 123-45-67"
                        autoFocus
                    />
                </label>
                <Activity mode={error ? 'visible' : 'hidden'}>
                    <p className="error" role="alert">
                        {error}
                    </p>
                </Activity>
                <div className="dialog__actions">
                    <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                    <button className="btn">Создать чат</button>
                </div>
            </form>
        </div>
    );
}
