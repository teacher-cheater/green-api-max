import { useState } from 'react';
import { getStateInstance } from '../api/greenapi';

interface Credentials {
    idInstance: string;
    apiTokenInstance: string;
}

interface LoginFormProps {
    onLogin: (creds: Credentials) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
    const [idInstance, setIdInstance] = useState<string>('');
    const [apiTokenInstance, setApiTokenInstance] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const creds = {
            idInstance: idInstance.trim(),
            apiTokenInstance: apiTokenInstance.trim(),
        };

        if (!/^\d+$/.test(creds.idInstance)) {
            setError('idInstance — это число, например 1101000001');
            return;
        }
        if (!creds.apiTokenInstance) {
            setError('Введите apiTokenInstance');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { stateInstance } = (await getStateInstance(creds)) ?? {};
            if (stateInstance !== 'authorized') {
                setError(
                    `Инстанс не авторизован (статус: ${stateInstance ?? 'неизвестен'}). Авторизуйте его в личном кабинете GREEN-API.`,
                );
                return;
            }
            onLogin(creds);
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth">
            <form className="auth__card" onSubmit={handleSubmit}>
                <h1>Вход в MAX Chat</h1>
                <p>Данные инстанса из личного кабинета GREEN-API</p>

                <label className="field">
                    <span className="field__label">idInstance</span>
                    <input
                        value={idInstance}
                        onChange={e => setIdInstance(e.target.value)}
                        inputMode="numeric"
                        autoComplete="off"
                        autoFocus
                    />
                </label>

                <label className="field">
                    <span className="field__label">apiTokenInstance</span>
                    <input
                        type="password"
                        value={apiTokenInstance}
                        onChange={e => setApiTokenInstance(e.target.value)}
                        autoComplete="off"
                    />
                </label>

                {error && (
                    <p className="error" role="alert">
                        {error}
                    </p>
                )}

                <button className="btn" disabled={loading}>
                    {loading ? 'Проверяем…' : 'Войти'}
                </button>
            </form>
        </div>
    );
}
