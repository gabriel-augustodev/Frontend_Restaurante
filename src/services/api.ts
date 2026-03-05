import axios from 'axios';

// URL da sua API no Render
export const BASE_URL = 'https://api-restaurante-mf6j.onrender.com';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@GourmetDash:token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Tipos
export interface Restaurante {
    id: string;
    nome: string;
    descricao: string;
    imagemUrl: string;
    taxaEntrega: number;
    tempoMedioEntrega: number;
    endereco: {
        cidade: string;
        bairro: string;
    };
}

export interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl: string | null;
    categoria: {
        id: string;
        nome: string;
    };
}

export interface Pedido {
    id: string;
    status: string;
    total: number;
    createdAt: string;
    restaurante: {
        id: string;
        nome: string;
    };
}