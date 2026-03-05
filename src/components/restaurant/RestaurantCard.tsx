import React from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/Button';

interface RestaurantCardProps {
    id: string;
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    deliveryFee: number;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
    id,
    name,
    image,
    rating,
    deliveryTime,
    deliveryFee
}) => {
    const handleViewMenu = () => {
        // Aqui você pode navegar para a página do restaurante
        console.log('Ver cardápio do restaurante:', id);
        // Exemplo de navegação futura:
        // navigate(`/restaurante/${id}`);
    };

    return (
        <div className="bg-background-card rounded-card shadow-card overflow-hidden hover:scale-[1.02] transition-transform duration-300">
            <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover"
            />

            <div className="p-4">
                <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                    {name}
                </h3>

                <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-text-secondary">{rating.toFixed(1)}</span>
                    <span className="text-text-secondary mx-1">•</span>
                    <span className="text-text-secondary">{deliveryTime} min</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-text-accent font-semibold">
                        Entrega: R$ {deliveryFee.toFixed(2)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleViewMenu}
                    >
                        Ver cardápio
                    </Button>
                </div>
            </div>
        </div>
    );
};