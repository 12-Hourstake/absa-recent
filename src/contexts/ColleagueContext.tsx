import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockColleagues, Colleague } from '@/data/mockColleagues';

interface ColleagueContextType {
  colleagues: Colleague[];
  isLoading: boolean;
  error: string | null;
  addColleague: (colleague: Omit<Colleague, 'id' | 'requestCount'>) => void;
  updateColleague: (id: string, colleague: Partial<Colleague>) => void;
  deleteColleague: (id: string) => void;
  getColleagueById: (id: string) => Colleague | undefined;
  getColleaguesByBranch: (branchId: string) => Colleague[];
  getColleaguesByDepartment: (department: string) => Colleague[];
}

const ColleagueContext = createContext<ColleagueContextType | undefined>(undefined);

export const ColleagueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedColleagues = localStorage.getItem('colleagues');
    if (savedColleagues) {
      try {
        const parsed = JSON.parse(savedColleagues);
        setColleagues(parsed.map((c: Colleague) => ({
          ...c,
          joinDate: new Date(c.joinDate)
        })));
      } catch (error) {
        console.error('Error parsing saved colleagues:', error);
        setColleagues(mockColleagues);
      }
    } else {
      setColleagues(mockColleagues);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (colleagues.length > 0) {
      localStorage.setItem('colleagues', JSON.stringify(colleagues));
    }
  }, [colleagues]);

  const addColleague = (colleagueData: Omit<Colleague, 'id' | 'requestCount'>) => {
    const newColleague: Colleague = {
      ...colleagueData,
      id: `COL${String(colleagues.length + 1).padStart(3, '0')}`,
      requestCount: 0
    };
    setColleagues(prev => [...prev, newColleague]);
  };

  const updateColleague = (id: string, updates: Partial<Colleague>) => {
    setColleagues(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteColleague = (id: string) => {
    setColleagues(prev => prev.filter(c => c.id !== id));
  };

  const getColleagueById = (id: string) => {
    return colleagues.find(c => c.id === id);
  };

  const getColleaguesByBranch = (branchId: string) => {
    return colleagues.filter(c => c.branchId === branchId);
  };

  const getColleaguesByDepartment = (department: string) => {
    return colleagues.filter(c => c.department === department);
  };

  return (
    <ColleagueContext.Provider
      value={{
        colleagues,
        isLoading,
        error,
        addColleague,
        updateColleague,
        deleteColleague,
        getColleagueById,
        getColleaguesByBranch,
        getColleaguesByDepartment
      }}
    >
      {children}
    </ColleagueContext.Provider>
  );
};

export const useColleagues = () => {
  const context = useContext(ColleagueContext);
  if (!context) {
    throw new Error('useColleagues must be used within ColleagueProvider');
  }
  return context;
};
