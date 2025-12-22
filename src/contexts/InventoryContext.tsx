import { createContext, useContext, useState, ReactNode } from "react";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  supplier: string;
  location: string;
  sku?: string;
  barcode?: string;
  notes?: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "In" | "Out";
  quantity: number;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
  notes?: string;
}

interface InventoryContextType {
  // State
  items: InventoryItem[];
  transactions: InventoryTransaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addItem: (
    item: Omit<InventoryItem, "id" | "status" | "lastUpdated">
  ) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItem: (id: string) => InventoryItem | undefined;
  getItemsByCategory: (category: string) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
  getOutOfStockItems: () => InventoryItem[];

  // Transactions
  addTransaction: (
    transaction: Omit<InventoryTransaction, "id">
  ) => Promise<void>;
  updateTransaction: (
    id: string,
    updates: Partial<InventoryTransaction>
  ) => Promise<void>;
  getTransactionsByItem: (itemId: string) => InventoryTransaction[];

  // Analytics
  getInventoryValue: () => number;
  getCategoryBreakdown: () => Array<{
    category: string;
    count: number;
    value: number;
    percentage: number;
  }>;
  getTopMovingItems: () => Array<{
    name: string;
    category: string;
    usage: number;
    trend: "up" | "down";
  }>;

  // Utility
  setError: (error: string | null) => void;
  clearError: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

// TODO: Replace with API calls to fetch inventory data from backend
const mockItems: InventoryItem[] = [];
const mockTransactions: InventoryTransaction[] = [];

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(mockItems);
  const [transactions, setTransactions] =
    useState<InventoryTransaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = async (
    itemData: Omit<InventoryItem, "id" | "status" | "lastUpdated">
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newItem: InventoryItem = {
        ...itemData,
        id: `ITEM-${Date.now()}`,
        status:
          itemData.currentStock === 0
            ? "Out of Stock"
            : itemData.currentStock <= itemData.minStock
            ? "Low Stock"
            : "In Stock",
        lastUpdated: new Date().toISOString().split("T")[0],
      };

      setItems((prev) => [...prev, newItem]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add item");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                status:
                  updates.currentStock !== undefined
                    ? updates.currentStock === 0
                      ? "Out of Stock"
                      : updates.currentStock <=
                        (updates.minStock || item.minStock)
                      ? "Low Stock"
                      : "In Stock"
                    : item.status,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update item");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getItem = (id: string) => items.find((item) => item.id === id);

  const getItemsByCategory = (category: string) =>
    items.filter((item) => item.category === category);

  const getLowStockItems = () =>
    items.filter((item) => item.status === "Low Stock");

  const getOutOfStockItems = () =>
    items.filter((item) => item.status === "Out of Stock");

  const addTransaction = async (
    transactionData: Omit<InventoryTransaction, "id">
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newTransaction: InventoryTransaction = {
        ...transactionData,
        id: `INV-${Date.now()}`,
      };

      setTransactions((prev) => [...prev, newTransaction]);

      // Update item stock based on transaction
      const item = getItem(transactionData.itemId);
      if (item) {
        const newStock =
          transactionData.type === "In"
            ? item.currentStock + transactionData.quantity
            : item.currentStock - transactionData.quantity;

        await updateItem(transactionData.itemId, { currentStock: newStock });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add transaction"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (
    id: string,
    updates: Partial<InventoryTransaction>
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === id ? { ...transaction, ...updates } : transaction
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update transaction"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionsByItem = (itemId: string) =>
    transactions.filter((transaction) => transaction.itemId === itemId);

  const getInventoryValue = () =>
    items.reduce(
      (total, item) => total + item.currentStock * item.unitPrice,
      0
    );

  const getCategoryBreakdown = () => {
    const breakdown = items.reduce((acc, item) => {
      const existing = acc.find((cat) => cat.category === item.category);
      if (existing) {
        existing.count += 1;
        existing.value += item.currentStock * item.unitPrice;
      } else {
        acc.push({
          category: item.category,
          count: 1,
          value: item.currentStock * item.unitPrice,
          percentage: 0,
        });
      }
      return acc;
    }, [] as Array<{ category: string; count: number; value: number; percentage: number }>);

    const totalValue = breakdown.reduce((sum, cat) => sum + cat.value, 0);
    return breakdown.map((cat) => ({
      ...cat,
      percentage: totalValue > 0 ? (cat.value / totalValue) * 100 : 0,
    }));
  };

  const getTopMovingItems = () => {
    // TODO: Replace with API call to get top moving items from backend
    return [];
  };

  const clearError = () => setError(null);

  const value: InventoryContextType = {
    // State
    items,
    transactions,
    isLoading,
    error,

    // Actions
    addItem,
    updateItem,
    deleteItem,
    getItem,
    getItemsByCategory,
    getLowStockItems,
    getOutOfStockItems,

    // Transactions
    addTransaction,
    updateTransaction,
    getTransactionsByItem,

    // Analytics
    getInventoryValue,
    getCategoryBreakdown,
    getTopMovingItems,

    // Utility
    setError,
    clearError,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

