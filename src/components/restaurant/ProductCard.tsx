import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    onAddToCart?: () => void;
    onImageError?: () => void;  // ← ADICIONE ESTA LINHA
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    description,
    price,
    image,
    onAddToCart,
    onImageError
}) => {
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        if (onAddToCart) {
            onAddToCart();
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
        }
    };

    return (
        <div
            className="bg-background-card rounded-card shadow-card p-4 flex gap-4"
            data-product-id={id}
        >
            {image && (
                <img
                    src={image}
                    alt={name}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={onImageError}  // ← USE A PROP AQUI
                />
            )}

            <div className="flex-1">
                <h4 className="font-display text-lg font-semibold text-text-primary mb-1">
                    {name}
                </h4>
                <p className="text-text-secondary text-sm mb-2 line-clamp-2">
                    {description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-text-accent font-bold text-lg">
                        R$ {price.toFixed(2)}
                    </span>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAdd}
                        className={`transition-all duration-300 ${added ? 'bg-green-600 hover:bg-green-700' : ''
                            }`}
                    >
                        {added ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Adicionado
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-1" />
                                Adicionar
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};