import axios from './axiosInstance';

export const register = async (userData) => {
    const response = await axios.post('/auth/register', userData);
    return response.data;
};

export const login = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
};

export const logout = async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
};

export const recoverPassword = async (email) => {
    const response = await axios.post('/auth/recover-password', { email });
    return response.data;
};

export const checkAuth = async () => {
    const response = await axios.get('/auth/check-auth');
    return response.data;
}
