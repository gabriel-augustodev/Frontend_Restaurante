import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/Button';
import { ArrowLeft, MapPin, CreditCard, DollarSign, Clock, Plus } from 'lucide-react';
import { enderecoService, type Endereco } from '../services/enderecoService';
import { pedidoService } from '../services/pedidoService';

// Tipo para métodos de pagamento
type MetodoPagamento = 'pix' | 'cartao' | 'dinheiro';

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, subtotal, clearCart } = useCart();

    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<string>('');
    const [metodoPagamento, setMetodoPagamento] = useState<MetodoPagamento>('pix');
    const [observacoes, setObservacoes] = useState('');
    const [loading, setLoading] = useState(false);
    const [buscandoEnderecos, setBuscandoEnderecos] = useState(true);
    const [erro, setErro] = useState('');

    // Pega o ID do restaurante do primeiro item
    const restauranteId = items[0]?.restauranteId;
    const taxaEntrega = 8.5; // Isso deve vir do restaurante
    const total = subtotal + taxaEntrega;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        carregarEnderecos();
    }, [user]);

    const carregarEnderecos = async () => {
        try {
            setBuscandoEnderecos(true);
            const data = await enderecoService.listar();
            setEnderecos(data);

            const principal = data.find(e => e.isPrincipal);
            if (principal) {
                setEnderecoSelecionado(principal.id);
            }
        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
            setErro('Não foi possível carregar seus endereços');
        } finally {
            setBuscandoEnderecos(false);
        }
    };

    const handleFinalizarPedido = async () => {
        if (!enderecoSelecionado) {
            setErro('Selecione um endereço de entrega');
            return;
        }

        if (!restauranteId) {
            setErro('Carrinho vazio');
            return;
        }

        setLoading(true);
        setErro('');

        try {
            const pedido = await pedidoService.criar({
                restauranteId,
                enderecoEntregaId: enderecoSelecionado,
                itens: items.map(item => ({
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    observacoes: item.observacoes
                })),
                observacoes
            });

            console.log('Pedido criado:', pedido);

            clearCart();
            navigate('/pedido-sucesso', {
                state: {
                    pedidoId: pedido.id,
                    metodoPagamento,
                    endereco: enderecos.find(e => e.id === enderecoSelecionado)
                }
            });

        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            setErro('Erro ao processar pedido. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-4">Seu carrinho está vazio</p>
                    <Button variant="primary" onClick={() => navigate('/')}>
                        Ver restaurantes
                    </Button>
                </div>
            </div>
        );
    }

    // Lista de métodos de pagamento para mapear
    const metodosPagamento: { valor: MetodoPagamento; label: string; descricao: string }[] = [
        { valor: 'pix', label: 'PIX', descricao: 'Pagamento instantâneo' },
        { valor: 'cartao', label: 'Cartão de crédito', descricao: 'Parcelamos em até 12x' },
        { valor: 'dinheiro', label: 'Dinheiro', descricao: 'Troco disponível' }
    ];

    return (
        <div className="min-h-screen bg-background-base">
            <header className="bg-brand-primary py-4 px-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-text-primary hover:text-secondary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-display text-2xl font-bold text-text-primary">
                        Finalizar pedido
                    </h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {erro && (
                    <div className="mb-6 bg-brand-primary/10 border border-brand-primary rounded-card p-4">
                        <p className="text-brand-primary text-center">{erro}</p>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Coluna da esquerda */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Endereço de entrega */}
                        <div className="bg-background-card rounded-card shadow-card p-6">
                            <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-secondary" />
                                Endereço de entrega
                            </h2>

                            {buscandoEnderecos ? (
                                <p className="text-text-secondary">Carregando endereços...</p>
                            ) : enderecos.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-text-secondary mb-4">Nenhum endereço cadastrado</p>
                                    <Button variant="primary" size="sm">
                                        Cadastrar endereço
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {enderecos.map((endereco) => (
                                        <label
                                            key={endereco.id}
                                            className={`flex items-start gap-3 p-4 rounded-card border-2 cursor-pointer transition-colors ${enderecoSelecionado === endereco.id
                                                ? 'border-secondary bg-secondary/5'
                                                : 'border-border-subtle hover:border-secondary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="endereco"
                                                value={endereco.id}
                                                checked={enderecoSelecionado === endereco.id}
                                                onChange={(e) => setEnderecoSelecionado(e.target.value)}
                                                className="mt-1 text-secondary focus:ring-secondary"
                                            />
                                            <div className="flex-1">
                                                <p className="text-text-primary font-medium">
                                                    {endereco.logradouro}, {endereco.numero}
                                                    {endereco.complemento && ` - ${endereco.complemento}`}
                                                </p>
                                                <p className="text-text-secondary text-sm">
                                                    {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                                                </p>
                                                <p className="text-text-secondary text-sm">CEP: {endereco.cep}</p>
                                                {endereco.isPrincipal && (
                                                    <span className="inline-block mt-1 text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                    <Button variant="outline" size="sm" className="mt-2">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar novo endereço
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Método de pagamento */}
                        <div className="bg-background-card rounded-card shadow-card p-6">
                            <h2 className="font-display text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-secondary" />
                                Forma de pagamento
                            </h2>

                            <div className="space-y-3">
                                {metodosPagamento.map((metodo) => (
                                    <label
                                        key={metodo.valor}
                                        className={`flex items-center gap-3 p-4 rounded-card border-2 cursor-pointer transition-colors ${metodoPagamento === metodo.valor
                                            ? 'border-secondary bg-secondary/5'
                                            : 'border-border-subtle hover:border-secondary/50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="pagamento"
                                            value={metodo.valor}
                                            checked={metodoPagamento === metodo.valor}
                                            onChange={() => setMetodoPagamento(metodo.valor)}
                                            className="text-secondary focus:ring-secondary"
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                                                {metodo.valor === 'pix' && (
                                                    <span className="text-secondary font-bold">PIX</span>
                                                )}
                                                {metodo.valor === 'cartao' && (
                                                    <CreditCard className="w-5 h-5 text-secondary" />
                                                )}
                                                {metodo.valor === 'dinheiro' && (
                                                    <DollarSign className="w-5 h-5 text-secondary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-text-primary font-medium">{metodo.label}</p>
                                                <p className="text-text-secondary text-sm">{metodo.descricao}</p>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="bg-background-card rounded-card shadow-card p-6">
                            <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                                Observações
                            </h2>
                            <textarea
                                placeholder="Alguma observação para o pedido? (ex: ponto da carne, troco para quanto)"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                rows={4}
                                className="w-full bg-background-input text-text-primary rounded-card p-4 outline-none focus:ring-2 focus:ring-secondary resize-none"
                            />
                        </div>
                    </div>

                    {/* Coluna da direita - Resumo */}
                    <div className="md:col-span-1">
                        <div className="bg-background-card rounded-card shadow-card p-6 sticky top-24">
                            <h2 className="font-display text-xl font-bold text-text-primary mb-4">
                                Resumo do pedido
                            </h2>

                            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-text-secondary">
                                            {item.quantidade}x {item.nome}
                                        </span>
                                        <span className="text-text-primary font-medium">
                                            R$ {(item.preco * item.quantidade).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border-subtle pt-4 space-y-2">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Taxa de entrega</span>
                                    <span>R$ {taxaEntrega.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-primary font-bold text-lg pt-2 border-t border-border-subtle">
                                    <span>Total</span>
                                    <span className="text-text-accent">R$ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    onClick={handleFinalizarPedido}
                                    disabled={loading || !enderecoSelecionado}
                                >
                                    {loading ? 'Processando...' : 'Finalizar pedido'}
                                </Button>

                                <div className="flex items-center justify-center gap-2 text-text-secondary text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>Entrega em aproximadamente 45 min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};