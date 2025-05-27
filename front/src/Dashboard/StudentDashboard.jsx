import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';



const HomePage = () => {
    const { user, logout } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка данных с бекенда
    useEffect(() => {
        const fetchHomeworks = async () => {
            try {
                // Здесь должен быть реальный запрос к вашему API
                // const response = await fetch('/api/homeworks');
                // const data = await response.json();

                // Временные мок данные для демонстрации
                const mockData = [
                    {
                        id: 1,
                        mentorId: 101,
                        studentId: 201,
                        task: 'https://example.com/task1.jpg',
                        createdAt: '2023-05-15T10:30:00Z'
                    },
                    {
                        id: 2,
                        mentorId: 102,
                        studentId: 202,
                        task: 'https://example.com/task2.jpg',
                        createdAt: '2023-05-16T14:45:00Z'
                    },
                    {
                        id: 3,
                        mentorId: 101,
                        studentId: 203,
                        task: 'https://example.com/task3.jpg',
                        createdAt: '2023-05-17T09:15:00Z'
                    }
                ];

                setHomeworks(mockData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHomeworks();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="home-page">
            <header className="header">
                <h1>Edumentor</h1>
                <div className="user-info">
                    <span>{user?.email} ({user?.role})</span>
                    <button onClick={logout} className="logout-button">Выйти</button>
                </div>
            </header>

            <main className="main-content">
                <div className="homeworks-list">
                    <h2>Homework</h2>

                    <div className="homework-cards">
                        {homeworks.map(homework => (
                            <Link to={`/homework/${homework.id}`} key={homework.id} className="homework-card-link">
                                <div className="homework-card">
                                    <div className="homework-header">
                                        <span className="homework-id">Номер: {homework.id}</span>
                                        <span className="homework-date">
                    {new Date(homework.createdAt).toLocaleString()}
                  </span>
                                    </div>

                                    <div className="homework-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Mentor ID:</span>
                                            <span className="meta-value">{homework.mentorId}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Student ID:</span>
                                            <span className="meta-value">{homework.studentId}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="footer">
                <p>© 2025 Edumentor</p>
            </footer>
        </div>
    );
};

export default HomePage;