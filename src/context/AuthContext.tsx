import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { UserData } from '../types';

interface AuthContextType {
    user: UserData | null;
    setUser: (user: UserData | null) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {},
    isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('jwt_token');
        if (token) {
            api.get('/user/current-user', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => setUser(res.data))
                .catch(() => setUser(null));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
