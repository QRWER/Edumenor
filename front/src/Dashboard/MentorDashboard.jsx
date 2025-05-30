    import React, { useState, useEffect } from 'react';
    import './MentorDashboard.css';
    import { Link } from 'react-router-dom';
    import {useAuth} from '../Auth/AuthContext';

    const HomePage = () => {
        const { user, logout } = useAuth();
        const [homeworks, setHomeworks] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [showAddForm, setShowAddForm] = useState(false);
        const [students, setStudents] = useState([]);
        const [mentor, setMentor] = useState([]);
        const [searchTerm, setSearchTerm] = useState('');
        const [formData, setFormData] = useState({
            studentId: '',
            taskImage: null,
            description: '',
            studentSearch: ''
        });
        const [formError, setFormError] = useState('');

        const fetchHomeworks = async () => {
            try {
                const response = await fetch(`http://localhost:8080/mentor/homework?idMentor=${user.id}`, {
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

        // Загрузка данных с бекенда
        useEffect(() => {

            const fetchProfile = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/mentor/profile`, {
                        method: 'GET',
                        credentials: 'include' // важно для HttpOnly кук
                    });

                    if (!response.ok) {
                        throw new Error('Ошибка загрузки профиля');
                    }

                    const data = await response.json(); // сервер должен вернуть объект ментора

                    setMentor(data); // <-- например, состояние useAuth()
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    console.error('Ошибка при загрузке профиля:', err.message);
                    setLoading(false);
                }
            };

            const fetchStudents = async () => {
                try {
                    const response = await fetch('http://localhost:8080/mentor/students', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    if (!response.ok) throw new Error('Ошибка загрузки студентов');

                    const data = await response.json();
                    const formattedStudents = data.map(student => ({
                        id: student.id,
                        name: student.fullName,
                        school: student.school
                    }));
                    setStudents(formattedStudents);
                    setLoading(false);
                } catch (err) {
                    setError(err.message);
                    setLoading(false);
                }
            };

            fetchHomeworks();
            fetchStudents();
            fetchProfile();
        }, []);

        useEffect(() => {
            console.log('Студенты:', students);
        }, [students]);

        useEffect(() => {
            console.log('Домашки:', homeworks);
        }, [homeworks]);

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));

            // Если это поле поиска, обfновляем поисковый термин
            if (name === 'studentSearch') {
                setSearchTerm(value);
            }
        };

        const handleFileChange = (e) => {
            setFormData(prev => ({ ...prev, taskImage: e.target.files[0] }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!formData.studentId || formData.studentId === '') {
                setFormError('Выберите студента перед отправкой');
                return;
            }

            setFormError(''); // Очистить ошибку, если всё ок

            const homeworkData = new FormData();
            homeworkData.append('idMentor', user.id);
            homeworkData.append('idStudent', formData.studentId);
            homeworkData.append('task', formData.taskImage);

            try {
                const response = await fetch('http://localhost:8080/mentor/homework', {
                    method: 'POST',
                    body: homeworkData,
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Не удалось отправить задание');
                }

                fetchHomeworks();
                const newHomework = await response.json();
                setHomeworks([...homeworks, newHomework]);
                setShowAddForm(false);
                setFormData({
                    studentId: '',
                    taskImage: null,
                    description: '',
                    studentSearch: ''
                });
            } catch (err) {
                setError(err.message);
                console.error('Ошибка при отправке задания:', err);
            }
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
                        {user?.role === 'ROLE_MENTOR' && (
                            <button
                                className="add-homework-btn"
                                onClick={() => setShowAddForm(true)} // <-- важно!
                            >
                                + Добавить задание
                            </button>
                        )}
                        <div className="user-info">
                            <span>{mentor.fullName} ({user?.role})</span>
                            <button onClick={logout} className="logout-button">Выйти</button>
                        </div>
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
                                                <span className="meta-label">Студент:</span>
                                                <span className="meta-value">
                                                    {students.find(s => s.id === homework.idStudent)?.name || 'Неизвестный студент'}
                                                </span>
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

                                {/* Сообщение об ошибке */}
                                {formError && <div className="form-error">{formError}</div>}

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