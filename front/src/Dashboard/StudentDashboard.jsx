import React, { useState, useEffect } from 'react';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';



const HomePage = () => {
    const { user, logout } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [profile, setProfile] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка данных с бекенда
    useEffect(() => {
        const fetchHomeworks = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/homework`, {
                    method: 'GET',
                    credentials: 'include' // <-- очень важно!
                });
                if (!response.ok) throw new Error('Ошибка загрузки заданий');

                const data = await response.json();
                const formattedHomework = data.map(homework => ({
                    id: homework.id,
                    idMentor: homework.idMentor,
                    idStudent: homework.idStudent,
                    task: homework.task,
                    timeCreate: homework.timeCreate
                }));
                setHomeworks(formattedHomework);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/profile`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Ошибка загрузки профиля');
                }

                const data = await response.json();

                setProfile(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка при загрузке профиля:', err.message);
                setLoading(false);
            }
        };

        const fetchMentors = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/mentors`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Ошибка загрузки заданий');

                const data = await response.json();
                const formattedMentors = data.map(mentor => ({
                    id: mentor.id,
                    fullName: mentor.fullName,
                    subject: mentor.subject,
                    education: mentor.education
                }));
                setMentors(formattedMentors);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHomeworks();
        fetchMentors();
        fetchProfile()
    }, []);

    useEffect(() => {
        console.log(mentors);
    }, [mentors]);

    useEffect(() => {
        console.log(profile)
    }, [profile]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="home-page">
            <header className="header">
                <h1>Edumentor</h1>
                <div className="user-info">
                    <span>{profile.fullName} ({user?.role})</span>
                    <button onClick={logout} className="logout-button">Выйти</button>
                </div>
            </header>

            <main className="main-content">
                <div className="homeworks-list">{homeworks.length>0 ?
                    <h2>Домашнее задание</h2>
                    :
                    <h2>Домашнего задания пока нет</h2>
                }
                    <div className="homework-cards">
                        {homeworks.map(homework => (
                            <Link to={`homework/${homework.id}`} key={homework.id} className="homework-card-link">
                                <div className="homework-card">
                                    <div className="homework-header">
                                        <span className="homework-id">Номер: {homework.id}</span>
                                        <span className="homework-date">
                    {new Date(homework.timeCreate).toLocaleString()}
                  </span>
                                    </div>

                                    <div className="homework-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Ментор:</span>
                                            <span className="meta-value">
                                                    {mentors.find(s => s.id === homework.idMentor)?.fullName || 'Неизвестный ментор'}
                                                </span>
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