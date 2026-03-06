import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Clock, MapPin, CreditCard, Home, Package } from 'lucide-react';

interface LocationState {
    pedidoId: string;
    metodoPagamento: string;
    endereco: {
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        estado: string;
    };
}

export const PedidoSucesso: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const [tempoRestante, setTempoRestante] = useState(45);

    // Se não veio do checkout, redirecionar para home
    useEffect(() => {
        if (!state?.pedidoId) {
            navigate('/');
        }
    }, [state, navigate]);

    // Timer regressivo
    useEffect(() => {
        const timer = setInterval(() => {
            setTempoRestante((prev) => (prev > 0 ? prev - 1 : 0));
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    if (!state?.pedidoId) {
        return null;
    }

    const getMetodoPagamentoLabel = (metodo: string) => {
        const map = {
            pix: 'PIX',
            cartao: 'Cartão de crédito',
            dinheiro: 'Dinheiro'
        };
        return map[metodo as keyof typeof map] || metodo;
    };

    return (
        <div className="min-h-screen bg-background-base flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                <div className="bg-background-card rounded-card shadow-card p-8 text-center">
                    {/* Ícone de sucesso animado */}
                    <div className="relative mb-6">
                        <div className="w-24 h-24 bg-secondary/20 rounded-full mx-auto flex items-center justify-center animate-pulse">
                            <CheckCircle className="w-12 h-12 text-secondary" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 border-4 border-secondary/30 rounded-full animate-ping" />
                        </div>
                    </div>

                    <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
                        Pedido confirmado!
                    </h1>

                    <div className="bg-background-input rounded-button py-2 px-4 inline-block mb-4">
                        <span className="text-text-secondary">Pedido </span>
                        <span className="text-secondary font-bold">{state.pedidoId}</span>
                    </div>

                    <p className="text-text-secondary mb-8">
                        Seu pedido foi recebido com sucesso e em breve será preparado.
                    </p>

                    <div className="space-y-4 mb-8 text-left">
                        <div className="flex items-start gap-3 p-4 bg-background-input rounded-card">
                            <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-primary font-medium">Tempo estimado</p>
                                <p className="text-text-secondary text-sm">
                                    {tempoRestante} minutos para entrega
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background-input rounded-card">
                            <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-primary font-medium">Endereço de entrega</p>
                                <p className="text-text-secondary text-sm">
                                    {state.endereco.logradouro}, {state.endereco.numero}
                                    {state.endereco.complemento && ` - ${state.endereco.complemento}`}<br />
                                    {state.endereco.bairro}, {state.endereco.cidade} - {state.endereco.estado}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-background-input rounded-card">
                            <CreditCard className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-text-primary font-medium">Forma de pagamento</p>
                                <p className="text-text-secondary text-sm">
                                    {getMetodoPagamentoLabel(state.metodoPagamento)} - Pagamento confirmado
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={() => navigate('/')}
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Voltar para home
                        </Button>

                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full"
                            onClick={() => navigate('/meus-pedidos')}
                        >
                            <Package className="w-5 h-5 mr-2" />
                            Acompanhar pedido
                        </Button>
                    </div>

                    <p className="text-text-secondary text-sm mt-6">
                        Obrigado por escolher o GourmetDash! ❤️
                    </p>
                </div>
            </div>
        </div>
    );
};