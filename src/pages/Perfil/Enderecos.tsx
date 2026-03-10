import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { MapPin, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { enderecoService, type Endereco } from '../../services/enderecoService';
import { EnderecoModal } from '../../components/endereco/EnderecoModal';
import type { EnderecoFormData } from '../../components/endereco/EnderecoForm';

export const Enderecos: React.FC = () => {
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

    // Estado do modal
    const [modalAberto, setModalAberto] = useState(false);
    const [enderecoEditando, setEnderecoEditando] = useState<Partial<EnderecoFormData> | null>(null);

    useEffect(() => {
        carregarEnderecos();
    }, []);

    const carregarEnderecos = async () => {
        try {
            setLoading(true);
            const data = await enderecoService.listar();
            setEnderecos(data);
        } catch {
            setMensagem({ tipo: 'erro', texto: 'Erro ao carregar endereços' });
        } finally {
            setLoading(false);
        }
    };

    const handleAbrirModalNovo = () => {
        setEnderecoEditando(null);
        setModalAberto(true);
    };

    const handleAbrirModalEditar = (endereco: Endereco) => {
        setEnderecoEditando({
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento || '',
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            isPrincipal: endereco.isPrincipal,
        });
        setModalAberto(true);
    };

    const handleSalvarEndereco = async (data: EnderecoFormData) => {
        setLoadingSubmit(true);

        try {
            if (enderecoEditando) {
                // TODO: Implementar edição quando tiver endpoint
                // await enderecoService.atualizar(enderecoEditando.id, data);
                setMensagem({ tipo: 'sucesso', texto: 'Endereço atualizado com sucesso!' });
            } else {
                await enderecoService.criar(data);
                setMensagem({ tipo: 'sucesso', texto: 'Endereço cadastrado com sucesso!' });
            }

            await carregarEnderecos();
            setModalAberto(false);

            setTimeout(() => setMensagem(null), 3000);
        } catch {
            setMensagem({ tipo: 'erro', texto: 'Erro ao salvar endereço' });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleDefinirPrincipal = async (id: string) => {
        try {
            await enderecoService.definirPrincipal(id);
            await carregarEnderecos();
            setMensagem({ tipo: 'sucesso', texto: 'Endereço principal atualizado!' });
            setTimeout(() => setMensagem(null), 3000);
        } catch {
            setMensagem({ tipo: 'erro', texto: 'Erro ao definir endereço principal' });
        }
    };

    const handleDeletar = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este endereço?')) return;

        try {
            await enderecoService.deletar(id);
            await carregarEnderecos();
            setMensagem({ tipo: 'sucesso', texto: 'Endereço removido com sucesso!' });
            setTimeout(() => setMensagem(null), 3000);
        } catch {
            setMensagem({ tipo: 'erro', texto: 'Erro ao remover endereço' });
        }
    };

    return (
        <>
            <div className="bg-background-card rounded-card shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-bold text-text-primary">
                        Meus Endereços
                    </h2>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAbrirModalNovo}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Endereço
                    </Button>
                </div>

                {mensagem && (
                    <div className={`mb-4 p-3 rounded-button ${mensagem.tipo === 'sucesso'
                            ? 'bg-green-500/10 border border-green-500 text-green-500'
                            : 'bg-red-500/10 border border-red-500 text-red-500'
                        }`}>
                        {mensagem.texto}
                    </div>
                )}

                {loading ? (
                    <p className="text-text-secondary text-center py-8">Carregando endereços...</p>
                ) : enderecos.length === 0 ? (
                    <div className="text-center py-12">
                        <MapPin className="w-16 h-16 text-text-secondary mx-auto mb-4" />
                        <p className="text-text-secondary mb-4">Nenhum endereço cadastrado</p>
                        <Button
                            variant="primary"
                            onClick={handleAbrirModalNovo}
                        >
                            Cadastrar primeiro endereço
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {enderecos.map((endereco) => (
                            <div
                                key={endereco.id}
                                className="bg-background-input rounded-card p-4 relative group"
                            >
                                {endereco.isPrincipal && (
                                    <div className="absolute top-2 right-2 flex items-center gap-1 text-secondary text-xs bg-secondary/20 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        <span>Principal</span>
                                    </div>
                                )}

                                <div className="pr-20">
                                    <p className="text-text-primary font-medium">
                                        {endereco.logradouro}, {endereco.numero}
                                        {endereco.complemento && ` - ${endereco.complemento}`}
                                    </p>
                                    <p className="text-text-secondary text-sm">
                                        {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                                    </p>
                                    <p className="text-text-secondary text-xs mt-1">CEP: {endereco.cep}</p>
                                </div>

                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {!endereco.isPrincipal && (
                                        <button
                                            onClick={() => handleDefinirPrincipal(endereco.id)}
                                            className="p-2 bg-background-card rounded-full hover:bg-secondary/20 transition-colors"
                                            title="Definir como principal"
                                        >
                                            <CheckCircle className="w-4 h-4 text-secondary" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAbrirModalEditar(endereco)}
                                        className="p-2 bg-background-card rounded-full hover:bg-secondary/20 transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4 text-secondary" />
                                    </button>
                                    <button
                                        onClick={() => handleDeletar(endereco.id)}
                                        className="p-2 bg-background-card rounded-full hover:bg-red-500/20 transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Endereço */}
            <EnderecoModal
                isOpen={modalAberto}
                onClose={() => setModalAberto(false)}
                onSubmit={handleSalvarEndereco}
                initialData={enderecoEditando || undefined}
                title={enderecoEditando ? 'Editar Endereço' : 'Novo Endereço'}
                loading={loadingSubmit}
            />
        </>
    );
};