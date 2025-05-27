import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './HomeworkDetailPage.css';

const HomeworkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [homework, setHomework] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [solutionImage, setSolutionImage] = useState(null);
    const [showSolutionForm, setShowSolutionForm] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Моковые данные преподавателей
    const mentors = {
        101: { id: 101, name: 'Иванова Анна Петровна', subject: 'Математика' },
        102: { id: 102, name: 'Сидоров Михаил Васильевич', subject: 'Физика' },
        103: { id: 103, name: 'Петрова Елена Сергеевна', subject: 'Информатика' }
    };

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                // Моковые данные для демонстрации
                const mockHomework = {
                    id: id,
                    mentorId: 101,
                    studentId: 201,
                    task: 'https://example.com/task1.jpg',
                    description: 'Решите задачи по теме "Дифференциальные уравнения"',
                    createdAt: '2023-05-15T10:30:00Z',
                    status: 'На проверке',
                    solution: 'https://example.com/solution1.jpg'
                };

                setHomework({
                    ...mockHomework,
                    mentor: mentors[mockHomework.mentorId]
                });
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchHomework();
    }, [id]);

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
                                {homework.mentor.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="mentor-name">{homework.mentor.name}</p>
                                <p className="mentor-subject">{homework.mentor.subject}</p>
                            </div>
                        </div>
                    </div>

                    <div className="meta-card">
                        <h3>Информация о задании</h3>
                        <p><strong>Дата создания:</strong> {formatDate(homework.createdAt)}</p>
                        <p>
                            <strong>Статус:</strong>
                            <span className={`status-badge ${homework.status.toLowerCase().replace(' ', '-')}`}>
                {homework.status}
              </span>
                        </p>
                    </div>
                </div>

                <div className="homework-main">
                    <div className="description-card">
                        <h2>Описание задания</h2>
                        <p>{homework.description}</p>
                    </div>

                    <div className="task-image-container">
                        <h2>Задание</h2>
                        <img
                            src={homework.task}
                            alt={`Домашнее задание ${homework.id}`}
                            className="task-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/800x600?text=Task+Image';
                            }}
                        />
                    </div>

                    {homework.solution && (
                        <div className="solution-container">
                            <h2>Решение студента</h2>
                            <img
                                src={homework.solution}
                                alt={`Решение задания ${homework.id}`}
                                className="solution-image"
                            />

                            {isMentor && !homework.review && (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="add-review-btn"
                                >
                                    Оценить
                                </button>
                            )}
                        </div>
                    )}

                    {showReviewForm && (
                        <div className="review-form">
                            <h3>Ваш отзыв</h3>
                            <form onSubmit={handleReviewSubmit}>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Введите ваш отзыв..."
                    required
                />
                                <button type="submit" className="submit-btn">
                                    Отправить
                                </button>
                            </form>
                        </div>
                    )}

                    {homework.review && (
                        <div className="review-container">
                            <h3>Отзыв преподавателя</h3>
                            <p>{homework.review}</p>
                            <p className="status-completed">Статус: Выполнено</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HomeworkDetailPage;