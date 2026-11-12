import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'pet-sitting-auth';

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null; } catch { return null; }
    });
    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
    }, []);
    const request = useCallback(async (url, options = {}) => {
        const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers };
        if (session?.token) headers.Authorization = `Bearer ${session.token}`;
        const response = await fetch(url, { ...options, headers });
        const data = await response.json().catch(() => ({}));
        if (response.status === 401 && session?.token) logout();
        return { response, data };
    }, [logout, session]);
    const value = useMemo(() => ({
        user: session?.user || null,
        token: session?.token || null,
        request,
        logout,
        login: (result) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(result)); setSession(result); },
    }), [session, request, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const value = useContext(AuthContext);
    if (!value) throw new Error('useAuth must be used inside AuthProvider.');
    return value;
};
