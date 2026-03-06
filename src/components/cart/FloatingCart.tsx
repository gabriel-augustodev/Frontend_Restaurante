import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';

interface FloatingCartProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const {
        items,
        subtotal,
        updateQuantity,
        removeItem,
        updateObservacoes,
        clearCart
    } = useCart();

    if (!isOpen) return null;

    const handleCheckout = () => {
        onClose();
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
            <div className="bg-background-card w-full max-w-md rounded-card shadow-card max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                    <h3 className="font-display text-xl font-bold text-text-primary">
                        Seu carrinho
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-primary"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Lista de itens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <p className="text-center text-text-secondary py-8">
                            Seu carrinho está vazio
                        </p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-3 border-b border-border-subtle pb-4 last:border-0">
                                {item.imagemUrl && (
                                    <img
                                        src={item.imagemUrl}
                                        alt={item.nome}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                )}

                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-text-primary">
                                                {item.nome}
                                            </h4>
                                            <p className="text-text-accent font-bold">
                                                R$ {(item.preco * item.quantidade).toFixed(2)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-text-secondary hover:text-brand-primary"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Quantidade */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                                            className="p-1 bg-background-input rounded hover:bg-background-modal"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="text-text-primary w-8 text-center">
                                            {item.quantidade}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                                            className="p-1 bg-background-input rounded hover:bg-background-modal"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Observações */}
                                    <input
                                        type="text"
                                        placeholder="Observações (ex: sem cebola)"
                                        value={item.observacoes || ''}
                                        onChange={(e) => updateObservacoes(item.id, e.target.value)}
                                        className="w-full mt-2 text-sm bg-background-input text-text-primary rounded p-2 outline-none focus:ring-1 focus:ring-secondary"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-4 border-t border-border-subtle space-y-4">
                        <div className="flex items-center justify-between text-text-primary">
                            <span className="font-medium">Subtotal</span>
                            <span className="font-bold text-text-accent">
                                R$ {subtotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearCart}
                                className="flex-1"
                            >
                                Limpar
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleCheckout}
                                className="flex-1"
                            >
                                Finalizar pedido
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};