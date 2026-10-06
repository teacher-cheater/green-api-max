import { useState } from 'react';
import type { ApiCredentials } from './api/greenapi';
import LoginForm from './components/LoginForm/LoginForm';
import Messenger from './components/Messenger/Messenger';
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
        <Messenger
            key={creds.idInstance}
            creds={creds}
            onLogout={handleLogout}
        />
    );
}

export default App;
