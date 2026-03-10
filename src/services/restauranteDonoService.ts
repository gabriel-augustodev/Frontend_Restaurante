import { api } from './api';

export interface PedidoRestaurante {
    id: string;
    status: 'AGUARDANDO_RESTAURANTE' | 'CONFIRMADO' | 'EM_PREPARO' | 'PRONTO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO';
    total: number;
    subtotal: number;
    taxaEntrega: number;
    createdAt: string;
    updatedAt: string;
    cliente: {
        id: string;
        nome: string;
        telefone: string;
    };
    enderecoEntrega: {
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
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

export const restauranteDonoService = {
    // Listar pedidos do restaurante
    listarPedidos: async (restauranteId: string): Promise<PedidoRestaurante[]> => {
        const response = await api.get(`/api/pedidos/restaurante/${restauranteId}`);
        return response.data;
    },

    // Atualizar status do pedido
    atualizarStatus: async (
        restauranteId: string,
        pedidoId: string,
        status: string
    ): Promise<PedidoRestaurante> => {
        const response = await api.patch(
            `/api/pedidos/${pedidoId}/restaurante/${restauranteId}/status`,
            { status }
        );
        return response.data;
    },

    // Buscar detalhes do restaurante
    buscarRestaurante: async (restauranteId: string) => {
        const response = await api.get(`/api/restaurantes/publicos/${restauranteId}`);
        return response.data;
    },

    // Buscar restaurantes do usuário logado
    buscarMeusRestaurantes: async () => {
        const response = await api.get('/api/restaurantes/meus');
        return response.data;
    }
};