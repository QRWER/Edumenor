import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {AuthProvider, useAuth} from './Auth/AuthContext';
import HomePage from './HomePage/HomePage';
import LoginPage from './Auth/LoginPage';
import MentorDashboard from './Dashboard/MentorDashboard';
import StudentDashboard from './Dashboard/StudentDashboard';
import AccessDeniedPage from "./Auth/AccessDeniedPage";
import RegisterPage from './Auth/RegisterPage';
import HomeworkDetailPage from "./HomeworkDetails/HomeworkDetailPage";

const PrivateRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Проверка доступа...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Показываем страницу "Доступ запрещен" вместо редиректа
        return (
            <div className="access-denied">
                <h2>Доступ запрещен</h2>
                <p>У вас нет прав для просмотра этой страницы</p>
                <button onClick={() => window.history.back()}>Назад</button>
            </div>
        );
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

                    <Route path="/" element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    } />

                    <Route path="/mentor/*" element={
                        <PrivateRoute requiredRole="MENTOR">
                            <MentorDashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/student/*" element={
                        <PrivateRoute requiredRole="STUDENT">
                            <StudentDashboard />
                        </PrivateRoute>
                    } />

                    <Route path="/homework/:id" element={<HomeworkDetailPage />} />

                    <Route path="/access-denied" element={<AccessDeniedPage />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;