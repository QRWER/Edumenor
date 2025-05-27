import axios from 'axios';
import { useAuth } from '/Auth/AuthContext';

const api = axios.create({
    baseURL: 'http://your-api-url.com/api',
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Обрабатываем 401 ошибки (не авторизован)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const { logout } = useAuth();
            logout();
        }
        return Promise.reject(error);
    }
);

export default api;