import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, redirect} from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './HomeworkDetailPage.css';

const StudentHomeworkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [homework, setHomework] = useState(null);
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [solutionImage, setSolutionImage] = useState(null);
    const [showSolutionForm, setShowSolutionForm] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [formError, setFormError] = useState('');
    const [solution, setSolution] = useState(null);
    const [review, setReview] = useState(null)

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const response = await fetch(`http://localhost:8080/student/homework/${id}`, {
                    method: 'GET',
                    credentials: 'include' // <-- очень важно!
                });
                if (!response.ok) window.location.replace("/*");

                const data = await response.json();
                const formattedHomework = {
                    id: data.id,
                    idMentor: data.idMentor,
                    idStudent: data.idStudent,
                    task: data.task,
                    timeCreate: data.timeCreate
                };
                if (formattedHomework.idStudent != user.id) window.location.replace("http://localhost:3000/access-denied");
                setHomework(formattedHomework);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHomework();
    }, []);

    useEffect(() => {
        const fetchMentor = async () => {
            if (!homework || !homework.idMentor) return;

            try {
                const response = await fetch(`http://localhost:8080/student/mentor/${homework.idMentor}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Ошибка загрузки студента');
                const data = await response.json();
                setMentor(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMentor();
    }, [homework]);

    const fetchReview = async () => {
        if (!homework) return;

        try {
            const response = await fetch(`http://localhost:8080/student/review/${homework.id}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Ошибка загрузки решения');
            if(response.headers.get('content-length') !== '0') {
                const data = await response.json();
                setReview(data);
                setShowReviewForm(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchReview();
    }, [homework]);

    const fetchSolution = async () => {
        if (!homework) return;

        try {
            const responseSolution = await fetch(`http://localhost:8080/student/solution/${homework.id}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!responseSolution.ok) throw new Error('Ошибка загрузки решения');
            if(responseSolution.headers.get('content-length') !== '0') {
                const data = await responseSolution.json();
                const formattedSolution = {
                    id: data.id,
                    photo: data.photo,
                    timeCreate: data.timeCreate
                };
                setSolution(formattedSolution);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchSolution();
    }, [homework]);

    // Отправка решения студента
    const handleSolutionSubmit = async (e) => {
        e.preventDefault();

        if (!solutionImage) {
            setFormError('Выберите фото перед отправкой');
            return;
        }

        const formData = new FormData();
        formData.append('id', homework.id);
        formData.append('file', solutionImage);

        try {

            const response = await fetch('http://localhost:8080/student/solution', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Не удалось отправить решение');
            }

            await fetchSolution();
            setShowSolutionForm(false);
            setSolutionImage(null);
            setFormError('');
        } catch (err) {
            console.error('Ошибка при отправке решения:', err.message);
            setFormError(err.message);
        }
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;

        // Обновляем состояние
        setHomework(prev => ({
            ...prev,
            status: 'Выполнено',
            review: reviewText
        }));

        setReviewText('');
        setShowReviewForm(false);
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    if (loading) return <div className="loading">Загрузка задания...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!homework) return <div>Задание не найдено</div>;

    const isStudent = user?.role === 'STUDENT';
    const isMentor = user?.role === 'MENTOR';
    const isCurrentStudent = isStudent && user?.id === homework.studentId;

    return (
        <div className="homework-detail-container">
            <header className="header">
                <h1>Домашнее задание #{homework.id}</h1>
                <button onClick={() => navigate(-1)} className="back-button">
                    ← Назад к списку
                </button>
            </header>

            <main className="homework-content">
                <div className="homework-meta">
                    <div className="meta-card">
                        <h3>Преподаватель</h3>
                        <div className="mentor-info">
                            <div className="mentor-avatar">
                                {mentor?.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="mentor-name">{mentor?.fullName}</p>
                                <p className="mentor-subject">{mentor?.subject}</p>
                            </div>
                        </div>
                    </div>

                    <div className="meta-card">
                        <h3>Информация о задании</h3>
                        <p><strong>Дата создания:</strong> {formatDate(homework.timeCreate)}</p>
                        <p>
                            <strong>Статус:</strong>
                            {homework && !solution && !review && (
                                <span className="status-badge" style={{backgroundColor: '#ffc107', color: 'white'}}>
                                    Ждет решения
                                </span>
                            )}
                            {homework && solution && !review && (
                                <span className="status-badge" style={{backgroundColor: '#0d6efd', color: 'white'}}>
                                    Ждет оценки
                                </span>
                            )}
                            {homework && solution && review && (
                                <span className="status-badge" style={{backgroundColor: '#28a745', color: 'white'}}>
                                    Оценено
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="homework-main">
                    <div className="solution-container">
                        <div className="solution-text"><h2>Задание</h2></div>
                        <img
                            src={`data:image/jpeg;base64,${homework.task}`}
                            alt={`Домашнее задание ${homework.id}`}
                            className="task-image"
                        />
                    </div>

                    {/* Кнопка "Добавить решение" */}
                    {!solution && (
                        <button
                            className="add-solution-btn"
                            onClick={() => setShowSolutionForm(true)}
                        >
                            Добавить решение
                        </button>
                    )}

                    {/* Модальное окно: загрузка решения */}
                    {showSolutionForm && (
                        <div className="modal-overlay">
                            <div className="solution-form-modal">
                                <h2>Загрузите ваше решение</h2>
                                <button
                                    className="close-modal"
                                    onClick={() => setShowSolutionForm(false)}
                                >
                                    ×
                                </button>

                                <form onSubmit={handleSolutionSubmit}>
                                    <div className="form-group">
                                        <label>Фото решения:</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setSolutionImage(e.target.files[0])}
                                            required
                                        />
                                    </div>

                                    {formError && (
                                        <div className="form-error-message">
                                            {formError}
                                        </div>
                                    )}

                                    <button type="submit" className="submit-btn">
                                        Отправить решение
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {solution && (

                        <div className="solution-container">
                            <div className="solution-text"><h2>Решение студента</h2></div>
                            <img
                                src={`data:image/jpeg;base64,${solution.photo}`}
                                alt={`Решение задания ${homework.id}`}
                                className="task-image"
                            />
                        </div>
                    )}

                    {review && (
                        <div className="review-container">
                            <h3>Отзыв преподавателя</h3>
                            <p>{review.text}</p>
                            <p className="status-completed">Статус: Оценено</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentHomeworkDetailPage;