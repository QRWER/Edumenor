import { useNavigate } from 'react-router-dom';
import './AccessDeniedPage.css';

const AccessDeniedPage = () => {
    const navigate = useNavigate();

    return (
        <div className="access-denied-container">
            <div className="access-denied-card">
                <h1>🚫 403</h1>
                <h2>Доступ запрещён</h2>
                <p>У вас недостаточно прав для просмотра этой страницы</p>
                <div className="buttons">
                    <button onClick={() => navigate(-2)} className="back-btn">
                        Назад
                    </button>
                    <button onClick={() => navigate('/')} className="home-btn">
                        На главную
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDeniedPage;