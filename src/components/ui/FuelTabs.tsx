import { FuelType } from "@/utils/fuelContext";

interface FuelTabsProps {
  selectedType: FuelType;
  onTypeChange: (type: FuelType) => void;
}

export const FuelTabs = ({ selectedType, onTypeChange }: FuelTabsProps) => {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onTypeChange("GENERATOR")}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          selectedType === "GENERATOR"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        Generator Fuel
      </button>
      <button
        onClick={() => onTypeChange("VEHICLE")}
        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
          selectedType === "VEHICLE"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        Vehicle Fuel
      </button>
    </div>
  );
};