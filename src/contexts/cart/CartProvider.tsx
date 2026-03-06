import React, { useState, useEffect, useCallback } from 'react';
import { CartContext } from './CartContext';
import type { CartItem } from './types';
import type { Produto } from '../../services/api';

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [restauranteId, setRestauranteId] = useState<string | null>(null);

    // Carregar carrinho do localStorage ao iniciar
    useEffect(() => {
        const storedCart = localStorage.getItem('@GourmetDash:cart');
        if (storedCart) {
            try {
                const parsed = JSON.parse(storedCart);
                setItems(parsed.items || []);
                setRestauranteId(parsed.restauranteId || null);
            } catch (error) {
                console.error('Erro ao carregar carrinho:', error);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Salvar carrinho no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('@GourmetDash:cart', JSON.stringify({
            items,
            restauranteId
        }));
    }, [items, restauranteId]);

    const addItem = useCallback((produto: Produto, observacoes?: string) => {
        setItems(prev => {
            // Verificar se está adicionando de um restaurante diferente
            if (restauranteId && restauranteId !== produto.restauranteId) {
                if (window.confirm('Você já tem itens de outro restaurante no carrinho. Deseja limpar o carrinho e adicionar este produto?')) {
                    setRestauranteId(produto.restauranteId);
                    return [{
                        id: `${produto.id}-${Date.now()}`,
                        produtoId: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        quantidade: 1,
                        observacoes,
                        imagemUrl: produto.imagemUrl,
                        restauranteId: produto.restauranteId
                    }];
                }
                return prev;
            }

            // Se for o mesmo restaurante, verificar se produto já existe
            const existingItem = prev.find(item => item.produtoId === produto.id);

            if (existingItem) {
                // Incrementar quantidade
                return prev.map(item =>
                    item.produtoId === produto.id
                        ? { ...item, quantidade: item.quantidade + 1 }
                        : item
                );
            }

            // Adicionar novo item
            setRestauranteId(produto.restauranteId);
            return [...prev, {
                id: `${produto.id}-${Date.now()}`,
                produtoId: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                quantidade: 1,
                observacoes,
                imagemUrl: produto.imagemUrl,
                restauranteId: produto.restauranteId
            }];
        });
    }, [restauranteId]);

    const removeItem = useCallback((itemId: string) => {
        setItems(prev => {
            const newItems = prev.filter(item => item.id !== itemId);
            if (newItems.length === 0) {
                setRestauranteId(null);
            }
            return newItems;
        });
    }, []);

    const updateQuantity = useCallback((itemId: string, quantidade: number) => {
        if (quantidade < 1) {
            removeItem(itemId);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, quantidade }
                    : item
            )
        );
    }, [removeItem]);

    const updateObservacoes = useCallback((itemId: string, observacoes: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === itemId
                    ? { ...item, observacoes }
                    : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setRestauranteId(null);
    }, []);

    const subtotal = items.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantidade, 0);
    const isEmpty = items.length === 0;

    return (
        <CartContext.Provider value={{
            items,
            restauranteId,
            addItem,
            removeItem,
            updateQuantity,
            updateObservacoes,
            clearCart,
            subtotal,
            totalItems,
            isEmpty
        }}>
            {children}
        </CartContext.Provider>
    );
};