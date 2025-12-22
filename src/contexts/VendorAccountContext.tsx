import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockVendorAccounts, VendorAccount } from '@/data/mockVendorAccounts';

interface VendorAccountContextType {
  vendorAccounts: VendorAccount[];
  isLoading: boolean;
  error: string | null;
  addVendorAccount: (account: Omit<VendorAccount, 'id' | 'createdDate'>) => void;
  updateVendorAccount: (id: string, account: Partial<VendorAccount>) => void;
  deleteVendorAccount: (id: string) => void;
  getVendorAccountById: (id: string) => VendorAccount | undefined;
  getVendorAccountsByVendor: (vendorId: string) => VendorAccount[];
  getVendorAccountsByRole: (role: string) => VendorAccount[];
}

const VendorAccountContext = createContext<VendorAccountContextType | undefined>(undefined);

export const VendorAccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vendorAccounts, setVendorAccounts] = useState<VendorAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAccounts = localStorage.getItem('vendorAccounts');
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        setVendorAccounts(parsed.map((va: VendorAccount) => ({
          ...va,
          createdDate: new Date(va.createdDate),
          lastLogin: va.lastLogin ? new Date(va.lastLogin) : undefined
        })));
      } catch (error) {
        console.error('Error parsing saved vendor accounts:', error);
        setVendorAccounts(mockVendorAccounts);
      }
    } else {
      setVendorAccounts(mockVendorAccounts);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (vendorAccounts.length > 0) {
      localStorage.setItem('vendorAccounts', JSON.stringify(vendorAccounts));
    }
  }, [vendorAccounts]);

  const addVendorAccount = (accountData: Omit<VendorAccount, 'id' | 'createdDate'>) => {
    const newAccount: VendorAccount = {
      ...accountData,
      id: `VA${String(vendorAccounts.length + 1).padStart(3, '0')}`,
      createdDate: new Date()
    };
    setVendorAccounts(prev => [...prev, newAccount]);
  };

  const updateVendorAccount = (id: string, updates: Partial<VendorAccount>) => {
    setVendorAccounts(prev => prev.map(va => va.id === id ? { ...va, ...updates } : va));
  };

  const deleteVendorAccount = (id: string) => {
    setVendorAccounts(prev => prev.filter(va => va.id !== id));
  };

  const getVendorAccountById = (id: string) => {
    return vendorAccounts.find(va => va.id === id);
  };

  const getVendorAccountsByVendor = (vendorId: string) => {
    return vendorAccounts.filter(va => va.vendorId === vendorId);
  };

  const getVendorAccountsByRole = (role: string) => {
    return vendorAccounts.filter(va => va.role === role);
  };

  return (
    <VendorAccountContext.Provider
      value={{
        vendorAccounts,
        isLoading,
        error,
        addVendorAccount,
        updateVendorAccount,
        deleteVendorAccount,
        getVendorAccountById,
        getVendorAccountsByVendor,
        getVendorAccountsByRole
      }}
    >
      {children}
    </VendorAccountContext.Provider>
  );
};

export const useVendorAccounts = () => {
  const context = useContext(VendorAccountContext);
  if (!context) {
    throw new Error('useVendorAccounts must be used within VendorAccountProvider');
  }
  return context;
};
