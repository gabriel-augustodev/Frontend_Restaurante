import { api } from './api';
import type { Restaurante, Produto } from './api'; // ← Use 'import type'

export const restauranteService = {
    // Listar todos os restaurantes
    listar: async () => {
        const response = await api.get<Restaurante[]>('/api/restaurantes/publicos');
        return response.data;
    },

    // Buscar restaurante por ID
    buscarPorId: async (id: string) => {
        const response = await api.get<Restaurante>(`/api/restaurantes/publicos/${id}`);
        return response.data;
    },

    // Listar produtos de um restaurante
    listarProdutos: async (restauranteId: string) => {
        const response = await api.get<Produto[]>(`/api/restaurantes/${restauranteId}/produtos`);
        return response.data;
    },
};