import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/restaurant/ProductCard';
import { FloatingCart } from '../components/cart/FloatingCart';
import { ArrowLeft, ShoppingCart, Clock, MapPin } from 'lucide-react';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante, Produto } from '../services/api';

export const RestaurantDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        addItem,
        subtotal,
        totalItems,
        isEmpty
    } = useCart();

    const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState<string[]>([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [imagemErro, setImagemErro] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (id) {
            carregarDados();
        }
    }, [id]);

    const carregarDados = async () => {
        try {
            setLoading(true);

            const restauranteData = await restauranteService.buscarPorId(id!);
            setRestaurante(restauranteData);

            const produtosData = await restauranteService.listarProdutos(id!);
            setProdutos(produtosData);

            // Extrair categorias únicas, ignorando null/undefined
            const categoriasUnicas = ['todos',
                ...new Set(
                    produtosData
                        .map(p => p.categoria?.nome)
                        .filter((nome): nome is string => nome !== null && nome !== undefined)
                )
            ];
            setCategorias(categoriasUnicas);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

    const produtosFiltrados = categoriaAtiva === 'todos'
        ? produtos
        : produtos.filter(p => (p.categoria?.nome || 'Outros') === categoriaAtiva);

    const handleAddToCart = (produto: Produto) => {
        if (!user) {
            navigate('/login');
            return;
        }
        addItem(produto);
    };

    const handleImageError = (produtoId: string) => {
        setImagemErro(prev => ({ ...prev, [produtoId]: true }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <p className="text-text-secondary">Carregando...</p>
            </div>
        );
    }

    if (!restaurante) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <p className="text-text-secondary">Restaurante não encontrado</p>
            </div>
        );
    }

    // Valores seguros para evitar undefined
    const tempoMedio = restaurante.tempoMedioEntrega || 30;
    const taxaEntrega = restaurante.taxaEntrega || 0;
    const enderecoBairro = restaurante.endereco?.bairro || 'Localização não informada';
    const enderecoCidade = restaurante.endereco?.cidade || '';

    return (
        <div className="min-h-screen bg-background-base pb-24">
            {/* Header do Restaurante */}
            <div className="relative h-64 md:h-80">
                <img
                    src={restaurante.imagemUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
                    alt={restaurante.nome}
                    className="w-full h-full object-cover"
                    onError={() => setImagemErro(prev => ({ ...prev, header: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/50 to-transparent" />

                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-background-card p-2 rounded-full hover:bg-background-input transition-colors z-10"
                >
                    <ArrowLeft className="w-6 h-6 text-text-primary" />
                </button>
            </div>

            {/* Informações do Restaurante */}
            <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                <div className="bg-background-card rounded-card shadow-card p-6 mb-8">
                    <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                        {restaurante.nome}
                    </h1>
                    <p className="text-text-secondary mb-4">{restaurante.descricao || 'Sem descrição'}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                            <Clock className="w-4 h-4 text-secondary" />
                            <span>{tempoMedio} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{enderecoBairro}{enderecoCidade ? `, ${enderecoCidade}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-accent font-semibold">
                            <span>Entrega: R$ {taxaEntrega.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Categorias */}
                {categorias.length > 1 && (
                    <div className="mb-8 overflow-x-auto">
                        <div className="flex gap-2 pb-2">
                            {categorias.map((categoria) => (
                                <button
                                    key={categoria}
                                    onClick={() => setCategoriaAtiva(categoria)}
                                    className={`px-4 py-2 rounded-button whitespace-nowrap transition-colors ${categoriaAtiva === categoria
                                        ? 'bg-secondary text-background-base font-medium'
                                        : 'bg-background-card text-text-secondary hover:bg-background-input'
                                        }`}
                                >
                                    {categoria === 'todos' ? 'Todos' : categoria}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Lista de Produtos */}
                <div className="space-y-6">
                    {produtosFiltrados.length === 0 ? (
                        <p className="text-center text-text-secondary py-12">
                            Nenhum produto encontrado nesta categoria
                        </p>
                    ) : (
                        produtosFiltrados.map((produto) => (
                            <ProductCard
                                key={produto.id}
                                id={produto.id}
                                name={produto.nome}
                                description={produto.descricao || 'Sem descrição'}
                                price={produto.preco || 0}
                                image={!imagemErro[produto.id] ? produto.imagemUrl || undefined : undefined}
                                onAddToCart={() => handleAddToCart(produto)}
                                onImageError={() => handleImageError(produto.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Carrinho Flutuante */}
            {user && !isEmpty && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-brand-primary text-text-primary px-6 py-3 rounded-button shadow-card flex items-center gap-4 z-50">
                    <ShoppingCart className="w-5 h-5 text-secondary" />
                    <span className="font-medium">{totalItems} {totalItems === 1 ? 'item' : 'itens'}</span>
                    <span className="text-secondary font-bold">R$ {subtotal?.toFixed(2) || '0.00'}</span>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setIsCartOpen(true)}
                    >
                        Ver carrinho
                    </Button>
                </div>
            )}

            {/* Modal do Carrinho */}
            <FloatingCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
};