/**
 * Utility functions for progress bars and performance badges
 * Provides consistent styling based on percentage values
 */

export interface ProgressStyle {
  progressClass: string;
  badgeClass: string;
  label: string;
  textColor: string;
  bgColor: string;
}

/**
 * Get progress bar class and badge styling based on percentage
 * @param value - The percentage value (0-100)
 * @returns ProgressStyle object with classes and labels
 */
export const getProgressStyle = (value: number): ProgressStyle => {
  if (value >= 90) {
    return {
      progressClass: "[&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Excellent",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50"
    };
  } else if (value >= 75) {
    return {
      progressClass: "[&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-blue-500",
      badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Good",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50"
    };
  } else if (value >= 60) {
    return {
      progressClass: "[&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-500",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      label: "Average",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50"
    };
  } else if (value > 0) {
    return {
      progressClass: "[&>div]:bg-gradient-to-r [&>div]:from-red-400 [&>div]:to-red-500",
      badgeClass: "bg-red-50 text-red-700 border-red-200",
      label: "Poor",
      textColor: "text-red-700",
      bgColor: "bg-red-50"
    };
  } else {
    return {
      progressClass: "[&>div]:bg-gray-200",
      badgeClass: "bg-gray-50 text-gray-700 border-gray-200",
      label: "Not Started",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50"
    };
  }
};

/**
 * Get just the progress bar class based on percentage
 * @param value - The percentage value (0-100)
 * @returns CSS class string for the progress bar
 */
export const getProgressClass = (value: number): string => {
  return getProgressStyle(value).progressClass;
};

/**
 * Get just the badge class based on percentage
 * @param value - The percentage value (0-100)
 * @returns CSS class string for the badge
 */
export const getBadgeClass = (value: number): string => {
  return getProgressStyle(value).badgeClass;
};

/**
 * Get the performance label based on percentage
 * @param value - The percentage value (0-100)
 * @returns Label string (Excellent, Good, Average, Poor, Not Started)
 */
export const getPerformanceLabel = (value: number): string => {
  return getProgressStyle(value).label;
};

/**
 * Get rating label from a string rating (for compatibility with existing code)
 * Maps common rating strings to standardized labels
 * @param rating - Rating string (e.g., "Good", "Average", "Excellent", "Poor")
 * @returns Standardized label
 */
export const getRatingLabel = (rating: string): string => {
  const normalized = rating.toLowerCase();
  if (normalized === "excellent" || normalized === "great") return "Excellent";
  if (normalized === "good") return "Good";
  if (normalized === "average" || normalized === "fair") return "Average";
  if (normalized === "poor" || normalized === "bad" || normalized === "low") return "Poor";
  return rating;
};

/**
 * Get badge class from a rating string
 * @param rating - Rating string (e.g., "Good", "Average", "Excellent", "Poor")
 * @returns CSS class string for the badge
 */
export const getBadgeClassFromRating = (rating: string): string => {
  const normalized = rating.toLowerCase();
  if (normalized === "excellent" || normalized === "great") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "good") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  } else if (normalized === "average" || normalized === "fair") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  } else if (normalized === "poor" || normalized === "bad" || normalized === "low") {
    return "bg-red-50 text-red-700 border-red-200";
  }
  return "bg-gray-50 text-gray-700 border-gray-200";
};

/**
 * Convert a score (0-100) to a rating and get the badge class
 * @param score - The score value (0-100)
 * @returns Object with rating label and badge class
 */
export const getScoreBadge = (score: number): { label: string; className: string } => {
  const style = getProgressStyle(score);
  return {
    label: style.label,
    className: style.badgeClass
  };
};
