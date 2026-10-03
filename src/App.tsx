import { useState } from 'react';
import type { ApiCredentials } from './api/greenapi';
import LoginForm from './components/LoginForm';
import { clearCredentials, loadCredentials, saveCredentials } from './storage';

function App() {
    const [creds, setCreds] = useState<ApiCredentials | null>(loadCredentials);

    function handleLogin(next: ApiCredentials) {
        saveCredentials(next);
        setCreds(next);
    }

    function handleLogout() {
        clearCredentials();
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
