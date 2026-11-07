
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
} from '../services/auth';

import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (
    credentials: LoginCredentials,
    selectedRole: UserRole,
  ) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    void restoreSession();
  }, []);
async function login(
  credentials: LoginCredentials,
  selectedRole: UserRole,
): Promise<void> {
  const response = await loginUser(credentials, selectedRole);
  setUser(response.user);
}


  async function register(credentials: RegisterCredentials): Promise<void> {
    const response = await registerUser(credentials);
    setUser(response.user);
  }

  async function logout(): Promise<void> {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isInitializing,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
