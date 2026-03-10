import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Search } from 'lucide-react';
import { cepService } from '../../services/cepService';

interface EnderecoFormData {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    isPrincipal?: boolean;
}

interface EnderecoFormProps {
    initialData?: Partial<EnderecoFormData>;
    onSubmit: (data: EnderecoFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export const EnderecoForm: React.FC<EnderecoFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const [formData, setFormData] = useState<EnderecoFormData>({
        cep: initialData?.cep || '',
        logradouro: initialData?.logradouro || '',
        numero: initialData?.numero || '',
        complemento: initialData?.complemento || '',
        bairro: initialData?.bairro || '',
        cidade: initialData?.cidade || '',
        estado: initialData?.estado || '',
        isPrincipal: initialData?.isPrincipal || false,
    });

    const [buscandoCep, setBuscandoCep] = useState(false);
    const [erroCep, setErroCep] = useState('');
    const [erro, setErro] = useState('');

    // Formatar CEP enquanto digita
    const formatarCep = (value: string) => {
        const cepLimpo = value.replace(/\D/g, '');
        if (cepLimpo.length <= 5) return cepLimpo;
        return cepLimpo.replace(/^(\d{5})(\d{0,3})/, '$1-$2');
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cepFormatado = formatarCep(e.target.value);
        setFormData(prev => ({ ...prev, cep: cepFormatado }));
        setErroCep('');
    };

    const buscarCep = async () => {
        const cepLimpo = formData.cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            setErroCep('CEP deve ter 8 dígitos');
            return;
        }

        setBuscandoCep(true);
        setErroCep('');

        try {
            const endereco = await cepService.buscar(cepLimpo);

            if (endereco) {
                setFormData(prev => ({
                    ...prev,
                    logradouro: endereco.logradouro,
                    bairro: endereco.bairro,
                    cidade: endereco.cidade,
                    estado: endereco.estado,
                    complemento: endereco.complemento || prev.complemento,
                }));
            }
        } catch (error) {
            setErroCep(error instanceof Error ? error.message : 'Erro ao buscar CEP');
        } finally {
            setBuscandoCep(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        // Validações
        if (!formData.cep) {
            setErro('CEP é obrigatório');
            return;
        }

        if (!formData.logradouro) {
            setErro('Logradouro é obrigatório');
            return;
        }

        if (!formData.numero) {
            setErro('Número é obrigatório');
            return;
        }

        if (!formData.bairro) {
            setErro('Bairro é obrigatório');
            return;
        }

        if (!formData.cidade) {
            setErro('Cidade é obrigatória');
            return;
        }

        if (!formData.estado) {
            setErro('Estado é obrigatório');
            return;
        }

        // Limpar CEP antes de enviar
        const dataToSubmit = {
            ...formData,
            cep: formData.cep.replace(/\D/g, ''),
        };

        await onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {erro && (
                <div className="bg-red-500/10 border border-red-500 rounded-card p-3">
                    <p className="text-red-500 text-sm">{erro}</p>
                </div>
            )}

            {/* CEP */}
            <div>
                <label className="block text-text-secondary text-sm mb-2">
                    CEP <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={formData.cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        maxLength={9}
                        className="flex-1 bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <button
                        type="button"
                        onClick={buscarCep}
                        disabled={buscandoCep}
                        className="bg-secondary text-background-base px-4 rounded-button hover:bg-secondary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        {buscandoCep ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
                {erroCep && (
                    <p className="text-red-500 text-xs mt-1">{erroCep}</p>
                )}
            </div>

            {/* Logradouro */}
            <div>
                <label className="block text-text-secondary text-sm mb-2">
                    Logradouro <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.logradouro}
                    onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
                    className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                />
            </div>

            {/* Número e Complemento */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-text-secondary text-sm mb-2">
                        Número <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.numero}
                        onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                        className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <div>
                    <label className="block text-text-secondary text-sm mb-2">
                        Complemento
                    </label>
                    <input
                        type="text"
                        value={formData.complemento}
                        onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                        className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="Apto, Bloco, etc"
                    />
                </div>
            </div>

            {/* Bairro */}
            <div>
                <label className="block text-text-secondary text-sm mb-2">
                    Bairro <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.bairro}
                    onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                    className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                />
            </div>

            {/* Cidade e Estado */}
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-text-secondary text-sm mb-2">
                        Cidade <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.cidade}
                        onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                        className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary"
                    />
                </div>
                <div>
                    <label className="block text-text-secondary text-sm mb-2">
                        Estado <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={formData.estado}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value.toUpperCase() }))}
                        maxLength={2}
                        className="w-full bg-background-input text-text-primary rounded-button py-3 px-4 outline-none focus:ring-2 focus:ring-secondary uppercase"
                        placeholder="SP"
                    />
                </div>
            </div>

            {/* Checkbox Principal */}
            <div className="flex items-center gap-3 pt-2">
                <input
                    type="checkbox"
                    id="isPrincipal"
                    checked={formData.isPrincipal}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPrincipal: e.target.checked }))}
                    className="w-4 h-4 text-secondary focus:ring-secondary rounded"
                />
                <label htmlFor="isPrincipal" className="text-text-secondary text-sm">
                    Definir como endereço principal
                </label>
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : 'Salvar endereço'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1"
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export type { EnderecoFormData };