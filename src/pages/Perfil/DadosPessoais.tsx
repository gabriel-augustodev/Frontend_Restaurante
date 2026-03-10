import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { User, Mail, Phone, Save } from 'lucide-react';

interface DadosPessoaisProps {
    onSuccess?: () => void;
}

export const DadosPessoais: React.FC<DadosPessoaisProps> = ({ onSuccess }) => {
    const { user } = useAuth();
    const [nome, setNome] = useState(user?.nome || '');
    const [email, setEmail] = useState(user?.email || '');
    const [telefone, setTelefone] = useState(user?.telefone || '');
    const [loading, setLoading] = useState(false);
    const [editando, setEditando] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMensagem(null);

        try {
            // TODO: Implementar chamada à API para atualizar dados
            console.log('Atualizando dados:', { nome, email, telefone });

            // Simular sucesso
            await new Promise(resolve => setTimeout(resolve, 1000));

            setMensagem({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso!' });
            setEditando(false);
            if (onSuccess) onSuccess();
        } catch {
            setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar dados. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-card rounded-card shadow-card p-6">
            <h2 className="font-display text-xl font-bold text-text-primary mb-6">
                Dados Pessoais
            </h2>

            {mensagem && (
                <div className={`mb-4 p-3 rounded-button ${mensagem.tipo === 'sucesso'
                        ? 'bg-green-500/10 border border-green-500 text-green-500'
                        : 'bg-red-500/10 border border-red-500 text-red-500'
                    }`}>
                    {mensagem.texto}
                </div>
            )}

            {!editando ? (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-background-input rounded-card">
                        <User className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                            <p className="text-text-primary font-medium">Nome</p>
                            <p className="text-text-secondary">{user?.nome}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-background-input rounded-card">
                        <Mail className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                            <p className="text-text-primary font-medium">Email</p>
                            <p className="text-text-secondary">{user?.email}</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-background-input rounded-card">
                        <Phone className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                            <p className="text-text-primary font-medium">Telefone</p>
                            <p className="text-text-secondary">{user?.telefone || 'Não informado'}</p>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => setEditando(true)}
                        className="mt-4"
                    >
                        Editar dados
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-text-secondary text-sm mb-2">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-text-secondary text-sm mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-text-secondary text-sm mb-2">Telefone</label>
                        <input
                            type="tel"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="flex-1"
                        >
                            {loading ? 'Salvando...' : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Salvar
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setEditando(false);
                                setNome(user?.nome || '');
                                setEmail(user?.email || '');
                                setTelefone(user?.telefone || '');
                            }}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};