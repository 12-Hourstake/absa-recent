import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CustomSelectDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option...",
  className = ""
}: CustomSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const isHeightClass = className.includes('h-');
  const heightClass = isHeightClass ? className : 'h-11';
  const otherClasses = isHeightClass ? '' : className;

  return (
    <div className={`relative ${otherClasses}`}>
      <button
        type="button"
        className={`w-full ${heightClass} rounded-lg border border-slate-300 bg-white px-4 text-sm text-left focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all flex items-center justify-between`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-full px-4 py-3 text-sm text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg transition-colors"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelectDropdown;