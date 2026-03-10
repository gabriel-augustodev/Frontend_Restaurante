import { api } from './api';

export interface CriarPedidoData {
    restauranteId: string;
    enderecoEntregaId: string;
    itens: {
        produtoId: string;
        quantidade: number;
        observacoes?: string;
    }[];
    observacoes?: string;
    cupomCodigo?: string;
}

export interface PedidoResponse {
    id: string;
    status: 'AGUARDANDO_RESTAURANTE' | 'CONFIRMADO' | 'EM_PREPARO' | 'PRONTO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO';
    total: number;
    subtotal: number;
    taxaEntrega: number;
    createdAt: string;
    updatedAt: string;
    restaurante: {
        id: string;
        nome: string;
    };
    itens: {
        id: string;
        produto: {
            id: string;
            nome: string;
        };
        quantidade: number;
        precoUnitario: number;
        observacoes?: string;
    }[];
}

export const pedidoService = {
    // Criar novo pedido
    criar: async (data: CriarPedidoData): Promise<PedidoResponse> => {
        const response = await api.post<PedidoResponse>('/api/pedidos', data);
        return response.data;
    },

    // Listar pedidos do usuário
    listarMeus: async (): Promise<PedidoResponse[]> => {
        const response = await api.get<PedidoResponse[]>('/api/pedidos/meus');
        return response.data;
    },

    // Buscar pedido por ID
    buscarPorId: async (id: string): Promise<PedidoResponse> => {
        const response = await api.get<PedidoResponse>(`/api/pedidos/${id}`);
        return response.data;
    },

    // Cancelar pedido
    cancelar: async (id: string): Promise<PedidoResponse> => {
        const response = await api.patch<PedidoResponse>(`/api/pedidos/${id}/cancelar`);
        return response.data;
    }
};