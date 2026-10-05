import { useState } from 'react';
import type { ApiCredentials } from './api/greenapi';
import LoginForm from './components/LoginForm';
import Messanger from './components/Messenger/Messanger';
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
        <Messanger
            key={creds.idInstance}
            creds={creds}
            onLogout={handleLogout}
        />
    );
}

export default App;
