import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const HomeRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === 'ROLE_MENTOR') {
        return <Navigate to="/mentor" replace />;
    }

    if (user.role === 'ROLE_STUDENT') {
        return <Navigate to="/student" replace />;
    }

    return <Navigate to="/login" replace />;
};

export default HomeRedirect;