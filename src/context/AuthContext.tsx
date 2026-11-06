import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { loginUser, registerUser } from '../services/auth';
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UserRole,
} from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials,
    selectedRole: UserRole,
  ) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function login(
    credentials: LoginCredentials,
    selectedRole: UserRole,
  ): Promise<void> {
    const response = await loginUser(credentials);

    if (response.user.role !== selectedRole) {
      if (selectedRole === 'ADMIN' && response.user.role === 'STAFF') {
        throw new Error(
          'You need to be promoted to be able to log in as an Admin.',
        );
      }

      if (selectedRole === 'STAFF' && response.user.role === 'ADMIN') {
        throw new Error('Your account is Admin. Please choose Admin to log in.');
      }
    }

    setUser(response.user);
    setToken(response.token);
  }

  async function register(credentials: RegisterCredentials): Promise<void> {
    const response = await registerUser(credentials);
    setUser(response.user);
    setToken(response.token);
  }

  function logout(): void {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
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