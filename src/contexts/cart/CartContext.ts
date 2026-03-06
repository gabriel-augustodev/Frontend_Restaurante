import { createContext } from 'react';
import type { CartContextData } from './types';

export const CartContext = createContext<CartContextData>({} as CartContextData);