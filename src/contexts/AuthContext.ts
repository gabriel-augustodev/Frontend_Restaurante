import { createContext } from 'react';
import type { AuthContextData } from './types'; // ← Use 'import type'

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);