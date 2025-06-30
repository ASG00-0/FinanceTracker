import axios from 'axios';

// Configure base URL for your .NET API
const API_BASE_URL = 'https://localhost:7120/api'; // Adjust port as needed

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authApi = {
    register: async (userData: { email: string; password: string }) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials: { email: string; password: string }) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },
};

// Add other API endpoints as needed
export const financeApi = {
    // Add your finance tracker endpoints here
    // getTransactions: async () => { ... },
    // createTransaction: async (data) => { ... },
};

export default apiClient;