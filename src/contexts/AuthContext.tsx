import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credential: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  picture: string;
  exp: number;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      try {
        const decoded: DecodedToken = jwtDecode(storedToken);
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser({
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            picture: decoded.picture,
          });
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credential: string) => {
    try {
      // For now, we'll decode the Google credential directly
      // In production, you'd send this to your backend for verification
      const decoded: DecodedToken = jwtDecode(credential);
      
      setToken(credential);
      setUser({
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      });
      
      localStorage.setItem('auth_token', credential);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
  };

  return (
    <GoogleOAuthProvider clientId="demo-client-id">
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};