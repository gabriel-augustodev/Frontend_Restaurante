import React from 'react';
import { X } from 'lucide-react';
import { EnderecoForm } from './EnderecoForm';
import type { EnderecoFormData } from './EnderecoForm';

interface EnderecoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: EnderecoFormData) => Promise<void>;
    initialData?: Partial<EnderecoFormData>;
    title?: string;
    loading?: boolean;
}

export const EnderecoModal: React.FC<EnderecoModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData,
    title = 'Novo Endereço',
    loading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background-card w-full max-w-2xl rounded-card shadow-card max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-subtle sticky top-0 bg-background-card z-10">
                    <h3 className="font-display text-xl font-bold text-text-primary">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    <EnderecoForm
                        initialData={initialData}
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};