import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Функция верификации токена
    const verifyToken = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            // В реальном приложении: запрос к API для проверки токена
            // const response = await fetch('/api/auth/verify', {
            //   headers: { Authorization: `Bearer ${token}` }
            // });
            // const data = await response.json();

            // Моковая проверка
            const decoded = parseJwt(token);
            if (decoded && decoded.exp * 1000 > Date.now()) {
                setUser({
                    username: decoded.username,
                    role: decoded.role
                });
            } else {
                logout();
            }
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    }, []);

    // Проверяем токен при загрузке и при изменении
    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    const parseJwt = (token) => {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch {
            return null;
        }
    };

    const login = async ({ username, password }) => {
        try {
            // Моковая авторизация - в реальном приложении замените на API-запрос
            let mockUser;
            if (username === 'mentor' && password === 'mentor123') {
                mockUser = { username: 'mentor', role: 'MENTOR' };
            } else if (username === 'student' && password === 'student123') {
                mockUser = { username: 'student', role: 'STUDENT' };
            } else {
                throw new Error('Неверный логин или пароль');
            }

            const mockToken = generateMockToken(mockUser);
            localStorage.setItem('token', mockToken);
            await verifyToken(); // Явно вызываем верификацию
            navigate(mockUser.role === 'MENTOR' ? '/mentor' : '/student');

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    // Генерация мокового токена с expire time (7 дней)
    const generateMockToken = (user) => {
        const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
        const payload = btoa(JSON.stringify({
            ...user,
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 дней
        }));
        return `${header}.${payload}.mock_signature`;
    };

    const checkAccess = useCallback((requiredRole) => {
        if (!user) return false;
        if (!requiredRole) return true;
        return user.role === requiredRole;
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAccess }}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);