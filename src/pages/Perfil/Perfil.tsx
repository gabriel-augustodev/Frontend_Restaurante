import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Tabs } from '../../components/ui/Tabs';
import { DadosPessoais } from './DadosPessoais';
import { AlterarSenha } from './AlterarSenha';
import { Enderecos } from './Enderecos';
import { User, Lock, MapPin, ArrowLeft } from 'lucide-react';

export const Perfil: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [abaAtiva, setAbaAtiva] = useState('dados');

    const tabs = [
        { id: 'dados', label: 'Dados Pessoais', icon: <User className="w-4 h-4" /> },
        { id: 'senha', label: 'Alterar Senha', icon: <Lock className="w-4 h-4" /> },
        { id: 'enderecos', label: 'Endereços', icon: <MapPin className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-background-base">
            {/* Header */}
            <header className="bg-brand-primary py-4 px-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-text-primary hover:text-secondary transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="font-display text-2xl font-bold text-text-primary">
                        Meu Perfil
                    </h1>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Cabeçalho do usuário */}
                <div className="bg-background-card rounded-card shadow-card p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-secondary" />
                        </div>
                        <div>
                            <h2 className="font-display text-2xl font-bold text-text-primary">
                                {user?.nome}
                            </h2>
                            <p className="text-text-secondary">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Abas */}
                <Tabs
                    tabs={tabs}
                    activeTab={abaAtiva}
                    onChange={setAbaAtiva}
                />

                {/* Conteúdo da aba */}
                <div className="mt-6">
                    {abaAtiva === 'dados' && <DadosPessoais />}
                    {abaAtiva === 'senha' && <AlterarSenha />}
                    {abaAtiva === 'enderecos' && <Enderecos />}
                </div>
            </div>
        </div>
    );
};