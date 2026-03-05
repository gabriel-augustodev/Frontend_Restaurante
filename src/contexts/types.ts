export interface User {
    id: string;
    email: string;
    nome: string;
    role: string;
}

export interface AuthContextData {
    user: User | null;
    loading: boolean;
    signIn: (email: string, senha: string) => Promise<void>;
    signUp: (data: { email: string; senha: string; nome: string }) => Promise<void>;
    signOut: () => void;
}