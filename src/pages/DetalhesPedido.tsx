import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { pedidoService, type PedidoResponse } from '../services/pedidoService';
import {
    ArrowLeft,

    Package,
    Store,
    Calendar,
    AlertCircle
} from 'lucide-react';

const statusMessages = {
    AGUARDANDO_RESTAURANTE: 'Aguardando o restaurante confirmar seu pedido',
    CONFIRMADO: 'Pedido confirmado! Em breve começaremos o preparo',
    EM_PREPARO: 'Seu pedido está sendo preparado com muito cuidado',
    PRONTO: 'Pedido pronto para entrega!',
    SAIU_PARA_ENTREGA: 'Saiu para entrega! Fique atento',
    ENTREGUE: 'Pedido entregue! Bom apetite!',
    CANCELADO: 'Pedido cancelado'
};

export const DetalhesPedido: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pedido, setPedido] = useState<PedidoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (id) {
            carregarPedido();
        }
    }, [id, user]);

    const carregarPedido = async () => {
        try {
            setLoading(true);
            const data = await pedidoService.buscarPorId(id!);
            setPedido(data);
        } catch (error) {
            console.error('Erro ao carregar pedido:', error);
            setErro('Não foi possível carregar os detalhes do pedido');
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <p className="text-text-secondary">Carregando...</p>
            </div>
        );
    }

    if (!pedido || erro) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-brand-primary mx-auto mb-4" />
                    <p className="text-text-secondary mb-4">{erro || 'Pedido não encontrado'}</p>
                    <Button variant="primary" onClick={() => navigate('/meus-pedidos')}>
                        Voltar para meus pedidos
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-base">
            {/* Header */}
            <header className="bg-brand-primary py-4 px-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-text-primary hover:text-secondary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-display text-2xl font-bold text-text-primary">
                        Detalhes do Pedido
                    </h1>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Status do pedido */}
                <div className="bg-background-card rounded-card shadow-card p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Package className="w-6 h-6 text-secondary" />
                        <h2 className="font-display text-xl font-bold text-text-primary">
                            Status do Pedido
                        </h2>
                    </div>

                    <div className={`p-4 rounded-card ${pedido.status === 'CANCELADO'
                        ? 'bg-red-500/10 border border-red-500'
                        : 'bg-secondary/10 border border-secondary'
                        }`}>
                        <p className={`text-lg font-medium ${pedido.status === 'CANCELADO' ? 'text-red-500' : 'text-secondary'
                            }`}>
                            {pedido.status === 'CANCELADO' ? '❌ Cancelado' : '✅ Ativo'}
                        </p>
                        <p className="text-text-secondary mt-2">
                            {statusMessages[pedido.status]}
                        </p>
                    </div>
                </div>

                {/* Informações do pedido */}
                <div className="bg-background-card rounded-card shadow-card p-6 mb-6">
                    <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                        Informações do Pedido
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Store className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-primary font-medium">Restaurante</p>
                                <p className="text-text-secondary">{pedido.restaurante.nome}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-primary font-medium">Data e hora</p>
                                <p className="text-text-secondary">{formatarData(pedido.createdAt)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Package className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-primary font-medium">Número do pedido</p>
                                <p className="text-text-secondary">#{pedido.id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Itens do pedido */}
                <div className="bg-background-card rounded-card shadow-card p-6 mb-6">
                    <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                        Itens do Pedido
                    </h2>

                    <div className="space-y-4">
                        {pedido.itens.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b border-border-subtle pb-4 last:border-0">
                                <div>
                                    <p className="text-text-primary font-medium">
                                        {item.quantidade}x {item.produto.nome}
                                    </p>
                                    {item.observacoes && (
                                        <p className="text-text-secondary text-sm mt-1">
                                            Obs: {item.observacoes}
                                        </p>
                                    )}
                                </div>
                                <p className="text-text-accent font-bold">
                                    R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resumo de valores */}
                <div className="bg-background-card rounded-card shadow-card p-6">
                    <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                        Resumo de Valores
                    </h2>

                    <div className="space-y-3">
                        <div className="flex justify-between text-text-secondary">
                            <span>Subtotal</span>
                            <span>R$ {pedido.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-text-secondary">
                            <span>Taxa de entrega</span>
                            <span>R$ {pedido.taxaEntrega.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-text-primary font-bold text-lg pt-3 border-t border-border-subtle">
                            <span>Total</span>
                            <span className="text-text-accent">R$ {pedido.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};