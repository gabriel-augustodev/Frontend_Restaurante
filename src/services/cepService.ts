import axios from 'axios';

interface ViaCEPResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export interface EnderecoViaCEP {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
}

export const cepService = {
    buscar: async (cep: string): Promise<EnderecoViaCEP | null> => {
        // Remover caracteres não numéricos
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            throw new Error('CEP deve ter 8 dígitos');
        }

        try {
            const response = await axios.get<ViaCEPResponse>(`https://viacep.com.br/ws/${cepLimpo}/json/`);

            if (response.data.erro) {
                throw new Error('CEP não encontrado');
            }

            return {
                cep: response.data.cep,
                logradouro: response.data.logradouro,
                complemento: response.data.complemento || '',
                bairro: response.data.bairro,
                cidade: response.data.localidade,
                estado: response.data.uf,
            };
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            throw new Error('Erro ao consultar CEP');
        }
    }
};