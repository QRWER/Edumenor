import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {AuthProvider, useAuth} from './Auth/AuthContext';
import HomeRedirect from './Dashboard/HomeRedirect';
import LoginPage from './Auth/LoginPage';
import MentorDashboard from './Dashboard/MentorDashboard';
import StudentDashboard from './Dashboard/StudentDashboard';
import AccessDeniedPage from "./Auth/AccessDeniedPage";
import RegisterPage from './Auth/RegisterPage';
import MentorHomeworkDetailPage from "./HomeworkDetails/MentorHomeworkDetailPage";
import StudentHomeworkDetailPage from "./HomeworkDetails/StudentHomeworkDetailPage";
import NotFoundPage from "./Auth/NotFoundPage";

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Проверка доступа...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Получаем роль пользователя безопасно
    const getUserRole = () => {
        if (!user) return null;

        // Если role — строка, например: "ROLE_MENTOR"
        if (typeof user.role === 'string') {
            return user.role;
        }

        if (user.roles && typeof user.role === 'object' && 'authority' in user.role) {
            return user.role.authority;
        }

        return null;
    };

    const userRole = getUserRole();

    // Проверяем доступ
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/access-denied" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/" element={<HomeRedirect />} />

                    <Route path="/mentor/*" element={
                        <PrivateRoute requiredRole="ROLE_MENTOR">
                            <MentorDashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/student/*" element={
                        <PrivateRoute requiredRole="ROLE_STUDENT">
                            <StudentDashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/mentor/homework/:id" element={
                        <PrivateRoute requiredRole="ROLE_MENTOR">
                            <MentorHomeworkDetailPage />
                        </PrivateRoute>
                        } />

                    <Route path="/student/homework/:id" element={
                        <PrivateRoute requiredRole="ROLE_STUDENT">
                            <StudentHomeworkDetailPage />
                        </PrivateRoute>
                    } />
                    <Route path="/access-denied" element={<AccessDeniedPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;