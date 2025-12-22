import React from "react";
import { CheckCircle, X } from "lucide-react";

interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
  title?: string;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({
  message,
  onDismiss,
  title = "Success",
}) => {
  if (!message) return null;

  return (
    <div className="relative bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800">{title}</p>
        <p className="text-xs text-green-700 mt-0.5">{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-green-500 hover:text-green-700 transition-colors"
          aria-label="Dismiss success message"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
