import { io, Socket } from 'socket.io-client';
import { BASE_URL } from './api';

// Tipos para os dados recebidos do WebSocket
export interface StatusAtualizadoData {
    pedidoId: string;
    status: string;
    mensagem: string;
    timestamp: string;
}

export interface NovoPedidoData {
    mensagem: string;
    pedido: {
        id: string;
        cliente?: string;
        total: number;
        itens?: number;
        createdAt: string;
    };
}

export interface PedidoProntoData {
    pedidoId: string;
    mensagem: string;
}

export interface PedidoEntregueData {
    pedidoId: string;
    mensagem: string;
}

class SocketService {
    private socket: Socket | null = null;

    connect() {
        if (!this.socket) {
            this.socket = io(BASE_URL, {
                transports: ['websocket'],
                autoConnect: true,
            });

            this.socket.on('connect', () => {
                console.log('🔌 Conectado ao WebSocket');
            });

            this.socket.on('disconnect', () => {
                console.log('🔌 Desconectado do WebSocket');
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ Erro no WebSocket:', error);
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Entrar na sala de um pedido específico
    entrarPedido(pedidoId: string) {
        if (this.socket) {
            this.socket.emit('entrar-pedido', pedidoId);
            console.log(`📋 Entrando na sala do pedido: ${pedidoId}`);
        }
    }

    // Sair da sala de um pedido
    sairPedido(pedidoId: string) {
        if (this.socket) {
            this.socket.emit('sair-pedido', pedidoId);
        }
    }

    // Entrar na sala de um restaurante
    entrarRestaurante(restauranteId: string) {
        if (this.socket) {
            this.socket.emit('entrar-restaurante', restauranteId);
            console.log(`🍽️ Restaurante ${restauranteId} ouvindo novos pedidos`);
        }
    }

    // Registrar callback para atualização de status
    onStatusAtualizado(callback: (data: StatusAtualizadoData) => void) {
        if (this.socket) {
            this.socket.on('status-atualizado', callback);
        }
    }

    // Registrar callback para novo pedido (para restaurantes)
    onNovoPedido(callback: (data: NovoPedidoData) => void) {
        if (this.socket) {
            this.socket.on('novo-pedido', callback);
        }
    }

    // Registrar callback para pedido pronto
    onPedidoPronto(callback: (data: PedidoProntoData) => void) {
        if (this.socket) {
            this.socket.on('pedido-pronto', callback);
        }
    }

    // Registrar callback para pedido entregue
    onPedidoEntregue(callback: (data: PedidoEntregueData) => void) {
        if (this.socket) {
            this.socket.on('pedido-entregue', callback);
        }
    }

    // Remover todos os listeners
    off() {
        if (this.socket) {
            this.socket.off();
        }
    }

    // Remover listener específico
    offEvent(event: string) {
        if (this.socket) {
            this.socket.off(event);
        }
    }
}

export const socketService = new SocketService();