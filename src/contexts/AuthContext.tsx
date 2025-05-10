// src/contexts/AuthContext.tsx
"use client";

import type { Role, User } from "@/lib/types";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ROLES } from "@/lib/constants";
import { mockUsers } from "@/lib/mockData"; // Assuming mockUsers are defined here

interface AuthContextType {
  currentUser: User | null;
  login: (role: Role, userId?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // Validate if the stored role is one of the defined ROLES
        if (Object.values(ROLES).includes(parsedUser.role)) {
           setCurrentUser(parsedUser);
        } else {
          // Invalid role, clear storage
          localStorage.removeItem("currentUser");
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("currentUser");
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((role: Role, userId?: string) => {
    setIsLoading(true);
    // Find a user that matches the role, or the specific userId if provided
    const userToLogin = userId 
      ? mockUsers.find(u => u.id === userId && u.role === role)
      : mockUsers.find(u => u.role === role);

    if (userToLogin) {
      setCurrentUser(userToLogin);
      localStorage.setItem("currentUser", JSON.stringify(userToLogin));
    } else {
      // Fallback if no matching user is found for the role (or specific user)
      // This could be an error, or a generic user object for that role
      const genericUser: User = { 
        id: userId || `generic-${role}-${Date.now()}`, 
        name: `${role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} User`, 
        email: `${role}@aylf.org`, 
        role 
      };
      setCurrentUser(genericUser);
      localStorage.setItem("currentUser", JSON.stringify(genericUser));
      console.warn(`No specific mock user found for role ${role} ${userId ? `with ID ${userId}` : ''}. Using a generic user.`);
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
