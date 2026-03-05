import { api } from './api';

interface LoginData {
    email: string;
    senha: string;
}

interface RegisterData {
    email: string;
    senha: string;
    nome: string;
    telefone?: string;
}

interface AuthResponse {
    user: {
        id: string;
        email: string;
        nome: string;
        role: string;
    };
    accessToken: string;
    refreshToken: string;
}

export const authService = {
    login: async (data: LoginData) => {
        const response = await api.post<AuthResponse>('/api/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    refreshToken: async (refreshToken: string) => {
        const response = await api.post<{ accessToken: string }>('/api/auth/refresh-token', {
            refreshToken,
        });
        return response.data;
    },
};