import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { loadUsersFromCache, saveUsersToCache } from "@/utils/userCache";

interface UsersContextType {
  users: User[];
  setUsers: (users: User[]) => void;
  updateUsersCache: (users: User[]) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Initialize users cache and load once on mount - never reset
  useEffect(() => {
    // Ensure cache exists
    if (!localStorage.getItem("USERS_CACHE_V1")) {
      localStorage.setItem("USERS_CACHE_V1", JSON.stringify([]));
    }
    
    const cachedUsers = loadUsersFromCache();
    setUsers(cachedUsers);
  }, []);

  const updateUsersCache = (newUsers: User[]) => {
    setUsers(newUsers);
    saveUsersToCache(newUsers);
  };

  return (
    <UsersContext.Provider value={{ users, setUsers, updateUsersCache }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within UsersProvider");
  }
  return context;
};