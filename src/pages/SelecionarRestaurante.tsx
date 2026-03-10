import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { restauranteDonoService } from '../services/restauranteDonoService';
import { Store, ChevronRight } from 'lucide-react';

interface Restaurante {
    id: string;
    nome: string;
    imagemUrl: string;
    endereco: {
        bairro: string;
        cidade: string;
    };
}

export const SelecionarRestaurante: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Verificar se é dono de restaurante
        if (user.role !== 'DONO_RESTAURANTE' && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        carregarRestaurantes();
    }, [user]);

    const carregarRestaurantes = async () => {
        try {
            setLoading(true);
            const data = await restauranteDonoService.buscarMeusRestaurantes();
            setRestaurantes(data);

            // Se tiver apenas um restaurante, redireciona direto
            if (data.length === 1) {
                navigate(`/restaurante-dashboard/${data[0].id}`);
            }
        } catch (error) {
            console.error('Erro ao carregar restaurantes:', error);
            setErro('Não foi possível carregar seus restaurantes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background-base flex items-center justify-center">
                <p className="text-text-secondary">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-base">
            <header className="bg-brand-primary py-4 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-display text-2xl font-bold text-text-primary">
                        Selecione um restaurante
                    </h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {erro && (
                    <div className="mb-6 bg-brand-primary/10 border border-brand-primary rounded-card p-4">
                        <p className="text-brand-primary text-center">{erro}</p>
                    </div>
                )}

                {restaurantes.length === 0 ? (
                    <div className="text-center py-12">
                        <Store className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                        <p className="text-text-secondary mb-4">
                            Você não tem nenhum restaurante cadastrado
                        </p>
                        <Button variant="primary" onClick={() => navigate('/')}>
                            Voltar para home
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurantes.map((rest) => (
                            <div
                                key={rest.id}
                                onClick={() => navigate(`/restaurante-dashboard/${rest.id}`)}
                                className="bg-background-card rounded-card shadow-card p-6 hover:scale-[1.02] transition-transform cursor-pointer"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                                        <Store className="w-8 h-8 text-secondary" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-display text-xl font-bold text-text-primary">
                                            {rest.nome}
                                        </h2>
                                        <p className="text-text-secondary text-sm">
                                            {rest.endereco.bairro}, {rest.endereco.cidade}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-secondary" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};