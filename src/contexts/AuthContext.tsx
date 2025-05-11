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

    if (details?.userId) { // Prioritize specific user if ID is given
      userToLogin = mockUsers.find(u => u.id === details.userId && u.role === role);
    } else if (role === ROLES.SITE_COORDINATOR && details?.siteId) {
      const site = mockSites.find(s => s.id === details.siteId);
      if (site?.coordinatorId) { // Check if site has a coordinatorId
        userToLogin = mockUsers.find(u => u.id === site.coordinatorId && u.role === ROLES.SITE_COORDINATOR);
      }
      if (!userToLogin) { // If no specific coordinator found for this site, or site has no coordinatorId
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
      if (sg?.leaderId) { // Check if small group has a leaderId
         userToLogin = mockUsers.find(u => u.id === sg.leaderId && u.role === ROLES.SMALL_GROUP_LEADER);
      }
      if (!userToLogin) { // If no specific leader found for this SG, or SG has no leaderId
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
      userToLogin = mockUsers.find(u => u.role === role);
    }

    // Final fallback if no user found by any means (e.g. national coordinator not in mockUsers)
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
      // Ensure siteId is populated for SG if only smallGroupId was passed
      if(role === ROLES.SMALL_GROUP_LEADER && details?.smallGroupId && !userToLogin.siteId){
           const sg = mockSmallGroups.find(s => s.id === details.smallGroupId);
           userToLogin.siteId = sg?.siteId;
      }
      console.warn(`No specific mock user found for role ${role}. Using a generic user:`, userToLogin);
    }
    
    // Ensure the final user object has the correct siteId/smallGroupId if passed through details,
    // especially if an existing user was found but their stored assignment needs updating for this session.
    if (role === ROLES.SITE_COORDINATOR && details?.siteId && userToLogin.siteId !== details.siteId) {
        userToLogin = {...userToLogin, siteId: details.siteId, smallGroupId: undefined}; // Site coordinators shouldn't have smallGroupId directly
    }
    if (role === ROLES.SMALL_GROUP_LEADER && details?.smallGroupId) {
        const sg = mockSmallGroups.find(s => s.id === details.smallGroupId);
        if (userToLogin.smallGroupId !== details.smallGroupId || userToLogin.siteId !== sg?.siteId) {
           userToLogin = {...userToLogin, smallGroupId: details.smallGroupId, siteId: sg?.siteId};
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
    // Optionally redirect to login page after logout
    // window.location.href = '/login'; // or use Next.js router if preferred and available here
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
