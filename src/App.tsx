import { useState } from 'react';
import LoginForm from './components/LoginForm';
import type { ApiCredentials } from './api/greenapi';

function App() {
    const [creds, setCreds] = useState<ApiCredentials | null>(null);

    function handleLogin(next: ApiCredentials) {
        setCreds(next);
    }

    function handleLogout() {
        setCreds(null);
    }

    if (!creds) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return (
        <div className="auth">
            <div className="auth__card">
                <h1>Инстанс {creds.idInstance}</h1>
                <p>Вход выполнен</p>
                <button className="btn" onClick={handleLogout}>
                    Выйти
                </button>
            </div>
        </div>
    );
}

export default App;
