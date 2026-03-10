import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useWebSocket } from '../hooks/useWebSocket';
import { Button } from '../components/ui/Button';
import { restauranteDonoService, type PedidoRestaurante } from '../services/restauranteDonoService';
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    Package,
    Truck,
    Home as HomeIcon,
    AlertCircle,
    Bell,
    RefreshCw,
    Phone,
    MapPin,
    User,
    House
} from 'lucide-react';

type StatusPedido = 'AGUARDANDO_RESTAURANTE' | 'CONFIRMADO' | 'EM_PREPARO' | 'PRONTO' | 'SAIU_PARA_ENTREGA' | 'ENTREGUE' | 'CANCELADO';

const statusConfig: Record<StatusPedido, {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ElementType;
    nextStatus?: StatusPedido[];
}> = {
    AGUARDANDO_RESTAURANTE: {
        label: 'Aguardando',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        icon: Clock,
        nextStatus: ['CONFIRMADO', 'CANCELADO']
    },
    CONFIRMADO: {
        label: 'Confirmado',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        icon: CheckCircle,
        nextStatus: ['EM_PREPARO', 'CANCELADO']
    },
    EM_PREPARO: {
        label: 'Em preparo',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        icon: Package,
        nextStatus: ['PRONTO', 'CANCELADO']
    },
    PRONTO: {
        label: 'Pronto',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        icon: CheckCircle,
        nextStatus: ['SAIU_PARA_ENTREGA']
    },
    SAIU_PARA_ENTREGA: {
        label: 'Saiu para entrega',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        icon: Truck,
        nextStatus: ['ENTREGUE']
    },
    ENTREGUE: {
        label: 'Entregue',
        color: 'text-green-600',
        bgColor: 'bg-green-600/10',
        icon: HomeIcon,
        nextStatus: []
    },
    CANCELADO: {
        label: 'Cancelado',
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        icon: AlertCircle,
        nextStatus: []
    }
};

export const RestauranteDashboard: React.FC = () => {
    const { id: restauranteId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [pedidos, setPedidos] = useState<PedidoRestaurante[]>([]);
    const [restauranteNome, setRestauranteNome] = useState('');
    const [loading, setLoading] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState('');
    const [notificacao, setNotificacao] = useState<{ id: string; mensagem: string } | null>(null);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');

    // Conectar ao WebSocket para receber novos pedidos
    const { status: socketStatus } = useWebSocket();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'DONO_RESTAURANTE' && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        if (restauranteId) {
            carregarDados();
            // Entrar na sala do restaurante para receber novos pedidos
            // (implementar no socket service depois)
        }
    }, [user, restauranteId]);

    // Quando receber atualização do WebSocket, recarregar pedidos
    useEffect(() => {
        if (socketStatus && restauranteId) {
            setNotificacao({
                id: Date.now().toString(),
                mensagem: '🔄 Novo pedido recebido!'
            });
            carregarPedidos();

            const timer = setTimeout(() => setNotificacao(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [socketStatus]);

    const carregarDados = async () => {
        try {
            setLoading(true);

            // Buscar informações do restaurante
            const restData = await restauranteDonoService.buscarRestaurante(restauranteId!);
            setRestauranteNome(restData.nome);

            await carregarPedidos();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            setErro('Não foi possível carregar os dados');
        } finally {
            setLoading(false);
        }
    };

    const carregarPedidos = async () => {
        try {
            const data = await restauranteDonoService.listarPedidos(restauranteId!);
            // Ordenar do mais recente para o mais antigo
            setPedidos(data.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ));
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        }
    };

    const atualizarStatus = async (pedidoId: string, novoStatus: StatusPedido) => {
        try {
            setAtualizando(true);
            await restauranteDonoService.atualizarStatus(restauranteId!, pedidoId, novoStatus);

            // Atualizar lista local
            setPedidos(prev =>
                prev.map(p =>
                    p.id === pedidoId
                        ? { ...p, status: novoStatus }
                        : p
                )
            );

            setNotificacao({
                id: Date.now().toString(),
                mensagem: `✅ Status atualizado para ${statusConfig[novoStatus].label}`
            });

            setTimeout(() => setNotificacao(null), 3000);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar status');
        } finally {
            setAtualizando(false);
        }
    };

    const formatarData = (dataString: string) => {
        const data = new Date(dataString);
        return data.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pedidosFiltrados = filtroStatus === 'todos'
        ? pedidos
        : pedidos.filter(p => p.status === filtroStatus);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <p className="text-text-secondary">Carregando...</p>
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
                            onClick={() => navigate('/selecionar-restaurante')}
                            className="text-text-primary hover:text-secondary transition-colors"
                            title="Voltar para seleção de restaurantes"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="font-display text-2xl font-bold text-text-primary">
                                {restauranteNome}
                            </h1>
                            <p className="text-text-secondary text-sm">Painel do restaurante</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botão Home */}
                        <button
                            onClick={() => navigate('/')}
                            className="text-text-primary hover:text-secondary transition-colors bg-background-card p-2 rounded-button"
                            title="Ir para home"
                        >
                            <House className="w-5 h-5" />
                        </button>

                        <button
                            onClick={carregarPedidos}
                            disabled={atualizando}
                            className="text-text-primary hover:text-secondary transition-colors disabled:opacity-50 bg-background-card p-2 rounded-button"
                            title="Atualizar pedidos"
                        >
                            <RefreshCw className={`w-5 h-5 ${atualizando ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Notificação */}
            {notificacao && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-secondary text-background-base px-6 py-3 rounded-button shadow-card flex items-center gap-3 animate-slideDown z-50">
                    <Bell className="w-5 h-5" />
                    <p className="font-medium">{notificacao.mensagem}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 py-8">
                {erro && (
                    <div className="mb-6 bg-brand-primary/10 border border-brand-primary rounded-card p-4">
                        <p className="text-brand-primary text-center">{erro}</p>
                    </div>
                )}

                {/* Filtros */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        onClick={() => setFiltroStatus('todos')}
                        className={`px-4 py-2 rounded-button transition-colors ${filtroStatus === 'todos'
                                ? 'bg-secondary text-background-base font-medium'
                                : 'bg-background-card text-text-secondary hover:bg-background-input'
                            }`}
                    >
                        Todos ({pedidos.length})
                    </button>
                    {Object.entries(statusConfig).map(([status, config]) => {
                        const count = pedidos.filter(p => p.status === status).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={status}
                                onClick={() => setFiltroStatus(status)}
                                className={`px-4 py-2 rounded-button transition-colors ${filtroStatus === status
                                        ? `${config.bgColor} ${config.color} font-medium`
                                        : 'bg-background-card text-text-secondary hover:bg-background-input'
                                    }`}
                            >
                                {config.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Lista de pedidos */}
                {pedidosFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                        <p className="text-text-secondary">Nenhum pedido encontrado</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pedidosFiltrados.map((pedido) => {
                            const status = statusConfig[pedido.status];

                            return (
                                <div
                                    key={pedido.id}
                                    className="bg-background-card rounded-card shadow-card p-6"
                                >
                                    {/* Cabeçalho */}
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
                                            <status.icon className={`w-4 h-4 ${status.color}`} />
                                            <span className={`text-sm font-medium ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cliente */}
                                    <div className="mb-4 p-4 bg-background-input rounded-card">
                                        <div className="flex items-start gap-3 mb-2">
                                            <User className="w-4 h-4 text-secondary mt-0.5" />
                                            <div>
                                                <p className="text-text-primary font-medium">{pedido.cliente.nome}</p>
                                                <p className="text-text-secondary text-sm flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {pedido.cliente.telefone}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                                            <p className="text-text-secondary text-sm">
                                                {pedido.enderecoEntrega.logradouro}, {pedido.enderecoEntrega.numero}
                                                {pedido.enderecoEntrega.complemento && ` - ${pedido.enderecoEntrega.complemento}`}<br />
                                                {pedido.enderecoEntrega.bairro}, {pedido.enderecoEntrega.cidade} - {pedido.enderecoEntrega.estado}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Itens */}
                                    <div className="mb-4 space-y-2">
                                        {pedido.itens.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-text-secondary">
                                                    {item.quantidade}x {item.produto.nome}
                                                    {item.observacoes && (
                                                        <span className="text-text-secondary/70 ml-2">
                                                            ({item.observacoes})
                                                        </span>
                                                    )}
                                                </span>
                                                <span className="text-text-primary">
                                                    R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center pt-4 border-t border-border-subtle mb-4">
                                        <span className="text-text-primary font-medium">Total</span>
                                        <span className="text-text-accent font-bold text-lg">
                                            R$ {pedido.total.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Ações */}
                                    {status.nextStatus && status.nextStatus.length > 0 && (
                                        <div className="flex gap-2">
                                            {status.nextStatus.map((nextStatus) => (
                                                <Button
                                                    key={nextStatus}
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => atualizarStatus(pedido.id, nextStatus)}
                                                    disabled={atualizando}
                                                    className="flex-1"
                                                >
                                                    Avançar para {statusConfig[nextStatus].label}
                                                </Button>
                                            ))}
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