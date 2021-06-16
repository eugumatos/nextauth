import { useState, useEffect, createContext, ReactNode } from "react";
import { setCookie, parseCookies } from "nookies";
import { api } from "../services/api";
import Router from "next/router";

type AuthProviderProps = {
  children: ReactNode;
}

type SignInCredentials = {
  email: string;
  password: string;
}

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  user: User;
  isAuthenticated: boolean;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api.get("/me").then(response => {
        const { email, permissions, roles } = response.data;

        setUser({ email, permissions, roles });
      })
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password
      });

      const { token, refreshToken, permissions, roles } = response.data;
  
      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      });
      
      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/"
      });

      setUser({
        email,
        permissions, 
        roles
      });

      api.defaults.headers['Authorization'] = `Berear ${token}`;

      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}