import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MaintenanceRequest, 
  IncidentReport, 
  CreateRequestData, 
  CreateIncidentData,
  RequestContextType,
  RequestStatus 
} from '@/types/request';
import { useAuth } from '@/contexts/AuthContext';
import { mockMaintenanceRequests, mockIncidentReports } from '@/data/mockRequests';

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔍 RequestProvider: Loading requests and incidents from localStorage...");
    
    // Load requests
    const savedRequests = localStorage.getItem('maintenanceRequests');
    if (savedRequests) {
      try {
        const parsedRequests = JSON.parse(savedRequests);
        console.log("✅ Requests loaded from localStorage:", parsedRequests.length);
        setRequests(parsedRequests);
      } catch (error) {
        console.log("❌ Error parsing saved requests:", error);
        setRequests(mockMaintenanceRequests);
      }
    } else {
      console.log("📝 No saved requests found, loading mock data");
      setRequests(mockMaintenanceRequests);
    }

    // Load incidents
    const savedIncidents = localStorage.getItem('incidentReports');
    if (savedIncidents) {
      try {
        const parsedIncidents = JSON.parse(savedIncidents);
        console.log("✅ Incidents loaded from localStorage:", parsedIncidents.length);
        setIncidents(parsedIncidents);
      } catch (error) {
        console.log("❌ Error parsing saved incidents:", error);
        setIncidents(mockIncidentReports);
      }
    } else {
      console.log("📝 No saved incidents found, loading mock data");
      setIncidents(mockIncidentReports);
    }
  }, []);

  const addRequest = async (requestData: CreateRequestData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const newRequest: MaintenanceRequest = {
        id: `REQ-${Date.now()}`,
        ...requestData,
        status: RequestStatus.SUBMITTED,
        submittedBy: {
          userId: user.id,
          name: user.name,
          email: user.email,
          department: user.department || 'Unknown'
        },
        submittedAt: new Date()
      };

      const updatedRequests = [...requests, newRequest];
      setRequests(updatedRequests);
      localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
      console.log("✅ Request added successfully:", newRequest);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addIncident = async (incidentData: CreateIncidentData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const newIncident: IncidentReport = {
        id: `INC-${Date.now()}`,
        ...incidentData,
        status: RequestStatus.SUBMITTED,
        reportedBy: {
          userId: user.id,
          name: user.name,
          email: user.email,
          department: user.department || 'Unknown'
        },
        reportedAt: new Date()
      };

      const updatedIncidents = [...incidents, newIncident];
      setIncidents(updatedIncidents);
      localStorage.setItem('incidentReports', JSON.stringify(updatedIncidents));
      console.log("✅ Incident added successfully:", newIncident);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add incident';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequest = async (requestId: string, updates: Partial<MaintenanceRequest>): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const updatedRequests = requests.map(request => 
        request.id === requestId ? { ...request, ...updates } : request
      );
      
      setRequests(updatedRequests);
      localStorage.setItem('maintenanceRequests', JSON.stringify(updatedRequests));
      console.log("✅ Request updated successfully:", requestId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update request';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateIncident = async (incidentId: string, updates: Partial<IncidentReport>): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      const updatedIncidents = incidents.map(incident => 
        incident.id === incidentId ? { ...incident, ...updates } : incident
      );
      
      setIncidents(updatedIncidents);
      localStorage.setItem('incidentReports', JSON.stringify(updatedIncidents));
      console.log("✅ Incident updated successfully:", incidentId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update incident';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RequestContext.Provider value={{ 
      requests, 
      incidents,
      addRequest, 
      addIncident,
      updateRequest, 
      updateIncident, 
      isLoading, 
      error 
    }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};
