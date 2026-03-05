import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProductCardProps {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    description,
    price,
    image
}) => {
    return (
        <div className="bg-background-card rounded-card shadow-card p-4 flex gap-4">
            {image && (
                <img
                    src={image}
                    alt={name}
                    className="w-24 h-24 object-cover rounded-lg"
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
                        onClick={() => console.log('Adicionar produto:', id)}
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar
                    </Button>
                </div>
            </div>
        </div>
    );
};