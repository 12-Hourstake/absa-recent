/**
 * Reusable dismissible alert component with consistent styling
 */

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Clock, Info } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type AlertVariant = "danger" | "warning" | "info" | "success";

interface DismissibleAlertProps {
  variant?: AlertVariant;
  title: string;
  description: string;
  count?: number;
  icon?: LucideIcon;
  show?: boolean;
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, {
  containerClass: string;
  iconClass: string;
  titleClass: string;
  descriptionClass: string;
  buttonClass: string;
  defaultIcon: LucideIcon;
}> = {
  danger: {
    containerClass: "bg-red-50 border-red-200 border-2",
    iconClass: "text-red-600",
    titleClass: "text-red-900",
    descriptionClass: "text-red-800",
    buttonClass: "text-red-600 hover:text-red-800 hover:bg-red-100",
    defaultIcon: AlertTriangle,
  },
  warning: {
    containerClass: "bg-amber-50 border-amber-200 border-2",
    iconClass: "text-amber-600",
    titleClass: "text-amber-900",
    descriptionClass: "text-amber-800",
    buttonClass: "text-amber-600 hover:text-amber-800 hover:bg-amber-100",
    defaultIcon: AlertTriangle,
  },
  info: {
    containerClass: "bg-blue-50 border-blue-200 border-2",
    iconClass: "text-blue-600",
    titleClass: "text-blue-900",
    descriptionClass: "text-blue-800",
    buttonClass: "text-blue-600 hover:text-blue-800 hover:bg-blue-100",
    defaultIcon: Info,
  },
  success: {
    containerClass: "bg-green-50 border-green-200 border-2",
    iconClass: "text-green-600",
    titleClass: "text-green-900",
    descriptionClass: "text-green-800",
    buttonClass: "text-green-600 hover:text-green-800 hover:bg-green-100",
    defaultIcon: Clock,
  },
};

export const DismissibleAlert = ({
  variant = "info",
  title,
  description,
  count,
  icon,
  show = true,
  onDismiss,
}: DismissibleAlertProps) => {
  const [isVisible, setIsVisible] = useState(show);
  const styles = variantStyles[variant];
  const IconComponent = icon || styles.defaultIcon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !show) {
    return null;
  }

  return (
    <Alert className={styles.containerClass}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <IconComponent className={`h-5 w-5 ${styles.iconClass} mt-0.5`} />
          <div className="flex-1">
            <AlertTitle className={`${styles.titleClass} font-semibold mb-1`}>
              {title}
            </AlertTitle>
            <AlertDescription className={styles.descriptionClass}>
              {description}
            </AlertDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 ${styles.buttonClass} flex-shrink-0`}
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
};
