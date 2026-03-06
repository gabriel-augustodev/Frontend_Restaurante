import { api } from './api';

export interface Endereco {
    id: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    isPrincipal: boolean;
}

export const enderecoService = {
    // Listar endereços do usuário
    listar: async (): Promise<Endereco[]> => {
        const response = await api.get<Endereco[]>('/api/enderecos');
        return response.data;
    },

    // Criar novo endereço
    criar: async (data: Omit<Endereco, 'id' | 'isPrincipal'> & { isPrincipal?: boolean }) => {
        const response = await api.post<Endereco>('/api/enderecos', data);
        return response.data;
    },

    // Atualizar endereço
    atualizar: async (id: string, data: Partial<Endereco>) => {
        const response = await api.put<Endereco>(`/api/enderecos/${id}`, data);
        return response.data;
    },

    // Deletar endereço
    deletar: async (id: string) => {
        await api.delete(`/api/enderecos/${id}`);
    },

    // Definir como principal
    definirPrincipal: async (id: string) => {
        const response = await api.patch<Endereco>(`/api/enderecos/${id}/principal`);
        return response.data;
    }
};