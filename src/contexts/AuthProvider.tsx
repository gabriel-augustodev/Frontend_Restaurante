import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from './types'; // ← Use 'import type'
import { authService } from '../services/authService';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStoredData = () => {
            try {
                const token = localStorage.getItem('@GourmetDash:token');
                const userData = localStorage.getItem('@GourmetDash:user');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Erro ao carregar dados do storage:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStoredData();
    }, []);

    const signIn = async (email: string, senha: string) => {
        try {
            const response = await authService.login({ email, senha });

            localStorage.setItem('@GourmetDash:token', response.accessToken);
            localStorage.setItem('@GourmetDash:refreshToken', response.refreshToken);
            localStorage.setItem('@GourmetDash:user', JSON.stringify(response.user));

            setUser(response.user);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    };

    const signUp = async (data: { email: string; senha: string; nome: string }) => {
        try {
            const response = await authService.register(data);

            localStorage.setItem('@GourmetDash:token', response.accessToken);
            localStorage.setItem('@GourmetDash:refreshToken', response.refreshToken);
            localStorage.setItem('@GourmetDash:user', JSON.stringify(response.user));

            setUser(response.user);
        } catch (error) {
            console.error('Erro no registro:', error);
            throw error;
        }
    };

    const signOut = () => {
        localStorage.removeItem('@GourmetDash:token');
        localStorage.removeItem('@GourmetDash:refreshToken');
        localStorage.removeItem('@GourmetDash:user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};