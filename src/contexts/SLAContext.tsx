import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SLABreach {
  id: string;
  ticketId: string;
  branch: string;
  slaType: string;
  breachDate: Date;
  resolutionDate?: Date;
  status: 'Pending Action' | 'Resolved';
  relatedEntity: 'Request' | 'WorkOrder' | 'VendorJob' | 'Maintenance';
}

export interface SLAPenalty {
  id: string;
  slaType: string;
  severityLevel: string;
  vendor: string;
  breachDuration: number;
  breachStartDate?: Date;
  calculatedAmount: number;
  status: 'Pending Payment' | 'Invoice Sent' | 'Completed';
  createdAt: Date;
}

interface SLAContextType {
  breaches: SLABreach[];
  penalties: SLAPenalty[];
  addBreach: (breach: Omit<SLABreach, 'id'>) => void;
  resolveBreach: (id: string) => void;
  addPenalty: (penalty: Omit<SLAPenalty, 'id' | 'createdAt'>) => void;
  updatePenaltyStatus: (id: string, status: SLAPenalty['status']) => void;
}

const SLAContext = createContext<SLAContextType | undefined>(undefined);

const SLA_BREACHES_STORAGE_KEY = 'SLA_BREACHES_CACHE_V1';
const SLA_PENALTIES_STORAGE_KEY = 'SLA_PENALTIES_CACHE_V1';

export const SLAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breaches, setBreaches] = useState<SLABreach[]>(() => {
    try {
      const cached = localStorage.getItem(SLA_BREACHES_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.map((breach: any) => ({
          ...breach,
          breachDate: new Date(breach.breachDate),
          resolutionDate: breach.resolutionDate ? new Date(breach.resolutionDate) : undefined
        }));
      }
    } catch (error) {
      console.error('Error loading SLA breaches from cache:', error);
    }
    return [];
  });

  const [penalties, setPenalties] = useState<SLAPenalty[]>(() => {
    try {
      const cached = localStorage.getItem(SLA_PENALTIES_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed.map((penalty: any) => ({
          ...penalty,
          breachStartDate: penalty.breachStartDate ? new Date(penalty.breachStartDate) : undefined,
          createdAt: new Date(penalty.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading SLA penalties from cache:', error);
    }
    return [];
  });

  const saveBreaches = useCallback((newBreaches: SLABreach[]) => {
    try {
      localStorage.setItem(SLA_BREACHES_STORAGE_KEY, JSON.stringify(newBreaches));
    } catch (error) {
      console.error('Error saving SLA breaches to cache:', error);
    }
  }, []);

  const savePenalties = useCallback((newPenalties: SLAPenalty[]) => {
    try {
      localStorage.setItem(SLA_PENALTIES_STORAGE_KEY, JSON.stringify(newPenalties));
    } catch (error) {
      console.error('Error saving SLA penalties to cache:', error);
    }
  }, []);

  const addBreach = useCallback((breachData: Omit<SLABreach, 'id'>) => {
    const newBreach: SLABreach = {
      ...breachData,
      id: `SLA-BREACH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    setBreaches(prev => {
      const updated = [...prev, newBreach];
      saveBreaches(updated);
      return updated;
    });
  }, [saveBreaches]);

  const resolveBreach = useCallback((id: string) => {
    setBreaches(prev => {
      const updated = prev.map(breach =>
        breach.id === id
          ? { ...breach, status: 'Resolved' as const, resolutionDate: new Date() }
          : breach
      );
      saveBreaches(updated);
      return updated;
    });
  }, [saveBreaches]);

  const addPenalty = useCallback((penaltyData: Omit<SLAPenalty, 'id' | 'createdAt'>) => {
    const newPenalty: SLAPenalty = {
      ...penaltyData,
      id: `SLA-PENALTY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };

    setPenalties(prev => {
      const updated = [...prev, newPenalty];
      savePenalties(updated);
      return updated;
    });
  }, [savePenalties]);

  const updatePenaltyStatus = useCallback((id: string, status: SLAPenalty['status']) => {
    setPenalties(prev => {
      const updated = prev.map(penalty =>
        penalty.id === id ? { ...penalty, status } : penalty
      );
      savePenalties(updated);
      return updated;
    });
  }, [savePenalties]);

  return (
    <SLAContext.Provider value={{
      breaches,
      penalties,
      addBreach,
      resolveBreach,
      addPenalty,
      updatePenaltyStatus
    }}>
      {children}
    </SLAContext.Provider>
  );
};

export const useSLA = () => {
  const context = useContext(SLAContext);
  if (context === undefined) {
    throw new Error('useSLA must be used within a SLAProvider');
  }
  return context;
};