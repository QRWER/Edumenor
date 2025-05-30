import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, redirect} from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import './HomeworkDetailPage.css';

const MentorHomeworkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [homework, setHomework] = useState(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [solutionImage, setSolutionImage] = useState(null);
    const [showSolutionForm, setShowSolutionForm] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [solution, setSolution] = useState(null);
    const [review, setReview] = useState(null);

    useEffect(() => {
        const fetchHomework = async () => {
            try {
                const response = await fetch(`http://localhost:8080/mentor/homework/${id}`, {
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
                if (formattedHomework.idMentor != user.id) window.location.replace("http://localhost:3000/access-denied");
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
        const fetchStudent = async () => {
            if (!homework || !homework.idStudent) return;

            try {
                const response = await fetch(`http://localhost:8080/mentor/student/${homework.idStudent}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) throw new Error('Ошибка загрузки студента');

                const data = await response.json();
                setStudent(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStudent();
    }, [homework]);

    useEffect(() => {
        const fetchSolution = async () => {
            if (!homework) return;

            try {
                const responseSolution = await fetch(`http://localhost:8080/mentor/solution/${homework.id}`, {
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
                    setShowReviewForm(true);
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchSolution();
    }, [homework]);

    const fetchReview = async () => {
        if (!homework) return;

        try {
            const response = await fetch(`http://localhost:8080/mentor/review/${homework.id}`, {
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

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!reviewText.trim()) {
            setError("Введите текст отзыва");
            return;
        }

        const reviewData = {
            id: homework.id,
            text: reviewText,
        };

        try {
            const response = await fetch('http://localhost:8080/mentor/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Не удалось отправить отзыв');
            }
            await fetchReview();
            setReviewText('');
            setShowReviewForm(false);
        } catch (err) {
            setError(err.message);
            console.error('Ошибка отправки отзыва:', err);
        }
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
                        <h3>Студент</h3>
                        <div className="mentor-info">
                            <div className="mentor-avatar">
                                {student?.fullName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="mentor-name">{student?.fullName}</p>
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
                    <div className="task-image-container">
                        <h2>Задание</h2>
                        <img
                            src={`data:image/jpeg;base64,${homework.task}`}
                            alt={`Домашнее задание ${homework.id}`}
                            className="task-image"
                        />
                    </div>

                    {solution && (
                        <div className="solution-container">
                            <h2>Решение студента</h2>
                            <img
                                src={`data:image/jpeg;base64,${solution.photo}`}
                                alt="Решение"
                                className="task-image"
                            />
                        </div>
                    )}

                    {!review && solution && (
                        <div className="review-form">
                            <h3>Напишите ваш отзыв</h3>
                            <form onSubmit={handleReviewSubmit}>
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Введите ваш отзыв..."
                required
                className="review-textarea"
            />
                                <button type="submit" className="submit-btn">
                                    Отправить отзыв
                                </button>
                            </form>
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

export default MentorHomeworkDetailPage;