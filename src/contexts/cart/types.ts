import type { Produto } from '../../services/api';

export interface CartItem {
    id: string;
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
    observacoes?: string;
    imagemUrl?: string | null;
    restauranteId: string; // ← ADICIONE ESTA LINHA
}

export interface CartContextData {
    items: CartItem[];
    restauranteId: string | null;
    addItem: (produto: Produto, observacoes?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantidade: number) => void;
    updateObservacoes: (itemId: string, observacoes: string) => void;
    clearCart: () => void;
    subtotal: number;
    totalItems: number;
    isEmpty: boolean;
}