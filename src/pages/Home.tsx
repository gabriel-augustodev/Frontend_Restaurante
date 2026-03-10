import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { Button } from '../components/ui/Button';
import { Search, User, Package, LogOut, Store } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { restauranteService } from '../services/restauranteService';
import type { Restaurante } from '../services/api';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        carregarRestaurantes();
    }, []);

    const carregarRestaurantes = async () => {
        try {
            setLoading(true);
            const data = await restauranteService.listar();
            setRestaurantes(data);
        } catch (error) {
            console.error('Erro ao carregar restaurantes:', error);
        } finally {
            setLoading(false);
        }
    };

    const restaurantesFiltrados = restaurantes.filter(rest =>
        rest.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        signOut();
        setIsMenuOpen(false);
        navigate('/');
    };

    // Fechar o menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = () => setIsMenuOpen(false);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-background-base">
            {/* Header */}
            <header className="bg-brand-primary py-4 px-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1
                        className="font-display text-2xl font-bold text-text-primary cursor-pointer hover:text-secondary transition-colors"
                        onClick={() => navigate('/')}
                    >
                        Gourmet<span className="text-secondary">Dash</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                {/* Botão do usuário */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="flex items-center gap-2 bg-background-card px-4 py-2 rounded-button hover:bg-background-input transition-colors"
                                >
                                    <User className="w-4 h-4 text-secondary" />
                                    <span className="text-text-primary hidden sm:inline">
                                        {user.nome.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Dropdown menu */}
                                {isMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 bg-background-card rounded-card shadow-card py-2 z-50 border border-border-subtle"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="px-4 py-2 border-b border-border-subtle">
                                            <p className="text-text-primary font-medium text-sm">{user.nome}</p>
                                            <p className="text-text-secondary text-xs">{user.email}</p>
                                        </div>

                                        {/* Opção Meu Perfil - PARA TODOS OS USUÁRIOS */}
                                        <button
                                            onClick={() => {
                                                navigate('/perfil');
                                                setIsMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-text-primary hover:bg-background-input flex items-center gap-2 transition-colors"
                                        >
                                            <User className="w-4 h-4 text-secondary" />
                                            <span>Meu Perfil</span>
                                        </button>

                                        {/* Opção Meus Pedidos - APENAS PARA CLIENTES */}
                                        {user.role === 'CLIENTE' && (
                                            <button
                                                onClick={() => {
                                                    navigate('/meus-pedidos');
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-text-primary hover:bg-background-input flex items-center gap-2 transition-colors"
                                            >
                                                <Package className="w-4 h-4 text-secondary" />
                                                <span>Meus Pedidos</span>
                                            </button>
                                        )}

                                        {/* Opção Painel do Restaurante - APENAS PARA DONOS */}
                                        {user.role === 'DONO_RESTAURANTE' && (
                                            <button
                                                onClick={() => {
                                                    navigate('/selecionar-restaurante');
                                                    setIsMenuOpen(false);
                                                }}
                                                className="w-full px-4 py-3 text-left text-text-primary hover:bg-background-input flex items-center gap-2 transition-colors"
                                            >
                                                <Store className="w-4 h-4 text-secondary" />
                                                <span>Painel do Restaurante</span>
                                            </button>
                                        )}

                                        {/* Opção Sair - PARA TODOS */}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-text-primary hover:bg-background-input flex items-center gap-2 transition-colors border-t border-border-subtle mt-1"
                                        >
                                            <LogOut className="w-4 h-4 text-secondary" />
                                            <span>Sair</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/login')}
                                >
                                    Entrar
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate('/login?mode=register')}
                                >
                                    Cadastrar
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="font-display text-5xl font-bold text-text-primary mb-4">
                        Experiência Gastronômica<br />
                        <span className="text-secondary">no conforto do seu lar</span>
                    </h2>
                    <p className="text-text-secondary text-xl mb-8 max-w-2xl mx-auto">
                        Os melhores restaurantes da cidade entregues com a qualidade que você merece
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Busque por restaurantes ou pratos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background-input text-text-primary rounded-button py-4 px-6 pl-14 outline-none focus:ring-2 focus:ring-secondary"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-6 h-6" />
                    </div>
                </div>
            </section>

            {/* Restaurants Grid */}
            <section className="py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <h3 className="font-display text-3xl font-bold text-text-primary mb-8">
                        Restaurantes em destaque
                    </h3>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-text-secondary">Carregando restaurantes...</p>
                        </div>
                    ) : restaurantesFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-text-secondary">Nenhum restaurante encontrado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurantesFiltrados.map((restaurante) => (
                                <RestaurantCard
                                    key={restaurante.id}
                                    id={restaurante.id}
                                    name={restaurante.nome}
                                    image={restaurante.imagemUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'}
                                    rating={4.5}
                                    deliveryTime={`${restaurante.tempoMedioEntrega || '30-45'}`}
                                    deliveryFee={restaurante.taxaEntrega}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};