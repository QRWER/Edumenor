import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css'; // можно стилизовать отдельно

const NotFoundPage = () => {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>Страница не найдена</p>
            <Link to="/">← На главную</Link>
        </div>
    );
};

export default NotFoundPage;