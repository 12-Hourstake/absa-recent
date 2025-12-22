import React, { createContext, useContext, useState, useEffect } from 'react';
import { Asset, CreateAssetData, AssetContextType, AssetStatus, AssetPriority, AssetType, AssetCategory, MaintenanceRecord } from '@/types/asset';
import { mockAssets } from '@/data/mockAssets';

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load assets from localStorage on component mount
  useEffect(() => {
    console.log('🔍 AssetProvider: Loading assets from localStorage...');
    const savedAssets = localStorage.getItem('ASSETS_CACHE_V1');
    if (savedAssets) {
      try {
        const parsedAssets = JSON.parse(savedAssets);
        
        // If no assets in localStorage or empty array, use mock data
        if (!parsedAssets || parsedAssets.length === 0) {
          console.log('📝 localStorage empty, loading mock data:', mockAssets.length);
          setAssets(mockAssets);
        } else {
          // Convert date strings back to Date objects
          const assetsWithDates = parsedAssets.map((asset: Asset) => ({
            ...asset,
            createdAt: new Date(asset.createdAt),
            updatedAt: new Date(asset.updatedAt),
            lastMaintenanceDate: asset.lastMaintenanceDate ? new Date(asset.lastMaintenanceDate) : undefined,
            nextMaintenanceDate: asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate) : undefined,
            maintenanceHistory: asset.maintenanceHistory?.map((record: MaintenanceRecord) => ({
              ...record,
              performedDate: new Date(record.performedDate)
            }))
          }));
          setAssets(assetsWithDates);
          console.log('✅ Assets loaded from localStorage:', assetsWithDates.length);
        }
      } catch (error) {
        console.log('❌ Error parsing saved assets:', error);
        setAssets(mockAssets);
      }
    } else {
      console.log('📝 No saved assets found, loading mock data:', mockAssets.length);
      setAssets(mockAssets);
    }
    setIsLoading(false);
  }, []);

  // Save assets to localStorage whenever assets change
  useEffect(() => {
    console.log('💾 Saving assets to localStorage:', assets.length);
    localStorage.setItem('ASSETS_CACHE_V1', JSON.stringify(assets));
  }, [assets]);

  const addAsset = async (assetData: CreateAssetData): Promise<void> => {
    console.log('➕ Adding new asset:', assetData);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newAsset: Asset = {
        id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...assetData,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin@absa.com.gh', // In real app, this would come from auth context
        maintenanceHistory: []
      };

      setAssets(prevAssets => [...prevAssets, newAsset]);
      console.log('✅ Asset added successfully:', newAsset.id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add asset';
      setError(errorMessage);
      console.log('❌ Error adding asset:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAsset = async (id: string, assetData: Partial<CreateAssetData>): Promise<void> => {
    console.log('🔄 Updating asset:', id, assetData);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAssets(prevAssets =>
        prevAssets.map(asset =>
          asset.id === id
            ? { ...asset, ...assetData, updatedAt: new Date() }
            : asset
        )
      );
      console.log('✅ Asset updated successfully:', id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update asset';
      setError(errorMessage);
      console.log('❌ Error updating asset:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAsset = async (id: string): Promise<void> => {
    console.log('🗑️ Deleting asset:', id);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
      console.log('✅ Asset deleted successfully:', id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete asset';
      setError(errorMessage);
      console.log('❌ Error deleting asset:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetById = (id: string): Asset | undefined => {
    return assets.find(asset => asset.id === id);
  };

  const getAssetsByBranch = (branch: string): Asset[] => {
    return assets.filter(asset => asset.location.branch === branch);
  };

  const getAssetsByType = (type: AssetType): Asset[] => {
    return assets.filter(asset => asset.type === type);
  };

  const getAssetsByStatus = (status: AssetStatus): Asset[] => {
    return assets.filter(asset => asset.status === status);
  };

  const value: AssetContextType = {
    assets,
    isLoading,
    error,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
    getAssetsByBranch,
    getAssetsByType,
    getAssetsByStatus
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};

export const useAssets = (): AssetContextType => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};
