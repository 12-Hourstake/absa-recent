export type FuelType = "GENERATOR" | "VEHICLE";

const FUEL_CONTEXT_KEY = "FUEL_CONTEXT_V1";

export const getFuelContext = (page: string): FuelType => {
  try {
    const stored = localStorage.getItem(FUEL_CONTEXT_KEY);
    if (stored) {
      const contexts = JSON.parse(stored);
      return contexts[page] || "GENERATOR";
    }
  } catch {
    // Fallback to default
  }
  return "GENERATOR";
};

export const setFuelContext = (page: string, fuelType: FuelType): void => {
  try {
    const stored = localStorage.getItem(FUEL_CONTEXT_KEY);
    const contexts = stored ? JSON.parse(stored) : {};
    contexts[page] = fuelType;
    localStorage.setItem(FUEL_CONTEXT_KEY, JSON.stringify(contexts));
  } catch {
    // Ignore storage errors
  }
};

// Legacy function names for compatibility
export const loadFuelContext = getFuelContext;
export const saveFuelContext = setFuelContext;