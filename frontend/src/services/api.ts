import axios from 'axios';

const apiHost = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
const defaultBaseURL = apiHost && apiHost !== ''
    ? apiHost.endsWith('/api')
        ? apiHost
        : `${apiHost}/api`
    : '/api';

const api = axios.create({
    baseURL: defaultBaseURL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
