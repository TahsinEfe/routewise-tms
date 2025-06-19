import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  phone?: string;
  roleName: string;
  companyId?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      username: string,
      roleName: string,
      companyId: number
  ) => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = 'http://localhost:7070/api/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('routewise_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Giriş fonksiyonu - backend'e istek atar
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // API response'un şu şekilde olmalı:
      // {
      //   "message": "Login successful!",
      //   "token": "jwt-token",
      //   "user": { "userId": ..., "firstName": ..., ... }
      // }

      const backendUser = data.user;
      const token = data.token;

      setUser(backendUser);
      localStorage.setItem('routewise_user', JSON.stringify(backendUser));
      if (token) {
        localStorage.setItem('token', token);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Kayıt fonksiyonu - backend'e istek atar
  const register = async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      username: string,
      roleName: string,
      companyId: number
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          password,
          email,
          roleName,
          companyId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Register failed');
      }

      const data = await response.json();

      // Başarılı kayıt sonrası otomatik login
      // Backend'den user bilgisi geliyorsa direkt set et, yoksa login yap
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('routewise_user', JSON.stringify(data.user));
      } else {
        await login(email, password);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('routewise_user');
  };

  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`  // Bunu kaldırın
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      const data = await response.json();

      // Güncellenmiş user bilgilerini context'e kaydet
      if (data.user) {
        setUser(data.user);
        localStorage.setItem('routewise_user', JSON.stringify(data.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <AuthContext.Provider value={{ user, login, register, updateUser, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
};