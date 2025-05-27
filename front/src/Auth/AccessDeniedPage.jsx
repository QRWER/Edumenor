import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="access-denied-container">
            <h1>403 - Доступ запрещен</h1>
            <p>У вас недостаточно прав для просмотра этой страницы</p>
            <button onClick={() => navigate(-1)}>Вернуться назад</button>
            <button onClick={() => navigate('/')}>На главную</button>
        </div>
    );
};

export default AccessDeniedPage;