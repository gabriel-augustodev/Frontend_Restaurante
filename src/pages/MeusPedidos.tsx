import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { pedidoService, type PedidoResponse } from '../services/pedidoService';
import {
    Clock,
    CheckCircle,
    Package,
    Truck,
    Home,
    AlertCircle,
    ChevronRight,
    RefreshCw
} from 'lucide-react';

const statusConfig = {
    AGUARDANDO_RESTAURANTE: {
        label: 'Aguardando confirmação',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        icon: Clock,
        step: 1
    },
    CONFIRMADO: {
        label: 'Pedido confirmado',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        icon: CheckCircle,
        step: 2
    },
    EM_PREPARO: {
        label: 'Em preparo',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        icon: Package,
        step: 3
    },
    PRONTO: {
        label: 'Pronto para entrega',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        icon: CheckCircle,
        step: 4
    },
    SAIU_PARA_ENTREGA: {
        label: 'Saiu para entrega',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        icon: Truck,
        step: 5
    },
    ENTREGUE: {
        label: 'Entregue',
        color: 'text-green-600',
        bgColor: 'bg-green-600/10',
        icon: Home,
        step: 6
    },
    CANCELADO: {
        label: 'Cancelado',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        icon: AlertCircle,
        step: 0
    }
};

export const MeusPedidos: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        carregarPedidos();
    }, [user]);

    const carregarPedidos = async () => {
        try {
            setLoading(true);
            const data = await pedidoService.listarMeus();
            // Ordenar do mais recente para o mais antigo
            setPedidos(data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
            setErro('Não foi possível carregar seus pedidos');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await carregarPedidos();
        setRefreshing(false);
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

    const getStatusConfig = (status: string) => {
        return statusConfig[status as keyof typeof statusConfig] || statusConfig.AGUARDANDO_RESTAURANTE;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <p className="text-text-secondary">Carregando pedidos...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-base">
            {/* Header */}
            <header className="bg-brand-primary py-4 px-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-text-primary hover:text-secondary transition-colors"
                        >
                            <ChevronRight className="w-6 h-6 rotate-180" />
                        </button>
                        <h1 className="font-display text-2xl font-bold text-text-primary">
                            Meus Pedidos
                        </h1>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="text-text-primary hover:text-secondary transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {erro && (
                    <div className="mb-6 bg-brand-primary/10 border border-brand-primary rounded-card p-4">
                        <p className="text-brand-primary text-center">{erro}</p>
                    </div>
                )}

                {pedidos.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                        <p className="text-text-secondary mb-4">Você ainda não tem pedidos</p>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Ver restaurantes
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pedidos.map((pedido) => {
                            const status = getStatusConfig(pedido.status);
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={pedido.id}
                                    className="bg-background-card rounded-card shadow-card p-6 hover:scale-[1.01] transition-transform cursor-pointer"
                                    onClick={() => navigate(`/pedido/${pedido.id}`)}
                                >
                                    {/* Cabeçalho do pedido */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-text-secondary text-sm">
                                                {formatarData(pedido.createdAt)}
                                            </p>
                                            <p className="text-text-primary font-medium">
                                                Pedido #{pedido.id.slice(0, 8)}
                                            </p>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
                                            <StatusIcon className={`w-4 h-4 ${status.color}`} />
                                            <span className={`text-sm font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Restaurante */}
                                    <div className="mb-4">
                                        <p className="text-text-primary font-medium">
                                            {pedido.restaurante.nome}
                                        </p>
                                    </div>

                                    {/* Itens do pedido (resumo) */}
                                    <div className="mb-4">
                                        <p className="text-text-secondary text-sm">
                                            {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}
                                        </p>
                                        <p className="text-text-secondary text-sm line-clamp-1">
                                            {pedido.itens.map(item => item.produto.nome).join(', ')}
                                        </p>
                                    </div>

                                    {/* Total e botão */}
                                    <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                                        <div>
                                            <span className="text-text-secondary text-sm">Total</span>
                                            <p className="text-text-accent font-bold text-lg">
                                                R$ {pedido.total.toFixed(2)}
                                            </p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            Ver detalhes
                                        </Button>
                                    </div>

                                    {/* Barra de progresso do pedido */}
                                    {status.step > 0 && status.step < 6 && (
                                        <div className="mt-4">
                                            <div className="h-1 bg-background-input rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-secondary transition-all duration-500"
                                                    style={{ width: `${(status.step / 6) * 100}%` }}
                                                />
                                            </div>
                                            <p className="text-text-secondary text-xs mt-1">
                                                Passo {status.step} de 6
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};