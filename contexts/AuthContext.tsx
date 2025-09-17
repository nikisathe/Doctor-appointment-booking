
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// NOTE: Storing users and especially passwords in local storage is insecure and is
// done here only for demonstration purposes in this mock environment.
// In a real application, use a secure backend with password hashing.

const getUsersFromStorage = (): User[] => {
    try {
        const users = localStorage.getItem('docbook_users');
        return users ? JSON.parse(users) : [];
    } catch (error) {
        console.error("Failed to parse users from localStorage", error);
        return [];
    }
};

const getCurrentUserFromStorage = (): User | null => {
    try {
        const user = localStorage.getItem('docbook_currentUser');
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error("Failed to parse current user from localStorage", error);
        return null;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUserFromStorage();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userToStore } = foundUser;
      setUser(userToStore);
      localStorage.setItem('docbook_currentUser', JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getUsersFromStorage();
    if (users.some(u => u.email === email)) {
      return false; // User already exists
    }

    const newUser: User = { id: Date.now().toString(), name, email, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem('docbook_users', JSON.stringify(updatedUsers));
    
    // Automatically log in after signup
    const { password: _, ...userToStore } = newUser;
    setUser(userToStore);
    localStorage.setItem('docbook_currentUser', JSON.stringify(userToStore));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('docbook_currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
