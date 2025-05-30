import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        role: 'ROLE_STUDENT',
        school: '',
        subject: '',
        education: ''
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Логин обязателен';
        if (!formData.password) newErrors.password = 'Пароль обязателен';
        if (!formData.fullname) newErrors.fullname = 'ФИО обязательно';
        if (!formData.role) newErrors.role = 'Роль обязательна';

        if (formData.role === 'Student' && !formData.school) {
            newErrors.school = 'Школа обязательна';
        }

        if (formData.role === 'Mentor') {
            if (!formData.subject) newErrors.subject = 'Предмет обязателен';
            if (!formData.education) newErrors.education = 'Образование обязательно';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors('')
        if (!validate()) return;

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const newErrors = {};
                newErrors.username = 'Такой логин уже существует'
                setErrors(newErrors);
                return;
            }

            navigate('/login');

        } catch (error) {
            const newErrors = {};
            newErrors.username = 'Такой логин уже существует'
            setErrors(newErrors);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Создать Аккаунт</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Логин*</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                        />
                        {errors.username && (
                            <span className="error-message">{errors.username}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Пароль*</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label>ФИО*</label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleChange}
                            className={errors.fullname ? 'error' : ''}
                        />
                        {errors.fullname && <span className="error-message">{errors.fullname}</span>}
                    </div>

                    <div className="form-group">
                        <label>Роль*</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className={errors.role ? 'error' : ''}
                        >
                            <option value="ROLE_STUDENT">Student</option>
                            <option value="ROLE_MENTOR">Mentor</option>
                        </select>
                        {errors.role && <span className="error-message">{errors.role}</span>}
                    </div>

                    {formData.role === 'ROLE_STUDENT' && (
                        <div className="form-group">
                            <label>Школа*</label>
                            <input
                                type="text"
                                name="school"
                                value={formData.school}
                                onChange={handleChange}
                                className={errors.school ? 'error' : ''}
                            />
                            {errors.school && <span className="error-message">{errors.school}</span>}
                        </div>
                    )}

                    {formData.role === 'ROLE_MENTOR' && (
                        <>
                            <div className="form-group">
                                <label>Предмет*</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={errors.subject ? 'error' : ''}
                                />
                                {errors.subject && <span className="error-message">{errors.subject}</span>}
                            </div>

                            <div className="form-group">
                                <label>Образование*</label>
                                <input
                                    type="text"
                                    name="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className={errors.education ? 'error' : ''}
                                />
                                {errors.education && <span className="error-message">{errors.education}</span>}
                            </div>
                        </>
                    )}

                    <button type="submit" className="register-button">Зарегестрироваться</button>
                </form>

                <div className="login-link">
                    Уже есть аккаунт? <a href="/login">Войти</a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;