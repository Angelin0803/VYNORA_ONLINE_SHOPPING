import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';
import { apiClient } from '../services/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  setDefaultAddress: (id: string) => void;
  updateSuperCoins: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check initial user from localStorage or API
    const stored = localStorage.getItem('vynora_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        // ignore
      }
    } else {
      // Default demo profile for seamless experience
      apiClient.login('angelin@vynora.in').then(u => setUser(u)).catch(() => {});
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const u = await apiClient.login(email);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string) => {
    setIsLoading(true);
    try {
      const u = await apiClient.register(name, email, phone);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vynora_user');
  };

  const addAddress = async (addrData: Omit<Address, 'id'>) => {
    if (!user) return;
    const newAddr: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
      isDefault: user.addresses.length === 0 ? true : addrData.isDefault
    };

    const updatedAddresses = addrData.isDefault
      ? user.addresses.map(a => ({ ...a, isDefault: false })).concat(newAddr)
      : [...user.addresses, newAddr];

    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('vynora_user', JSON.stringify(updatedUser));
  };

  const setDefaultAddress = (id: string) => {
    if (!user) return;
    const updated = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    const updatedUser = { ...user, addresses: updated };
    setUser(updatedUser);
    localStorage.setItem('vynora_user', JSON.stringify(updatedUser));
  };

  const updateSuperCoins = (amount: number) => {
    if (!user) return;
    const updatedUser = { ...user, superCoins: Math.max(0, user.superCoins + amount) };
    setUser(updatedUser);
    localStorage.setItem('vynora_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      addAddress,
      setDefaultAddress,
      updateSuperCoins
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
