import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './LoginPage.css';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const { user } = useAuth();
    console.log('Current user:', user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const result = await login({ username, password });
        if (!result.success) {
            setError(result.message);
        }
        // Перенаправление происходит внутри AuthContext
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Вход в систему</h2>
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">Войти</button>
                </form>
                <div className="register-link">
                    Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;