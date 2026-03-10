import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export const AlterarSenha: React.FC = () => {
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
    const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

    const validarSenha = () => {
        const criterios = {
            tamanho: novaSenha.length >= 8,
            maiuscula: /[A-Z]/.test(novaSenha),
            minuscula: /[a-z]/.test(novaSenha),
            numero: /[0-9]/.test(novaSenha),
            especial: /[!@#$%^&*(),.?":{}|<>]/.test(novaSenha)
        };

        return criterios;
    };

    const criterios = validarSenha();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);

        // Validações
        if (novaSenha !== confirmarSenha) {
            setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem' });
            setLoading(false);
            return;
        }

        if (Object.values(criterios).some(v => !v)) {
            setMensagem({ tipo: 'erro', texto: 'A senha não atende todos os critérios' });
            setLoading(false);
            return;
        }

        try {
            // TODO: Implementar chamada à API para alterar senha
            console.log('Alterando senha');

            setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarSenha('');
        } catch {
            // Se não precisar do erro, pode deixar o catch vazio
            setMensagem({ tipo: 'erro', texto: 'Erro ao alterar senha. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-card rounded-card shadow-card p-6">
            <h2 className="font-display text-xl font-bold text-text-primary mb-6">
                Alterar Senha
            </h2>

            {mensagem && (
                <div className={`mb-4 p-3 rounded-button ${mensagem.tipo === 'sucesso'
                        ? 'bg-green-500/10 border border-green-500 text-green-500'
                        : 'bg-red-500/10 border border-red-500 text-red-500'
                    }`}>
                    {mensagem.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Senha Atual */}
                <div>
                    <label className="block text-text-secondary text-sm mb-2">Senha Atual</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <input
                            type={mostrarSenhaAtual ? 'text' : 'password'}
                            value={senhaAtual}
                            onChange={(e) => setSenhaAtual(e.target.value)}
                            className="w-full bg-background-input text-text-primary rounded-button py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-secondary"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                        >
                            {mostrarSenhaAtual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Nova Senha */}
                <div>
                    <label className="block text-text-secondary text-sm mb-2">Nova Senha</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                        <input
                            type={mostrarNovaSenha ? 'text' : 'password'}
                            value={novaSenha}
                            onChange={(e) => setNovaSenha(e.target.value)}
                            className="w-full bg-background-input text-text-primary rounded-button py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-secondary"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                        >
                            {mostrarNovaSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirmar Senha */}
                <div>
                    <label className="block text-text-secondary text-sm mb-2">Confirmar Nova Senha</label>
                    <input
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                        required
                    />
                </div>

                {/* Critérios da senha */}
                <div className="bg-background-input rounded-card p-4 space-y-2">
                    <p className="text-text-primary text-sm font-medium mb-2">A senha deve conter:</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${criterios.tamanho ? 'text-green-500' : 'text-gray-500'}`} />
                        <span className="text-text-secondary text-sm">No mínimo 8 caracteres</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${criterios.maiuscula ? 'text-green-500' : 'text-gray-500'}`} />
                        <span className="text-text-secondary text-sm">Pelo menos 1 letra maiúscula</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${criterios.minuscula ? 'text-green-500' : 'text-gray-500'}`} />
                        <span className="text-text-secondary text-sm">Pelo menos 1 letra minúscula</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${criterios.numero ? 'text-green-500' : 'text-gray-500'}`} />
                        <span className="text-text-secondary text-sm">Pelo menos 1 número</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className={`w-4 h-4 ${criterios.especial ? 'text-green-500' : 'text-gray-500'}`} />
                        <span className="text-text-secondary text-sm">Pelo menos 1 caractere especial</span>
                    </div>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                </Button>
            </form>
        </div>
    );
};