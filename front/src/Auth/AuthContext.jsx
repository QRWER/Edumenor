import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const verifyToken = useCallback(async () => {
        try {
            const res = await fetch('http://localhost:8080/auth/valid', {
                method: 'GET',
                credentials: 'include' // <-- очень важно!
            });

            if (!res.ok) {
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await res.json();

            console.log(data)

            setUser({
                id: data.id,
                username: data.username,
                role: data.roles[0] || null
            });
        } catch (error) {
            console.error('Ошибка верификации:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Выполняем верификацию при загрузке
    useEffect(() => {
        console.log("Я юзер:", user);
        verifyToken();
    }, [verifyToken]);

    const login = async ({ username, password }) => {

        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // <-- отправляем куки
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка входа');
        }

        const data = await response.json();

        setUser({
            id: data.id,
            username: data.username,
            role: data.roles[0]
        });

        navigate(data.roles.includes("ROLE_MENTOR") ? '/mentor' : '/student');

        return { success: true };
    };

    const logout = async () => {
        await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        setUser(null);
        navigate('/login');
    };

    // Проверка доступа
    const checkAccess = useCallback((requiredRole) => {
        if (!user) return false;
        if (!requiredRole) return true;
        return user.role === requiredRole;
    }, [user]);

    const value = {
        user,
        loading,
        login,
        logout,
        checkAccess
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);