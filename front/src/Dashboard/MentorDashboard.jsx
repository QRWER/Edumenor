import React, { useState, useEffect } from 'react';
import './MentorDashboard.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const HomePage = () => {
    const { user, logout } = useAuth();
    const [homeworks, setHomeworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [students, setStudents] = useState([
        { id: 201, name: 'Иван Петров' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 203, name: 'Алексей Иванов' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
        { id: 202, name: 'Мария Сидорова' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        studentId: '',
        taskImage: null,
        description: '',
        studentSearch: ''
    });

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
                        studentName: 'Иван Петров',
                        task: 'https://example.com/task1.jpg',
                        createdAt: '2023-05-15T10:30:00Z'
                    },
                    {
                        id: 2,
                        mentorId: 102,
                        studentId: 202,
                        studentName: 'Мария Сидорова',
                        task: 'https://example.com/task2.jpg',
                        createdAt: '2023-05-16T14:45:00Z'
                    },
                    {
                        id: 3,
                        mentorId: 101,
                        studentId: 203,
                        studentName: 'Алексей Иванов',
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Если это поле поиска, обновляем поисковый термин
        if (name === 'studentSearch') {
            setSearchTerm(value);
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, taskImage: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Здесь будет отправка на бекенд
        console.log('Домашнее задание добавлено:', formData);

        // Моковое добавление задания в список
        const newHomework = {
            id: homeworks.length + 1,
            mentorId: user.id,
            studentId: formData.studentId,
            studentName: students.find(s => s.id == formData.studentId)?.name || 'Unknown',
            task: URL.createObjectURL(formData.taskImage),
            createdAt: new Date().toISOString()
        };

        setHomeworks([...homeworks, newHomework]);
        setShowAddForm(false);
        setFormData({
            studentId: '',
            taskImage: null,
            description: '',
            studentSearch: ''
        });
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="home-page">
            <header className="header">
                <h1>Edumentor</h1>
                <div className="header-controls">
                    {user?.role === 'MENTOR' && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="add-homework-btn"
                        >
                            + Добавить задание
                        </button>
                    )}
                    <div className="user-info">
                        <span>{user?.email} ({user?.role})</span>
                        <button onClick={logout} className="logout-button">Выйти</button>
                    </div>
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
                                            <span className="meta-label">Student:</span>
                                            <span className="meta-value">{homework.studentName}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Модальное окно добавления задания */}
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="add-homework-modal">
                        <h2>Добавить новое задание</h2>
                        <button
                            className="close-modal"
                            onClick={() => setShowAddForm(false)}
                        >
                            ×
                        </button>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Поиск студента:</label>
                                <input
                                    type="text"
                                    name="studentSearch"
                                    value={formData.studentSearch}
                                    onChange={handleInputChange}
                                    placeholder="Введите имя студента"
                                />
                            </div>

                            <div className="form-group">
                                <label>Выберите студента:</label>
                                <div className="student-search-results">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map(student => (
                                            <div
                                                key={student.id}
                                                className={`student-item ${formData.studentId == student.id ? 'selected' : ''}`}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    studentId: student.id,
                                                    studentSearch: student.name
                                                }))}
                                            >
                                                {student.name}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-results">Студенты не найдены</div>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Описание задания:</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Фото задания:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Сохранить задание
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <footer className="footer">
                <p>© 2025 Edumentor</p>
            </footer>
        </div>
    );
};

export default HomePage;