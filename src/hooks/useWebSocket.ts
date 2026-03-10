import { useEffect, useState, useCallback } from 'react';
import { socketService, type StatusAtualizadoData } from '../services/socket';

export const useWebSocket = (pedidoId?: string) => {
    const [status, setStatus] = useState<string | null>(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date | null>(null);
    const [conectado, setConectado] = useState(false);

    // Função para lidar com atualização de status
    const handleStatusAtualizado = useCallback((data: StatusAtualizadoData) => {
        setStatus(data.status);
        setUltimaAtualizacao(new Date());

        // Mostrar notificação se houver mensagem
        if (data.mensagem) {
            console.log('🔔 Notificação:', data.mensagem);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        // Função assíncrona para conectar
        const conectar = async () => {
            try {
                socketService.connect();

                // Usar setTimeout para evitar o warning do ESLint
                // e garantir que a atualização do estado aconteça após o efeito
                setTimeout(() => {
                    if (mounted) {
                        setConectado(true);
                    }
                }, 0);

                if (pedidoId) {
                    socketService.entrarPedido(pedidoId);
                    socketService.onStatusAtualizado(handleStatusAtualizado);
                }
            } catch (error) {
                console.error('Erro ao conectar WebSocket:', error);
                if (mounted) {
                    setConectado(false);
                }
            }
        };

        conectar();

        // Cleanup ao desmontar
        return () => {
            mounted = false;
            if (pedidoId) {
                socketService.sairPedido(pedidoId);
                socketService.offEvent('status-atualizado');
            }
        };
    }, [pedidoId, handleStatusAtualizado]);

    return {
        status,
        ultimaAtualizacao,
        conectado
    };
};