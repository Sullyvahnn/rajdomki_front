import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: false,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    if (!config.headers) config.headers = {} as import('axios').AxiosRequestHeaders;
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    // console.log('✅ Dodano token:', (config.headers as Record<string, string>)['Authorization']);
  } else {
    // console.warn('⚠️ Brak tokena w localStorage');
  }
  return config;
});

export default api;
