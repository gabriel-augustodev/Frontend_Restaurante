import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'register';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await signIn(email, senha);
                navigate('/');
            } else {
                await signUp({ email, senha, nome });
                navigate('/');
            }
        } catch (err) {
            setError('Erro ao autenticar. Verifique seus dados.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2
                        className="font-display text-4xl font-bold text-text-primary mb-2 cursor-pointer hover:text-secondary transition-colors"
                        onClick={() => navigate('/')}
                    >
                        Gourmet<span className="text-secondary">Dash</span>
                    </h2>
                    <p className="text-text-secondary">
                        {mode === 'login' ? 'Faça seu login' : 'Crie sua conta'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label htmlFor="nome" className="sr-only">
                                    Nome
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                                    <input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        required
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full bg-background-input text-text-primary rounded-button py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-secondary"
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background-input text-text-primary rounded-button py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Seu email"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="senha" className="sr-only">
                                Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                                <input
                                    id="senha"
                                    name="senha"
                                    type="password"
                                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                    required
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                    className="w-full bg-background-input text-text-primary rounded-button py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Sua senha"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-brand-primary/10 border border-brand-primary rounded-button p-3">
                            <p className="text-brand-primary text-sm text-center">{error}</p>
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                'Carregando...'
                            ) : (
                                <>
                                    {mode === 'login' ? 'Entrar' : 'Cadastrar'}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-text-secondary hover:text-secondary transition-colors"
                        >
                            {mode === 'login'
                                ? 'Não tem uma conta? Cadastre-se'
                                : 'Já tem uma conta? Faça login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};