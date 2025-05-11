// src/contexts/AuthContext.tsx
"use client";

import type { Role, User } from "@/lib/types";
import React, { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ROLES } from "@/lib/constants";
import { mockUsers, mockSites, mockSmallGroups } from "@/lib/mockData"; 

interface AuthContextType {
  currentUser: User | null;
  login: (role: Role, details?: { userId?: string, siteId?: string, smallGroupId?: string }) => void;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (updatedData: Partial<User>) => void;
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
        if (Object.values(ROLES).includes(parsedUser.role)) {
           setCurrentUser(parsedUser);
        } else {
          localStorage.removeItem("currentUser");
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("currentUser");
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((role: Role, details?: { userId?: string, siteId?: string, smallGroupId?: string }) => {
    setIsLoading(true);
    let userToLogin: User | undefined;

    // 1. Prioritize specific user if ID is given (from new login flow)
    if (details?.userId) {
      userToLogin = mockUsers.find(u => u.id === details.userId);
      if (userToLogin) {
        // Ensure the role matches, though the login page logic should already ensure this.
        // Also, update site/sg assignment if the selected user is being assigned contextually (e.g., an NC leading an SG temporarily)
        userToLogin.role = role; 
        if (details.siteId) userToLogin.siteId = details.siteId;
        if (details.smallGroupId) userToLogin.smallGroupId = details.smallGroupId;
      }
    }
    
    // 2. Fallback: If no userId, or user not found by ID (should be rare with new flow), use existing logic
    if (!userToLogin) {
        if (role === ROLES.SITE_COORDINATOR && details?.siteId) {
          const site = mockSites.find(s => s.id === details.siteId);
          // Site coordinator ID is now a user ID
          if (site?.coordinatorId) userToLogin = mockUsers.find(u => u.id === site.coordinatorId && u.role === ROLES.SITE_COORDINATOR);
          
          if (!userToLogin) { // Generic fallback if no specific coordinator for that site by ID
            userToLogin = {
              id: `generic-site-${details.siteId}-${Date.now()}`,
              name: `${site?.name || 'Site'} Coordinator`,
              email: `${site?.name?.toLowerCase().replace(/\s+/g, '') || 'site_coord'}@aylf.org`,
              role: ROLES.SITE_COORDINATOR,
              siteId: details.siteId,
            };
          }
        } else if (role === ROLES.SMALL_GROUP_LEADER && details?.smallGroupId) {
          const sg = mockSmallGroups.find(s => s.id === details.smallGroupId);
          if (sg?.leaderId) userToLogin = mockUsers.find(u => u.id === sg.leaderId && u.role === ROLES.SMALL_GROUP_LEADER);

          if (!userToLogin) { // Generic fallback
            userToLogin = {
              id: `generic-sg-${details.smallGroupId}-${Date.now()}`,
              name: `${sg?.name || 'Small Group'} Leader`,
              email: `${sg?.name?.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '') || 'sg_leader'}@aylf.org`,
              role: ROLES.SMALL_GROUP_LEADER,
              smallGroupId: details.smallGroupId,
              siteId: sg?.siteId, 
            };
          }
        } else { // National Coordinator or any other role without specific entity selection
          // For NC, the new flow passes userId. This is a deeper fallback.
          userToLogin = mockUsers.find(u => u.role === role); 
        }
    }


    // Final fallback if no user found by any means
    if (!userToLogin) {
      const genericUserName = role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      userToLogin = {
        id: `generic-${role}-${details?.siteId || details?.smallGroupId || Date.now()}`,
        name: `${genericUserName} User`,
        email: `${role.replace(/_/g, '')}@aylf.org`,
        role,
        siteId: details?.siteId,
        smallGroupId: details?.smallGroupId,
      };
      if(role === ROLES.SMALL_GROUP_LEADER && details?.smallGroupId && !userToLogin.siteId){
           const sg = mockSmallGroups.find(s => s.id === details.smallGroupId);
           userToLogin.siteId = sg?.siteId;
      }
      console.warn(`No specific mock user found for role ${role} and details provided. Using a generic user:`, userToLogin);
    }
    
    // Ensure the final user object has the correct siteId/smallGroupId if passed through details,
    // especially if an existing user was found but their stored assignment needs updating for this session.
     if (userToLogin) {
        userToLogin.role = role; // Ensure the role is what was selected
        if (role === ROLES.SITE_COORDINATOR && details?.siteId) {
            userToLogin.siteId = details.siteId;
            userToLogin.smallGroupId = undefined; 
        }
        if (role === ROLES.SMALL_GROUP_LEADER && details?.smallGroupId) {
            const sg = mockSmallGroups.find(s => s.id === details.smallGroupId);
            userToLogin.smallGroupId = details.smallGroupId;
            userToLogin.siteId = sg?.siteId;
        }
        if (role === ROLES.NATIONAL_COORDINATOR) {
            userToLogin.siteId = undefined;
            userToLogin.smallGroupId = undefined;
        }
    }
    
    setCurrentUser(userToLogin);
    localStorage.setItem("currentUser", JSON.stringify(userToLogin));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setIsLoading(false);
  }, []);

  const updateUserProfile = useCallback((updatedData: Partial<User>) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedData };
      if (updatedData.role && updatedData.role !== currentUser.role) {
        console.warn("Role cannot be changed from profile edit. Ignoring role update.");
        newUser.role = currentUser.role;
      }
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...newUser };
      }
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

