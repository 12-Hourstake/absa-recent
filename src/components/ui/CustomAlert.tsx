import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export type AlertVariant = "error" | "success" | "info" | "warning";

interface CustomAlertProps {
  message: string;
  variant?: AlertVariant;
  onDismiss?: () => void;
  title?: string;
}

const variantConfig = {
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
    dismissColor: "text-red-500 hover:text-red-700",
    Icon: AlertCircle,
    defaultTitle: "Error",
  },
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
    dismissColor: "text-green-500 hover:text-green-700",
    Icon: CheckCircle,
    defaultTitle: "Success",
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
    dismissColor: "text-blue-500 hover:text-blue-700",
    Icon: Info,
    defaultTitle: "Information",
  },
  warning: {
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    iconColor: "text-yellow-600",
    titleColor: "text-yellow-800",
    messageColor: "text-yellow-700",
    dismissColor: "text-yellow-500 hover:text-yellow-700",
    Icon: AlertTriangle,
    defaultTitle: "Warning",
  },
};

export const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  variant = "info",
  onDismiss,
  title,
}) => {
  if (!message) return null;

  const config = variantConfig[variant];
  const Icon = config.Icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={`relative ${config.bgColor} border ${config.borderColor} rounded-lg p-3 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300`}
    >
      <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`text-sm font-medium ${config.titleColor}`}>
          {displayTitle}
        </p>
        <p className={`text-xs ${config.messageColor} mt-0.5`}>{message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className={`${config.dismissColor} transition-colors`}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
