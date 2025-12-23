import React, { createContext, useContext, useState, useCallback } from 'react';

export interface SystemDocument {
  id: string;
  name: string;
  fileType: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  associatedEntity: string;
  fileSize?: string;
  sourceModule: 'Requests' | 'Logs' | 'Maintenance' | 'Assets' | 'Vendors' | 'Audits' | 'Fuel';
  file?: File;
}

interface DocumentContextType {
  documents: SystemDocument[];
  addDocument: (document: Omit<SystemDocument, 'id' | 'uploadedAt'>) => void;
  removeDocument: (id: string) => void;
  getDocumentsByModule: (module: SystemDocument['sourceModule']) => SystemDocument[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const DOCUMENTS_STORAGE_KEY = 'SYSTEM_DOCUMENTS_CACHE_V1';

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<SystemDocument[]>(() => {
    try {
      const cached = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Convert date strings back to Date objects
        return parsed.map((doc: any) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt)
        }));
      }
    } catch (error) {
      console.error('Error loading documents from cache:', error);
    }
    return [];
  });

  const saveToStorage = useCallback((docs: SystemDocument[]) => {
    try {
      localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(docs));
    } catch (error) {
      console.error('Error saving documents to cache:', error);
    }
  }, []);

  const addDocument = useCallback((documentData: Omit<SystemDocument, 'id' | 'uploadedAt'>) => {
    const newDocument: SystemDocument = {
      ...documentData,
      id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date()
    };

    setDocuments(prev => {
      const updated = [...prev, newDocument];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeDocument = useCallback((id: string) => {
    setDocuments(prev => {
      const updated = prev.filter(doc => doc.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const getDocumentsByModule = useCallback((module: SystemDocument['sourceModule']) => {
    return documents.filter(doc => doc.sourceModule === module);
  }, [documents]);

  return (
    <DocumentContext.Provider value={{
      documents,
      addDocument,
      removeDocument,
      getDocumentsByModule
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};